/*globals _,define*/

define(['TemplateCreator/outputs/OutputGenerator',
        'TemplateCreator/templates/Constants',
        'underscore',
        '../common/CaffeInPlaceLayers',
        './CaffeTemplate'], function(OutputGenerator,
                                     Constants,
                                     _,
                                     InPlaceLayers,
                                     CaffeTemplate) {
    'use strict';

    // Caffe Constants
    var TRAINING = '_training_',
        TESTING = '_testing_';

    var CaffeGenerator = function() {
        this.template = CaffeTemplate;
        this.runOptions = null;
        this.lossLayers = null;
    };

    // Inherit the 'createTemplateFromNodes' method
    _.extend(CaffeGenerator.prototype, OutputGenerator.prototype);

    /**
     * Create the output files stored in a JS Object where the 
     * key is the file name and the value is the file content.
     *
     * @param {Virtual Node} tree
     * @return {Object}
     */
    CaffeGenerator.prototype.createOutputFiles = function(tree) {
        var outputFiles = {},
            name = tree.name.replace(/ /g, '_'),
            archName = name+'_network.prototxt',
            trainName = name+'_trainer.prototxt',
            testName = name+'_solver.prototxt',
            classifyName = name+'_classify.prototxt.ejs',
            template,
            labelName,
            node;

        // Add the label layer info
        labelName = this._addLabelLayer(tree);

        // Update for in-place computation
        this._addInPlaceOperations(labelName, tree);

        // Decorate the active node with the run settings
        _.extend(tree, this.runOptions);
        tree.archName = archName;

        // Add the data source and type to data nodes
        // As the children are topo sorted, data nodes should be first
        for (var i = tree[Constants.CHILDREN].length; i--;) {
            node = tree[Constants.CHILDREN][i];
            // FIXME: Add support for more data inputs?
            if (node[Constants.BASE].name === 'Data') {
                // Add the data attributes
                node.location = '"'+this.runOptions.inputData+'"';
                node.backend = this.runOptions.dataType;
            }
        }

        // Create the architecture file
        template = _.template(this.template[Constants.ARCH]);
        outputFiles[archName] = template(tree);
        outputFiles[archName] += this.createTemplateFromNodes(tree[Constants.CHILDREN]);

        // Create the training file
        template = _.template(this.template[TRAINING]);
        outputFiles[trainName] = template(tree);

        // Create the testing file
        template = _.template(this.template[TESTING]);
        outputFiles[testName] = template(tree);

        // Create the classification prototxt template
        outputFiles[classifyName] = this.createPrototxtTemplate(tree);

        // Create the metadata file
        var metadata = {
            type: 'Caffe',
            trainCommand: 'caffe train --solver='+trainName,
            testCommand: ''
        };  // Add test cmd FIXME 
        outputFiles.metadata = JSON.stringify(metadata);

        return outputFiles;
    };

    CaffeGenerator.prototype._addLabelLayer = function(tree) {
        // Add the label layer to the network if needed (check for loss layers)
        // Get a list of labels that require a label layer (loss layers)
        var lossLayerTypes = this.lossLayers,
            lossLayers,
            labelName = this._getUniqueLabelName(tree),
            dataLayers;

        // Get all these types of layers
        lossLayers = tree[Constants.CHILDREN].filter(function(layer) {
            var base = layer[Constants.BASE].name.toLowerCase();
            return lossLayerTypes.indexOf(base) !== -1;
        });

        if (lossLayers.length) {
            // Create the label layer
            var labelLayer = {name: labelName};
            labelLayer[Constants.BASE] = {name: 'label'};

            // Add the label layer to the "bottom" values of the loss layers
            lossLayers.forEach(function(layer) {
                layer[Constants.PREV].push(labelLayer);
            });

            // Update the data layers
            tree[Constants.CHILDREN]
                .filter(function(layer) {  // Get data layers
                    return layer[Constants.BASE].name.toLowerCase() === 'data';
                })
                .forEach(function(layer) {  // add label to "next" values
                    layer[Constants.NEXT].push(labelLayer);
                });
        }
        return labelName;
    };

    CaffeGenerator.prototype._getUniqueLabelName = function(tree) {
        // Create dictionary of existing names
        var names = {},
            children = tree[Constants.CHILDREN],
            basename = 'label',
            name = basename,
            i;

        for (i = children.length; i--;) {
            names[children[i].name] = true;
        }

        // Find unique name
        i = 2;
        while (names[name]) {
            name = basename + i++;
        }
        return name;
    };

    CaffeGenerator.prototype._addInPlaceOperations = function(labelName, tree) {
        // Convolution layers connect into themselves and subsequent ReLU layers
        // will connect their top value back into the convolution layer. The
        // node immediately following the ReLU layer will connect to the conv layer
        var children = tree[Constants.CHILDREN],
            next,
            prev,
            conv,
            base,
            j;

        for (var i = children.length; i--;) {
            base = children[i][Constants.BASE].name.toLowerCase();
            if (InPlaceLayers[base]) {
                // Set the previous of the next to the previous of the current
                children[i][Constants.NEXT].forEach(function(node) {
                    node[Constants.PREV]= children[i][Constants.PREV];
                });
                // Set the bottom to the top value
                children[i][Constants.NEXT] = children[i][Constants.PREV];
            } else {
                // Keep 'label' if it exists
                children[i][Constants.NEXT] = children[i][Constants.NEXT]
                    .filter(function(node) {
                        return node.name === labelName;
                    });

                // Add self
                children[i][Constants.NEXT].unshift(children[i]);
            }
            // Make sure 'label' is last if it exists
            children[i][Constants.PREV].sort(function(node) {
                return node.name === labelName;
            });
        }
    };

    CaffeGenerator.prototype.createPrototxtTemplate = function(tree) {
        var template,
            result,
            data;

        // Add the node name
        template = _.template(this.template[Constants.ARCH]);
        result = template(tree);

        // Remove the data layer
        data = tree[Constants.CHILDREN].shift();
        result += `input: "${data.name}"`;
        
        // Add the input info
        result += [
            '\ninput_shape {',
            '{{ _.each(dims, function(dim) { }}',
            '  dim: {{= dim }}{{ }); }}',
            '}\n'
        ].join('\n');

        // Add the rest of the layers
        result += this.createTemplateFromNodes(tree[Constants.CHILDREN]);

        return result;
    };

    return CaffeGenerator;
});

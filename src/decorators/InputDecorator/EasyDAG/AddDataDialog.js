define([
    'text!./templates/AddDataDialog.html',
    'text!./templates/LabeledDataTable.html',
    'text!./templates/EditingFooter.html'
], function(
    AddDataHtml,
    DataTable,
    EditingFooter
) {
    'use strict';

    var COL_CLASS = 'col-md-2',
        ADD_NODE_CLASS = 'add-node',
        SELECTED_CLASS = 'info',
        DATA_UPLOADER = 'UploadData';

    var AddNodeDialog = function() {
        this.$el = $(AddDataHtml);
        this.$content = this.$el.find('#content');
        this.$footer = $(EditingFooter);
        this.$title = this.$el.find('#title');

        // Creating labeled datasets
        this.trainedDataNodes = null;
        this.currentDataSet = null;
        this.classes = null;  // name -> paths
        this.datasets = null;
    };

    AddNodeDialog.prototype.show = function(dataNodes) {
        this.trainedDataNodes = dataNodes;
        this.renderSelectLabeledData();
        this.$el.modal('show');
    };

    AddNodeDialog.prototype._createTable = function(params) {
        // Populate the template
        var self = this,
            title = params.title,
            names = params.names,
            nodes = params.nodes || names,
            onclick = params.onclick,
            onNewClick = params.onNewClick,
            container,
            html,
            node,
            row;

        // Create the dialog and add the nodes
        this.$title.text(title);
        this.$content.empty();
        this.$footer.remove();
        this.$content.append($(DataTable));

        container = this.$content.find('#content-table');
        names
            .map(AddNodeDialog.toHtml)
            .forEach((html, i) => {
            node = nodes[i];
            html.onclick = onclick.bind(this, node, html);
            container.append(html);
        });

        if (onNewClick) {
            // Add 'Create new...' button
            var newBtn = AddNodeDialog.toHtml('Create new...');
            newBtn.className = ADD_NODE_CLASS + ' create-new';
            newBtn.onclick = onNewClick.bind(this);
            container.append(newBtn);
        }
    };

    AddNodeDialog.toHtml = function(name) {
        var container = document.createElement('tr'),
            td = document.createElement('td');

        container.appendChild(td);
        td.innerHTML = name;
        return container;
    };

    AddNodeDialog.prototype.onDataClicked = function(node, html, event) {
        event.stopPropagation();
        event.preventDefault();
        this.onLabeledDataSelect(node);
        this.$el.modal('hide');
    };

    AddNodeDialog.prototype._makeNewTableEntry = function(params) {
        var self = this,
            name = '',
            onFinish = params.onFinish,
            container = this.$content.find('#content-table'),
            row = document.createElement('tr'),
            rowData = document.createElement('td'),
            rowText = document.createElement('div');

        rowData.appendChild(rowText);
        row.appendChild(rowData);
        rowText.innerHTML = name;
        container.prepend(row);

        rowText.className = 'new-entry';
        rowText.setAttribute('id', 'new-row-text');
        rowText = container.find('#new-row-text');

        rowText.css('width', 100);
        rowText.editInPlace({
            css: {
                width: 100
            },
            enableEmpty: false,
            onChange: (oldValue, newValue) => {
                name = newValue;
            },
            onFinish: function() {
                if (name) {
                    onFinish.call(this, name, row);
                } else {
                    row.remove();
                }

            }
        });
    };

    AddNodeDialog.prototype.onCreateClicked = function() {
        var self = this;
        // Clear class data
        this.classes = {};

        // Create a new row and edit it in place
        this._makeNewTableEntry({
            onFinish: function(name, html) {
                if (self.datasets[name]) {  // duplicate!
                    // Move this to a UI indicator FIXME
                    console.error('data set with that name already exists!');
                    html.remove();
                } else {

                    self.currentDataSet = name;
                    self.renderClassView();
                    $(this).remove();
                }
            }
        });
    };

    AddNodeDialog.prototype.renderSelectLabeledData = function() {
        // Populate the template
        var self = this,
            dataNodes = this.trainedDataNodes,
            names = dataNodes.map(node => node.name);

        // Record data set names
        this.datasets = {};
        names.forEach(name => this.datasets[name] = true);

        this._createTable({
            title: 'Select Training Data',
            onclick: this.onDataClicked,
            nodes: dataNodes,
            names: names,

            // Extension
            onNewClick: this.onCreateClicked
        });
    };

    AddNodeDialog.prototype.onLabeledDataSelect = function() {
        // nop
        console.log('onLabeledDataSelect is not overridden!');
    };

    /* * * * * * * * * * Creating labeled datasets * * * * * * * * * */
    // Class Index view
    AddNodeDialog.prototype.renderClassView = function() {
        var self = this,
            container = this.$content.find('#content-table'),
            nameHtmls,
            names,
            name = this.currentDataSet;

        // FIXME: If I allow editing existing datasets, this.classes will need
        // to be set

        names = Object.keys(this.classes);
        this._createTable({
            title: 'Classes for ' + name,
            onclick: this.renderEditClassView,
            names: names,

            // Extension
            onNewClick: this.onCreateClass
        });

        // Populate the button bar
        this._addEditFooter({
            done: () => {
                // Create the labeled data node from this.classes
                // Select the dimensions, if needed
                this.getLabeledNodeDims(size => {
                    var node = this.createLabeledDataNode(this.currentDataSet, this.classes, size);
                    this.onLabeledDataSelect(node);
                    this.$el.modal('hide');
                });
            },
            cancel: () => {
                // Go back to the original data selection
                this.renderSelectLabeledData();
            }
        });
    };

    AddNodeDialog.prototype.getLabeledNodeDims = function(callback) {
        var sizes = this._getAllImageSizes(),
            size = sizes[0];

        if (sizes.length === 1) {
            size = sizes[0];
        } else {
            // TODO: Ask for the right sizes...

            // For now, we will just pick the most common size
            var counts = {},
                maxId = sizes[0].join(','),
                id;

            for (var i = sizes.length; i--;) {
                id = sizes[i].join(',');
                if (!counts[id]) {
                    counts[id] = 0;
                }
                counts[id]++;

                // Store the max
                if (counts[id] > counts[maxId]) {
                    maxId = id;
                }
            }
            size = maxId
                .split(',')
                .map(val => +val);
        }
        return callback({width: size[0], height: size[1]});
    };

    AddNodeDialog.prototype._getAllImageSizes = function() {
        // Get all unique dimensions for the images
        var images,
            dims = [],
            exists;

        images = Object.keys(this.classes)

            // Get the data groups and flatten
            .map(classId => this.classes[classId])
            .reduce((l1, l2) => l1.concat(l2), [])

            // Get the images
            .map(groupId => this.getChildrenOf(groupId))
            .reduce((l1, l2) => l1.concat(l2), [])
            .map(image => [image.attributes.width, image.attributes.height]);

        // Insert unique dims
        //for (var i = images.length; i--;) {
            //exists = !!dims
                //.find(dim => images[i][0] === dim[0] && images[i][1] === dim[1]);
            //if (!exists) {
                //dims.push(images[i]);
            //}
        //}

        //return dims;
        return images;
    };

    AddNodeDialog.prototype._addEditFooter = function(params) {
        var button;

        this.$content.after(this.$footer);

        // Done button
        button = this.$el.find('#done-btn');
        button.click(params.done);

        // Cancel button
        button = this.$el.find('#cancel-btn');
        button.click(params.cancel);
    };

    AddNodeDialog.prototype.onCreateClass = function(name) {
        var self = this;
        // Create new entry
        this._makeNewTableEntry({
            onFinish: function(name, html) {
                if (self.classes[name]) {  // duplicate!
                    // Move this to a UI indicator FIXME
                    console.error('class with that name already exists!');
                    html.remove();
                } else {
                    self.renderEditClassView(name);
                    $(this).remove();
                }
            }
        });

    };

    // Editing classes
    AddNodeDialog.prototype.renderEditClassView = function(className) {
        var self = this,
            container = this.$content.find('#content-table'),
            nameHtmls,
            dataNodes = this.getRawDataNodes(),
            names,
            selected = {},
            
            classes,
            ids,
            usedNodeIds = {};

        // Remove dataNodes already in a class
        classes = Object.keys(this.classes);
        for (var i = classes.length; i--;) {
            ids = this.classes[classes[i]];
            for (var j = ids.length; j--;) {
                usedNodeIds[ids[j]] = true;
            }
        }
        dataNodes = dataNodes.filter(node => !usedNodeIds[node.id]);
        names = dataNodes.map(node => node.name);

        // Create the table
        this._createTable({
            title: 'Select data for "' + className + '"',
            onclick: function(node, html) {
                if (selected[node.id]) {
                    html.className = '';
                    delete selected[node.id];
                } else {
                    selected[node.id] = node;
                    html.className = SELECTED_CLASS;
                }
            },
            nodes: dataNodes,
            names: names,

            // Extension
            //onNewClick: this.uploadData,
            //newText: 'Upload...'
        });

        // Attach event listeners for buttons
        this._addEditFooter({
            done: () => {
                // When 'ok' clicked, create the class entry
                var selectedIds = Object.keys(selected);
                if (selectedIds.length) {
                    this.classes[className] = selectedIds;
                }
                // Return to the classes view
                this.renderClassView();
            },
            cancel: this.renderClassView.bind(this)
        });
    };
    
    AddNodeDialog.prototype.uploadData = function() {
        // TODO: Add support for uploading data from here
        //WebGMEGlobal.InterpreterManager.run(DATA_UPLOADER, null, function(result) {
            // Resume
            // TODO
        //});
    };

    AddNodeDialog.prototype.createLabeledDataNode = function() {
        console.warn('getRawDataNodes not overridden in decorator!');
    };

    AddNodeDialog.prototype.getRawDataNodes = function() {
        console.warn('getRawDataNodes not overridden in decorator!');
    };

    return AddNodeDialog;
});

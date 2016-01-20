/*globals define*/
define(['../common/CaffeToWebGME'], function(StandardLayers) {
    'use strict';
    // Every layer has the following:
    //
    // layer {
    //     name: "name"
    //     type: "base_name"
    //     top: "base_name"
    //     bottom: "base_name"
    // }

    // Helper functions
    var attributeOrder = ['name', 'type', 'top', 'bottom'];
    var attributeSorter = function(key1, key2) {
        // Sort the attributes by the 'attributeOrder' and sort any fields
        // like data_param, pooling_param, etc, to the end
        var i1 = attributeOrder.indexOf(key1),
            i2 = attributeOrder.indexOf(key2);

        if (i1 === -1) {
            i1 = Infinity;
        }

        if (i2 === -1) {
            i2 = Infinity;
        }

        if (i2 < i1 || key2.indexOf('_param') > -1) {
            return -1;
        }
        return 1;
    };

    var quotedKeys = ['type', 'name'];  // Keys that should have quoted values
    var createAttributeText = function(key, value) {
        // Add handlebars to value
        value = '{{= '+value+' }}';
        // Add quotes to the value if needed
        if (quotedKeys.indexOf(key) > -1) {
            value = '"'+value+'"';
        }
        return '\t'+key+': '+value+'\n';
    };

    var addKeyValuePair = function(prefix, key, value) {
        var snippet;
        if (typeof value !== 'object') {
            return prefix+createAttributeText(key, value);
        } else {
            snippet = createLayerTemplate(prefix+'\t', value);
            return prefix+'\t'+key+' {\n'+ snippet +prefix+'\t}\n';
        }
    };

    var createLayerTemplate = function(prefix, layer) {
        // convert each non-object value to text. Recurse on object values
        var keys = Object.keys(layer),
            template = '',
            value;

        // Sort the keys for aesthetics in the output files
        keys.sort(attributeSorter);
        for (var i = keys.length; i--;) {
            value = layer[keys[i]];
            if (value instanceof Array) {
                // For each value, create keys[i], that value
                for (var j = 0; j < value.length; j++) {
                    template += addKeyValuePair(prefix, keys[i], value[j]);
                }
            } else {
                template += addKeyValuePair(prefix, keys[i], value);
            }
        }
        return template;
    };

    // Basic block templates
    var blockMap = {
        _base_: '',
        _arch_: 'name: "{{= name }}"\n',  // active node

        _training_: 'net: "{{= archName }}"\n'+
            'base_lr: {{= learning_rate }}\n'+
            'momentum: {{= momentum }}\n'+
            'weight_decay: {{= weight_decay }}\n'+
            'lr_policy: "{{= learning_rate_policy }}"\n'+
            'gamma: {{= gamma }}\n'+
            'power: {{= power }}\n'+
            'max_iter: {{= maxIter }}\n'+
            'snapshot: {{= snapshot }}\n'+
            'snapshot_prefix: "{{= snapshotPrefix }}"\n'+
            'solver_mode: {{= solverMode }}\n',

    };

    blockMap._testing_ =  blockMap._training_ + 'test_iter: {{= testIter }}\n'+
        'test_interval: {{= testInterval }}';

    // Populate the layers with the basic templates
    var layerHeader = 
        'layer {\n'+
        '\ttype: "{{= _base_.name }}"\n'+

        // Incoming connections
        '{{ _.each(_previous_, function(layer) {}}'+
        '\tbottom: "{{= layer.name }}"\n'+
        '{{ });}}'+
        
        // Outgoing connections
        '{{ _.each(_next_, function(layer) {}}'+
        '\ttop: "{{= layer.name }}"\n'+
        '{{ });}}';

    // Add Layer Specific Parameters from the CaffeToWebGME file
    var Layers = _.clone(StandardLayers),
        layerTypes;

    // Add the layers to the blockMap
    layerTypes = Object.keys(Layers);
    layerTypes.forEach(function(layerType) {
        // top, bottom, type are handled manually
        var contents = _.omit(Layers[layerType], ['top', 'bottom', 'type']),
            body = createLayerTemplate('', contents),
            template = layerHeader+body+'\n}\n';

        blockMap[layerType] = template;
    });

    return blockMap;
});

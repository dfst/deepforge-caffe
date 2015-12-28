// This is a mapping from caffe layers to webgme meta name

define(['../common/CaffeToWebGME', '../common/utils'], function(Layers, Utils) {
    'use strict';

    var omitAttributes = ['top', 'bottom', 'type'],  // non-attributes in webgme
        mappings = {};
    Object.keys(Layers).forEach(function(layer) {
        var completeLayer = Utils.flattenWithPrefix('',Layers[layer]);
        mappings[layer.toLowerCase()] = Utils.omit(completeLayer, omitAttributes);
    });
    // Add the input layer (a sort of pseudo-layer in DeepForge)
    mappings.input = {name: 'name'};
    return mappings;
});

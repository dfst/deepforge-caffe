// This file contains the layers that can be computed in place
//
// It is used by both the NetworkImporter and the CNNCreator
// TODO: See if we can automate the creation of this file from
// Caffe's docs or something
define([], function() {
    var convertKeysToLowerCase = function(object) {
        var result = {},
            keys = Object.keys(object);
        for (var i = keys.length; i--;) {
            result[keys[i].toLowerCase()] = object[keys[i]];
        }
        return result;
    };

    return convertKeysToLowerCase({
        ReLU: true,
        Dropout: true
    });
});

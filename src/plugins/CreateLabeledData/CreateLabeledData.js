/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Collects the images and labels and creates lmdb from them
 */

define([
    'plugin/PluginConfig',
    'plugin/PluginBase'
], function (
    PluginConfig,
    PluginBase) {
    'use strict';

    /**
     * Initializes a new instance of CreateLabeledData.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin CreateLabeledData.
     * @constructor
     */
    var CreateLabeledData = function () {
        // Call base class' constructor.
        PluginBase.call(this);
    };

    // Prototypal inheritance from PluginBase.
    CreateLabeledData.prototype = Object.create(PluginBase.prototype);
    CreateLabeledData.prototype.constructor = CreateLabeledData;

    /**
     * Gets the name of the CreateLabeledData.
     * @returns {string} The name of the plugin.
     * @public
     */
    CreateLabeledData.prototype.getName = function () {
        return 'CreateLabeledData';
    };

    /**
     * Gets the semantic version (semver.org) of the CreateLabeledData.
     * @returns {string} The version of the plugin.
     * @public
     */
    CreateLabeledData.prototype.getVersion = function () {
        return '0.1.0';
    };

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(string, plugin.PluginResult)} callback - the result callback
     */
    CreateLabeledData.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this,
            nodeObject;


        // Using the logger.
        self.logger.debug('This is a debug message.');
        self.logger.info('This is an info message.');
        self.logger.warn('This is a warning message.');
        self.logger.error('This is an error message.');

        // Using the coreAPI to make changes.

        nodeObject = self.activeNode;

        self.core.setAttribute(nodeObject, 'name', 'My new obj');
        self.core.setRegistry(nodeObject, 'position', {x: 70, y: 70});


        // This will save the changes. If you don't want to save;
        // exclude self.save and call callback directly from this scope.
        self.save('CreateLabeledData updated model.', function (err) {
            if (err) {
                callback(err, self.result);
                return;
            }
            self.result.setSuccess(true);
            callback(null, self.result);
        });

    };

    return CreateLabeledData;
});

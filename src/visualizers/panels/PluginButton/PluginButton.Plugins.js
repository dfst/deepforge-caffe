/*globals WebGMEGlobal*/
define([
    'js/Constants',
    'js/RegistryKeys',
    'js/Dialogs/PluginResults/PluginResultsDialog'
], function(
    CONSTANTS,
    REGISTRY_KEYS,
    PluginResultsDialog
) {
    'use strict';
    
    var RESULTS_NAME = 'View Results';
    var ActionButtonPlugins = function() {
        this.results = [];
        this._validPlugins = [];
        this._currentPlugins = [];
        this._pluginConfig = {};
        this._newResults = false;
    };

    ActionButtonPlugins.prototype._invokePlugin = function (name) {
        var self = this;
        if (name) {
            WebGMEGlobal.InterpreterManager.run(name, null, function(result) {
                // Create the toast
                Materialize.toast(result.pluginName + ' execution ' + (result.success ?
                    'successful' : 'failed') + '.', 5000);
                // TODO: allow click to view results from the toast
                self.results.push(result);
                //self._newResults = true;
                // TODO: Increase the priority of the result until it is viewed?
                self._updatePluginBtns();
            });
        }
    };

    ActionButtonPlugins.prototype.getPluginFn = function (name) {
        return this._invokePlugin.bind(this, name);
    };

    ActionButtonPlugins.prototype.pluginResultsFn = function () {
        var dialog = new PluginResultsDialog();
        dialog.show(this.client, this.results);
    };

    ActionButtonPlugins.prototype._initialize = function () {
        // Add listener for object changed and update the button
        WebGMEGlobal.State.on('change:' + CONSTANTS.STATE_ACTIVE_OBJECT, this._stateActiveObjectChanged, this);
        // TODO: Do I need a destructor for this?
        // TODO: I should check to see how this updates when the validPlugins
        // gets updated. It may require a refresh of the active node currently
    };

    ActionButtonPlugins.prototype._stateActiveObjectChanged = function (m, nodeId) {
        var node = this.client.getNode(nodeId),
            rawPluginRegistry = node.getRegistry(REGISTRY_KEYS.VALID_PLUGINS) || '',
            plugin;

        // Get the valid plugins for the node
        this._validPlugins = rawPluginRegistry.split(' ')
            .filter(entry => !!entry);

        this._currentNodeId = nodeId;
        this._updatePluginBtns();
    };


    ActionButtonPlugins.prototype._updatePluginBtns = function() {
        var oldPlugins = this._currentPlugins,
            pluginStyle,
            plugin,
            i;

        // TODO: This could be optimized
        // Remove the old plugins
        for (i = oldPlugins.length; i--;) {
            delete this.buttons[oldPlugins[i]];
        }

        // Add the plugins to the buttons list
        for (i = this._validPlugins.length; i--;) {
            plugin = this._validPlugins[i];
            pluginStyle = this._pluginConfig[plugin] || {};
            pluginStyle.action = this.getPluginFn(plugin);

            // Set the style
            this.buttons[plugin] = pluginStyle;
        }

        // Add results if necessary
        if (this.results.length) {
            this.buttons[RESULTS_NAME] = {
                action: this.pluginResultsFn.bind(this),
                icon: 'list',
                color: 'grey',
                priority: this._newResults ? 100000 : -100000
            };
        }

        this._currentPlugins = this._validPlugins;

        // Update the button
        this.update();
    };

    return ActionButtonPlugins;
});

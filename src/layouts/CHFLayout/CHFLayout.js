/*globals define, WebGMEGlobal, $ */
define([
    'lib/jquery/' + (DEBUG ? 'jquery.layout' : 'jquery.layout.min'),
    'js/logger',
    'text!./templates/CHFLayout.html',
    'text!./CHFLayoutConfig.json'
], function(
    _jQueryLayout,
    Logger,
    defaultLayoutTemplate,
    LayoutConfigJSON
) {
    'use strict';
    
    var CONFIG = JSON.parse(LayoutConfigJSON),
        SPACING_OPEN_TOUCH = 10,
        SPACING_CLOSED_TOUCH = 10,
        SPACING_OPEN_DESKTOP = 3,
        SPACING_CLOSED_DESKTOP = 6,
        SPACING_OPEN = WebGMEGlobal.SUPPORTS_TOUCH ? SPACING_OPEN_TOUCH : SPACING_OPEN_DESKTOP,
        SPACING_CLOSED = WebGMEGlobal.SUPPORTS_TOUCH ? SPACING_CLOSED_TOUCH : SPACING_CLOSED_DESKTOP,
        SIDE_PANEL_WIDTH = 202;

    var CHFLayout = function(params) {
        this._logger = (params && params.logger) || Logger.create('gme:Layouts:CHFLayout',
            WebGMEGlobal.gmeConfig.client.log);
        this.panels = CONFIG.panels;
        this._template = (params && params.template) || defaultLayoutTemplate;

        this._body = null;
        this._panelToContainer = {};
    };

    /**
     * Initialize the html page. This example is using the jQuery Layout plugin.
     *
     * @return {undefined}
     */
    CHFLayout.prototype.init = function() {
        var self = this;

        this._body = $('body');
        this._body.html(this._template);

        this._centerPanel = this._body.find('div.center');
        this._floatContainer = this._body.find('div.float');

        this._headerPanel = this._body.find('div.ui-layout-north');
        this._footerPanel = this._body.find('div.ui-layout-south');

        this._configurePluginButton('div#pluginBtn');

        this._canvas = null;
        this._body.layout({
            north: {
                closable: false,
                resizable: false,
                slidable: false,
                spacing_open: 0, //jshint ignore: line
                size: 64
            },
            south: {
                closable: false,
                resizable: false,
                slidable: false,
                spacing_open: 0, //jshint ignore: line
                size: 27        //has to match footer CSS settings (height + border)
            },
            center: {
                onresize: function (/*paneName, paneElement, paneState, paneOptions, layoutName*/) {
                    self._onCenterResize();
                }
            }
        });
    };

    // TODO: Move this to a custom visualizer
    CHFLayout.prototype._configurePluginButton = function(selector) {
        this._pluginBtn = this._body.find(selector);
        // TODO: for each anchor in the button, bind it to launch the given plugin
    };

    /**
     * Add a panel to a given container. This is defined in the corresponding
     * layout config JSON file.
     *
     * @param {Panel} panel
     * @param {String} container
     * @return {undefined}
     */
    CHFLayout.prototype.addToContainer = function(panel, container) {
        if (container === 'header') {
            this._headerPanel.append(panel.$pEl);
        } else if (container === 'footer') {
            this._footerPanel.append(panel.$pEl);
        } else if (container === 'float') {
            this._floatContainer.append(panel.$pEl);
        } else if (container === 'center') {
            this._centerPanel.append(panel.$pEl);
            this._canvas = panel;
            this._onCenterResize();
            return this._onCenterResize;
        }
    };

    /**
     * Remove the given panel from the views
     *
     * @param {Panel} panel
     * @return {undefined}
     */
    CHFLayout.prototype.remove = function(panel) {
        if (this._canvas === panel) {
            this._centerPanel.empty();
        }
    };

    /**
     * Remove the current layout
     *
     * @return {undefined}
     */
    CHFLayout.prototype.destroy = function() {
        this._body.empty();
    };

    // Resize handlers
    //
    // These are internally called and used by the example to provide a responsive
    // UI (even if it is simply scaling linearly here)
    CHFLayout.prototype._onCenterResize = function() {
        if (this._canvas) {
            this._canvas.setSize(this._centerPanel.width(), this._centerPanel.height());
        }
    };

    return CHFLayout;
});

/*globals define, WebGMEGlobal, $ */
define([
    'CHFLayout/CHFLayout',
    'text!./ForgeLayoutConfig.json'
], function(
    CHFLayout,
    LayoutConfigJSON
) {
    'use strict';
    
    var CONFIG = JSON.parse(LayoutConfigJSON);

    var ForgeLayout = function(params) {
        this.config = CONFIG;
        CHFLayout.call(this, params);
    };

    ForgeLayout.prototype = new CHFLayout();

    return ForgeLayout;
});

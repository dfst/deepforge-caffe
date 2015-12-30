/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

/**
 * @author brollb / https://github.com/brollb
 */

define([
    'decorators/LayerDecorator/EasyDAG/LayerDecorator.EasyDAGWidget',
    'css!./LossDecorator.EasyDAGWidget.css',
    'd3'
], function (
    LayerDecorator
) {

    'use strict';

    var LossDecorator,
        DECORATOR_ID = 'LossDecorator',

    LossDecorator = function (options) {
        var opts = _.extend({}, options);

        this.dense = this.dense || {width: 110, height: 50};
        this.size = this.size || {width: 110, height: 150};
        this.color = this.color || '#ff9100';
        this._nameY = 25;

        LayerDecorator.call(this, options);
    };

    LossDecorator.prototype.DECORATORID = DECORATOR_ID;
    _.extend(LossDecorator.prototype, LayerDecorator.prototype);

    LossDecorator.prototype.setAttributes = function() {
        LayerDecorator.prototype.setAttributes.call(this);
        this.dense.width = this.size.width = 11 * this.name.length;
    };

    return LossDecorator;
});

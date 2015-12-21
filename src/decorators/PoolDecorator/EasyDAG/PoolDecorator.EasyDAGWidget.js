/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

/**
 * @author brollb / https://github.com/brollb
 */

define([
    'decorators/LayerDecorator/EasyDAG/LayerDecorator.EasyDAGWidget',
    'css!./PoolDecorator.EasyDAGWidget.css',
    'd3'
], function (
    LayerDecorator
) {

    'use strict';

    var PoolDecorator,
        DECORATOR_ID = 'PoolDecorator';

    PoolDecorator = function (options) {
        this.dense = this.dense || {width: 100, height: 50};
        this.size = this.size || {width: 120, height: 150};
        this.color = this.color || '#2196f3';

        LayerDecorator.call(this, options);

        this.logger.debug('PoolDecorator ctor');
    };

    _.extend(PoolDecorator.prototype, LayerDecorator.prototype);

    PoolDecorator.prototype.initialize = function() {
        LayerDecorator.prototype.initialize.call(this);

        this.$subtitle = this.$el.append('text')
            .attr('class', 'subtitle')
            .style('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black');
    };

    PoolDecorator.prototype.condense = function() {
        LayerDecorator.prototype.condense.call(this);
        var dims = ['', 'x', ''].join(this._attributes['kernel_size']);

        this.$subtitle
            .attr('y', 15)
            .text(dims);
    };

    PoolDecorator.prototype.expand = function() {
        LayerDecorator.prototype.expand.call(this);
        this.$subtitle.text('');
    };

    PoolDecorator.prototype.getAttributeDisplayName = function(name) {
        // TODO: Override
        return LayerDecorator.prototype.getAttributeDisplayName.call(this, name);
    };

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    return PoolDecorator;
});

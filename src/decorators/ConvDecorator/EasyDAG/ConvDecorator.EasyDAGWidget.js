/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

/**
 * @author brollb / https://github.com/brollb
 */

define([
    'decorators/LayerDecorator/EasyDAG/LayerDecorator.EasyDAGWidget',
    'css!./ConvDecorator.EasyDAGWidget.css',
    'd3'
], function (
    LayerDecorator
) {

    'use strict';

    var ConvDecorator,
        DECORATOR_ID = 'ConvDecorator';

    ConvDecorator = function (options) {
        this.dense = this.dense || {width: 125, height: 50};
        this.size = this.size || {width: 150, height: 150};
        this.color = this.color || '#4fc3f7';

        LayerDecorator.call(this, options);

        this.logger.debug('ConvDecorator ctor');
    };

    _.extend(ConvDecorator.prototype, LayerDecorator.prototype);

    ConvDecorator.prototype.initialize = function() {
        LayerDecorator.prototype.initialize.call(this);

        this.$subtitle = this.$el.append('text')
            .attr('class', 'subtitle')
            .style('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black');
    };

    ConvDecorator.prototype.condense = function() {
        LayerDecorator.prototype.condense.call(this);
        var dims = ['', 'x', ''].join(this._attributes['kernel_size']);

        this.$subtitle
            .attr('y', 15)
            .text(dims);
    };

    ConvDecorator.prototype.expand = function() {
        LayerDecorator.prototype.expand.call(this);
        this.$subtitle.text('');
    };

    ConvDecorator.prototype.getAttributeDisplayName = function(name) {
        // TODO: Override
        return LayerDecorator.prototype.getAttributeDisplayName.call(this, name);
    };

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    return ConvDecorator;
});

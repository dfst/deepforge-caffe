/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

/**
 * @author brollb / https://github.com/brollb
 */

define([
    'decorators/LayerDecorator/EasyDAG/LayerDecorator.EasyDAGWidget',
    'css!./InnerProductDecorator.EasyDAGWidget.css',
    'd3'
], function (
    LayerDecorator
) {

    'use strict';

    var InnerProductDecorator,
        DECORATOR_ID = 'InnerProductDecorator';

    InnerProductDecorator = function (options) {
        this.dense = this.dense || {width: 120, height: 50};
        this.size = this.size || {width: 150, height: 150};
        this.color = this.color || '#7e57c2';

        LayerDecorator.call(this, options);

        this.logger.debug('InnerProductDecorator ctor');
    };

    _.extend(InnerProductDecorator.prototype, LayerDecorator.prototype);

    InnerProductDecorator.prototype.initialize = function() {
        LayerDecorator.prototype.initialize.call(this);
        this.$subtitle = this.$el.append('text')
            .attr('class', 'subtitle')
            .style('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black');
    };

    InnerProductDecorator.prototype.condense = function() {
        var output = this._attributes.num_output;

        LayerDecorator.prototype.condense.call(this);
        // Add the number of output
        this.$subtitle
            .attr('y', 15)
            .text(output);
    };


    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    return InnerProductDecorator;
});

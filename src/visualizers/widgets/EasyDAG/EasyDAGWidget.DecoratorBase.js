// This contains all the functionality required of decorators used in EasyDAG
define([
    'js/Decorators/WidgetDecoratorBase',
    'd3'
], function(
    DecoratorBase
) {
    'use strict';
    var nop = function() {};
    var EasyDAGDecoratorBase = function(params) {
        this.width = this.width || 100;  // Override with width/height
        this.height = this.height || 100;
        DecoratorBase.call(this, params);
        //this.$el = d3.select(document.createElement('g'));
        this.$parent = params.parentEl;
        this.$el = this.$parent.append('g')
            .attr('class', 'centering-offset');
    };

    EasyDAGDecoratorBase.prototype.update = nop;

    // Callback for triggering size change in parent
    EasyDAGDecoratorBase.prototype.onResize = nop;
    EasyDAGDecoratorBase.prototype.saveAttribute = nop;
    EasyDAGDecoratorBase.prototype.setPointer = nop;

    EasyDAGDecoratorBase.prototype.onSelect = function() {
        this.onResize();
    };
    EasyDAGDecoratorBase.prototype.onDeselect = function() {
        this.onResize();
    };

    return EasyDAGDecoratorBase;
});

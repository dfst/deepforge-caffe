/*globals define, _*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Decorators/DecoratorBase',
    './EasyDAG/ReLUDecorator.EasyDAGWidget'
], function (DecoratorBase, LargeLayerDecoratorEasyDAGWidget) {

    'use strict';

    var ReLUDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'ReLUDecorator';

    ReLUDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('ReLUDecorator ctor');
    };

    _.extend(ReLUDecorator.prototype, __parent_proto__);
    ReLUDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    ReLUDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            EasyDAG: LargeLayerDecoratorEasyDAGWidget
        };
    };

    return ReLUDecorator;
});

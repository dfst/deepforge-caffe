/*globals define, _*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Decorators/DecoratorBase',
    './EasyDAG/LossDecorator.EasyDAGWidget'
], function (DecoratorBase, LossDecoratorEasyDAGWidget) {

    'use strict';

    var LossDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'LossDecorator';

    LossDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('LossDecorator ctor');
    };

    _.extend(LossDecorator.prototype, __parent_proto__);
    LossDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    LossDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            EasyDAG: LossDecoratorEasyDAGWidget
        };
    };

    return LossDecorator;
});

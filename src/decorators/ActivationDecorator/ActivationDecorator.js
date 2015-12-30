/*globals define, _*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Decorators/DecoratorBase',
    './EasyDAG/ActivationDecorator.EasyDAGWidget'
], function (DecoratorBase, LargeLayerDecoratorEasyDAGWidget) {

    'use strict';

    var ActivationDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'ActivationDecorator';

    ActivationDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('ActivationDecorator ctor');
    };

    _.extend(ActivationDecorator.prototype, __parent_proto__);
    ActivationDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    ActivationDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            EasyDAG: LargeLayerDecoratorEasyDAGWidget
        };
    };

    return ActivationDecorator;
});

define([
    'widgets/EasyDAG/DAGItem'
], function(
    DAGItem
) {
    'use strict';

    var LayerItem = function() {
        DAGItem.apply(this, arguments);
    };

    _.extend(LayerItem.prototype, DAGItem.prototype);

    LayerItem.prototype.setupDecoratorCallbacks = function() {
        DAGItem.prototype.setupDecoratorCallbacks.call(this);

        this.decorator.createLabeledDataNode = this.createLabeledDataNode.bind(this);
    };

    return LayerItem;
});

define([
    'text!./ModelRow.html'
], function(
    ROW_HTML
) {
    'use strict';
    
    var statusToClass = {
        FAILED: 'danger',
        TRAINING: 'warning',
        FINISHED: 'success'
    };
    var ModelItem = function(parent, node) {
        this.$el = $(ROW_HTML);
        this.initialize();
        this.update(node);
        parent.append(this.$el);
    };

    ModelItem.prototype.initialize = function() {
        // Get the fields and stuff
        this.$name = this.$el.find('.model-name');
        this.$arch = this.$el.find('.arch-name');
        this.$data = this.$el.find('.data-name');
        this.$status = this.$el.find('.training-status');
        this.$delete = this.$el.find('.model-remove');
    };

    ModelItem.prototype.update = function(node) {
        // Set the row fields and stuff
        this.$name.text(node.name);
        this.$arch.text(node.architecture || 'unknown');
        this.$data.text(node.data || 'unknown');
        this.$status.text(node.status);

        // Set the class based on status
        var className = statusToClass[node.status] || '';
        this.$el.attr('class', className);
    };

    ModelItem.prototype.remove = function() {
        this.$el.remove();
    };

    return ModelItem;
});

define([
    'text!./templates/AddDataDialog.html'
], function(
    AddDataHtml
) {
    'use strict';

    var COL_CLASS = 'col-md-2',
        ADD_NODE_CLASS = 'add-node';
    var AddNodeDialog = function() {
        this._content = AddDataHtml;
        this._dialog = null;
    };

    AddNodeDialog.prototype.show = function(dataNodes) {
        // Populate the template
        var self = this,
            nodes = dataNodes.map(AddNodeDialog.toHtml),
            container,
            row;

        // Create the dialog and add the nodes
        this._dialog = $(this._content);
        container = this._dialog.find('#node-container');
        nodes.forEach((html, i) => {
            let node = dataNodes[i];
            html.onclick = this.onDataClicked.bind(this, node);
            container.append(html);
        });
        this._dialog.modal('show');
    };

    AddNodeDialog.toHtml = function(node) {
        var container = document.createElement('tr'),
            td = document.createElement('td');

        container.appendChild(td);
        td.innerHTML = node.name;
        return container;
    };

    AddNodeDialog.prototype.onDataClicked = function(node, event) {
        event.stopPropagation();
        event.preventDefault();
        this.onSelect(node);
        this._dialog.modal('hide');
    };

    AddNodeDialog.prototype.onSelect = function() {
        // nop
        console.log('onSelect is not overridden!');
    };

    return AddNodeDialog;
});

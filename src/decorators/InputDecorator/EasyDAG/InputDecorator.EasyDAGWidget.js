/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

/**
 * @author brollb / https://github.com/brollb
 */

define([
    'js/Constants',
    'js/NodePropertyNames',
    'widgets/EasyDAG/EasyDAGWidget.DecoratorBase',
    './AddDataDialog',
    'css!./InputDecorator.EasyDAGWidget.css',
    'd3'
], function (
    CONSTANTS,
    nodePropertyNames,
    DecoratorBase,
    DataDialog
) {

    'use strict';

    var InputDecorator,
        DECORATOR_ID = 'InputDecorator',

    InputDecorator = function (options) {
        var opts = _.extend({}, options);

        this._node = options.node;
        this._dataDialog = new DataDialog();
        // onSelect, set the pointer of this node to the correct value
        this._dataDialog.onSelect = (dataNode) => {
            this.setPointer('data', dataNode.id);
        };

        this.width = 100;
        this.height = 60;
        this.color = '#444444';

        DecoratorBase.call(this, options);
        this.initialize();
        this.logger.debug('InputDecorator ctor');

    };

    _.extend(InputDecorator.prototype, DecoratorBase.prototype);

    InputDecorator.prototype.initialize = function() {
        this.$body = this.$el
            .append('rect')
            .attr('x', -this.width/2)
            .attr('y', -this.height/2)
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'input-decorator')
            .attr('stroke', this.color)
            .attr('stroke-width', '3');

            //.append('path')
            //.attr('class', 'input-decorator')
            //.attr('stroke', this.color)
            //.attr('stroke-width', '3')
            //.attr('d', this._getPathData());

        this.$name = this.$el.append('text')
            .attr('y', 5)
            .attr('class', 'name')
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')  // FIXME: Move this to css
            .attr('fill', 'black');

        this.$actionBtn = null;

        this.$el
            .attr('transform', `translate(${this.width/2}, ${this.height/2})`);

        // Set the dataNode value
        this.dataNode = this._node.pointers.data;
        if (this.dataNode) {
            this.createRemoveBtn();
        } else {
            this.createAddBtn();
        }
    };

    InputDecorator.prototype.DATA_ROOT = null;
    InputDecorator.prototype.setDataRoot = function() {
        if (!this.DATA_ROOT) {
            var dirs = this.getChildrenOf();
            for (var i = dirs.length; i--;) {
                if (dirs[i].name.toLowerCase() === 'data') {
                    InputDecorator.prototype.DATA_ROOT = dirs[i].id;
                }
            }
            if (!InputDecorator.prototype.DATA_ROOT) {
                console.warn('Could not find a data folder');
            }
        }
    };

    InputDecorator.prototype.updateActionBtn = function() {
        this.$actionBtn.remove();
        if (this.dataNode) {
            this.createRemoveBtn();
        } else {
            this.createAddBtn();
        }
    };

    InputDecorator.prototype.createAddBtn = function() {
        var container = this.$el.append('g'),
            size = 12,
            width = 3,
            cy = 15,
            color = '#66bb6a';

        container.append('circle')
            .attr('cy', cy)
            .attr('r', (size+8)/2)
            .attr('stroke', color)
            .attr('fill', color)
            .style('opacity', '1');

        container.append('line')
            .attr('x1', -size/2)
            .attr('x2', size/2)
            .attr('y1', cy)
            .attr('y2', cy)
            .attr('stroke-width', width)
            .attr('stroke', 'black');

        container.append('line')
            .attr('y1', cy-size/2)
            .attr('y2', cy+size/2)
            .attr('x1', '0')
            .attr('x2', '0')
            .attr('stroke-width', width)
            .attr('stroke', 'black');

        // Add on click
        container.on('click', () => {
            console.log('Adding a data node');
            var dataNodes = this.getDataNodes();
            // Show the dialog
            this._dataDialog.show(dataNodes);

        });

        this.$name
            .attr('y', '-5')
            .text('Add Data');

        // TODO: Rotate to get x
        this.$actionBtn = container;
    };

    InputDecorator.prototype.createRemoveBtn = function() {
        var container = this.$el.append('g'),
            size = 12,
            width = 3,
            cy = 15,
            color = '#e57373';

        // TODO: change this to css/external files
        container.append('circle')
            .attr('cy', cy)
            .attr('r', (size+8)/2)
            .attr('stroke', color)
            .attr('fill', color)
            .style('opacity', '0');

        container.append('line')
            .attr('x1', -size/2)
            .attr('y1', cy-size/2)
            .attr('x2', size/2)
            .attr('y2', cy+size/2)
            .attr('stroke-width', width)
            .attr('stroke', 'black');

        container.append('line')
            .attr('x1', size/2)
            .attr('y1', cy-size/2)
            .attr('x2', -size/2)
            .attr('y2', cy+size/2)
            .attr('stroke-width', width)
            .attr('stroke', 'black');

        // Add on click
        container.on('click', () => {
            // Show the dialog
            this.setPointer('data', null);
        });

        // TODO: Rotate to get x
        this.$actionBtn = container;
    };

    InputDecorator.prototype.getDataNodes = function() {
        // Get the nodes in /data
        this.setDataRoot();
        return this.getChildrenOf(this.DATA_ROOT);  // default is root
    };

    InputDecorator.prototype._getPathData = function() {
        var rx = this.width/2,
            ry = this.height/2;

        return [
            `M${-rx},${-ry}`,
            `l ${this.width} 0`,
            `l 0 ${this.height}`,
            `l ${-this.width} 0`,
            `l 0 ${-this.height}`
        ].join(' ');
    };

    InputDecorator.prototype.renderNoData = function() {
        this.$body
            .transition()
            .attr('stroke-dasharray', '4,4')
            .style('fill', '#fff9c4')
            .style('stroke', '#fff9c4');
    };

    InputDecorator.prototype.renderWithData = function() {
        this.$body
            .transition()
            .attr('stroke-dasharray', null)
            .style('fill', '#ffeb3b')
            .style('stroke', '#ffeb3b');

        this.$name
            .attr('text-anchor', 'middle')
            .attr('y', 0)
            .text(this.dataNode.name);
    };

    InputDecorator.prototype.render = function() {
        if (this.dataNode) {
            this.renderWithData();
        } else {
            this.renderNoData();
        }
        this.updateActionBtn();
    };

    InputDecorator.prototype.update = function(node) {
        this._node = node;
        // Check if dataPath changed
        if (this.dataNode !== node.pointers.data) {
            this.dataNode = node.pointers.data;
            this.render()
        }
    };

    InputDecorator.prototype.DECORATORID = DECORATOR_ID;

    return InputDecorator;
});

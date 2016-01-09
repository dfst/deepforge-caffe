define(['d3'], function() {

    var lineFn = d3.svg.line()
        .x(d => d.x)
        .y(d => d.y)
        .interpolate('linear');

    var Connection = function(pEl, desc) {
        this.desc = desc;
        this.id = desc.id;
        this.src = desc.src;
        this.dst = desc.dst;

        this.$pEl = pEl;
        this.$el = this.$pEl.append('path')
            .attr('fill', 'white');

        //this.$pEl.append("svg:defs").selectAll("marker")
            //.data(["end"])      // Different link/path types can be defined here
            //.enter().append("svg:marker")    // This section adds in the arrows
            //.attr("id", String)
            //.attr("viewBox", "0 -5 10 10")
            //.attr("refX", 15)
            //.attr("refY", -1.5)
            //.attr("markerWidth", 6)
            //.attr("markerHeight", 6)
            //.attr("orient", "auto")
            //.append("svg:path")
            //.attr("d", "M0,-5L10,0L0,5");
    };

    Connection.prototype.redraw = function() {
        this.$el.attr('d', lineFn(this.points))
            .transition()
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
            .attr("marker-end", "url(#arrowhead)");
    };

    Connection.prototype.remove = function() {
        this.$el.remove();
    };

    return Connection;
});

import * as d3 from 'd3';

import png from './a.png';

function getDistance(s, t) {
    return Math.sqrt(Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2));
}

function getRotate(s, t) {
    let f = t.y > s.y ? 1 : -1;
    let r = f * Math.asin(Math.abs(t.y - s.y) / getDistance(s, t));
    let rr = (t.x > s.x ? r : f * Math.PI - r) * (180 / Math.PI);
    return (t.x > s.x ? r : f * Math.PI - r) * (180 / Math.PI);
}

function _nodes() {
    let gnode = this._svg.selectAll('g.node');
    if (gnode.empty()) {
        gnode = this._svg.append('g').classed('node', true);
    }
    let node = gnode.selectAll('g.node-child');
    if (!node.empty()) {
        node.remove();
        node = gnode.selectAll('g.node-child');
    }
    this._simulation.nodes(this._nodes);
    let _this = this;
    node = node.data(this._nodes)
        .join('g')
        .classed('node-child', true)
        .call(d3.drag()
            .on('start', function(d) {
                if (!(d3.event.sourceEvent.target instanceof SVGImageElement)) return;
                if (_this._moveOrLine === 'line') {
                    let startMouse = d3.mouse(this);
                    _this._svg.selectAll('g.line')
                        .append('path')
                        .classed('line-help', true)
                        .attr('stroke', '#9dadb5')
                        .attr('stroke-width', 2)
                        .attr('stroke-linecap', 'round')
                        .attr('stroke-linejoin', 'round')
                        .attr('fill', 'none');
                    d3.event.on('drag', d => {
                        let dd = { x: startMouse[0] + d3.event.x, y: startMouse[1] + d3.event.y };
                        if (Math.abs(dd.x - d.x) > _this._radius || Math.abs(dd.y - d.y) > _this._radius) {
                            _this._svg.selectAll('path.line-help').attr('d', 'M' + _this._radius + ',0 L' + getDistance(d, dd) + ',0')
                                .attr('transform', 'translate(' + d.x + ',' + d.y + ') rotate(' + getRotate(d, dd) + ')');
                        }
                    }).on('end', d => {
                        let image = d3.event.sourceEvent.target,
                            dd = null;
                        if (image instanceof SVGImageElement) {
                            dd = d3.select(image).datum();
                        }
                        //终点是落在节点上，并且不是起点的节点，并且原来的线集合里没有起终点的连接
                        if (!!dd && d.id != dd.id && _this._lines.findIndex(l => l.source.id == d.id && l.target.id == dd.id) === -1) {
                            _this._lines.push({ id: d.id + '-' + dd.id, source: d, target: dd });
                            _lines.call(_this);
                        }
                        _this._svg.selectAll('path.line-help').remove();
                    });
                } else {
                    _this._simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                    d3.event.on('drag', d => {
                        d.fx = d3.event.x;
                        d.fy = d3.event.y;
                        /*//考虑拖拽的时候是否超过svg边界
                        let x = d3.event.x,
                            y = d3.event.y;
                        if (d3.event.x < 0) {
                            x = 0;
                        }
                        if (d3.event.x > _this._svg.node().clientWidth) {
                            x = _this._svg.node().clientWidth;
                        }
                        if (d3.event.y < 0) {
                            y = 0;
                        }
                        if (d3.event.y > _this._svg.node().clientHeight) {
                            y = _this._svg.node().clientHeight;
                        }
                        _this._simulation.restart();
                        d.fx = x;
                        d.fy = y;*/
                    }).on('end', d => {
                        _this._simulation.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    });
                }
            })
        );


    node.append('image')
        .attr('x', -this._radius)
        .attr('y', -this._radius)
        .attr('href', d => png)
        .attr('width', this._radius * 2)
        .attr('height', this._radius * 2)

    node.append('text')
        .attr('y', this._radius)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#ddd')
        .text(d => d.name);

    this._simulation.alphaTarget(0).restart();
}

function _lines() {
    let gline = this._svg.selectAll('g.line');
    if (gline.empty()) {
        gline = this._svg.append('g').classed('line', true);
    }
    let line = gline.selectAll('path.line-child');
    if (!line.empty()) {
        line.remove();
        line = gline.selectAll('path.line-child');
    }
    //this._simulation.force('link').links(this._lines);
    line = line.data(this._lines)
        .join('path')
        .classed('line-child', true)
        .attr('stroke', '#9dadb5')
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('fill', 'none');
    this._simulation.alphaTarget(0).restart();
}

function _init() {
    this._svg = d3.create('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('display', 'block')
        .call(d3.zoom()
            .scaleExtent([0.1, 10])
            .on('zoom', () => {
                /*//考虑缩放的时候外层容器加入滚动条
                if (d3.event.transform.k > 1) {
                    this._svg
                        .attr('width', d3.event.transform.k * 100 + '%')
                        .attr('height', d3.event.transform.k * 100 + '%');
                }
                this._svg.selectAll('g.line').attr('transform', 'scale(' + d3.event.transform.k + ')');
                this._svg.selectAll('g.node').attr('transform', 'scale(' + d3.event.transform.k + ')');
                let pnode = this._svg.node().parentNode;
                pnode.scrollTop = -d3.event.transform.y;
                pnode.scrollLeft = -d3.event.transform.x;*/
                this._svg.selectAll('g.line').attr('transform', () => (d3.event.transform));
                this._svg.selectAll('g.node').attr('transform', () => (d3.event.transform));
            })
        );
    this._simulation = d3.forceSimulation([])
        //.force('link', d3.forceLink([]))
        //.force('charge', d3.forceManyBody())
        //.force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(this._radius));
    this._simulation.on('tick', () => {
        console.log(111);
        this._svg.selectAll('path.line-child').attr('d', d => 'M' + this._radius + ',0 L' + (getDistance(d.source, d.target) - this._radius) + ',0')
            .attr('transform', d => 'translate(' + d.source.x + ',' + d.source.y + ') rotate(' + getRotate(d.source, d.target) + ')');
        this._svg.selectAll('g.node-child').attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });
}

function ModelView(_data) {
    this._radius = 32;

    this._moveOrLine = 'move';

    this._nodes = (_data || {}).nodes || [];
    this._lines = (_data || {}).lines || [];

    _init.call(this);
    _lines.call(this);
    _nodes.call(this);
}

Object.assign(ModelView.prototype, {
    getView: function() {
        return this._svg.node();
    },
    screen: function(mode) {
        if (mode === 'full') { //全屏模式
            return;
        }
    },
    zoom: function(scale) {

    },
    clear: function() {

    },
    cancelAddLine: function() {
        this._moveOrLine = 'move';
    },
    addLine: function() {
        this._moveOrLine = 'line';
    },
    delLine: function() {

    },
    addNode: function(node) {
        let point = d3.clientPoint(this._svg.select('g.node').node(), { clientX: node.x, clientY: node.y });
        let index = this._nodes.findIndex(n => n.id == node.id);
        if (index === -1) { //添加
            node.x = point[0];
            node.y = point[1];
            this._nodes.push(node);
            _nodes.call(this);
        } else { //替换，更新
            //this._simulation.alphaTarget(0.3);
            this._nodes[index].fx = point[0];
            this._nodes[index].fy = point[1];
            this._simulation.tick();
        }

    },
    delNode: function() {

    }
});

export default ModelView;

import * as d3 from 'd3';

import 'babel-polyfill';

import png from './a.png';

//判断浏览器版本
const Env = (function() {
    const UA = window.navigator.userAgent.toLowerCase(),
        isEdge = UA && UA.indexOf('edge/') > 0,
        inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform,
        weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
    return {
        Edge: isEdge,
        IE: function() {
            let isIE = UA && /msie|trident/.test(UA);
            if (!isIE) return false;
            if (/rv:([\d.]+)\) like gecko/.test(UA)) return 11;
            if (document.all && !!window.atob) return 10;
            if (document.all && !!window.addEventListener) return 9;
            if (document.all && !!document.querySelector) return 8;
            if (document.all && !!window.XMLHttpRequest) return 7;
            if (document.all && !!document.compatMode) return 6;
            return 5;
        }(),
        Chrome: UA && /chrome\/\d+/.test(UA) && !isEdge,
        FF: UA && !!UA.match(/firefox\/(\d+)/),
        Android: (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android'),
        IOS: (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios')
    }
}());

//勾股定理计算两点之间的距离
function getDistance(s, t) {
    return Math.sqrt(Math.pow(t.x - s.x, 2) + Math.pow(t.y - s.y, 2));
}
//三角函数计算两点之间的线段与水平线之间的旋转弧度
function getRotate(s, t) {
    let f = t.y > s.y ? 1 : -1,
        r = f * Math.asin(Math.abs(t.y - s.y) / getDistance(s, t));
    return (t.x > s.x ? r : f * Math.PI - r) * (180 / Math.PI);
}
//根据两点之间的距离，及夹角，及一点的坐标，计算另一点的坐标
function getPoint(r, a, p) {
    let ar = (a * Math.PI) / 180;
    return [p.x + r * Math.cos(ar), p.y + r * Math.sin(ar)];
}
//根据海伦公式(三边求面积法)，获取每个边的高
function getHeight(a, b, c) {
    let p = (a + b + c) / 2,
        S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
    return [2 * S / a, 2 * S / b, 2 * S / c];
}
//对数值直接截取几位小数，不四舍五入
function cutNumber(n, c) {
    if (Number.isNaN(+n)) return n;
    return Number(String(+n).replace(new RegExp('^(.*\\..{' + c + '}).*$'), '$1'));
}
//判断矩形与圆是否相交
function rectCrossCircle(rect, circle) {
    let rx = rect.x,
        ry = rect.y,
        rw = rect.width,
        rh = rect.height,
        cx = circle.x,
        cy = circle.y,
        cr = circle.radius,
        cross = false;
    //九种情况
    if (cx <= rx) {
        if (cy <= ry) { //圆心到矩形左上角点的距离
            if (getDistance({ x: rx, y: ry }, { x: cx, y: cy }) <= cr) { //相交
                cross = true;
            }
        } else if (cy > ry && cy < ry + rh) { //圆心到矩形左边线的垂直距离
            if (rx - cx <= cr) { //相交
                cross = true;
            }
        } else if (cy >= ry + rh) { //圆心到矩形左下角点的距离
            if (getDistance({ x: rx, y: ry + rh }, { x: cx, y: cy }) <= cr) { //相交
                cross = true;
            }
        }
    } else if (cx > rx && cx < rx + rw) {
        if (cy <= ry) { //圆心到矩形上边线的垂直距离
            if (ry - cy <= cr) { //相交
                cross = true;
            }
        } else if (cy > ry && cy < ry + rh) { //圆心在矩形内部，必相交
            cross = true;
        } else if (cy >= ry + rh) { //圆心到矩形下边线的垂直距离
            if (cy - (ry + rh) <= cr) { //相交
                cross = true;
            }
        }
    } else if (cx >= rx + rw) {
        if (cy <= ry) { //圆心到矩形右上角点的距离
            if (getDistance({ x: rx + rw, y: ry }, { x: cx, y: cy }) <= cr) { //相交
                cross = true;
            }
        } else if (cy > ry && cy < ry + rh) { //圆心到矩形右边线的垂直距离
            if (cx - (rx + rw) <= cr) { //相交
                cross = true;
            }
        } else if (cy >= ry + rh) { //圆心到矩形右下角点的距离
            if (getDistance({ x: rx + rw, y: ry + rh }, { x: cx, y: cy }) <= cr) { //相交
                cross = true;
            }
        }
    }
    return cross;
}
//判断矩形是否与线段相交
function rectCrossLine(rect, line) {
    let rx = rect.x,
        ry = rect.y,
        rw = rect.width,
        rh = rect.height,
        sx = line.sx,
        sy = line.sy,
        tx = line.tx,
        ty = line.ty,
        lr = getRotate({ x: sx, y: sy }, { x: tx, y: ty }),
        ld = getDistance({ x: sx, y: sy }, { x: tx, y: ty }),
        cross = false;
    //以竖向为中心，线段向右倾斜的情况（一，三象限，斜率为正直）
    if ((lr >= -90 && lr < 0) || (lr < 180 && lr >= 90)) {
        //类似于矩形与矩形相交，考虑坐标起始点相反两种情况，所以使用最大最小值比较
        if (Math.min(sx, tx) <= (rx + rw) && Math.max(sx, tx) >= rx && Math.min(sy, ty) <= (ry + rh) && Math.max(sy, ty) >= ry) {
            //计算定值距离
            lr = (180 - lr) % 180;
            let kr = 180 - lr - getRotate({ x: rx, y: ry }, { x: rx + rw, y: ry + rh }),
                distance = Math.sin((kr * Math.PI) / 180) * Math.sqrt(Math.pow(rw, 2) + Math.pow(rh, 2));
            //计算点到线的垂直距离之和
            let a1 = getDistance({ x: rx, y: ry }, { x: sx, y: sy }),
                b1 = getDistance({ x: rx, y: ry }, { x: tx, y: ty }),
                a2 = getDistance({ x: rx + rw, y: ry + rh }, { x: sx, y: sy }),
                b2 = getDistance({ x: rx + rw, y: ry + rh }, { x: tx, y: ty }),
                height = getHeight(a1, b1, ld)[2] + getHeight(a2, b2, ld)[2];
            //如果相交的情况下，则矩形两条对角线其中一条与线段同一方向倾斜（即斜率正负相同）的对角线的两个点（矩形顶点）到线段的垂直距离之差，以及反方向倾斜（即斜率正负相反）的对角线两个点（矩形顶点）到线段的垂直距离之和都是一个定值，这里验证一种即可。
            if (cutNumber(distance, 10) === cutNumber(height, 10)) { //小数点的误差，所以需要四舍五入取大致数值
                cross = true;
            }
        }
        //以竖向为中心，线段向左倾斜的情况（二，四象限，斜率为正直）
    } else if ((lr < 90 && lr >= 0) || (lr >= -180 && lr < -90)) {
        //类似于矩形与矩形相交，考虑坐标起始点相反两种情况，所以使用最大最小值比较
        if (Math.min(sx, tx) <= (rx + rw) && Math.max(sx, tx) >= rx && Math.max(sy, ty) >= ry && Math.min(sy, ty) <= (ry + rh)) {
            //计算定值距离
            lr = (180 + lr) % 180;
            let kr = 180 - lr + getRotate({ x: rx, y: ry + rh }, { x: rx + rw, y: ry }),
                distance = Math.sin((kr * Math.PI) / 180) * Math.sqrt(Math.pow(rw, 2) + Math.pow(rh, 2));
            //计算点到线的垂直距离之和
            let a1 = getDistance({ x: rx, y: ry + rh }, { x: sx, y: sy }),
                b1 = getDistance({ x: rx, y: ry + rh }, { x: tx, y: ty }),
                a2 = getDistance({ x: rx + rw, y: ry }, { x: sx, y: sy }),
                b2 = getDistance({ x: rx + rw, y: ry }, { x: tx, y: ty }),
                height = getHeight(a1, b1, ld)[2] + getHeight(a2, b2, ld)[2];
            //如果相交的情况下，则矩形两条对角线其中一条与线段同一方向倾斜（即斜率正负相同）的对角线的两个点（矩形顶点）到线段的垂直距离之差，以及反方向倾斜（即斜率正负相反）的对角线两个点（矩形顶点）到线段的垂直距离之和都是一个定值，这里验证一种即可。
            if (cutNumber(distance, 10) === cutNumber(height, 10)) {
                cross = true;
            }
        }
    }
    return cross;
}
//判断矩形是否与矩形相交
function rectCrossRect(rect1, rect2) {
    let x1 = rect1.x,
        y1 = rect1.y,
        w1 = rect1.width,
        h1 = rect1.height,
        x2 = rect2.x,
        y2 = rect3.y,
        w2 = rect2.width,
        h2 = rect2.height,
        cross = false;
    //rect2上边竖坐标值小于等于rect1下边竖坐标值&&rect2下边竖坐标值大于等于rect1下边竖坐标值并且rect2左边横坐标值小于等于rect1右边横坐标值&&rect2右边横坐标值大于等于rect1左边边横坐标值，则两矩形必相交
    if ((y2 + h2) >= y1 && y2 <= (y1 + h1) && (x2 + w2) >= x1 && x2 <= (x1 + w1)) {
        cross = true;
    }
    return cross;
}
//阻止相关事件默认行为及冒泡，主要针对菜单元素的
function _stopAllEvents(el) {
    el.on('click', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    }).on('dblclick', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    }).on('contextmenu', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    }).on('wheel', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    }).on('mousedown', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    }).on('mousemove', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    }).on('mouseup', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    }).on('mouseover', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    }).on('mouseout', function() {
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    });
}
//右键菜单统一注册处理
function _contextmenu(type, el) {
    let key = type === 'node' ? 'nodeMenu' : type === 'line' ? 'lineMenu' : 'viewMenu';
    if (!this._options[key] || !this._options[key].length) return;
    el.on('contextmenu.contextmenu', n => {
        let args = [n];
        if (type === 'line') {
            args = [this._lines.idMap[n.sid], this._lines.idMap[n.tid], n.twa];
        }
        //根据菜单里的test检测点击对象是否可以显示改菜单
        let menus = this._options[key].filter(m => {
            return !(typeof(m.test) === 'function' && m.test.apply(null, args) === false);
        });
        if (!menus.length) return;
        //计算右键菜单位置，主要考虑靠下及靠右点击，菜单不应该显示在点击位置，而是在窗口内显示
        let width = 120, //菜单宽度
            height = 30, //单个菜单高度
            marginLeft = 20, //菜单文字离左边距离
            svgNode = this._svg.node(),
            svgRect = svgNode.getBoundingClientRect(),
            mouse = d3.mouse(svgNode), //获取鼠标相对于svg元素的xy坐标
            x = mouse[0],
            y = mouse[1];
        if (svgRect.width < width + 2) {
            x = 0;
        } else if (svgRect.width - x < width + 2) {
            x = svgRect.width - (width + 2);
        }
        let totalHeight = height * menus.length;
        if (svgRect.height < totalHeight + 2) {
            y = 0;
        } else if (svgRect.height - y < totalHeight + 2) {
            y = y - (totalHeight + 2);
            if (y < 0) {
                y = 0;
            }
        }
        //创建右键菜单元素
        if (!this._contextmenu || this._contextmenu.empty()) {
            this._contextmenu = this._svg.append('g');
        }
        //创建子菜单组，会合并元素替换上一次出现的时候数据
        let children = this._contextmenu
            .attr('opacity', 0)
            .selectAll('g')
            .data(menus)
            .join('g')
            .attr('cursor', 'pointer')
            .attr('transform', (m, i) => ('translate(0,' + (i * height) + ')'))
            .on('click.contextmenu', m => { //菜单点击事件
                args.splice(0, 0, d3.event);
                typeof(m.click === 'function') ? m.click.apply(null, args): null;
                //处理完事件后隐藏菜单
                _contextmenuHide.call(this);
            })
            .on('mouseover.contextmenu', function() { //鼠标移上菜单时的处理
                let gmenu = d3.select(this);
                gmenu.select('rect').attr('fill', '#c3e5f9');
                //gmenu.select('text').attr('fill', '#fff');
            })
            .on('mouseout.contextmenu', function() { //鼠标移出菜单时的处理
                let gmenu = d3.select(this);
                gmenu.select('rect').attr('fill', '#fff');
                //gmenu.select('text').attr('fill', '#333');
            });
        //对菜单上的所有事件进行组织冒泡和默认行为，会阻止在此事件触发之后的所有事件
        _stopAllEvents.call(this, children);
        //创建子菜单的文字及占据范围的rect
        children.each(function(m, i) {
            let child = d3.select(this),
                rect = child.select('rect'),
                text = child.select('text');
            if (rect.empty()) {
                rect = child.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('fill', '#fff')
                    .attr('fill-opacity', .85)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 1)
                    .attr('stroke-linejoin', 'round') //圆角处理
                    .attr('stroke-dasharray', i === 0 ? '150,120' : i === menus.length - 1 ? '0,120,60' : '0,120,30,0'); //处理菜单边框的，控制四边显示哪些
            }
            if (text.empty()) {
                text = child.append('text')
                    .attr('dy', '.3em')
                    .attr('transform', 'translate(' + marginLeft + ',' + (height / 2) + ')')
                    .attr('font-size', '14px')
                    .attr('fill', '#333');
            }
            text.text(m => m.name)
        });
        //菜单相关显示以及动画显示
        this._contextmenu
            .attr('class', '')
            .classed('contextmenu contextmenu-' + type + (args[0] ? ('-' + args[0].id) : '') + (args[1] ? ('-' + args[1].id) : ''), true)
            .attr('transform', 'translate(' + (x + 1) + ',' + (y + 1) + ')')
            .attr('display', null)
            .transition()
            .attr('opacity', 1);
        d3.event.preventDefault();
        d3.event.stopImmediatePropagation();
    });
}
//隐藏右键菜单函数
function _contextmenuHide() {
    if (this._contextmenu && this._contextmenu.attr('display') !== 'none') {
        this._contextmenu
            .transition()
            .attr('opacity', 0)
            .end().then(() => {
                this._contextmenu.attr('display', 'none');
            }).catch((e) => {});
    }
}
//快速菜单同意注册梳理
function _fastmenu(type, el) {
    let key = type === 'node' ? 'nodeFastMenu' : type === 'line' ? 'lineFastMenu' : 'viewFastMenu';
    if (!this._options[key] || !this._options[key].length) return;
    let _this = this;
    el.on('click.fastmenu', function(n) {
        let args = [n];
        if (type === 'line') {
            args = [_this._lines.idMap[n.sid], _this._lines.idMap[n.tid], n.twa];
        }
        //根据菜单里的test检测点击对象是否可以显示改菜单
        let menus = _this._options[key].filter(m => {
            return !(typeof(m.test) === 'function' && m.test.apply(null, args) === false);
        });
        if (!menus.length) return;
        //计算点击范围内可触发快速菜单
        let mouse = d3.mouse(this),
            radius = getDistance({ x: 0, y: 0 }, { x: mouse[0], y: mouse[1] });
        if (radius > _this._options.radius - 12) return;
        //创建快速菜单元素
        if (!_this._fastmenu || _this._fastmenu.empty()) {
            _this._fastmenu = _this._svg.append('g');
        }
        //创建子菜单组，会合并元素替换上一次出现的时候数据
        let children = _this._fastmenu
            .attr('opacity', 0)
            .selectAll('g')
            .data(_generator.call(_this, 'pie')(menus))
            .join('g')
            .attr('cursor', 'pointer')
            .on('click.fastmenu', (m) => { //菜单点击事件
                args.splice(0, 0, d3.event);
                typeof(m.data.click) === 'function' ? m.data.click.apply(null, args): null;
                //处理完事件后隐藏菜单
                _fastmenuHide.call(_this);
            })
            .on('mouseover.fastmenu', function() { //鼠标移上菜单时的处理
                let gmenu = d3.select(this);
                gmenu.select('path').attr('fill', '#c3e5f9');
                gmenu.select('text').attr('fill', '#333');
            })
            .on('mouseout.fastmenu', function() { //鼠标移出菜单时的处理
                let gmenu = d3.select(this);
                gmenu.select('path').attr('fill', '#00A68F');
                gmenu.select('text').attr('fill', '#fff');
            });
        //对菜单上的所有事件进行组织冒泡和默认行为，会阻止在此事件触发之后的所有事件
        _stopAllEvents.call(_this, children);
        //创建子菜单的文字及path
        children.each(function(m, i) {
            let child = d3.select(this),
                path = child.select('path'),
                text = child.select('text');
            if (path.empty()) {
                path = child.append('path')
                    .attr('fill', '#00A68F')
                    .attr('d', _generator.call(_this, 'arc'));
            }
            if (text.empty()) {
                text = child.append('text')
                    .attr('transform', 'translate(' + _generator.call(_this, 'arc').centroid(m) + ')')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '.3em')
                    .attr('font-size', '12px')
                    .attr('fill', '#fff');
            }
            text.text(m.data.name)
        });
        //菜单相关显示以及动画显示
        _this._fastmenu
            .attr('class', '')
            .classed('fastmenu fastmenu-' + type + (args[0] ? ('-' + args[0].id) : '') + (args[1] ? ('-' + args[1].id) : ''), true)
            .attr('transform', d3.zoomTransform(this))
            .attr('display', null)
            .transition()
            .attr('opacity', 1)
            .selectAll('g')
            .attr('transform', 'translate(' + (args[0] && !args[1] ? args[0].x : mouse[0]) + ',' + (args[0] && !args[1] ? args[0].y : mouse[1]) + ')');
    });
}
//隐藏快速菜单函数
function _fastmenuHide() {
    if (this._fastmenu && this._fastmenu.attr('display') !== 'none') {
        this._fastmenu
            .transition()
            .attr('opacity', 0)
            .end().then(() => {
                this._fastmenu.attr('display', 'none');
            }).catch((e) => {});
    }
}
//增加修改替换等节点时合并线
function _lineMerge(replace, update, node) {
    let lineMap = {},
        len = this._lines.length;
    //循环合并
    while (len--) {
        let l = this._lines[len];
        if ((l.sid == replace.id && l.tid == update.id) || (l.sid == update.id && l.tid == replace.id)) {
            //将要合并的两个节点之间的连接删除
            this._lines.splice(len, 1);
        } else if (l.sid == replace.id || l.tid == replace.id || l.sid == update.id || l.tid == update.id) {
            let skey = 'sid',
                tkey = 'tid';
            if (l.sid == replace.id || l.sid == update.id) {
                skey = 'tid';
                tkey = 'sid';
            }
            if (!!lineMap[l[skey]]) {
                let _l = lineMap[l[skey]];
                if (_l.twa) { //双向
                    this._lines.splice(len, 1);
                } else {
                    if (_l[skey] == l[skey]) { //同向
                        _l.twa = l.twa;
                        this._lines.splice(len, 1);
                    } else { //反向
                        _l.twa = true;
                        this._lines.splice(len, 1);
                    }
                }
            } else {
                l[tkey] = node.id;
                this._lines.idMap[node.id] = node;
                lineMap[l[skey]] = l;
            }
        }
    }
    //循环判断合并后的线和新节点是否可以连线
    for (let k in lineMap) {
        let line = lineMap[k],
            snode = this._lines.idMap[line.sid],
            tnode = this._lines.idMap[line.tid],
            isPositive = this._options.canLink(snode, tnode),
            isOpposite = false;
        if (line.twa) {
            isOpposite = this._options.canLink(tnode, snode);
        }
        if (!isPositive && !isOpposite) { //删掉该线
            let index = this._lines.findIndex(l => line === l);
            if (index !== -1) this._lines.splice(index, 1);
        } else if (isPositive && !isOpposite) {
            line.twa = false;
        } else if (!isPositive && isOpposite) {
            line.twa = false;
            let tempId = line.sid;
            line.sid = line.tid;
            line.tid = tempId;
        }
    }
    _lines.call(this);
}
//构建d3相关功能函数生成器
const _generator = (function() {
    let generator = {};
    return function(type) {
        if (!generator[type]) {
            let _this = this;
            if (type === 'zoom') {
                //构造缩放事件生成器
                generator[type] = d3.zoom()
                    .scaleExtent([0.1, 10]) //缩放比例在0.1-1-10之间
                    .on('zoom', () => {
                        /*//考虑缩放的时候外层容器加入滚动条
                        if (d3.event.transform.k > 1) {
                            this._svg
                                .attr('width', d3.event.transform.k * 100 + '%')
                                .attr('height', d3.event.transform.k * 100 + '%');
                        }
                        this._svg.selectAll('g.node-line').attr('transform', 'scale(' + d3.event.transform.k + ')');
                        this._svg.selectAll('g.fastmenu').attr('transform', 'scale(' + d3.event.transform.k + ')');
                        let pnode = this._svg.node().parentNode;
                        pnode.scrollTop = -d3.event.transform.y;
                        pnode.scrollLeft = -d3.event.transform.x;*/
                        //rect元素变化改变节点-连线组的位移及缩放
                        this._svg.selectAll('g.node,g.line,g.rect').attr('transform', d3.event.transform);
                        //改变节点快速菜单的位移及缩放，主要是跟随节点-连线一起变化
                        this._svg.selectAll('g.fastmenu').attr('transform', d3.event.transform);
                    });
            } else if (type === 'drag') {
                //构造拖拽事件生成器
                generator[type] = d3.drag()
                    .on('start', function(n) {
                        //计算鼠标在当前元素上的位置
                        let startMouse = d3.mouse(this);
                        if (!n) { //表示触发的是svg的拖拽事件
                            //构造“选择框”
                            let boxSelector = _this._svg.append('rect')
                                .classed('box-selector', true)
                                .attr('fill', '#ddd')
                                .attr('fill-opacity', .45),
                                nodeZoom = d3.zoomTransform(_this._svg.selectAll('g.rect').node());
                            d3.event.on('drag', _ => { //注册拖动事件
                                //拖动时计算并更新“选择框”的位置和大小
                                let x = Math.min(startMouse[0], d3.event.x),
                                    y = Math.min(startMouse[1], d3.event.y),
                                    w = Math.abs(d3.event.x - startMouse[0]),
                                    h = Math.abs(d3.event.y - startMouse[1]);
                                boxSelector.attr('x', x)
                                    .attr('y', y)
                                    .attr('width', w)
                                    .attr('height', h);
                                _this._nodes.forEach(_n => {
                                    let point = nodeZoom.apply([_n.x, _n.y]),
                                        radius = (_this._options.radius - 12) * nodeZoom.k;
                                    if (rectCrossCircle({ x: x, y: y, width: w, height: h }, { x: point[0], y: point[1], radius: radius })) {
                                        _selectNode.call(_this, d3.select('image.node-' + _n.id));
                                    }
                                    //rectCrossRect({ x: x, y: y, width: w, height: h },{ x: _n.x, y: _n.y, width: _n.w, height: _n.h });
                                });
                                _this._lines.forEach(_l => {
                                    let source = _this._lines.idMap[_l.sid],
                                        target = _this._lines.idMap[_l.tid],
                                        radius = _this._options.radius,
                                        angle = getRotate(source, target);
                                    //因为线的起止坐标并不在节点圆心上，而是在节点的半径以外，所以要减去相应的长度
                                    source = nodeZoom.apply(getPoint(radius, angle, source));
                                    target = nodeZoom.apply(getPoint(radius, 180 + angle, target));
                                    if (rectCrossLine({ x: x, y: y, width: w, height: h }, { sx: source[0], sy: source[1], tx: target[0], ty: target[1] })) {
                                        _selectLine.call(_this, d3.select('path.line-' + _l.sid + '-' + _l.tid));
                                    }
                                });
                            }).on('end', _ => { //结束拖动
                                //移除“选择框”
                                boxSelector.remove();
                            });
                            return;
                        }
                        //获取鼠标点距离节点中心距离
                        let radius = getDistance({ x: 0, y: 0 }, { x: startMouse[0], y: startMouse[1] });
                        if (radius <= _this._options.radius - 12) { //此种范围内执行拖拽动作
                            //启动力模型tick事件
                            _this._simulation.alphaTarget(0.3).restart();
                            n.fx = n.x;
                            n.fy = n.y;
                            d3.event.on('drag', _n => { //注册拖动事件
                                //赋值节点下一点的位置，后面会在tick函数内更新节点位置
                                _n.fx = d3.event.x;
                                _n.fy = d3.event.y;
                                /*//考虑拖拽的时候是否超过svg边界
                                let x = d3.event.x,
                                    y = d3.event.y,
                                    svgRect = _this._svg.node().getBoundingClientRect();
                                if (d3.event.x < 0) {
                                    x = 0;
                                }
                                if (d3.event.x > svgRect.width) {
                                    x = svgRect.width;
                                }
                                if (d3.event.y < 0) {
                                    y = 0;
                                }
                                if (d3.event.y > svgRect.height) {
                                    y = svgRect.height;
                                }
                                _this._simulation.restart();
                                _n.fx = x;
                                _n.fy = y;*/
                            }).on('end', _n => {
                                //结束拖动，并结束tick函数
                                _this._simulation.alphaTarget(0);
                                _n.fx = null;
                                _n.fy = null;
                            });
                        } else if (radius <= _this._options.radius) { //此种范围内执行节点连线动作
                            //判断节点是否可以连线
                            if (!_this._options.canLink(n)) return;
                            //构造“拖动线”
                            let lineHelp = _this._svg.selectAll('g.line')
                                .append('path')
                                .classed('line-help', true)
                                .attr('stroke', '#9dadb5')
                                .attr('stroke-width', 2)
                                .attr('stroke-linecap', 'round')
                                .attr('stroke-linejoin', 'round')
                                .attr('fill', 'none')
                                .attr('marker-end', 'url(#end)');
                            d3.event.on('drag', source => { //注册拖动事件
                                let target = { x: startMouse[0] + d3.event.x, y: startMouse[1] + d3.event.y },
                                    distance = getDistance(source, target);
                                //拖动时计算并更新“拖动线”的位置和角度
                                if (distance - 5 > _this._options.radius) {
                                    lineHelp.attr('d', 'M' + _this._options.radius + ',0 L' + (distance - 5) + ',0')
                                        .attr('transform', 'translate(' + source.x + ',' + source.y + ') rotate(' + getRotate(source, target) + ')');
                                    /*let rotate = getRotate(source, target),
                                        start = getPoint(_this._options.radius, rotate, source),
                                        end = getPoint(5, 180 + rotate, target),
                                        midA = [(start[0] + end[0]) / 2, start[1]],
                                        midB = [(start[0] + end[0]) / 2, end[1]];
                                    lineHelp.attr('d', 'M' + start[0] + ',' + start[1] + ' C' + midA[0] + ',' + midA[1] + ' ' + midB[0] + ',' + midB[1] + ' ' + end[0] + ',' + end[1]);*/
                                    if (Env.IE) {
                                        lineHelp.attr('marker-end', null);
                                        d3.timeout(_ => {
                                            lineHelp.attr('marker-end', 'url(#end)');
                                        }, 100);
                                    }
                                }
                            }).on('end', source => { //结束拖动
                                //移除“拖动线”
                                lineHelp.remove();
                                //判断结束时鼠标是否落在另一个节点范围内
                                let target = d3.event.sourceEvent.target;
                                if (target instanceof SVGImageElement) {
                                    target = d3.select(target).datum();
                                } else {
                                    target = null;
                                }
                                //判断连线的两个节点之间是都可以连线
                                if (!_this._options.canLink(source, target)) return;
                                //终点是落在节点上，并且不是起点的节点，并且原来的线集合里没有起终点的连接
                                if (!!target && source.id != target.id && _this._lines.findIndex(l => l.sid == source.id && l.tid == target.id) === -1) {
                                    let index = _this._lines.findIndex(l => l.sid == target.id && l.tid == source.id);
                                    if (index === -1) {
                                        _this._lines.push({ sid: source.id, tid: target.id });
                                    } else { //双向箭头
                                        _this._lines[index].twa = true;
                                    }
                                    //更新连线
                                    _lines.call(_this);
                                }
                            });
                        }
                    });
            } else if (type === 'arc') {
                //构造弧形路径生成器
                generator[type] = d3.arc()
                    .innerRadius(_this._options.radius - 3)
                    .outerRadius(_this._options.radius + 17)
            } else if (type === 'pie') {
                //构造环、饼图数据生成器
                generator[type] = d3.pie()
                    .padAngle(.03)
                    .value((a, b, c) => 1 / c.length)
            }
        }
        return generator[type];
    }
}());
//选择线
function _selectLine(path, selected) {
    if (selected === false) { //取消选择
        path.classed('selected', false)
            .attr('stroke', '#9dadb5')
            .attr('marker-end', 'url(#end)')
            .attr('marker-start', l => (l.twa ? 'url(#start)' : ''));
    } else { //选择
        path.classed('selected', true)
            .attr('stroke', 'red')
            .attr('marker-end', 'url(#end-selected)')
            .attr('marker-start', l => (l.twa ? 'url(#start-selected)' : ''));
    }
}
//选择节点
function _selectNode(node, selected) {
    if (selected === false) { //取消选择
        node.classed('selected', false);
    } else { //选择
        node.classed('selected', true);
    }
}
//构建节点
function _nodes() {
    //使用力模型重新构造节点对象数据
    this._simulation.nodes(this._nodes);
    //在lines集合里放入可以根据node.id直接获取node对象的映射
    this._lines.idMap = {};
    this._nodes.forEach(n => {
        this._lines.idMap[n.id] = n;
    });
    //查找节点组，如果没有则创建
    let gnodeParent = this._svg.selectAll('g.node-line'),
        gnode = gnodeParent.selectAll('g.node');
    if (gnode.empty()) {
        gnode = gnodeParent.append('g').classed('node', true);
    }
    //创建节点（会和原有数据合并，根据node.id筛选的）
    let _this = this,
        node = gnode.selectAll('g.node-child')
        .data(this._nodes, n => n.id)
        .join('g')
        .classed('node-child', true)
        .attr('cursor', 'default')
        .on('mousedown.contextmenu', n => { //由于下面的'drag'事件会阻止冒泡及后续的注册事件，所以在此注册关掉菜单用
            _contextmenuHide.call(this);
            _fastmenuHide.call(this);
        })
        .on('mousemove.line', function(n) { //鼠标在节点上移动的时候，判断移动到可连线区域，则改变鼠标样式
            let mouse = d3.mouse(this);
            d3.timeout(_ => { //延时触发，防止过快反应不过来
                let radius = getDistance({ x: 0, y: 0 }, { x: mouse[0], y: mouse[1] }),
                    isPointer = radius > _this._options.radius - 12 && radius <= _this._options.radius;
                d3.select(this).attr('cursor', isPointer ? 'pointer' : 'default');
            }, 250);
        }).on('click.select', function(n) { //选中事件
            let image = d3.select(this).select('image');
            _selectNode.call(_this, image, !image.classed('selected'));
            //防止冒泡到svg的click事件
            d3.event.stopPropagation();
        }).call(_generator.call(this, 'drag')); //对节点注册拖拽事件，此事件会阻止后续注册的以及冒泡的父元素相关事件:mousedown,mouseup,mousemove
    //注册周围快速菜单事件
    _fastmenu.call(_this, 'node', node);
    //注册右键菜单事件
    _contextmenu.call(_this, 'node', node);
    //创建节点组内部图片image和节点名称text
    node.each(function(n) {
        let cnode = d3.select(this),
            image = cnode.select('image'),
            text = cnode.select('text');
        if (image.empty()) {
            image = cnode.append('image')
                .classed('node-' + n.id, true)
                .attr('x', -_this._options.radius)
                .attr('y', -_this._options.radius)
                .attr('width', _this._options.radius * 2)
                .attr('height', _this._options.radius * 2);
        }
        image.attr('xlink:href', n => png);
        if (text.empty()) {
            text = cnode.append('text')
                .classed('node-' + n.id, true)
                .attr('y', _this._options.radius)
                .attr('dy', '1em')
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', '#ddd');
        }
        text.text(n => n.text);
    });
    //启动力模型事件，校正线位置（alphaTarget[0-1]数值越大，tick运行次数越多）
    this._simulation.alphaTarget(0.5).restart();
    //启动后用此法停止力模型tick
    d3.timeout(_ => this._simulation.alphaTarget(0));
}
//构建连线
function _lines() {
    //查找连线组，如果没有则创建
    let glineParent = this._svg.selectAll('g.node-line'),
        gline = glineParent.selectAll('g.line');
    if (gline.empty()) {
        gline = glineParent.append('g').classed('line', true);
    }
    /*//直接使用path作为线，此种情况鼠标点击选中或右键，可点范围较小，不易触发事件
    let line = gline.selectAll('path.line-child')
        .data(this._lines, l => (l.sid + '-' + l.tid))
        .join('path')
        .classed('line-child', true)
        .attr('stroke', '#9dadb5')
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('fill', 'none')
        .attr('marker-start', l => (l.twa ? 'url(#start)' : ''))
        .attr('marker-end', 'url(#end)');*/

    //创建线（会和原有数据合并，根据连线的起止节点id筛选的）
    let _this = this,
        line = gline.selectAll('g.line-child')
        .data(this._lines, l => (l.sid + '-' + l.tid))
        .join('g')
        .attr('cursor', 'default')
        .classed('line-child', true)
        .on('click.select', function(l) { //选中事件
            let path = d3.select(this).select('path');
            _selectLine.call(_this, path, !path.classed('selected'));
            //防止冒泡到svg的click事件
            d3.event.stopPropagation();
        });
    //注册右键菜单事件
    _contextmenu.call(this, 'line', line);
    //创建线内部撑大范围的rect和线的path
    line.each(function(l) {
        let cline = d3.select(this),
            rect = cline.select('rect'),
            path = cline.select('path');
        if (rect.empty()) {
            rect = cline.append('rect')
                .classed('line-' + l.sid + '-' + l.tid, true)
                .attr('x', _this._options.radius)
                .attr('y', -6)
                .attr('height', 12)
                .attr('opacity', 0);
        }
        if (path.empty()) {
            path = cline.append('path')
                .classed('line-' + l.sid + '-' + l.tid, true)
                .attr('stroke', '#9dadb5')
                .attr('stroke-width', 2)
                .attr('stroke-linecap', 'round')
                .attr('stroke-linejoin', 'round')
                .attr('fill', '#9dadb5')
                .attr('marker-end', 'url(#end)');
        }
        //如果是双向箭头，则加一个反向箭头
        path.attr('marker-start', l => (l.twa ? 'url(#start)' : ''));
    });
    //启动力模型事件，校正线位置（alphaTarget[0-1]数值越大，tick运行次数越多）
    this._simulation.alphaTarget(0.5).restart();
    //启动后用此法停止力模型tick
    d3.timeout(_ => this._simulation.alphaTarget(0));
}
//初始化
function _init() {
    this._svg = d3.create('svg');
    if (Env.IE && Env.IE < 9) {
        alert('SVG不支持你所使用的浏览器，请更换其他浏览器或升级为更高版本的浏览器后查看！');
        return;
    }
    //创建svg画布
    this._svg
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 800 450')//火狐需要设置具体的宽高不能直接百分比，否则会报错
        .attr('display', 'block')
        .on('mousedown.contextmenu', _ => { //由于后面的'drag'事件会阻止冒泡及后续的注册事件，所以在此注册关掉菜单用
            _contextmenuHide.call(this);
            _fastmenuHide.call(this);
        }).on('click.select', _ => { //单击时去掉选择状态
            _selectNode.call(this, d3.selectAll('g.node-child').selectAll('image.selected'), false);
            _selectLine.call(this, d3.selectAll('g.line-child').selectAll('path.selected'), false);
        }).call(_generator.call(this, 'drag'));
    //对画布注册右键菜单事件
    _contextmenu.call(this, 'view', this._svg);
    //创建连线箭头引用
    this._svg.append('defs')
        .selectAll('marker')
        .data(['start', 'end', 'start-selected', 'end-selected'])
        .enter()
        .append('marker')
        .attr('id', m => m)
        .attr('refX', 3)
        .attr('refY', 3)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('markerUnits', 'strokeWidth')
        .append('path')
        .attr('d', m => (m.indexOf('end') !== -1 ? 'M 0 0 6 3 0 6Z' : 'M 0 3 6 6 6 0Z'))
        //.attr('d', m => (m === 'end' ? 'M2,2 L10,6 L2,10 L4,6 L2,2' : 'M2,2 L10,6 L2,10 L4,6 L2,2'))
        .attr('fill', m => (m.indexOf('selected') !== -1 ? 'red' : '#9dadb5'));
    //创建节点-连线组并注册放大缩小事件，事件内容主要是改变注册元素及相关元素的位移及缩放
    this._svg.append('g')
        .classed('node-line', true)
        .on('mousedown.contextmenu', _ => { //由于下面的'zoom'事件会阻止冒泡及后续的注册事件，所以在此注册关掉菜单用
            _contextmenuHide.call(this);
            _fastmenuHide.call(this);
        })
        .call(_generator.call(this, 'zoom')) //缩放事件，此事件会阻止后续注册的以及冒泡的父元素相关事件:mousedown,mouseup,mousemove,wheel,dblclick
        .append('g')
        .classed('rect', true)
        .append('rect')
        .attr('opacity', 0);
    //构建节点碰撞力模型
    this._simulation = d3.forceSimulation([])
        .force('collide', d3.forceCollide(this._options.radius));
    //注册用力时执行的事件，事件内主要用于改变因为力的原因需要改变的相关参数，比如节点位移，线的路径以及旋转变形等
    this._simulation.on('tick', _ => {
        let _this = this;
        //线更新
        this._svg.selectAll('g.line-child')
            .each(function(l) {
                let child = d3.select(this),
                    x = _this._lines.idMap[l.sid].x,
                    y = _this._lines.idMap[l.sid].y,
                    r = _this._options.radius,
                    distance = getDistance(_this._lines.idMap[l.sid], _this._lines.idMap[l.tid]),
                    rotate = getRotate(_this._lines.idMap[l.sid], _this._lines.idMap[l.tid]);
                //更新线的path位置
                child.select('path')
                    .attr('d', 'M' + (r + (l.twa ? 5 : 0)) + ',0 L' + (distance - r - 5) + ',0')
                    //.attr('d', 'M' + r + ',0 L' + (distance - r - 9) + ',0 ' + (distance - r - 12) + ',-6 ' + (distance - r) + ',0 ' + (distance - r - 12) + ',6 ' + (distance - r - 9) + ',0 Z')
                    //.attr('d', 'M' + r + ',0 L' + (distance - r - 12) + ',0 V -6 L' + (distance - r) + ',0 ' + (distance - r - 12) + ',6 V0 Z')
                    .attr('transform', 'translate(' + x + ',' + y + ') rotate(' + rotate + ')');
                /*let r2 = _this._options.radius + (l.twa ? 5 : 0),
                    start = getPoint(r2, rotate, _this._lines.idMap[l.sid]),
                    end = getPoint(r, 180 + rotate, _this._lines.idMap[l.tid]),
                    midA = [(start[0] + end[0]) / 2, start[1]],
                    midB = [(start[0] + end[0]) / 2, end[1]];
                child.select('path').attr('d', 'M' + start[0] + ',' + start[1] + ' C' + midA[0] + ',' + midA[1] + ' ' + midB[0] + ',' + midB[1] + ' ' + end[0] + ',' + end[1]);*/
                if (Env.IE) {
                    let path = child.select('path').attr('marker-end', null);
                    d3.timeout(_ => {
                        if (path.classed('selected')) {
                            path.attr('marker-end', 'url(#end-selected)');
                        } else { //选择
                            path.attr('marker-end', 'url(#end)');
                        }
                    }, 250);
                }
                //更新线的可点区域位置
                child.select('rect')
                    .attr('width', (distance - 2 * r) > 0 ? (distance - 2 * r) : 0)
                    .attr('transform', 'translate(' + x + ',' + y + ') rotate(' + rotate + ')');
                //线上的快速菜单位置更新（暂时没有这个快速菜单）
                let menus = _this._svg.selectAll('g.fastmenu-line-' + l.sid + '-' + l.tid);
                if (menus && !menus.empty()) {
                    menus.selectAll('g').attr('transform', 'rotate(' + rotate + ')');
                }
            });
        //节点更新
        this._svg.selectAll('g.node-child')
            .each(function(n) {
                let child = d3.select(this);
                //更新node的位置
                child.attr('transform', 'translate(' + n.x + ',' + n.y + ')');
                //节点上的快速菜单位置更新
                let menus = _this._svg.selectAll('g.fastmenu-node-' + n.id);
                if (menus && !menus.empty()) {
                    menus.selectAll('g').attr('transform', 'translate(' + n.x + ',' + n.y + ')');
                }
            });
        //更新node-line组内部rect宽高和位置，方便缩放使用
        let max = { x: 0, y: 0 },
            min = { x: Infinity, y: Infinity };
        this._nodes.forEach(n => {
            if (n.x > max.x) max.x = n.x;
            if (n.y > max.y) max.y = n.y;
            if (n.x < min.x) min.x = n.x;
            if (n.y < min.y) min.y = n.y;
        });
        if (this._nodes.length) {
            this._svg.select('g.rect').select('rect')
                .attr('width', (max.x - min.x + 2 * this._options.radius) > 0 ? (max.x - min.x + 2 * this._options.radius) : 0)
                .attr('height', (max.y - min.y + 2 * this._options.radius + 15) > 0 ? (max.y - min.y + 2 * this._options.radius + 15) : 0) //加上15是因为节点下面有名称占15px高度
                .attr('x', min.x - this._options.radius)
                .attr('y', min.y - this._options.radius);
        }
    });
    //构建线和节点
    _lines.call(this);
    _nodes.call(this);
}

function ModelView(options) {
    this._options = options = Object.assign({
        radius: 32,
        nodes: [],
        lines: [],
        canLink: _ => 1,
        lineMenu: [],
        nodeMenu: [],
        nodeFastMenu: [],
        viewMenu: []
    }, options);

    this._nodes = options.nodes;
    this._lines = options.lines;

    _init.call(this);
}

Object.assign(ModelView.prototype, {
    getView() {
        return this._svg.node();
    },
    getData() {
        return {
            nodes: this._nodes,
            lines: this._lines
        };
    },
    translate(x, y, way) { //根据给定的x,y值进行位移，不传值则位于初始位置
        //zoom.translateTo移动的是视图中心点，所以要进行转换
        let zoom = _generator.call(this, 'zoom'),
            el = this._svg.selectAll('g.node-line').transition(),
            rect = this._svg.select('g.rect').select('rect'),
            svgRect = this._svg.node().getBoundingClientRect();
        if (x === 'center') { //移动到画布中央
            x = (svgRect.width - +rect.attr('width')) / 2;
            y = (svgRect.height - +rect.attr('height')) / 2;
            way = 'to';
        } else if (x === 'init') { //移动到刚开始的位置
            x = +rect.attr('x');
            y = +rect.attr('y');
            way = 'to';
        }
        if (way === 'to') { //直接移动到距离画布左边x，上边y的位置
            let rx = +rect.attr('x'),
                ry = +rect.attr('y');
            if (Number.isNaN(+x)) x = rx;
            if (Number.isNaN(+y)) y = ry;
            x = x - rx;
            y = y - ry;
            zoom.translateTo(el, svgRect.width / 2 - x, svgRect.height / 2 - y);
        } else { //在原来的位置基础上再移动一定的距离(x,y)
            if (Number.isNaN(+x)) x = 0;
            if (Number.isNaN(+y)) y = 0;
            zoom.translateBy(el, x, y);
        }
    },
    scale(k, way) { //根据给定的k值进行缩放，不传值则恢复原始比例
        if (Number.isNaN(+k) || (+k <= 0)) k = 1;
        let zoom = _generator.call(this, 'zoom'),
            el = this._svg.selectAll('g.node-line').transition();
        if (k === 1) { //如果是1，则直接认为恢复到原始比例，因为在原来的基础上增加一倍，没有用。
            way = 'to';
        }
        if (way === 'to') { //直接变换到给出的比例
            zoom.scaleTo(el, k);
        } else { //在原有的基础上变化k倍
            zoom.scaleBy(el, k);
        }
    },
    addNode(node) {
        let point = d3.clientPoint(this._svg.select('g.node').node(), { clientX: node.x, clientY: node.y });
        node.x = point[0];
        node.y = point[1];
        let replaceIndex = this._nodes.findIndex(n => getDistance(n, node) <= this._options.radius),
            updateIndex = this._nodes.findIndex(n => n.id == node.id);
        if (replaceIndex === -1 && updateIndex === -1) { //添加
            this._nodes.push(node);
        } else if (updateIndex !== -1 && (replaceIndex === -1 || replaceIndex === updateIndex)) { //更新
            _lineMerge.call(this, {}, this._nodes[updateIndex], node);
            this._nodes[updateIndex] = node;
        } else { //替换
            //直接替换
            _lineMerge.call(this, this._nodes[replaceIndex], this._nodes[updateIndex] || {}, node);
            this._nodes[replaceIndex] = node;
            if (updateIndex !== -1) { //合并(删除)替换
                this._nodes.splice(updateIndex, 1);
            }
        }
        _nodes.call(this);
    },
    deleteNode(ns) {
        if (ns === '*') { //节点不在，线将何存？
            this._lines = [];
            this._nodes = [];
            _lines.call(this);
            _nodes.call(this);
            return;
        }
        if (!Array.isArray(ns)) {
            ns = typeof(ns) === 'object' ? [ns] : [];
        }
        let nodeChange = [],
            lineChange = false;
        ns.forEach(n => {
            let delIndex = this._nodes.findIndex(_n => n.id == _n.id);
            if (delIndex !== -1) {
                nodeChange.push(this._nodes.splice(delIndex, 1)[0]);
            }
        });
        if (nodeChange.length) { //将与删掉的节点相关的线删除
            let len = this._lines.length;
            while (len--) {
                let l = this._lines[len];
                for (let j = 0; j < nodeChange.length; j++) {
                    if (l.sid == nodeChange[j].id || l.tid == nodeChange[j].id) {
                        lineChange = true;
                        this._lines.splice(len, 1);
                        break;
                    }
                }
            }
        }
        if (lineChange) {
            _lines.call(this);
        }
        if (nodeChange.length) {
            _nodes.call(this);
        }
    },
    deleteLine(ls) {
        if (ls === '*') {
            this._lines = [];
            _lines.call(this);
            return;
        }
        if (!Array.isArray(ls)) {
            ls = typeof(ls) === 'object' ? [ls] : [];
        }
        let change = false;
        ls.forEach(l => {
            let delIndex = this._lines.findIndex(_l => l.sid == _l.sid && l.tid == _l.tid);
            if (delIndex !== -1) {
                change = true;
                this._lines.splice(delIndex, 1);
            }
        });
        if (change) {
            _lines.call(this);
        }
    },
    selectNode(ns, selected) {
        if (ns === '*') {
            return _selectNode.call(this, d3.selectAll('g.node-child').selectAll('image'), selected);
        }
        if (!Array.isArray(ns)) {
            ns = typeof(ns) === 'object' ? [ns] : [];
        }
        let nodes = ns.map(n => {
            return d3.select('image.node-' + n.id).node();
        });
        return _selectNode.call(this, d3.selectAll(nodes), selected);
    },
    selectLine(ls, selected) {
        if (ls === '*') {
            return _selectLine.call(this, d3.selectAll('g.line-child').selectAll('path'), selected);
        }
        if (!Array.isArray(ls)) {
            ls = typeof(ls) === 'object' ? [ls] : [];
        }
        let lines = ls.map(l => {
            return d3.select('path.line-' + l.sid + '-' + l.tid).node();
        });
        return _selectLine.call(this, d3.selectAll(lines), selected);
    },
    isSelected(data) {
        return !d3.select((data.type === 'node' ? 'image' : 'path') + '.selected.' + data.type + '-' + (data.type === 'node' ? data[data.type].id : (data[data.type].sid + '-' + data[data.type].tid))).empty();
    },
    getSelecteds() {
        let rtn = {
            nodes: [],
            lines: []
        }
        rtn.lines.idMap = {};
        d3.selectAll('path.selected').each(l => {
            rtn.lines.push(l);
            rtn.lines.idMap[l.sid] = rtn.lines.idMap[l.sid] || this._lines.idMap[l.sid];
            rtn.lines.idMap[l.tid] = rtn.lines.idMap[l.tid] || this._lines.idMap[l.tid];
        });
        d3.selectAll('image.selected').each(n => {
            rtn.nodes.push(n);
        });
        return rtn;
    }
});

export default ModelView;

import ModelView from 'lib/chart';
import * as data from '../data/data';

import './index.css';

var count = 4;
var areaDom = document.getElementsByClassName('graph-area')[0];
var dragImg = Array.prototype.slice.call(document.getElementsByClassName('dragImg'));
var chartDom = new ModelView({
    radius: 32,
    viewBox: [0, 0, 800, 450],
    nodes: data.nodes,
    lines: data.lines,
    canLink(s, t) {
        if (s && s.id == 66) {
            alert('此节点无法作为连线的起点');
            return false;
        }
        if (s.id == 33 && t && t.id == 66) {
            alert('无法连接到该节点');
            return false;
        }
        return true;
    },
    lineMenu: [{
        name: '选择',
        click: function(e, s, t, a) {
            chartDom.selectLine({ sid: s.id, tid: t.id, twa: a }, true);
        },
        test: function(s, t, a) {
            console.log(s.id,t.id);
            return !chartDom.isSelected({ type: 'line', line: { sid: s.id, tid: t.id, twa: a } });
        }
    }, {
        name: '取消',
        click: function(e, s, t, a) {
            console.log(this);
            chartDom.selectLine({ sid: s.id, tid: t.id, twa: a }, false);
        },
        test: function(s, t, a) {
            console.log(this);
            return chartDom.isSelected({ type: 'line', line: { sid: s.id, tid: t.id, twa: a } });
        }
    }, {
        name: '删除',
        click: function(e, s, t, a) {
            chartDom.deleteLine({ sid: s.id, tid: t.id, twa: a });
        }
    }],
    nodeMenu: [{
        name: '选择',
        click: function(e, n) {
            chartDom.selectNode(n, true);
        },
        test: function(n) {
            console.log(n.id);
            return !chartDom.isSelected({ type: 'node', node: n });
        }
    }, {
        name: '取消',
        click: function(e, n) {
            chartDom.selectNode(n, false);
        },
        test: function(n) {
            return chartDom.isSelected({ type: 'node', node: n });
        }
    }, {
        name: '删除',
        click: function(e, n) {
            chartDom.deleteNode(n);
        }
    }],
    nodeFastMenu: [{ name: 'a', click: function() {console.log(this);},test:function(n){console.log(n.id);console.log(this);} }, { name: 'b', click: function(k) { alert(k.text) } }, { name: 'c', click: function() {}, test: function(n) { return n.id != 11 } }, { name: 'd', click: function() {} }, { name: 'e', click: function() {} }, { name: 'f', click: function() {} }, { name: 'g', click: function() {} }],
    viewMenu: [{
        name: '添加节点',
        click: function(e) {
            chartDom.addNode({
                'id': count + '' + count,
                'shape': './images/model.png',
                'text': prompt('请输入节点名称', '数据' + count),
                'x': e.menuX,
                'y': e.menuY
            });
            count++;
        }
    }, {
        name: '右移',
        click: function(e) {
            chartDom.translate(30, 0);
        }
    }, {
        name: '左移',
        click: function(e) {
            chartDom.translate(-30, 0);
        }
    }, {
        name: '上移',
        click: function(e) {
            chartDom.translate(0, -30);
        }
    }, {
        name: '下移',
        click: function(e) {
            chartDom.translate(0, 30);
        }
    }, {
        name: '居中',
        click: function(e) {
            chartDom.translate('center');
        }
    }, {
        name: '初始位置',
        click: function(e) {
            chartDom.translate('init');
        }
    }, {
        name: '放大',
        click: function(e) {
            chartDom.scale(1.2);
        }
    }, {
        name: '缩小',
        click: function(e) {
            chartDom.scale(0.8);
        }
    }, {
        name: '初始大小',
        click: function(e) {
            chartDom.scale();
        }
    }, {
        name: '全屏查看',
        click: function(e) {
            areaDom.style.cssText = "width:auto;height:auto;left:0;top:0;bottom:0;right:0;margin:0;z-index:10000;position:absolute;";
            var bound = areaDom.getBoundingClientRect();
            chartDom.viewBox(bound.width, bound.height);
            chartDom.translate('center');
        },
        test: function() {
            console.log(arguments);
            return areaDom.style.position != 'absolute';
        }
    }, {
        name: '退出全屏',
        click: function(e) {
            areaDom.style.cssText = "width:800px;height:450px;margin:100px;position:static;";
            var bound = areaDom.getBoundingClientRect();
            chartDom.viewBox(bound.width, bound.height);
            chartDom.translate('center');
        },
        test: function() {
            return areaDom.style.position != 'static';
        }
    }, {
        name: '全部选择',
        click: function(e) {
            chartDom.selectNode('*', true);
            chartDom.selectLine('*', true);
        },
        test: function() {
            let data = chartDom.getSelecteds(),
                allData = chartDom.getData()
            return !(data.nodes.length === allData.nodes.length && data.lines.length === allData.lines.length);
        }
    }, {
        name: '取消选择',
        click: function(e) {
            chartDom.selectNode('*', false);
            chartDom.selectLine('*', false);
        },
        test: function() {
            let data = chartDom.getSelecteds();
            return !(data.nodes.length === 0 && data.lines.length === 0);
        }
    }, {
        name: '清空选择',
        click: function(e) {
            let data = chartDom.getSelecteds();
            chartDom.deleteNode(data.nodes);
            chartDom.deleteLine(data.lines);
        },
        test: function() {
            let data = chartDom.getSelecteds();
            return data.nodes.length !== 0 || data.lines.length !== 0;
        }
    }, {
        name: '清空所有',
        click: function(e) {
            chartDom.deleteNode('*');
        }
    }]
});
areaDom.appendChild(chartDom.getView());
dragImg.forEach(function(t,i) {
    t.onmousedown = function(e) {
        let startPos = { x: e.pageX, y: e.pageY };
        let startOffset = this.getBoundingClientRect();
        startOffset = { x: startOffset.x, y: startOffset.y };
        let imgHelper = document.createElement('a');
        imgHelper.innerHTML = this.innerHTML;
        imgHelper.style.position = 'absolute';
        imgHelper.style.display = 'inline-block';
        imgHelper.style.width = this.clientWidth + 'px';
        imgHelper.style.height = this.clientHeight + 'px';
        imgHelper.style.top = startOffset.y + 'px';
        imgHelper.style.left = startOffset.x + 'px';
        document.body.appendChild(imgHelper);
        document.onmousemove = function(ee) {
            imgHelper.style.top = startOffset.y + (ee.pageY - startPos.y) + 'px';
            imgHelper.style.left = startOffset.x + (ee.pageX - startPos.x) + 'px';
            ee.preventDefault();
        };
        document.onmouseup = function(ee) {
            document.onmousemove = null;
            document.onmouseup = null;
            let viewRect = areaDom.getBoundingClientRect();
            if (imgHelper.offsetLeft > viewRect.left &&
                (imgHelper.offsetLeft + imgHelper.clientWidth / 2) < viewRect.right &&
                imgHelper.offsetTop > viewRect.top &&
                (imgHelper.offsetTop + imgHelper.clientHeight / 2) < viewRect.bottom) {
                console.log('a:',ee.clientX)
                chartDom.addNode({
                    'id': i == 0 ? (count + '' + count) : '000000000000',
                    'shape': './images/model.png',
                    'text': '数据' + (i == 0 ? count : ''),
                    'x': ee.clientX,
                    'y': ee.clientY
                });
                if (i == 0) count++;
                imgHelper.parentNode.removeChild(imgHelper);
            } else {
                imgHelper.style.top = startOffset.y + 'px';
                imgHelper.style.left = startOffset.x + 'px';
                imgHelper.style.transition = 'top .3s, left .3s';
                setTimeout(function() {
                    imgHelper.remove();
                }, 300);
            }
            ee.preventDefault();
        };
        e.stopPropagation();
    }
});
console.dir(chartDom);
console.log(chartDom.getData());

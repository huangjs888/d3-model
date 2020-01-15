let nodes = [{
    'id': 11,
    'shape': './a.png',
    'text': '数据1',
    x:568,
    y:76
}, {
    'id': 22,
    'shape': './a.png',
    'text': '数据2',
    x:588,
    y:276
}, {
    'id': 33,
    'shape': './a.png',
    'text': '数据3',
    x:578,
    y:176
}, {
    'id': 44,
    'shape': './a.png',
    'text': '数据4',
    x:768,
    y:226
}];
let lines = [{
    'sid': nodes[0].id,
    'tid': nodes[1].id,
}, {
    'twa':true,
    'sid': nodes[1].id,
    'tid': nodes[2].id,
}, {
    'sid': nodes[1].id,
    'tid': nodes[3].id,
}];

export { nodes, lines };

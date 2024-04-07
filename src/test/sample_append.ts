import * as md2graph from '../md2graph';

const stylecls = [[""],[""]];
const newcls = ["",""];
const result = md2graph.appendStyleCls(stylecls, newcls);
console.log(result); // Outputs: [["", ""]]

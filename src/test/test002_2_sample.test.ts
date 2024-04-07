import * as fs from 'fs';
import * as path from 'path';
import * as graph2md from '../graph2md';


// Get the file path
const sample = fs.readFileSync(
    path.join(__dirname, './dat/out_sample.ts.md'),
    'utf8'
);

const sample2 = fs.readFileSync(
    path.join(__dirname, './dat/out_002_1_sample.md'),
    'utf8'
);

const tmp = JSON.parse(sample);
const link_f = tmp["link_feature"]
const node_f = tmp["node_feature"]
console.log(link_f)
const right = graph2md.main(link_f,node_f);

// // Write the result to the file
// fs.writeFileSync(path.join(__dirname, './dat/out_002_2_sample.ts.md'), right, 'utf8');

// const left = sample2;

// // assert.strictEqual(left, right);
// console.log(left===right)
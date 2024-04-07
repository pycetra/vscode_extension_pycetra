import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as md2graph from '../md2graph';


// Get the file path
const sample = fs.readFileSync(
    path.join(__dirname, './dat/in_sample.md'),
    'utf8'
);

const sample2 = fs.readFileSync(
    path.join(__dirname, './dat/out_sample.md'),
    'utf8'
);

const right = md2graph.main(sample);

// Write the result to the file
fs.writeFileSync(path.join(__dirname, './dat/out_sample.ts.md'), right, 'utf8');

const left = sample2;

assert.strictEqual(left, right);
console.log(left===right)
//assert.strictEqual(left, right);
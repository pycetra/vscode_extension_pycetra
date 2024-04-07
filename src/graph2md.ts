// import * as fs from 'fs';
interface DataFrameRow {
    md: string[];
    link_flag: number[];
    level: number[];
    id: number[];
    text: string[];
    sortkey: number[];
    region: string[];
    // Add other properties if needed
}
interface NodeFeature {
    id: number[];
    text: string[];
    level: number[];
    sortkey: number[];
    x: number[]; // Optional properties initialized to undefined
    y: number[];
    selecter: number[];
    region: string[];
    stylecls: string[][]; // 'O' in Python is likely a custom object or class
    position: number[][]; // Same as above, 'O' is a placeholder for a custom type
    link_flag: number[];
}
interface LinkFeature {
    id: number[];
    from: number[];
    to: number[];
    x_from: number[];
    y_from: number[];
    x_to: number[];
    y_to: number[];
    selecter: number[];
    region: string[];
    stylecls: string[][];
}


function initializeNodeFeatures(size: number): NodeFeature {
    return {
        id: new Array(size).fill(0),
        text: new Array(size).fill(""),
        level: new Array(size).fill(0),
        sortkey: new Array(size).fill(0),
        x: new Array(size).fill(0.0),
        y: new Array(size).fill(0.0),
        selecter: new Array(size).fill(0),
        region: new Array(size).fill(""),
        stylecls: Array.from({ length: size }, () => [""]),
        position: Array.from({ length: size }, () => [0]),
        link_flag: new Array(size).fill(0),
    };
}
function initializeLinkFeatures(size: number): LinkFeature {
    return {
        id: new Array(size).fill(0),
        from: new Array(size).fill(0),
        to: new Array(size).fill(0),
        x_from: new Array(size).fill(0.0),
        y_from: new Array(size).fill(0.0),
        x_to: new Array(size).fill(0.0),
        y_to: new Array(size).fill(0.0),
        selecter: new Array(size).fill(0),
        region: new Array(size).fill(""),
        stylecls: Array.from({ length: size }, () => [""]),
    };
}



export function main(link_f:LinkFeature, node_f:NodeFeature ): String {
    const link_f_2 = link_f.stylecls.filter(styleClasses => !styleClasses.includes("markdownpath"));
    console.log(link_f_2)
    return 'a'
}
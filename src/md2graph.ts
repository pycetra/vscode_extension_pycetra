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




function text2dataframe(text: string, config = { sep: "\n", tab: "  " }): DataFrameRow {
    const lines = text.split(config["sep"]);
    return {
        md: lines,
        link_flag: [],
        level: [],
        id: [],
        text: [],
        sortkey: [],
        region: [],
    };
}

function getStyleClsMarkdownpath(text: string[]): string[] {
    return text.map(text => text.match(/@/g)?.length === 2 ? "markdownpath" : "");
}

export function appendStyleCls(stylecls: string[][], newcls: string[]): string[][] {
    return stylecls.map((cls, index) => [...cls, newcls[index]]);
}

function getIdDict(symbols: string[], ids: number[]): { [key: string]: number } {
    const symbolIdDict: { [key: string]: number } = {};
    symbols.forEach((symbol, index) => {
        if (symbol !== "") {
            symbolIdDict[symbol] = ids[index];
        }
    });
    return symbolIdDict;
}

interface FromTo {
    from: number;
    to: number;
    stylecls: string[];
}

function getFromTo(node_f: NodeFeature, symbol2id_dict: { [key: string]: number }): FromTo[] {
    const node_max: { [level: number]: number } = {};
    const fromto_list: FromTo[] = [];

    node_f.text.forEach((text, index) => {
        const link_flag = node_f.link_flag[index];
        const level = node_f.level[index];
        const id = node_f.id[index];

        if (link_flag === 0) {
            node_max[level] = id;
        } else {
            const nodes = text.split("->").map(node => node.replace(/@/g, "").trim());
            if (nodes.length === 2) {
                const [parent_node, child_node] = nodes;
                if (symbol2id_dict[parent_node] !== undefined && symbol2id_dict[child_node] !== undefined) {
                    fromto_list.push({
                        from: symbol2id_dict[parent_node],
                        to: symbol2id_dict[child_node],
                        stylecls: ["markdownpath"]
                    });
                }
            }
        }

        if (level > 0) {
            const parent_node = node_max[level - 1];
            if (parent_node !== undefined) {
                fromto_list.push({
                    from: parent_node,
                    to: id,
                    stylecls: [""]
                });
            }
        } else if (level < 0) {
            throw new Error(`Invalid level: ${level}`);
        }
    });

    return fromto_list;
}

export function main(text: string, config = { sep: "\n", tab: "  " }): any {
    if (text.trim() === "") {
        return [];
    }

    let df = text2dataframe(text, config);
    df.md = df.md.filter(line => line !== '');
    df.link_flag = df.md.map(line => (line.match(/@/g) || []).length === 2 ? 1 : 0);
    df.level = df.md.map(line => {
        // "-"の前にあるタブの数をカウント
        const prefix = line.split('-')[0];
        const tabCount = prefix.length > 0 ? prefix.split(config.tab).length - 1 : 0;
        return tabCount;
    });

    df.id = Array.from({ length: df.md.length }, (_, index) => 1001 + index);
    df.text = df.md.map(line => {
        const splitLine = line.split("- ");
        return splitLine[splitLine.length - 1];
    });

    df.text = df.text.map(text => text.startsWith("#") ? text.replace(/ /g, "") : text);

    const node_sortkey: { [key: number]: number } = {};
    df.sortkey = df.level.map(level => {
        if (node_sortkey[level] === undefined) {
            node_sortkey[level] = 0;
        }
        const sortKey = node_sortkey[level];
        node_sortkey[level] += 1;
        return sortKey;
    });

    df.region = df.text.map(text => {
        if (text.startsWith("#") && !text.startsWith("##")) {
            return formattedRegion(text);
        } else {
            return "";
        }
    });
    const node_f_md = df;
    const size = df.md.length;
    const node_f = initializeNodeFeatures(size);
    node_f.id = node_f_md.id;
    node_f.text = node_f_md.text
    node_f.level = node_f_md.level
    node_f.sortkey = node_f_md.sortkey
    node_f.region = node_f_md.region


    const stdsymbol: string[] = node_f.text.map(text => {
        const atCount = (text.match(/@/g) || []).length;
        return atCount === 1 ? text.split("@")[1] : "";
    });
    let newStyleCls = getStyleClsMarkdownpath(node_f.text);

    node_f.stylecls = appendStyleCls(node_f.stylecls, newStyleCls);
    const { link_flag, ...node_f_rest } = node_f;


    const symbol2idDict = getIdDict(stdsymbol, node_f.id);


    const fromto_list = getFromTo(node_f, symbol2idDict);
    const size_ = fromto_list.length;
    const link_f = initializeLinkFeatures(size_);
    link_f.from = fromto_list.map(item => item.from);
    link_f.to = fromto_list.map(item => item.to);
    link_f.stylecls = fromto_list.map(item => item.stylecls);
    link_f.id = Array.from({ length: size_ }, (_, i) => i + 2000);

    return JSON.stringify({node_feature:node_f_rest,
        link_feature:link_f})
}

function formattedRegion(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, '');
}


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

interface LinkFeature_tmp {
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
    level: number[];
    root_category: number[];
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
    const filteredLinkIndices = link_f.stylecls
        .map((styleClasses, index) => styleClasses.includes("markdownpath") ? -1 : index)
        .filter(index => index !== -1);

    const filteredLinks: LinkFeature_tmp = {
        id: [],
        from: [],
        to: [],
        x_from: [],
        y_from: [],
        x_to: [],
        y_to: [],
        selecter: [],
        region: [],
        stylecls: [],
        level:[],
        root_category:[],
    };

    filteredLinkIndices.forEach(index => {
        filteredLinks.id.push(link_f.id[index]);
        filteredLinks.from.push(link_f.from[index]);
        filteredLinks.to.push(link_f.to[index]);
        filteredLinks.x_from.push(link_f.x_from[index]);
        filteredLinks.y_from.push(link_f.y_from[index]);
        filteredLinks.x_to.push(link_f.x_to[index]);
        filteredLinks.y_to.push(link_f.y_to[index]);
        filteredLinks.selecter.push(link_f.selecter[index]);
        filteredLinks.region.push(link_f.region[index]);
        filteredLinks.stylecls.push(link_f.stylecls[index]);
        filteredLinks.level.push(0);
        filteredLinks.root_category.push(0);
    });
    const link_f_3 = addLevel(filteredLinks,node_f );

    const root_category = getRootCategory(link_f_3, node_f);
    link_f_3.from.forEach((fromId, index) => {
        const rootCategory = root_category[fromId];
        link_f_3.root_category[index] = rootCategory;
    });
    const link_f_4 = { ...link_f_3 };
    
    // ////////////////////////////////////////////
    // 実装場所
    const markdown_box = fusionLinkAndNode(link_f_4, node_f)
    // ////////////////////////////////////////////

    console.log("一部削除")
    console.log(link_f_4)
    console.log("一部削除")
    return 'a'
}


function fusionLinkAndNode(link_f:LinkFeature_tmp, node_f:NodeFeature)

function getRootCategory(link_f: LinkFeature_tmp, node_f: NodeFeature): { [key: number]: number } {
    const root_category: { [key: number]: number } = {};
    node_f.id.forEach((id, index) => {
        if (node_f.level[index] === 0) {
            root_category[id] = id;
        }
    });

    const maxLevel = Math.max(...link_f.level)+1;
    for (let lv = 0; lv <= maxLevel; lv++) {
        link_f.from.forEach((from, index) => {
            if (link_f.level[index] === lv && root_category[from] !== undefined) {
                root_category[link_f.to[index]] = root_category[from];
            }
        });
    }

    return root_category;
}

function addLevel(link_f: LinkFeature_tmp, node_f: NodeFeature): LinkFeature_tmp {
    const link_f_r2:LinkFeature_tmp = {
        id: [],
        from: [],
        to: [],
        x_from: [],
        y_from: [],
        x_to: [],
        y_to: [],
        selecter: [],
        region: [],
        stylecls: [],
        level:[],
        root_category:[],
    };

    link_f.from.forEach((fromId, index) => {
        const nodeIdIndex = node_f.id.indexOf(fromId);
        if (nodeIdIndex !== -1) {
            link_f_r2.id.push(link_f.id[index]);
            link_f_r2.from.push(link_f.from[index]);
            link_f_r2.to.push(link_f.to[index]);
            link_f_r2.x_from.push(link_f.x_from[index]);
            link_f_r2.y_from.push(link_f.y_from[index]);
            link_f_r2.x_to.push(link_f.x_to[index]);
            link_f_r2.y_to.push(link_f.y_to[index]);
            link_f_r2.selecter.push(link_f.selecter[index]);
            link_f_r2.region.push(link_f.region[index]);
            link_f_r2.stylecls.push(link_f.stylecls[index]);
            link_f_r2.level.push(node_f.level[nodeIdIndex]);
        }
    });

    return link_f_r2;
}
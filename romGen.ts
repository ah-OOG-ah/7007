import { CVNode, InputNode } from "./CVC";

const romHex = `
00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f
10 11 12 13 14 15 16 17 18 19 1a 1b 1c 1d 1e 1f
20 21 22 23 24 25 26 27 28 29 2a 2b 2c 2d 2e 2f
30 31 32 33 34 35 36 37 38 39 3a 3b 3c 3d 3e 3f`.trim().replaceAll("\n", " ").split(" ");

// The ROM prints out one byte per two hex digits
console.log(romHex);
console.log("ROM size: " + (romHex.length));

const templateNode = new CVNode(80, 0, 1, 8, "");

function makeInput(id: number, value: number) {
    // Max length is the number of digits in the bytes
    // If we have less than 0xff bytes, this is floor(log16(count)) + 1
    const maxLen = Math.floor(Math.log2(romHex.length) / Math.log2(16)) + 1;
    const label = (id % 16 === 0) ?
        "0x" + id.toString(16).padStart(maxLen, "0")
        : ""
    return new InputNode(id, value, label);
}

let output = {
    layout: {
        width: 100,
        height: 900,
        title_x: 50,
        title_y: 13,
        titleEnabled: true
    },
    verilogMetadata: {
        isVerilogCircuit: false,
        isMainCircuit: false,
        code: "",
        subCircuitScopeIds: []
    },
    allNodes: new Array<CVNode>(romHex.length),
    id: 4896214989, // Seems constant???
    name: "Main",
    Input: new Array<InputNode>(romHex.length),
    restrictedCircuitElementsUsed: [],
    nodes: [],
    scopes: [],
    logixClipBoardData: true
};

let id = 0;
for (let byte of romHex) {
    output.allNodes[id] = templateNode;
    output.Input[id] = makeInput(id, parseInt(byte, 16));
    ++id;
}

console.log(JSON.stringify(output));

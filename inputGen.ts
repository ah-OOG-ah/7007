import { CVNode, InputNode } from "./CVC";

const inputCount = 256;

function makeInput(id: number, value: number) {
    // Max length is the number of digits in the bytes
    // If we have less than 0xff bytes, this is floor(log16(count)) + 1
    const maxLen = Math.floor(Math.log2(inputCount) / Math.log2(16)) + 1;
    const label = "0x" + id.toString(16).padStart(maxLen, "0");
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
    allNodes: new Array<CVNode>(inputCount * 2),
    id: 7779518701, // Seems constant???
    name: "12-32 Select",
    Input: new Array<InputNode>(inputCount),
    restrictedCircuitElementsUsed: [],
    nodes: [],
    scopes: [],
    logixClipBoardData: true
};

for (let id = 0; id < inputCount; ++id) {
    const nodeId = id + inputCount;
    output.allNodes[id] = new CVNode(0, 0, 1, 32, "", [nodeId]);
    output.allNodes[nodeId] = new CVNode(0, 0, 2, 32, "", [id]);

    output.Input[id] = makeInput(id, parseInt(id, 16));
    ++id;
}

console.log(JSON.stringify(output));

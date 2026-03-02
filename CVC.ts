// 20-digit random value, alphabet A-Za-z0-9, in that order
const idChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
function makeId() {
    let id = "";
    for (let i = 0; i < 20; ++i) {
        id += idChars.charAt(Math.floor(Math.random() * idChars.length));
    }
    return id;
}

export class CVNode {
    x!: number;
    y!: number
    type!: number
    bitWidth!: number
    label!: string
    connections;

    constructor(x: number, y: number, type: number, bitWidth: number, label: string, connections: number[] = []) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.bitWidth = bitWidth;
        this.label = label;
        this.connections = connections;
    }
}

export class InputNode {
    x = 0
    y!: number
    objectType = "Input"
    label!: string
    direction = "RIGHT"
    labelDirection = "LEFT"
    propagationDelay = 0
    customData

    constructor(id: number, value: number, label: string) {
        this.y = id * 20;
        this.label = label;
        this.customData = {
            nodes: { output1: id },
            values: { state: value },
            constructorParamaters: [ "RIGHT", 8, { x: 0, y: id * 20, id: makeId() } ]
        };
    }
}
// Given a hard-coded assembly program, converts it to bits.

import {write} from "node:fs";
import write1k from "./write1k";

const REGISTERS = [ "A", "B", "C", "D", "E", "H", "L", "M" ];

const asm = `
MOV A, 1H
MOV B, 1H
HLT
`.trim();

console.log("Assembly:")
console.log(asm);

const asmArr = asm.split("\n");

// While the output can be and likely is longer than this, there are at least this many output bytes
let output = new Array<number>(asmArr.length)

let i = 1;
let idx = 0;

for (const line of asmArr) {
    const params = line.split(" ")

    switch (params[0]) {
        case "HLT": idx = decodeHLT(output, idx); break
        case "MOV": idx = decodeMOV(output, idx, params); break
        default: {
            console.log("Invalid opcode detected at line %i: %s", i, line)
            process.exit(1)
        }
    }

    ++i;
}

// HLT
function decodeHLT(output: number[], idx: number): number {
    output[idx] = 0
    return idx + 1
}

// MOV R1, R2    --- ex: MOV A, B
// MOV R, M      --- ex: MOV A, M
// MOV R, number --- ex: MOV A, 42H
// MOV M, R      --- ex: MOV M, A
// MOV M, number --- ex: MOV M, 42H
function decodeMOV(output: number[], idx: number, params: string[]) {
    const r1 = REGISTERS.indexOf(params[1][0]);
    if (r1 < 0) {
        throw new Error("Invalid parameter for MOV! Opcode: " + params)
    }

    const r2 = REGISTERS.indexOf(params[2][0]);
    if (r2 < 0) {
        // Loading some int -> R
        output[idx++] = 0b0000_0110 | (r1 << 3)
        output[idx++] = parseInt(params[2].slice(0, -1), 16)
        return idx
    }

    // Loading R2 -> R1, M is register 0x7
    output[idx++] = 0b1100_0000 | (r1 << 3) | r2
    return idx
}

let writer = write1k(output)
console.log(output.map((v) => {
    return "0x" + v.toString(16).padStart(2, "0")
}))

await writer

// Given a hard-coded assembly program, converts it to bits.
import write1k from "./write1k";
import * as fs from "node:fs";

const REGISTERS = [ "B", "C", "D", "E", "H", "L", "M", "A" ];

const asmFile = process.argv.length >= 3 ? process.argv[2] : "asm.txt"
const asmArr = fs.readFileSync(asmFile).toString().trim().split("\n");

// While the output can be and likely is longer than this, there are at least this many output bytes
let output = new Array<number>(asmArr.length)

let i = 1;
let idx = 0;

console.log("Assembly:")
// the 7007 requires programs to start with a NOP
idx = decodeNOP(output, idx)
for (const line of asmArr) {
    if (line.trim() === "") continue
    if (line[0] === "#") continue

    const params = line.split(" ")
    const prevI = idx

    switch (params[0]) {
        case "ADD": idx = decodeADD(output, idx, params); break
        case "AND": idx = decodeAND(output, idx, params); break
        case "HLT": idx = decodeHLT(output, idx); break
        case "MOV": idx = decodeMOV(output, idx, params); break
        case "NOP": idx = decodeNOP(output, idx); break
        case "NOT": idx = decodeNOT(output, idx); break
        case "OR":  idx = decodeOR(output, idx, params); break
        case "SHR": idx = decodeSHR(output, idx); break
        case "SHL": idx = decodeSHL(output, idx); break
        default: {
            console.log("Invalid opcode detected at line %i: %s", i, line)
            process.exit(1)
        }
    }

    const logLine = "0x" + prevI.toString(15+1).padStart(2, "0") + ": "
        + line.padEnd(10, " ") + ":"
        + output.slice(prevI, idx).map(value => " 0x" + value.toString(15+1).padStart(2, "0")).join("")
    console.log(logLine)
    ++i;
}
// Add a HLT at the end
idx = decodeHLT(output, idx)

/*    BEGIN DECODE OPS     */

function decodeInt(string: string): number {
    return parseInt(string.slice(0, -1), 16)
}

// ADD r      --- ex: ADD B
// ADD M      --- ex: ADD M
// ADD number --- ex: ADD 42H
function decodeADD(output: number[], idx: number, params: string[]) {
    const r1 = REGISTERS.indexOf(params[1][0]);
    if (r1 < 0) {
        // Add immediate
        output[idx++] = 0b00000100
        output[idx++] = decodeInt(params[1])
        return idx
    }

    // Add R to the accumulator
    output[idx++] = 0b10000000 | r1
    return idx
}

// AND r --- ex: AND B
function decodeAND(output: number[], idx: number, params: string[]) {
    const r1 = REGISTERS.indexOf(params[1][0]);
    if (r1 < 0) throw new Error("Invalid register " + params[1] + " specified for AND!")

    // AND R with the accumulator
    output[idx++] = 0b10100_000 | r1
    return idx
}

// HLT
function decodeHLT(output: number[], idx: number): number {
    output[idx] = 0b01110110
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
        output[idx++] = decodeInt(params[2])
        return idx
    }

    // Loading R2 -> R1, M is register 0x7
    output[idx++] = 0b01_000_000 | (r1 << 3) | r2
    return idx
}

// NOP
function decodeNOP(output: number[], idx: number): number {
    output[idx] = 0
    return idx + 1
}

// NOT --- always targets A
function decodeNOT(output: number[], idx: number) {
    output[idx] = 0b0010_1111
    return idx + 1
}

// OR r --- ex: OR B
function decodeOR(output: number[], idx: number, params: string[]) {
    const r1 = REGISTERS.indexOf(params[1][0]);
    if (r1 < 0) throw new Error("Invalid register " + params[1] + " specified for OR!")

    // OR R with the accumulator
    output[idx++] = 0b10110_000 | r1
    return idx
}

function decodeSHR(output: number[], idx: number): number {
    output[idx] = 0b0000_1111
    return idx + 1
}

function decodeSHL(output: number[], idx: number): number {
    output[idx] = 0b0000_0111
    return idx + 1
}

let writer = write1k(output)
console.log(output.map((v) => {
    return "0x" + v.toString(16).padStart(2, "0")
}))

await writer

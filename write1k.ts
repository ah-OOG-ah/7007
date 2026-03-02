/**
 * Unlike the romGen script, this one modifies an existing ROM chip.
 */

import { CVNode, InputNode } from "./CVC";

const romHex = `
00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f
10 11 12 13 14 15 16 17 18 19 1a 1b 1c 1d 1e 1f
20 21 22 23 24 25 26 27 28 29 2a 2b 2c 2d 2e 2f
30 31 32 33 34 35 36 37 38 39 3a 3b 3c 3d 3e 3f`.trim().replaceAll("\n", " ").split(" ");

// The ROM prints out one byte per two hex digits
console.log(romHex);
console.log("ROM size: " + (romHex.length));

const maxSize = 1024;
if (romHex.length > maxSize) {
    console.log("ROM too large for 1k chip! Please shrink it.");
    process.exit(1);
}

// Load the object
import romJson from "./dumps/1krom.json";
romJson.ConstantVal;

let id = 0;
for (let byte of romHex) {
    output.allNodes[id] = templateNode;
    output.Input[id] = makeInput(id, parseInt(byte, 16));
    ++id;
}

console.log(JSON.stringify(output));

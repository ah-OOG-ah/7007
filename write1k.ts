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
console.error(romHex);
console.error("ROM size: " + (romHex.length));

const maxSize = 1024;
if (romHex.length > maxSize) {
    console.log("ROM too large for 1k chip! Please shrink it.");
    process.exit(1);
}

// Load the object
import romJson from "./dumps/1krom.json";

// Load constant vals into a new array and sort them
const oldConstants = romJson.ConstantVal;
let newConstants = [...oldConstants];
newConstants.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (b.x < a.x) return 1;

    if (a.y < b.y) return -1;
    else if (b.y < a.y) return 1;

    return 0;
});

// Max length is the number of digits in the bytes
// If we have less than 0xff bytes, this is floor(log16(count)) + 1
const maxLen = Math.floor(Math.log2(newConstants.length) / Math.log2(16)) + 1;


for (let i = 0; i < newConstants.length; ++i) {
    let conStr = "";

    for (let ii = 0; ii < 4; ++ii) {
        let byteIdx = i * 4 + ii;
        let byte = byteIdx < romHex.length ? romHex[byteIdx] : "0";
        let byteStr = parseInt(byte, 16).toString(2).padStart(8, "0");

        conStr = byteStr + conStr;
    }

    newConstants[i].customData.constructorParamaters[2] = conStr;
    newConstants[i].label = (i % 4 === 0) ? "0x" + (i*4).toString(16).padStart(maxLen, "0") : "";
}

console.log(JSON.stringify(romJson));

/**
 * Unlike the romGen script, this one modifies an existing ROM chip.
 */
import * as fs from "node:fs";

const romHex = `
01`.trim().replaceAll("\n", " ").split(" ");

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

fs.writeFileSync("./build/rom.json", JSON.stringify(romJson));

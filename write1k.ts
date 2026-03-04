/**
 * Unlike the romGen script, this one modifies an existing ROM chip.
 */
import * as fs from "node:fs";

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
const MAX_ADDR_LEN = Math.floor(Math.log2(newConstants.length) / Math.log2(16)) + 1;
const MAX_ROM_SIZE = 1024;

export default async function write1k(romHex: number[]) {
    if (romHex.length > MAX_ROM_SIZE) {
        console.log("ROM too large for 1k chip! Please shrink it.");
        process.exit(1);
    }

    for (let i = 0; i < newConstants.length; ++i) {
        let conStr = "";

        for (let ii = 0; ii < 4; ++ii) {
            let byteIdx = i * 4 + ii;
            let byte = byteIdx < romHex.length ? romHex[byteIdx] : "0";
            let byteStr = byte.toString(2).padStart(8, "0");

            conStr = byteStr + conStr;
        }

        newConstants[i].customData.constructorParamaters[2] = conStr;
        newConstants[i].label = (i % 4 === 0) ? "0x" + (i*4).toString(16).padStart(MAX_ADDR_LEN, "0") : "";
    }

    fs.writeFileSync("./build/rom.json", JSON.stringify(romJson));
}
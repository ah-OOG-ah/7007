# 7007 Microprocessor Project
mul.txt describes multiplication by 4, add.txt adds two numbers, and div.txt divides by four.

Sources used:
https://datasheets.chipdb.org/upload/wepwawet/8008_(1978)%20Datasheet.pdf (Intel 8008 Datasheet)
https://datasheets.chipdb.org/Intel/MCS-80/intel-8080.pdf (8080 datasheet)
https://en.wikipedia.org/wiki/Intel_8080 (Wikipedia on the 8080)
https://stackoverflow.com/questions/10932578/how-are-shifts-implemented-on-the-hardware-level (Barrel shifter on SO)

I spent about an hour on the shifter, another 15min on debugging, and then another 30min writing and testing assembly.

# Usage
This isn't useful without the CPU core itself, so first you'll want to import that into CircuitVerse. The file is 
[dumps/7007_final.cv](dumps/7007_final.cv). It *should* work, but if it doesn't it might still be up at 
https://circuitverse.org/users/333837/projects/7007 - make a copy of that and jump in!

Next, you'll want to assemble your program. The instruction set is currently... a thing, that exists. It's not noted
down in one place, you'll have to check the header comments on the `decodeXXX` functions in 
[assembler.ts](assembler.ts). Once you have an ASM file (plaintext, one instruction per line), you can assemble it with
`bun rom myfile`, or whatever node runtime you use - `npm rom myfile` should also work, etc. That will write the ROM as
[build/rom.json](build/rom.json).

To get the ROM in the 7007, go to the `1k ROM` tab in the CircuitVerse project, select all, and delete it. Then, copy
the contents of the ROM file you built earlier, and paste it into the window. Apparently, when you copy and paste in
CircuitVerse, it handles everything as JSON - and it doesn't care *where* the JSON came from. Next, edit the layout of
the part, move the `D` output to be level with the `A0-9` input, and shrink the part vertically as much as you can.
Finally, go back to the `Main` tab, delete the lower two ROM chips from the instruction fetch section, and copy the top
one twice to replace them, reconnecting them as needed.

FINALLY FINALLY, now that your ROM is loaded, you can run the chip. Hit the `RST Once` button a few times, until the
registers and instruction pointer are clear. If they refuse to clear or the first three instruction bytes are incorrect,
try hitting `Clock Semi-pulse` once or twice, then resetting again. Now that the chip is in the initial state, you can 
hit `Clock Semi-pulse` to advance it by a third of a clock cycle, and watch it go!
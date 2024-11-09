import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function calcAvgFileSizeReduction() {
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDir = path.dirname(currentModulePath);
    const filePath = path.resolve(currentModuleDir, '..', 'fileCompressionAnalysis.txt');

    const fileStream = fs.createReadStream(filePath);
    let totalReduction = 0, lineCount = 0;

    const rl = readline.createInterface({
        input: fileStream,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        const [oldSizeStr, newSizeStr] = line.split(',');
        const oldSize = parseInt(oldSizeStr);
        const newSize = parseInt(newSizeStr);

        if (!isNaN(oldSize) && !isNaN(newSize)) {
            totalReduction += (oldSize - newSize) / oldSize;
            lineCount++;
        }
    });

    rl.on('close', () => {
        const avgReduction = totalReduction / lineCount;
        console.log(`Average Reduction Percentage: ${(avgReduction * 100).toFixed(2)}%`);
    });
}

calcAvgFileSizeReduction();
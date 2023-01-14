import {exec} from 'child_process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {writeFile} from 'fs/promises';
import path from 'path';

const frequencySeconds = 1;
const outPath = path.join('out','mem-usage.json');

function start() {
    let out = [];
    const child  = exec(`free --mega -s ${frequencySeconds}`);

    child.stdout.on('data', (data) => {
        const memDataLine = data.split('\n')[out.length === 0? 1:2];
        const [,total, used,free] = memDataLine.split(/[\s]+/);
        out.push({total, used, free, timestamp: Date.now()});
    });

    getQuitSignal().then(() => {
        writeFile(outPath, JSON.stringify(out),{encoding: 'utf-8'}).then(() => {
            child.kill('SIGINT');
            console.log('Memory usage has been recorded to ' + outPath);
            process.exit(0);
        });
    });
}

async function getQuitSignal() {
    let answer = '';
    const rl = readline.createInterface({ input, output });

    while(answer.toLowerCase().trim() !== 'q') {
        answer = await rl.question('Enter q to stop recording: ');
    }

    rl.close();
    return;
}

start();
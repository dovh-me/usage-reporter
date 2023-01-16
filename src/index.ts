import {exec} from 'child_process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {writeFile} from 'fs/promises';
import {join} from 'path';

// import the config
import config from '../config';

type outType = {
    hostname: string,
    startTimestamp: number,
    endTimestamp: number,
    dataset: {total:number, used: number, free: number, timestamp: number}[]
}

const frequencySeconds = config.frequencySeconds || 1;
const outPath = config.outPath || join('.','public','mem-usage.json');
//TODO: add support for different units

async function start() {
    let out:outType = {
        hostname: '',
        startTimestamp: Date.now(),
        endTimestamp: Date.now(),
        dataset: []
    };
    const child  = exec(`free --mega -s ${frequencySeconds}`);

    child.stdout.on('data', (data) => {
        const memDataLine = data.split('\n')[out.dataset.length === 0? 1:2];
        const [,total, used,free] = memDataLine.split(/[\s]+/);
        out.dataset.push({total, used, free, timestamp: Date.now()});
    });

    getHostName(out);

    getQuitSignal().then(() => {
        // set the end timestamp
        out.endTimestamp = Date.now();

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

function getHostName(obj: outType) {
    const child  = exec(`hostname -I`);
    
    child.stdout.on('data', (data) => {
        child.kill('SIGINT');
        obj.hostname = data.trim();
    });
}

await start();
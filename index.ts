import dotenv from 'dotenv';
dotenv.config();
import { spawn } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFile } from 'fs';
import { downloadInputForYearAndDay, getPuzzleDescription } from './utils/aoc-actions';

const action = process.argv[2];
const year = process.argv[3];
const day = process.argv[4];

const createFromTemplate = async () => {
    const path = `./challenges/${year}/${day}`;
    if (!existsSync(path)) {
        console.log(`Creating challenge to ${path} from template...`);
        mkdirSync(`challenges/${year}/${day}`, { recursive: true });

        await readFile('template/index.ts', 'utf-8', function(error, data: string) {
            if (error) throw error;

            const newValue = data.replace(/\$year/gim, year).replace(/\$day/gim, day);

            writeFileSync(`${path}/index.ts`, newValue, 'utf-8');
        });
    }

    if (!existsSync(`${path}/input.txt`)) {
        console.log(`Downloading input...`);
        const input = await downloadInputForYearAndDay(day, year);
        writeFileSync(`${path}/input.txt`, input);
    }
    const readme = await getPuzzleDescription(year, day);
    writeFileSync(`${path}/README.md`, readme);
};

if (action === 'create') {
    createFromTemplate();
}

if (action === 'run') {
    const path = `challenges/${year}/${day}/index.ts`;
    if (existsSync(path)) {
        spawn('nodemon', ['-x', 'ts-node', `challenges/${year}/${day}/index.ts ${year} ${day}`], {
            stdio: 'inherit',
            shell: true,
        });
    }
}

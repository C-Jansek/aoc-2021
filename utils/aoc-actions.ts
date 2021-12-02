import dotenv from 'dotenv';
dotenv.config(); // Get SESSION_COOKIE from .env
import https from 'https';
import cheerio from 'cheerio';

/**
 * Download input for challenge from adventofcode.com using session cookie.
 * @param {string} day
 * @param {string} year
 * @return {Promise<string>}
 */
export const downloadInputForYearAndDay = (day: string, year: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'adventofcode.com',
            path: `/${year}/day/${day}/input`,
            method: 'GET',
            port: '443',
            headers: {
                Cookie: `session=${process.env.SESSION_COOKIE}`,
            },
        };
        let data = '';
        https.get(options, (response: any) => {
            response.on('data', (dataChunk: string) => {
                data += dataChunk;
            });
            response.on('error', (error: Error) => {
                reject(error);
            });
            response.on('close', () => resolve(data));
        });
    });
};

/**
 * Get challenge description from adventofcode.com using session cookie.
 * @param {string} year
 * @param {string} day
 * @return {Promise<string>}
 */
export const getPuzzleDescription = (year: string, day: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'adventofcode.com',
            path: `/${year}/day/${day}`,
            method: 'GET',
            port: '443',
            headers: {
                Cookie: `session=${process.env.SESSION_COOKIE}`,
            },
        };
        let data = '';
        https.get(options, (response: any) => {
            response.on('data', (dataChunk: any) => {
                data += dataChunk;
            });
            response.on('error', (error: Error) => {
                reject(error);
            });
            response.on('close', (done: any) => {
                // Regex to filter out <main> for us
                resolve(getReadmePage(data));
            });
        });
    });
};

export const getReadmePage = (page: any) => {
    const $ = cheerio.load(page);
    const nodes = $('.day-desc')
        .children()
        .toArray();
    return nodes.map((n) => cheerio.html(n)).join('');
};

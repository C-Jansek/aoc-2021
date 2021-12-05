import getInput from '../../../utils/getInput';

import { Vector2, Vector3, Vector4 } from 'three';
import _ from 'lodash';

const part1 = () => {
    // const input = getInput('2021', '5')
    //     .split('\n')
    //     .slice(0, -1);
    // const lines: Vector4[] = [];
    // for (const line of input) {
    //     const [p1, p2] = line.split(' -> ');
    //     const [x1, y1] = p1.split(',').map((number) => Number(number));
    //     const [x2, y2] = p2.split(',').map((number) => Number(number));
    //     lines.push(
    //         new Vector4(Math.min(x1, x2), Math.min(y1, y2), Math.max(x2, x1), Math.max(y2, y1)),
    //     );
    // }
    // const hits: { pos: Vector2; hits: number }[] = [];
    // for (const line of lines) {
    //     //    Vertical line
    //     if (line.x === line.z) {
    //         for (let y = line.y; y <= line.w; y++) {
    //             const thisHit = hits.find((hit) => hit.pos.x === line.x && hit.pos.y === y);
    //             if (thisHit) thisHit.hits++;
    //             else hits.push({ pos: new Vector2(line.x, y), hits: 1 });
    //         }
    //     } else if (line.y === line.w) {
    //         for (let x = line.x; x <= line.z; x++) {
    //             const thisHit = hits.find((hit) => hit.pos.x === x && hit.pos.y === line.y);
    //             if (thisHit) thisHit.hits++;
    //             else hits.push({ pos: new Vector2(x, line.y), hits: 1 });
    //         }
    //     }
    // }
    // console.log(hits);
    // return hits.filter((hit) => hit.hits > 1).length;
};

const part2 = () => {
    const input = getInput('2021', '5')
        .split('\n')
        .slice(0, -1);

    const lines: Vector4[] = [];

    for (const line of input) {
        const [p1, p2] = line.split(' -> ');
        const [x1, y1] = p1.split(',').map((number) => Number(number));
        const [x2, y2] = p2.split(',').map((number) => Number(number));
        if (x1 === x2 || y1 == y2) {
            lines.push(
                new Vector4(Math.min(x1, x2), Math.min(y1, y2), Math.max(x2, x1), Math.max(y2, y1)),
            );
        } else {
            lines.push(new Vector4(x1, y1, x2, y2));
        }
    }

    let hits: { pos: Vector2; hits: number }[] = [];

    for (const line of lines) {
        //    Vertical line
        if (line.x === line.z) {
            for (let y = line.y; y <= line.w; y++) {
                const thisHit = hits.find((hit) => hit.pos.x === line.x && hit.pos.y === y);
                if (thisHit) thisHit.hits++;
                else hits.push({ pos: new Vector2(line.x, y), hits: 1 });
            }
        }
        // Horizontal
        else if (line.y === line.w) {
            for (let x = line.x; x <= line.z; x++) {
                const thisHit = hits.find((hit) => hit.pos.x === x && hit.pos.y === line.y);
                if (thisHit) thisHit.hits++;
                else hits.push({ pos: new Vector2(x, line.y), hits: 1 });
            }
        }
        // Diagonal
        else if (line.x < line.z) {
            if (line.y < line.w) {
                for (let iterator = 0; iterator < line.z - line.x; iterator++) {
                    const thisHit = hits.find(
                        (hit) => hit.pos.x === line.x + iterator && hit.pos.y === line.y + iterator,
                    );
                    if (thisHit) thisHit.hits++;
                    else {
                        hits.push({
                            pos: new Vector2(line.x + iterator, line.y + iterator),
                            hits: 1,
                        });
                    }
                }
            } else {
                for (let iterator = 0; iterator < line.z - line.x; iterator++) {
                    const thisHit = hits.find(
                        (hit) => hit.pos.x === line.x + iterator && hit.pos.y === line.y - iterator,
                    );
                    if (thisHit) thisHit.hits++;
                    else {
                        hits.push({
                            pos: new Vector2(line.x + iterator, line.y - iterator),
                            hits: 1,
                        });
                    }
                }
            }
        } else if (line.x > line.z) {
            if (line.y < line.w) {
                for (let iterator = 0; iterator < line.x - line.z; iterator++) {
                    const thisHit = hits.find(
                        (hit) => hit.pos.x === line.x - iterator && hit.pos.y === line.y + iterator,
                    );
                    if (thisHit) thisHit.hits++;
                    else {
                        hits.push({
                            pos: new Vector2(line.x - iterator, line.y + iterator),
                            hits: 1,
                        });
                    }
                }
            } else {
                for (let iterator = 0; iterator < line.x - line.z; iterator++) {
                    const thisHit = hits.find(
                        (hit) => hit.pos.x === line.x - iterator && hit.pos.y === line.y - iterator,
                    );
                    if (thisHit) thisHit.hits++;
                    else {
                        hits.push({
                            pos: new Vector2(line.x - iterator, line.y - iterator),
                            hits: 1,
                        });
                    }
                }
            }
        }
    }

    console.log(hits);
    console.log(lines);
    // hits = _.sortBy(hits, (o) => o.pos.x);
    return hits.filter((hit) => hit.hits > 1).length;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

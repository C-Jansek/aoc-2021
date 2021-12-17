import { Vector2 } from 'three';
import getInput from '../../../utils/getInput';

const doStep = (position: Vector2, velocity: Vector2) => {
    position.add(velocity);
    velocity.x += velocity.x < 0 ? 1 : velocity.x === 0 ? 0 : -1;
    velocity.y -= 1;
};

const part1 = () => {
    const input = getInput('2021', '17').split('\n');
    // target area: x=207..263, y=-115..-63

    const targetArea = {
        x: { min: 207, max: 263 },
        y: { min: -115, max: -63 },
    };
    // const targetArea = {
    //     x: { min: 20, max: 30 },
    //     y: { min: -10, max: -5 },
    // };

    // for (let x = 0; x < targetArea.x.max; x++) {
    //     if (sumTillZero(x) >= targetArea.x.min) {

    //     }
    // })
    let totalMaxHeight: number = -1;
    for (let xVel = 0; xVel < targetArea.x.max; xVel++) {
        console.log(`test ${xVel}`);
        for (let yVel = 0; yVel < 1_000; yVel++) {
            let maxHeight = 0;
            const velocity = new Vector2(xVel, yVel);
            const position = new Vector2();

            while (position.x <= targetArea.x.max && position.y >= targetArea.y.min) {
                // console.log(`not overshooten: ${position.x} ${position.y}`);
                if (position.x >= targetArea.x.min && position.y <= targetArea.y.max) {
                    if (maxHeight > totalMaxHeight) totalMaxHeight = maxHeight;
                    break;
                }
                doStep(position, velocity);

                if (position.y > maxHeight) maxHeight = position.y;
                if (velocity.x === 0 && position.x < targetArea.x.min) break;
            }
        }
    }

    return totalMaxHeight;
};

const sumTillZero = (n: number): number => Math.round((n + 1) * (n / 2));

const part2 = () => {
    const input = getInput('2021', '17').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

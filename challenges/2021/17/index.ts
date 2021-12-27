import { Vector2 } from 'three';
import getInput from '../../../utils/getInput';

type ValueRange = {
    min: number;
    max: number;
};

type Area = {
    x: ValueRange;
    y: ValueRange;
};

const doStep = (position: Vector2, velocity: Vector2) => {
    position.add(velocity);
    if (velocity.x !== 0) velocity.x += velocity.x < 0 ? 1 : -1;
    velocity.y -= 1;
};

/**
 * Parse input to Area.
 *
 * Input example:
 *      `target area: x=207..263, y=-115..-63`
 */

const parseInput = (input: string): Area => {
    const values = [...input.matchAll(/(-){0,1}\d+/g)].map((value) => Number(value[0]));
    if (values.length !== 4) throw new Error('Range incorrect');

    return {
        x: {
            min: values[0],
            max: values[1],
        },
        y: {
            min: values[2],
            max: values[3],
        },
    };
};

/**
 * Calculate range of values that should be tested.
 * Disregard all values that will definitely not reach the target area.
 */
const getTestRange = (targetArea: Area): Area => {
    return {
        x: {
            // Test from x not moving horizontally
            min: 0,
            // To it being at the max of the area after the first step
            max: targetArea.x.max,
        },
        y: {
            // Observe that position.y is a parabola opening down.

            // Velocity at y = 0 will both times be starting velocity (but not same direction)
            // Least possible value is when it overshoots (y goes below target) after one step.
            //      So negative lowest target value;
            // Max possible value if it overshoots the step after getting to y=0 again.
            //      So when velocity.y is higher than abs(target.y.min)
            min: -Math.abs(targetArea.y.min),
            max: Math.abs(targetArea.y.min),
        },
    };
};

/**
 * Check if the position is allready past (horizontally or vertically) the area
 */
const hasOvershooten = (position: Vector2, area: Area): boolean => {
    return position.x > area.x.max || position.y < area.y.min;
};

/**
 * Check if the position is inside of the area
 */
const inArea = (position: Vector2, area: Area): boolean => {
    return (
        area.x.min <= position.x &&
        position.x <= area.x.max &&
        area.y.min <= position.y &&
        position.y <= area.y.max
    );
};

/**
 * Return the maxHeight that the probe will reach on its trajectory to the target area.
 *
 * When the probe does not reach the target area, return `null`
 */
const maxHeightWithVelocity = (xVel: number, yVel: number, targetArea: Area): number | null => {
    // Initiate starting values
    let maxHeight = 0;
    const velocity = new Vector2(xVel, yVel);
    const position = new Vector2();

    while (!hasOvershooten(position, targetArea)) {
        if (inArea(position, targetArea)) {
            return maxHeight;
        }

        doStep(position, velocity);

        if (position.y > maxHeight) maxHeight = position.y;

        // If it has stopped moving horizontally,
        // and is not yet in the target area,
        // it wont get to the target area
        if (velocity.x === 0 && position.x < targetArea.x.min) break;
    }
    return null;
};

/**
 * Problem:
 * Find the initial velocity that causes the probe to reach the highest y position
 * and still eventually be within the target area after any step.
 *
 * What is the highest y position it reaches on this trajectory?
 */
const part1 = () => {
    const input = getInput('2021', '17').split('\n');

    const targetArea = parseInput(input[0]);
    const testRange: Area = getTestRange(targetArea);

    let overallMaxHeight = 0;

    // Test all values in testRange
    for (let xVel = testRange.x.min; xVel <= testRange.x.max; xVel++) {
        for (let yVel = testRange.y.min; yVel <= testRange.y.max; yVel++) {
            const maxHeight = maxHeightWithVelocity(xVel, yVel, targetArea);
            if (maxHeight !== null && maxHeight > overallMaxHeight) overallMaxHeight = maxHeight;
        }
    }

    return overallMaxHeight;
};

/**
 * Problem:
 * How many distinct initial velocity values cause the probe to reach the target area at some point?
 */
const part2 = () => {
    const input = getInput('2021', '17').split('\n');

    const targetArea = parseInput(input[0]);
    const testRange: Area = getTestRange(targetArea);

    let probesThatReachedTarget = 0;

    // Test all values in testRange
    for (let xVel = testRange.x.min; xVel <= testRange.x.max; xVel++) {
        for (let yVel = testRange.y.min; yVel <= testRange.y.max; yVel++) {
            const maxHeight = maxHeightWithVelocity(xVel, yVel, targetArea);
            if (maxHeight !== null) probesThatReachedTarget++;
        }
    }
    return probesThatReachedTarget;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

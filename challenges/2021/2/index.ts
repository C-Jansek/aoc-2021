import getInput from '../../../utils/getInput';

const part1 = () => {
    const movements = getInput('2021', '2').split('\n');

    const location = { x: 0, y: 0 };
    for (const move of movements) {
        const [direction, amount] = move.split(' ');
        switch (direction) {
            case 'forward':
                location.x += Number(amount);
                break;
            case 'down':
                location.y += Number(amount);
                break;
            case 'up':
                location.y -= Number(amount);
                break;
        }
    }

    return location.x * location.y;
};

const part2 = () => {
    const movements = getInput('2021', '2').split('\n');

    const location = { x: 0, y: 0 };
    let aim = 0;
    for (const move of movements) {
        const [direction, amount] = move.split(' ');
        switch (direction) {
            case 'forward':
                location.x += Number(amount);
                location.y += aim * Number(amount);
                break;
            case 'down':
                aim += Number(amount);
                break;
            case 'up':
                aim -= Number(amount);
                break;
        }
    }

    return location.x * location.y;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

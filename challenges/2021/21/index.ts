import getInput from '../../../utils/getInput';

const part1 = () => {
    const input = getInput('2021', '21')
        .split('\n')
        .filter((line) => line !== '');

    const players = input.map((player) => {
        const starting = Number(player.split(': ')[1]);
        const totalScore = 0;
        return {
            position: starting,
            totalScore,
        };
    });
    let tripleDieRoll = 0;
    let dieRoll = 0;
    while (players.every((p) => p.totalScore < 1000)) {
        dieRoll += 3;
        const totalThisRound = dieRoll * 3 - 3;
        let position = players[tripleDieRoll % 2].position + totalThisRound;
        while (position > 10) position -= 10;
        players[tripleDieRoll % 2].position = position;
        players[tripleDieRoll % 2].totalScore += position;
        tripleDieRoll++;
    }
    return (players.find((p) => p.totalScore < 1000)?.totalScore || 0) * dieRoll;
};

/**
 * Generate all possible series of `totalRolls` dice throws
 * with lowest roll `minRoll` and highest roll `maxRoll`.
 */
const generatePossibilities = (totalRolls: number, minRoll = 1, maxRoll = 3): number[][] => {
    if (minRoll > maxRoll) throw new Error('Should have minRoll <= maxRoll');

    // Generate list with integers from minRoll to maxRoll: [minRoll, minRoll + 1 ,..., maxRoll];
    if (totalRolls === 1) {
        const rolls = [];
        for (let index = minRoll; index <= maxRoll; index++) {
            rolls.push([index]);
        }
        return rolls;
    }

    // Generate list that is one shorter, and add all possible rolls to each of the possibilities
    const rolls = generatePossibilities(totalRolls - 1, minRoll, maxRoll);
    const newRolls = [];
    for (let index = minRoll; index <= maxRoll; index++) {
        newRolls.push(...rolls.map((r) => [...r, index]));
    }
    return newRolls;
};

const part2 = () => {
    const input = getInput('2021', '21')
        .split('\n')
        .filter((line) => line !== '');

    const startings = input.map((p) => Number(p.split(': ')[1]));

    const players = input.map((player, index) => {
        const starting = Number(player.split(': ')[1]);
        const totalWins = 0;
        const activeScores: { [key: string]: number } = {};
        activeScores[`0_${starting}_0_${startings[(index + 1) % 2]}`] = 1;
        return {
            position: starting,
            totalWins,
            activeScores,
        };
    });
    const possibleDieces = generatePossibilities(3, 1, 3);

    let tripleDieRoll = 0;
    while (players.every((p) => Object.values(p.activeScores).length > 0)) {
        const player = players[tripleDieRoll % 2];
        const otherPlayer = players[(tripleDieRoll + 1) % 2];
        const newActiveScores: { [key: string]: number } = {};
        const otherNewActiveScores: { [key: string]: number } = {};

        for (const [active, count] of Object.entries(player.activeScores)) {
            for (const dieRoll of possibleDieces) {
                const thisTotal = dieRoll.reduce((total, current) => total + current, 0);

                const otherScore = Number(active.split('_')[2]);
                const otherPosition = Number(active.split('_')[3]);
                let position = Number(active.split('_')[1]) + thisTotal;
                while (position > 10) position -= 10;
                const newScore = Number(active.split('_')[0]) + position;
                if (newScore >= 21) player.totalWins += count;
                else if (
                    newActiveScores[`${newScore}_${position}_${otherScore}_${otherPosition}`]
                ) {
                    newActiveScores[
                        `${newScore}_${position}_${otherScore}_${otherPosition}`
                    ] += count;
                } else {
                    newActiveScores[
                        `${newScore}_${position}_${otherScore}_${otherPosition}`
                    ] = count;
                }

                if (newScore >= 21) {
                    continue;
                } else if (
                    otherNewActiveScores[`${otherScore}_${otherPosition}_${newScore}_${position}`]
                ) {
                    otherNewActiveScores[
                        `${otherScore}_${otherPosition}_${newScore}_${position}`
                    ] += count;
                } else {
                    otherNewActiveScores[
                        `${otherScore}_${otherPosition}_${newScore}_${position}`
                    ] = count;
                }
            }
        }
        player.activeScores = newActiveScores;
        otherPlayer.activeScores = otherNewActiveScores;

        tripleDieRoll++;
    }
    return players.sort((a, b) => b.totalWins - a.totalWins)[0].totalWins;
};
196186007;
console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

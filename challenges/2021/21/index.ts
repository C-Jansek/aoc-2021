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

const generatePossibilities = (): number[][] => {
    return [
        [1, 1, 1],
        [1, 1, 2],
        [1, 1, 3],
        [1, 2, 1],
        [1, 2, 2],
        [1, 2, 3],
        [1, 3, 1],
        [1, 3, 2],
        [1, 3, 3],
        [2, 1, 1],
        [2, 1, 2],
        [2, 1, 3],
        [2, 2, 1],
        [2, 2, 2],
        [2, 2, 3],
        [2, 3, 1],
        [2, 3, 2],
        [2, 3, 3],
        [3, 1, 1],
        [3, 1, 2],
        [3, 1, 3],
        [3, 2, 1],
        [3, 2, 2],
        [3, 2, 3],
        [3, 3, 1],
        [3, 3, 2],
        [3, 3, 3],
    ];
};

const part2 = () => {
    const input = getInput('2021', '21')
        .split('\n')
        .filter((line) => line !== '');

    const players = input.map((player) => {
        const starting = Number(player.split(': ')[1]);
        const totalWins = 0;
        const activeScores: { [key: string]: number } = {};
        activeScores[`0_${starting}`] = 1;
        return {
            position: starting,
            totalWins,
            activeScores,
        };
    });
    const possibleDieces = generatePossibilities();

    let tripleDieRoll = 0;
    while (players.every((p) => Object.values(p.activeScores).length > 0)) {
        const player = players[tripleDieRoll % 2];
        const newActiveScores: { [key: string]: number } = {};
        for (const [active, count] of Object.entries(player.activeScores)) {
            for (const dieRoll of possibleDieces) {
                const thisTotal = dieRoll.reduce((total, current) => total + current, 0);

                let position = Number(active.split('_')[1]) + thisTotal;
                while (position > 10) position -= 10;
                const newScore = Number(active.split('_')[0]) + position;
                if (newScore >= 21) player.totalWins += count;
                else if (newActiveScores[`${newScore}_${position}`]) {
                    newActiveScores[`${newScore}_${position}`] += count;
                } else {
                    newActiveScores[`${newScore}_${position}`] = count;
                }
            }
        }
        player.activeScores = newActiveScores;
        console.log(player);
        tripleDieRoll++;
        console.log(tripleDieRoll);
    }
    return players.sort((a, b) => b.totalWins - a.totalWins)[0].totalWins;
};
196186007;
console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

import { assert } from 'console';
import getInput from '../../../utils/getInput';

type Packet = {
    length: number;
    subPackets?: (Packet | null)[];
    typeId: number;
    value: number;
    version: number;
    versionSum: number;
};

const parseHexadecimal = (input: string): string => {
    let output = '';
    for (const char of input) {
        output += ('0000' + Number.parseInt(char, 16).toString(2)).slice(-4);
    }
    return output;
};

const processTypeId = (subPackets: Packet[], typeId: number): number => {
    switch (typeId) {
        case 0: {
            return subPackets.reduce((sum, current) => (sum += current.value), 0);
        }
        case 1: {
            return subPackets.reduce((product, current) => (product *= current.value), 1);
        }
        case 2: {
            return subPackets.reduce(
                (min, current) => Math.min(min, current.value),
                Number.POSITIVE_INFINITY,
            );
        }
        case 3: {
            return subPackets.reduce(
                (max, current) => Math.max(max, current.value),
                Number.NEGATIVE_INFINITY,
            );
        }
        case 5: {
            return subPackets[0].value > subPackets[1].value ? 1 : 0;
        }
        case 6: {
            return subPackets[0].value < subPackets[1].value ? 1 : 0;
        }
        case 7: {
            return subPackets[0].value === subPackets[1].value ? 1 : 0;
        }
    }
    throw new Error(`Unknown typeId ${typeId}`);
};

const literalValue = (
    input: string,
    version: number,
    typeId: number,
    metaLength: number,
): Packet => {
    const dataBits = input.slice(6);
    const valuesArray: string[] = [];
    for (let index = 0; index - 1 < dataBits.length / 5; index++) {
        valuesArray.push(dataBits.slice(index * 5 + 1, (index + 1) * 5));
        if (dataBits[index * 5] === '0') {
            break;
        }
    }

    const length = valuesArray.join('').length + valuesArray.length + metaLength;

    return {
        version,
        typeId,
        length,
        value: Number.parseInt(valuesArray.join(''), 2),
        versionSum: version,
    };
};

const unpack = (input: string): Packet | null => {
    if (Number.parseInt(input) === 0) return null;

    const version = Number.parseInt(input.slice(0, 3), 2);
    const typeId = Number.parseInt(input.slice(3, 6), 2);
    const metaLength = 6;

    // Output literal Value
    if (typeId === 4) return literalValue(input, version, typeId, metaLength);

    // Initialize
    let characterIndex = 0;
    let subPacketIndex = 0;
    const modeId = input[6];
    const dataBits = input.slice(7);
    const subPackets: Packet[] = [];

    // Mode specific constants
    const lengthTypeIdLength = modeId === '0' ? 15 : 11;
    const subPacketBits = dataBits.slice(lengthTypeIdLength);
    const maxCondition = Number.parseInt(dataBits.slice(0, lengthTypeIdLength), 2);

    // Check next characters for subpacket
    while (modeId === '0' ? characterIndex < maxCondition : subPacketIndex < maxCondition) {
        const checkBits =
            modeId === '0'
                ? subPacketBits.slice(characterIndex, maxCondition)
                : subPacketBits.slice(characterIndex);

        const subPacket = unpack(checkBits);
        if (!subPacket) break;

        subPackets.push(subPacket);

        characterIndex += subPacket.length;
        subPacketIndex++;
    }

    // Unpack subPackets
    const length = characterIndex + metaLength + modeId.length + lengthTypeIdLength;
    const value = processTypeId(subPackets, typeId);
    const versionSum = subPackets.reduce((sum, current) => (sum += current.versionSum), version);

    return {
        length,
        subPackets,
        typeId,
        value,
        version,
        versionSum,
    };
};

const part1 = () => {
    const input = getInput('2021', '16').split('\n')[0];

    const binaryData = parseHexadecimal(input);
    const packet = unpack(binaryData);

    return packet?.versionSum ?? -1;
};

const part2 = () => {
    const input = getInput('2021', '16').split('\n')[0];

    const binaryData = parseHexadecimal(input);
    const packet = unpack(binaryData);

    return packet?.value ?? -1;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

import { assert } from 'console';
import getInput from '../../../utils/getInput';

type Packet = {
    version: number;
    typeId: number;
    length: number;
    versionSum: number;
    value: number;
    subPackets?: (Packet | null)[];
};

const parseHexadecimal = (input: string): string => {
    let output = '';
    for (const char of input) {
        output += ('0000' + Number.parseInt(char, 16).toString(2)).slice(-4);
    }
    return output;
};

const unpack = (input: string): Packet | null => {
    if (Number.parseInt(input) === 0) return null;
    const version = Number.parseInt(input.slice(0, 3), 2);
    const typeId = Number.parseInt(input.slice(3, 6), 2);
    const versionAndTypeLength = 6;

    if (typeId === 4) {
        const valueBits = input.slice(6);
        const valuesArray: string[] = [];
        for (let index = 0; index - 1 < valueBits.length / 5; index++) {
            valuesArray.push(valueBits.slice(index * 5 + 1, (index + 1) * 5));
            if (valueBits[index * 5] === '0') {
                break;
            }
        }

        const length = valuesArray.join('').length + valuesArray.length + versionAndTypeLength;
        return {
            version,
            typeId,
            length,
            value: Number.parseInt(valuesArray.join(''), 2),
            versionSum: version,
        };
    }

    const dataBits = input.slice(7);
    const lengthTypeId = input[6];

    const subPackets: Packet[] = [];
    let versionSum = 0;
    let length = 0;
    if (lengthTypeId === '0') {
        const lengthTypeIdLength = 15;
        const subPacketsTotalLength = Number.parseInt(dataBits.slice(0, lengthTypeIdLength), 2);

        const subPacketBits = dataBits.slice(lengthTypeIdLength);

        // Split subpackets
        let index = 0;
        while (index < subPacketsTotalLength) {
            const subPacket = unpack(subPacketBits.slice(index, subPacketsTotalLength));
            if (!subPacket) break;
            subPackets.push(subPacket);
            index += subPacket.length;
        }
        versionSum = subPackets.reduce((sum, current) => (sum += current.versionSum), version);

        length = index + versionAndTypeLength + lengthTypeId.length + lengthTypeIdLength;
    } else {
        assert(lengthTypeId === '1');
        if (lengthTypeId !== '1') throw new Error('Not specified lengthTypId');

        const lengthTypeIdLength = 11;
        const subPacketCount = Number.parseInt(dataBits.slice(0, lengthTypeIdLength), 2);

        const subPacketBits = dataBits.slice(lengthTypeIdLength);

        // Split subpackets
        let index = 0;
        let subPacketIndex = 0;
        while (subPacketIndex < subPacketCount) {
            const subPacket = unpack(subPacketBits.slice(index));
            if (!subPacket) break;
            subPackets.push(subPacket);
            index += subPacket.length;
            subPacketIndex++;
        }

        // Unpack subPackets
        versionSum = subPackets.reduce((sum, current) => (sum += current.versionSum), version);
        length = index + versionAndTypeLength + lengthTypeId.length + lengthTypeIdLength;
    }
    let value = 0;

    if (typeId === 0) {
        value = subPackets.reduce((sum, current) => (sum += current.value), 0);
    }
    if (typeId === 1) {
        value = subPackets.reduce((product, current) => (product *= current.value), 1);
    }
    if (typeId === 2) {
        value = subPackets.reduce(
            (min, current) => Math.min(min, current.value),
            Number.POSITIVE_INFINITY,
        );
    }
    if (typeId === 3) {
        value = subPackets.reduce(
            (max, current) => Math.max(max, current.value),
            Number.NEGATIVE_INFINITY,
        );
    }
    if (typeId === 5) {
        value = subPackets[0].value > subPackets[1].value ? 1 : 0;
    }
    if (typeId === 6) {
        value = subPackets[0].value < subPackets[1].value ? 1 : 0;
    }
    if (typeId === 7) {
        value = subPackets[0].value === subPackets[1].value ? 1 : 0;
    }

    return {
        version,
        typeId,
        length,
        subPackets,
        versionSum,
        value,
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
    console.log(packet);

    return packet?.value ?? -1;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

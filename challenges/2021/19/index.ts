import _ from 'lodash';
import { Matrix3, Vector3 } from 'three';
import getInput from '../../../utils/getInput';

// const possibleOrientations = [
//     // Only flipped
//     new Matrix3().set(1, 0, 0, 0, 1, 0, 0, 0, 1),
//     new Matrix3().set(-1, 0, 0, 0, 1, 0, 0, 0, 1),
//     new Matrix3().set(1, 0, 0, 0, -1, 0, 0, 0, 1),
//     new Matrix3().set(1, 0, 0, 0, 1, 0, 0, 0, -1),
//     new Matrix3().set(-1, 0, 0, 0, -1, 0, 0, 0, 1),
//     new Matrix3().set(1, 0, 0, 0, -1, 0, 0, 0, -1),
//     new Matrix3().set(-1, 0, 0, 0, 1, 0, 0, 0, -1),
//     new Matrix3().set(-1, 0, 0, 0, -1, 0, 0, 0, -1),

//     new Matrix3().set(0, 1, 0, 1, 0, 0, 0, 0, 1),
//     new Matrix3().set(1, 0, 0, 0, 0, 1, 0, 1, 0),
//     new Matrix3().set(0, 0, 1, 0, 1, 0, 1, 0, 0),

//     new Matrix3().set(0, 0, 1, 1, 0, 0, 0, 1, 0),
//     new Matrix3().set(0, 1, 0, 0, 0, 1, 1, 0, 0),
// ];

const generatePossibleOrientations = () => {
    const orientations: Matrix3[] = [];
    const zRollMatrix = new Matrix3().set(0, 1, 0, -1, 0, 0, 0, 0, 1);
    const rollZ = (m: Matrix3) => m.multiply(zRollMatrix);

    const yRollMatrix = new Matrix3().set(1, 0, 0, 0, 0, -1, 0, 1, 0);
    const rollY = (m: Matrix3) => m.multiply(yRollMatrix);

    const xRollMatrix = new Matrix3().set(0, 0, 1, 0, 1, 0, -1, 0, 0);
    const rollX = (m: Matrix3) => m.multiply(xRollMatrix);

    const matrix = new Matrix3();
    for (let _ = 0; _ < 3; _++) {
        rollY(matrix);
        for (let _index = 0; _index < 4; _index++) {
            orientations.push(new Matrix3().multiply(rollZ(matrix)));
        }

        rollX(matrix);
        for (let _index = 0; _index < 4; _index++) {
            orientations.push(new Matrix3().multiply(rollZ(matrix)));
        }
    }

    return orientations;
};

class Scanner {
    id: number;
    position: Vector3;
    orientation: boolean | Matrix3;
    report: Vector3[];
    positionKnown: boolean;

    constructor(id: number, report: string[], positionKnown = false, baseOrientation = false) {
        this.id = id;
        this.report = this.parseReport(report);
        this.position = new Vector3();
        this.positionKnown = positionKnown;
        this.orientation = baseOrientation ? new Matrix3() : false;
    }

    parseReport(input: string[]) {
        const report: Vector3[] = [];
        for (const line of input) {
            report.push(new Vector3(...line.split(',').map((value) => Number(value))));
        }
        return report;
    }

    // relativePositionWithRotation(otherScanner: Scanner, orientation: Matrix3): Vector3 | false {
    //     const otherReport = otherScanner.getRotatedReport(orientation);
    //     // this.report vs otherReport;
    // }

    relativePositionFromReport(otherReport: Vector3[]): Vector3 | null {
        for (const _beaconA of this.report) {
            for (const _beaconB of otherReport) {
                // const overlappingBeacons = this.findOverlappingBeacons(this.report, otherReport);

                const mapping: Record<number, number> = {};
                const positionDelta = new Vector3().subVectors(_beaconA, _beaconB);
                // console.log('\n\n -----------------\n', _beaconA, _beaconB, positionDelta);

                for (const [indexA, beaconA] of this.report.entries()) {
                    if (beaconA === _beaconA) continue;

                    for (const [indexB, beaconB] of otherReport.entries()) {
                        if (beaconB === _beaconB || Object.values(mapping).includes(indexB)) {
                            continue;
                        }

                        if (
                            beaconB
                                .clone()
                                .add(positionDelta)
                                .equals(beaconA)
                        ) {
                            mapping[indexA] = indexB;
                        }
                    }
                }
                if (Object.values(mapping).length > 12) {
                    return positionDelta;
                }
            }
        }
        return null;
    }

    getRotatedReport(orientation: Matrix3): Vector3[] {
        return this.report.map((beacon) => beacon.clone().applyMatrix3(orientation));
    }

    setPosition(position: Vector3, orientation: Matrix3): void {
        this.position = position;
        this.orientation = orientation;
        this.positionKnown = true;

        for (const beacon of this.report) {
            beacon.applyMatrix3(orientation).add(position);
        }
    }
}

const part1 = () => {
    const scannersInput = getInput('2021', '19').split('\n\n');
    const scanners: Scanner[] = [];

    for (const scanner of scannersInput) {
        const id = Number(scanner.split('\n')[0].match(/\d+/g));
        const report = scanner.split('\n').slice(1);
        scanners.push(new Scanner(id, report, id === 0 ? true : false, id === 0 ? true : false));
    }

    const possibleOrientations = generatePossibleOrientations();

    while (!scanners.every((scanner) => scanner.positionKnown)) {
        for (const scannerA of scanners) {
            if (!scannerA.positionKnown) continue;
            for (const scannerB of scanners) {
                // No need to match if already found
                if (scannerB.positionKnown || scannerA === scannerB) {
                    continue;
                }

                for (const orientation of possibleOrientations) {
                    const positionDelta = scannerA.relativePositionFromReport(
                        scannerB.getRotatedReport(orientation),
                    );
                    if (!positionDelta) continue;

                    console.log(scannerA.id, scannerB.id);
                    // console.log(scannerA.position);
                    // console.log(positionDelta);
                    scannerB.setPosition(positionDelta, orientation);
                    break;
                }
                // break; // testing
            }
            // break; // testing
        }
    }
    console.log(scanners);
    // console.log(scanners.map((scanner) => _.orderBy(scanner.report, ['x', 'y', 'z'], 'asc')));
    const allBeacons: Vector3[] = [];
    for (const scanner of scanners) {
        for (const beacon of scanner.report) {
            allBeacons.push(beacon);
        }
    }
    const uniqBeacons = _.uniqBy(allBeacons, (a: Vector3) => hash(a));
    const sortedBeacons = _.orderBy(uniqBeacons, ['x', 'y', 'z'], 'asc');
    // console.log(sortedBeacons);
    return sortedBeacons.length;
};

const hash = (v: Vector3) => v.toArray().join('-');

const part2 = () => {
    const scannersInput = getInput('2021', '19').split('\n\n');
    const scanners: Scanner[] = [];

    for (const scanner of scannersInput) {
        const id = Number(scanner.split('\n')[0].match(/\d+/g));
        const report = scanner.split('\n').slice(1);

        scanners.push(new Scanner(id, report, id === 0, id === 0));
    }

    const possibleOrientations = generatePossibleOrientations();

    while (!scanners.every((scanner) => scanner.positionKnown)) {
        for (const scannerA of scanners) {
            if (!scannerA.positionKnown) continue;

            for (const scannerB of scanners) {
                // No need to match if already found
                if (scannerB.positionKnown || scannerA === scannerB) continue;

                for (const orientation of possibleOrientations) {
                    const beaconsB = scannerB.getRotatedReport(orientation);

                    const relativePosition = scannerA.relativePositionFromReport(beaconsB);
                    if (relativePosition) {
                        console.log(scannerA.id, scannerB.id);
                        // console.log(scannerA.position);
                        // console.log(relativePosition);
                        scannerB.setPosition(relativePosition, orientation);
                        break;
                    }
                    // break; // testing
                }
                // break; // testing
            }
            // break; // testing
        }
    }
    console.log(scanners);

    let maxDistance = 0;
    for (const scannerA of scanners) {
        for (const scannerB of scanners) {
            const manhattan = scannerA.position.manhattanDistanceTo(scannerB.position);
            if (manhattan > maxDistance) maxDistance = manhattan;
        }
    }
    return maxDistance;
};

console.log(`Solution 1: ${part1()}`);
// 491 too high
// 490 too high

console.log(`Solution 2: ${part2()}`);

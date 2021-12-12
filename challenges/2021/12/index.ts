import getInput from '../../../utils/getInput';

interface Node {
    id: string;
    edges: Edge[];
    smallCave: boolean;
}

interface Edge {
    id: string;
    nodes: Node[];
}

type Path = Node[];
type PathDouble = {
    path: Node[];
    hasDouble: boolean;
};

class Network {
    nodes: Node[];
    edges: Edge[];

    constructor(input: string[]) {
        this.nodes = [];
        this.edges = [];
        this.parseInput(input);
    }

    parseInput(input: string[]) {
        for (const line of input) {
            const [from, to] = line.split('-');
            const fromNode = this.findNodeOrNew(from);
            const toNode = this.findNodeOrNew(to);

            const edge = { id: line, nodes: [fromNode, toNode] };

            fromNode.edges.push(edge);
            toNode.edges.push(edge);

            this.nodes.push(fromNode, toNode);
            this.edges.push(edge);
        }
    }

    findNodeOrNew(id: string): Node {
        const node = this.nodes.find((node) => node.id === id);
        if (!node) {
            let smallCave = false;
            if (/[a-z]/.test(id)) {
                smallCave = true;
            }
            return {
                id,
                edges: [],
                smallCave,
            };
        }
        return node;
    }

    findNode(id: string): Node {
        const node = this.nodes.find((node) => node.id === id);
        if (!node) throw new Error(`No node with id ${id}`);
        return node;
    }

    allPaths(fromId: string, toId: string): Path[] {
        const fromNode = this.findNode(fromId);
        const toNode = this.findNode(toId);

        const paths: Path[] = [[fromNode]];
        const finishedPaths: Path[] = [];

        while (paths.length > 0) {
            const path = paths.pop();
            if (!path) return finishedPaths;

            const fromNode = path[path.length - 1];
            if (fromNode === toNode) finishedPaths.push(path);
            const fromEdges = fromNode.edges;

            for (const edge of fromEdges) {
                const toNode = edge.nodes.find((node) => node !== fromNode);

                if (!toNode) throw new Error(`Edge with no end Node`);

                if (!toNode.smallCave || !path.includes(toNode)) {
                    paths.push([...path, toNode]);
                }
            }
        }

        return finishedPaths;
    }

    allPathsOneDouble(fromId: string, toId: string): PathDouble[] {
        const startNode = this.findNode(fromId);
        const endNode = this.findNode(toId);

        const paths: PathDouble[] = [{ path: [startNode], hasDouble: false }];
        const finishedPaths: PathDouble[] = [];

        while (paths.length > 0) {
            const path = paths.pop();
            if (!path) return finishedPaths;

            const fromNode = path.path[path.path.length - 1];
            if (fromNode === endNode) {
                finishedPaths.push(path);
                continue;
            }
            const fromEdges = fromNode.edges;

            for (const edge of fromEdges) {
                const toNode = edge.nodes.find((node) => node !== fromNode);

                if (!toNode) throw new Error(`Edge with no end Node`);

                if (
                    !toNode.smallCave ||
                    !path.path.includes(toNode) ||
                    (!path.hasDouble && toNode !== startNode)
                ) {
                    const hasDouble =
                        path.hasDouble || (toNode.smallCave && path.path.includes(toNode));
                    paths.push({ path: [...path.path, toNode], hasDouble });
                }
            }
        }

        return finishedPaths;
    }
}

const part1 = () => {
    const input = getInput('2021', '12')
        .split('\n')
        .filter((line) => line !== '');

    const network = new Network(input);

    const paths = network.allPaths('start', 'end');

    return paths.length;
};

const part2 = () => {
    const input = getInput('2021', '12')
        .split('\n')
        .filter((line) => line !== '');

    const network = new Network(input);

    const paths = network.allPathsOneDouble('start', 'end');

    return paths.length;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);

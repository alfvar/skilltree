export interface NodeData {
    age: number;
    dependency?: string; // key of another node
}

const nodeDataStore: ReadonlyMap<string, NodeData> = new Map([
    ["Pirate", { age: 6 }],
    ["Knight", { age: 6 }],
    ["Princess", { age: 6 }],
    ["Wizard", { age: 6 }],
    ["Dragon", { age: 6 }],
    ["Farmer", { age: 6 }],
    ["Builder", { age: 6 }],
    ["Treasure hunts", { age: 12, dependency: "Pirate" }],
    ["Boat", { age: 12, dependency: "Pirate" }],
    ["Secret base", { age: 12, dependency: "Pirate" }],
]);

export function getNodeData(name: string): NodeData | undefined {
    return nodeDataStore.get(name);
}

export function getAllNodeData(): ReadonlyArray<[string, NodeData]> {
    return Array.from(nodeDataStore.entries());
}

export function getNodeDependency(name: string): NodeData | undefined {
    const node = nodeDataStore.get(name);
    if (node?.dependency) {
        return nodeDataStore.get(node.dependency);
    }
    return undefined;
}

import { getAllNodeData, getAncestorChain } from "./skillStore";

export function renderSkillNodes(
    currentDependency: string | undefined,
    parentAngleRange: { start: number; end: number }
) {
    // Get ancestor chain if we have a current dependency
    const ancestorChain = currentDependency ? getAncestorChain(currentDependency) : [];
    const visibleNodes = new Set([
        ...ancestorChain,
        ...(currentDependency ? [currentDependency] : [])
    ]);
    
    const allData = Array.from(getAllNodeData());
    
    const filteredData = allData.filter(
        ([key, data]) => {
            // Show nodes that:
            // 1. Have no dependency (roots)
            // 2. Are in the ancestor chain
            // 3. Are children of currentDependency
            return !data.dependency || 
                   visibleNodes.has(key) || 
                   data.dependency === currentDependency;
        }
    );
    
    // Group nodes by their parent dependency
    const nodesByParent = new Map<string | undefined, Array<[string, any]>>();
    filteredData.forEach(([key, data]) => {
        const parent = data.dependency;
        if (!nodesByParent.has(parent)) {
            nodesByParent.set(parent, []);
        }
        nodesByParent.get(parent)!.push([key, data]);
    });
    
    // Also create a map of ALL siblings (not just visible ones) for angle calculation
    const allNodesByParent = new Map<string | undefined, Array<[string, any]>>();
    allData.forEach(([key, data]) => {
        const parent = data.dependency;
        if (!allNodesByParent.has(parent)) {
            allNodesByParent.set(parent, []);
        }
        allNodesByParent.get(parent)!.push([key, data]);
    });
    
    // Calculate angle ranges for each group
    const angleRanges = new Map<string, { start: number; end: number }>();
    
    // Start with root nodes (no dependency) - they get the full 360 degrees
    const rootNodes = allNodesByParent.get(undefined) || [];
    const rootSliceAngle = 360 / rootNodes.length;
    rootNodes.forEach(([key], index) => {
        angleRanges.set(key, {
            start: index * rootSliceAngle,
            end: (index + 1) * rootSliceAngle
        });
    });
    
    // Calculate angles for child nodes based on their parent's range
    // Process in dependency order by repeatedly processing nodes whose parents have been calculated
    let remainingNodes = filteredData.filter(([key, data]) => data.dependency);
    let processedCount = 0;
    
    while (remainingNodes.length > 0 && processedCount < remainingNodes.length) {
        processedCount = 0;
        
        remainingNodes = remainingNodes.filter(([key, data]) => {
            const parentRange = angleRanges.get(data.dependency!);
            if (parentRange) {
                // Use ALL siblings (not just visible ones) for angle calculation
                const allSiblings = allNodesByParent.get(data.dependency) || [];
                const siblingIndex = allSiblings.findIndex(([k]) => k === key);
                const siblingCount = allSiblings.length;
                const parentSpan = parentRange.end - parentRange.start;
                const sliceAngle = parentSpan / siblingCount;
                
                angleRanges.set(key, {
                    start: parentRange.start + (siblingIndex * sliceAngle),
                    end: parentRange.start + ((siblingIndex + 1) * sliceAngle)
                });
                processedCount++;
                return false; // Remove from remaining
            }
            return true; // Keep in remaining
        });
    }
    
    return filteredData.map(([key, data]) => {
        const range = angleRanges.get(key) || { start: 0, end: 360 };
        
        // Determine size and radius based on age
        let size, outerRadius, innerRadius;
        if (data.age === 6) {
            size = 300;
            outerRadius = (size / 2) - 10;
            innerRadius = 0;
        } else if (data.age === 12) {
            size = 700;
            outerRadius = (size / 2) - 10;
            innerRadius = (300 / 2) - 10;
        } else if (data.age === 18) {
            size = 1200;
            outerRadius = (size / 2) - 10;
            innerRadius = (700 / 2) - 10;
        } else if (data.age === 30) {
            size = 1800;
            outerRadius = (size / 2) - 10;
            innerRadius = (1200 / 2) - 10;
        }
        
        return {
            id: key,
            type: "pieSlice",
            position: { x: 0, y: 0 },
            data: { 
                label: key,
                size,
                outerRadius,
                innerRadius,
                startAngle: range.start,
                endAngle: range.end,
            },
        };
    });
}

import { getAllNodeData } from "./skillStore";

export function renderSkillNodes(
    currentDependency: string | undefined,
    parentAngleRange: { start: number; end: number }
) {
    const filteredData = Array.from(getAllNodeData()).filter(
        ([key, data]) => data.dependency === currentDependency
    );
    
    // Calculate angle for each slice within parent's range
    const parentAngleSpan = parentAngleRange.end - parentAngleRange.start;
    const sliceAngle = parentAngleSpan / filteredData.length;
    
    return filteredData.map(([key, data], index) => {
        const startAngle = parentAngleRange.start + (index * sliceAngle);
        const endAngle = startAngle + sliceAngle;
        
        // Determine size and radius based on age
        let size, outerRadius, innerRadius;
        if (data.age === 6) {
            size = 300;
            outerRadius = (size / 2) - 10;
            innerRadius = 0;
        } else if (data.age === 12) {
            size = 700;
            outerRadius = (size / 2) - 10;
            innerRadius = (300 / 2) - 10; // Inner circle is year6 size
        } else if (data.age === 18) {
            size = 1200;
            outerRadius = (size / 2) - 10;
            innerRadius = (700 / 2) - 10; // Inner circle is year12 size
        } else if (data.age === 30) {
            size = 1800;
            outerRadius = (size / 2) - 10;
            innerRadius = (1200 / 2) - 10; // Inner circle is year18 size
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
                startAngle,
                endAngle,
            },
        };
    });
}

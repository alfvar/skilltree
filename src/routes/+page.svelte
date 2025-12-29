<script>
    import { SvelteFlow, Background } from "@xyflow/svelte";
    import "@xyflow/svelte/dist/style.css";
    import CircleNode from "$lib/components/CircleNode.svelte";
    import PieSliceNode from "$lib/components/PieSliceNode.svelte";
    import { backgroundNodes } from "$lib/backgroundNodes";
    import { getAllNodeData } from "$lib/skillStore";

    const nodeTypes = {
        circle: CircleNode,
        pieSlice: PieSliceNode,
    };

    let currentDependency = $state(undefined);
    let parentAngleRange = $state({ start: 0, end: 360 }); // Track parent's angle range

    $effect(() => {
        console.log("currentDependency:", currentDependency);
    });

    // Dynamically get skills based on current dependency
    function getSkillNodes() {
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

    let nodes = $derived.by(() => [...backgroundNodes, ...getSkillNodes()]);

    let edges = $state.raw([
        { id: "e1-circle", source: "1", target: "circle" },
        { id: "e-circle-alpha", source: "circle", target: "alpha" },
    ]);

    function handleNodeClick(event) {
        console.log("Node clicked:", event);
        const node = event.node;
        // Only update dependency if it's a skill node (not a background circle)
        if (node && node.type === "pieSlice") {
            currentDependency = node.id;
            // Store the clicked node's angle range for its children
            parentAngleRange = { 
                start: node.data.startAngle, 
                end: node.data.endAngle 
            };
        }
    }

</script>

<div style="width: 100vw; height: 100vh;">
    <SvelteFlow
        {nodes}
        {edges}
        {nodeTypes}
        nodesDraggable={false}
        initialViewport={{ zoom: 0.5, x: 0, y: 0 }}
        onnodeclick={handleNodeClick}
    >
        <Background color="#888" />
    </SvelteFlow>
</div>

<style>
    :global(html),
    :global(body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>

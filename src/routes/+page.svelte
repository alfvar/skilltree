<script>
    import { SvelteFlow, Background, SvelteFlowProvider } from "@xyflow/svelte";
    import "@xyflow/svelte/dist/style.css";
    import CircleNode from "$lib/components/CircleNode.svelte";
    import PieSliceNode from "$lib/components/PieSliceNode.svelte";
    import CameraController from "$lib/components/CameraController.svelte";
    import { backgroundNodes } from "$lib/backgroundNodes";
    import { renderSkillNodes } from "$lib/renderSkillNodes";
    import { getRingSegmentCenter } from "$lib/utils/coordinateUtils";

    const nodeTypes = {
        circle: CircleNode,
        pieSlice: PieSliceNode,
    };

    let currentDependency = $state(undefined);
    let parentAngleRange = $state({ start: 0, end: 360 });
    
    // Calculate initial viewport to center (0,0) on screen
    let viewport = $state({
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 960,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 540,
        zoom: 2
    });

    $effect(() => {
        console.log("currentDependency:", currentDependency);
    });

    let nodes = $derived.by(() => [
        ...backgroundNodes, 
        ...renderSkillNodes(currentDependency, parentAngleRange)
    ]);

    // Calculate camera target position when nodes change
    let cameraTarget = $derived.by(() => {
        if (currentDependency === undefined) return null;
        
        const skillNodes = renderSkillNodes(currentDependency, parentAngleRange);
        if (skillNodes.length === 0) return null;
        
        const firstNode = skillNodes[0];
        return getRingSegmentCenter(
            firstNode.data.innerRadius,
            firstNode.data.outerRadius,
            parentAngleRange.start,
            parentAngleRange.end
        );
    });

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
        {viewport}
        onnodeclick={handleNodeClick}
    >
        <CameraController targetCenter={cameraTarget} />
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

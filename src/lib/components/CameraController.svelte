<script>
    import { useSvelteFlow } from "@xyflow/svelte";
    import { untrack } from "svelte";
    import { CAMERA_TRANSITION_DURATION_MS } from "$lib/utils/coordinateUtils";

    let { targetCenter } = $props();

    const { setViewport, getViewport } = useSvelteFlow();

    $effect(() => {
        if (targetCenter) {
            untrack(() => {
                const currentViewport = getViewport();
                const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
                const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
                
                // Calculate viewport position to center the target flow coordinate
                const newX = screenWidth / 2 - targetCenter.x * currentViewport.zoom;
                const newY = screenHeight / 2 - targetCenter.y * currentViewport.zoom;
                
                setViewport({ 
                    x: newX,
                    y: newY,
                    zoom: currentViewport.zoom
                }, { 
                    duration: CAMERA_TRANSITION_DURATION_MS 
                });
            });
        }
    });
</script>

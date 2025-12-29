<script>
    import { useSvelteFlow } from "@xyflow/svelte";
    
    let { data } = $props();
    
    const size = data.size || 300;
    const radius = (size / 2) - 10;
    const center = size / 2;
    const fontSize = 20;
    const perimeterFontSize = 11;
    const textOffset = 5; // Distance text sits from the circle line
    const textRadius = radius + textOffset;
    
    const { getViewport } = useSvelteFlow();
    
    // Calculate approximate text width
    let textWidth = $derived((data.perimeterLabel || 'Label').length * perimeterFontSize * 0.6);
    let padding = 4;
    
    // Calculate text position based on viewport
    let textPosition = $derived.by(() => {
        const viewport = getViewport();
        
        // Get screen dimensions
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
        
        // Convert screen center to flow coordinates
        // Formula: flowCoord = (screenCoord - viewportTranslation) / zoom
        const viewportCenterX = (screenWidth / 2 - viewport.x) / viewport.zoom;
        const viewportCenterY = (screenHeight / 2 - viewport.y) / viewport.zoom;
        
        // Calculate vector from circle center (0,0 in flow) to viewport center
        const dx = viewportCenterX;
        const dy = viewportCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If viewport is very close to circle center, default to top position
        if (distance < 10) {
            return { x: center, y: center - textRadius };
        }
        
        // Calculate angle pointing FROM circle center TOWARDS viewport center
        const angleToViewport = Math.atan2(dy, dx);
        
        // Position text on the circle edge in SVG coordinates
        // The circle in SVG is centered at (center, center)
        const textX = center + textRadius * Math.cos(angleToViewport);
        const textY = center + textRadius * Math.sin(angleToViewport);
        
        return { x: textX, y: textY };
    });
</script>

<svg class="circle" width={size} height={size} style="transform: translate(-50%, -50%); pointer-events: none; overflow: visible;">
    <circle
        r={radius}
        cx={center}
        cy={center}
        fill="transparent"
        stroke="black"
        stroke-width="1"
    />
    
    <!-- White background for sticky text -->
    <rect
        x={textPosition.x - textWidth / 2 - padding}
        y={textPosition.y - perimeterFontSize / 2 - padding}
        width={textWidth + padding * 2}
        height={perimeterFontSize + padding * 2}
        fill="white"
        rx="2"
    />
    
    <!-- Sticky text that follows viewport -->
    <text
        class="stickyText"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size={perimeterFontSize}
        fill="black"
        font-weight="bold"
        x={textPosition.x}
        y={textPosition.y}
    >
        {data.perimeterLabel || 'Label'}
    </text>
</svg>

<style>
    .circle {
        cursor: grab;
    }
    
    .nodeText {
        user-select: none;
        font-weight: bold;
    }
    
    .perimeterText {
        user-select: none;
        font-family: monospace;
    }
    
    .stickyText {
        user-select: none;
        pointer-events: none;
    }
</style>

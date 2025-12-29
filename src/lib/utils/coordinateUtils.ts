const ANGLE_OFFSET_DEGREES = -90;
export const CAMERA_TRANSITION_DURATION_MS = 600;

/**
 * Converts polar coordinates to Cartesian coordinates
 * @param radius - Distance from origin
 * @param angleDegrees - Angle in degrees (0 = top, increases clockwise)
 * @returns Object with x and y coordinates
 */
export function polarToCartesian(radius: number, angleDegrees: number): { x: number; y: number } {
    const angleRadians = ((angleDegrees + ANGLE_OFFSET_DEGREES) * Math.PI) / 180;
    return {
        x: radius * Math.cos(angleRadians),
        y: radius * Math.sin(angleRadians)
    };
}

/**
 * Calculates the center point of an angular range at a given radius
 * @param innerRadius - Inner boundary of the ring
 * @param outerRadius - Outer boundary of the ring
 * @param startAngle - Start angle in degrees
 * @param endAngle - End angle in degrees
 * @returns Object with x and y coordinates of the center point
 */
export function getRingSegmentCenter(
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
): { x: number; y: number } {
    const midRadius = (innerRadius + outerRadius) / 2;
    const midAngle = (startAngle + endAngle) / 2;
    return polarToCartesian(midRadius, midAngle);
}

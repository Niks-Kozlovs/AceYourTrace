import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GRAPHHOPPER_API_KEY;
const GRAPHHOPPER_URL = 'https://graphhopper.com/api/1/route';

export function calculateEndPoint(start, distance, degree) {
    const radians = (Math.PI / 180) * degree;
    const deltaLat = Math.cos(radians) * (distance / 111320);
    const deltaLng = Math.sin(radians) * (distance / (40075000 * Math.cos(start.lat * Math.PI / 180) / 360));
    return { lat: start.lat + deltaLat, lng: start.lng + deltaLng };
}

export function pruneRoute(route, maxDistance) {
    if (!route || !route.instructions) return route;
    const instructions = route.instructions;
    instructions.pop();

    while (instructions.length > 0) {
        const lastInstruction = instructions[instructions.length - 1];
        const newRouteDistance = route.distance - lastInstruction.distance;
        const newDeltaDistance = Math.abs(newRouteDistance - maxDistance);
        const currDeltaDistance = Math.abs(route.distance - maxDistance);

        if (newDeltaDistance >= currDeltaDistance) break;

        instructions.pop();
        route.points.coordinates.splice(
            lastInstruction.interval[0],
            lastInstruction.interval[1] - lastInstruction.interval[0] + 1
        );
        route.distance = newRouteDistance;
        route.time = route.time - lastInstruction.time;
    }
    return route;
}

export async function fetchGraphHopperRoute(points) {
    const pointParams = points.map(p => `point=${p.lat},${p.lng}`).join('&');
    const url = `${GRAPHHOPPER_URL}?${pointParams}&vehicle=foot&key=${API_KEY}&type=json&points_encoded=false`;
    try {
        const response = await axios.get(url);
        return response.data.paths[0];
    } catch (error) {
        console.error("GraphHopper API Error");
        return null;
    }
}
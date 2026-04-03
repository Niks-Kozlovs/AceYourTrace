import express from 'express';
import { calculateEndPoint, pruneRoute, fetchGraphHopperRoute } from '../services/routeService.js';

const router = express.Router();

// Star Routes Logic
router.post('/star', async (req, res) => {
    const { location, distance, routeCount = 4 } = req.body;
    const routePromises = [];
    
    for (let degree = 0; degree < 360; degree += 360 / routeCount) {
        const endPoint = calculateEndPoint(location, distance, degree);
        routePromises.push(fetchGraphHopperRoute([location, endPoint]));
    }
    
    let routes = await Promise.all(routePromises);
    routes = routes.filter(r => r !== null).map(r => pruneRoute(r, distance));
    res.json(routes);
});

// Circular Route Logic
router.post('/circular', async (req, res) => {
    const { location, distance } = req.body;

    const generateCircular = async (magicNumber = 1, depth = 0) => {
        const halfDistance = distance / magicNumber;

        // Calculate the midpoint
        const midPoint = calculateEndPoint(location, halfDistance, 0);

        // Calculate left and right points to form a circular shape
        const leftPoint = calculateEndPoint(midPoint, halfDistance, 90);
        const rightPoint = calculateEndPoint(midPoint, halfDistance, -90);

        const currentRoute = await fetchGraphHopperRoute([location, leftPoint, midPoint, rightPoint, location]);
        if (!currentRoute) {
            throw new Error('Failed to fetch route');
        }

        if (depth > 3) {
        return currentRoute;
        }

        const distanceDiscrepancy = Math.abs(currentRoute.distance - distance);
        const maxAllowedDiscrepancy = distance * 0.05;

        if (distanceDiscrepancy < maxAllowedDiscrepancy) {
        return currentRoute;
        }

        const distanceFactor = currentRoute.distance / distance;
        const newRoute = await generateCircular(magicNumber * distanceFactor, depth + 1);


        const deltaDistanceNewRoutes = Math.abs(distance - newRoute.distance);
        const deltaDistanceCombinedRoute = Math.abs(distance - currentRoute.distance);

        const isCurrentRouteOptimal = deltaDistanceCombinedRoute < deltaDistanceNewRoutes;
        return isCurrentRouteOptimal ? currentRoute : newRoute;
    };

    try {
        const route = await generateCircular();
        res.json(route);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
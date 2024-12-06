const GRAPHHOPPER_API_URL = 'https://graphhopper.com/api/1/route';

export default class RoutingService {
  constructor(settings, apiKey) {
    this.settings = settings;
    this.apiKey = apiKey;
  }

  async generateRoutes(routeCount = 4) {
    const { location, distance } = this.settings;

    const routePromises = [];
    for (let degree = 0; degree < 360; degree += 360 / routeCount) {
      const endPoint = this.calculateEndPoint(location, distance, degree);
      routePromises.push(this.fetchRoute([location, endPoint]));
    }

    const routes = await Promise.all(routePromises);
    routes.forEach(route => {
      return this.pruneRoute(route, distance);
    });
    return routes;
  }

  async generateCircularRoute(magicNumber = 1, depth = 0) {
    const { location, distance } = this.settings;
    const halfDistance = distance / magicNumber;

    // Calculate the midpoint
    const midPoint = this.calculateEndPoint(location, halfDistance, 0);

    // Calculate left and right points to form a circular shape
    const leftPoint = this.calculateEndPoint(midPoint, halfDistance, 90);
    const rightPoint = this.calculateEndPoint(midPoint, halfDistance, -90);

    const currentRoute = await this.fetchRoute([location, leftPoint, midPoint, rightPoint, location]);

    if (depth > 3) {
      return currentRoute;
    }

    const distanceDiscrepancy = Math.abs(currentRoute.distance - this.settings.distance);
    const maxAllowedDiscrepancy = this.settings.distance * 0.1;

    if (distanceDiscrepancy < maxAllowedDiscrepancy) {
      return currentRoute;
    }

    const distanceFactor = currentRoute.distance / this.settings.distance;
    const newRoute = await this.generateCircularRoute(magicNumber * distanceFactor, depth + 1);


    const deltaDistanceNewRoutes = Math.abs(distance - newRoute.distance);
    const deltaDistanceCombinedRoute = Math.abs(distance - currentRoute.distance);

    const isCurrentRouteOptimal = deltaDistanceCombinedRoute < deltaDistanceNewRoutes;
    return isCurrentRouteOptimal ? currentRoute : newRoute;
  }

  calculateEndPoint(start, distance, degree) {
    const radians = (Math.PI / 180) * degree;
    const deltaLat = Math.cos(radians) * (distance / 111320); // Approximate
    const deltaLng = Math.sin(radians) * (distance / (40075000 * Math.cos(start.lat * Math.PI / 180) / 360));
    return {
      lat: start.lat + deltaLat,
      lng: start.lng + deltaLng,
    };
  }

  async fetchRoute(points) {
    const pointParams = points.map(p => `point=${p.lat},${p.lng}`).join('&');
    const url = `${GRAPHHOPPER_API_URL}?${pointParams}&vehicle=foot&key=${this.apiKey}&type=json&points_encoded=false`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.paths && data.paths.length > 0) {
      return data.paths[0];
    }
    return null;
  }

  pruneRoute(route, maxDistance) {
    const instructions = route.instructions;
    route.instructions.pop();

    while (instructions.length > 0) {
      const lastInstruction = instructions[instructions.length - 1];
      const newRouteDistance = route.distance - lastInstruction.distance;
      const newDeltaDistance = Math.abs(newRouteDistance - maxDistance);
      const currDeltaDistance = Math.abs(route.distance - maxDistance);

      if (newDeltaDistance >= currDeltaDistance) {
        break;
      }

      instructions.pop();
      route.points.coordinates.splice(
        lastInstruction.interval[0],
        lastInstruction.interval[1] - lastInstruction.interval[0] + 1
      );
      route.distance = newRouteDistance;
      route.time = route.time - lastInstruction.time;
    }
  }
}
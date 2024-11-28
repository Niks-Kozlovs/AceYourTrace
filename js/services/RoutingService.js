import { getBoundingBox } from '../util/GeoUtils.js';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const GRAPHHOPPER_API_URL = 'https://graphhopper.com/api/1/route';

export default class RoutingService {
  constructor(settings, apiKey) {
    this.settings = settings;
    this.apiKey = apiKey;
  }

  // async fetchNearbyPoints(location, distance) {
  //   const bbox = getBoundingBox(location, distance / 2).join(',');
  //   const query = `
  //     [out:json];
  //     (way["highway"](${bbox}); node(w););
  //     out geom;
  //   `;
  //   const url = `${OVERPASS_API_URL}?data=${encodeURIComponent(query)}`;
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   return data.elements.filter(el => el.type === 'node').map(el => ({
  //     lat: el.lat,
  //     lng: el.lon,
  //   }));
  // }

  async generateRoutes(routeCount) {
    const { location, distance } = this.settings;
    // const nearbyPoints = await this.fetchNearbyPoints(location, distance);

    const routePromises = [];
    for (let degree = 0; degree < 360; degree += 360/routeCount) {
      const endPoint = this.calculateEndPoint(location, distance, degree);
      routePromises.push(this.fetchRoute([location, endPoint]));
    }

    const routes = await Promise.all(routePromises);
    return routes.filter(route => route !== null);
  }

  //Moves a point a certain distance in a certain direction
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
}
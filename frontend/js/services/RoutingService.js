const BACKEND_URL = './api/routes';

export default class RoutingService {
  constructor(settings) {
    this.settings = settings;
  }

  async generateRoutes(routeCount = 4) {
    const response = await fetch(`${BACKEND_URL}/star`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: { lat: this.settings.location.lat, lng: this.settings.location.lng },
        distance: this.settings.distance,
        routeCount
      })
    });
    return await response.json();
  }

  async generateCircularRoute() {
    const response = await fetch(`${BACKEND_URL}/circular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: { lat: this.settings.location.lat, lng: this.settings.location.lng },
        distance: this.settings.distance
      })
    });
    return await response.json();
  }
}
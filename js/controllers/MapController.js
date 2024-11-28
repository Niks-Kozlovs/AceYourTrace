export default class MapController {
    static OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    static OSM_ATTRIBUTION = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

    constructor(settings) {
        this.settings = settings;
        this.map = L.map('map').setView(this.settings.location, 12);
        this.marker = null;

        L.tileLayer(
            MapController.OSM_URL,
            {
                maxZoom: 18,
                attribution: MapController.OSM_ATTRIBUTION
            },
        ).addTo(this.map);

        this.map.on('click', this.onMapClick.bind(this));
    }

    centerView() {
        this.map.setView(this.settings.location, 12);
    }

    updateMapView() {
        if (this.marker) {
            this.map.removeLayer(this.marker);
        }
        this.marker = L.marker(this.settings.location).addTo(this.map);
    }

    onMapClick(event) {
        if (this.settings.isMapInteractable === false) {
            return;
        }

        this.settings.location = event.latlng;
        this.updateMapView();
    }

    addRoute(route) {
        const routeLayer = L.polyline(route.coordinates, { color: 'blue' }).addTo(this.map);
        routeLayer.on('click', () => {
          this.settings.setSelectedRoute(route);
        });
    }
}
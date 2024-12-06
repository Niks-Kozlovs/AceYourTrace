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

    removeLocationMarker() {
        if (this.marker) {
            this.map.removeLayer(this.marker);
        }
    }

    removeRoutes() {
        this.map.eachLayer(layer => {
            if (layer instanceof L.Polyline) {
                this.map.removeLayer(layer);
            }
        });
    }

    updateMapView() {
        this.removeLocationMarker();
        this.marker = L.marker(this.settings.location).addTo(this.map);
    }

    onMapClick(event) {
        this.settings.location = event.latlng;
        this.updateMapView();
    }

    addRoute(route, index) {
        const coordinates = route.points.coordinates.map(coord => [coord[1], coord[0]]);
        const offset = index * 0.0001;
        const offsetCoordinates = coordinates.map(coord => [coord[0] + offset, coord[1] + offset]);
        const routeLayer = L.polyline(offsetCoordinates, {
            color: this.getRouteColor(index),
            weight: 5,
            opacity: 0.7,
            smoothFactor: 1
        }).addTo(this.map);

        const distanceKm = (route.distance / 1000).toFixed(2);
        const timeMinutes = Math.round(route.time / 60000);
        const popup = routeLayer.bindPopup(
            `
            <b>Route Info:</b><br>
            Distance: ${distanceKm} km<br>
            Time: ${timeMinutes} min<br>
            `,
            {
                className: 'route-popup',
                closeButton: false
            },
        );

        routeLayer.on('click', () => {
            console.log('Route clicked');
        });

        routeLayer.on('mouseover', () => {
            popup.openPopup();
            routeLayer.setStyle({ color: '#4a80f5', weight: 7 });
        });
        routeLayer.on('mouseout', () => {
            popup.closePopup();
            routeLayer.setStyle({ color: this.getRouteColor(index), weight: 5 });
        });
    }

    addRoutes(routes) {
        routes.forEach((route, index) => this.addRoute(route, index));
    }

    getRouteColor(index) {
        const colors = ['blue', 'red', 'green', 'orange', 'purple'];
        return colors[index % colors.length];
    }
}
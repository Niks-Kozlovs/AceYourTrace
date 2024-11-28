export default class UIController {
    constructor(settings, mapController, routingService) {
        this.settings = settings;
        this.mapController = mapController;
        this.routingService = routingService;
        this.bindEvents();
        this.setInitialValues();
    }

    bindEvents() {
        document.getElementById('distanceInput').addEventListener('change', this.onDistanceChange.bind(this));
        document.getElementById('typeInput').addEventListener('change', this.onTypeChange.bind(this));
        document.getElementById('getLocationBtn').addEventListener('click', this.onGetLocation.bind(this));
        this.settings.addEventListener('locationChanged', this.onLocationSet.bind(this));
    }

    setInitialValues() {
        const initialValue = document.getElementById('distanceInput').value
        const initialType = document.getElementById('typeInput').value;
        this.settings.value = initialValue;
        this.settings.type = initialType;
    }

    onDistanceChange(event) {
        const distance = parseInt(event.target.value) * 1000;
        this.settings.setValue(distance);
    }

    onTypeChange(event) {
        const type = event.target.value;
        this.settings.setType(type);
    }

    async onGetLocation() {
        if ("geolocation" in navigator === false) {
            document.getElementById('error').textContent = "Geolocation not available";
            return;
        }

        navigator.geolocation.getCurrentPosition(this.onLocationResolved, this.onLocationRejected);
    }

    onLocationResolved(position) {
        const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
        this.settings.location = latlng;
        this.mapController.updateMapView();
        this.mapController.centerView();
    }

    onLocationRejected(error) {
        if (error.code == error.PERMISSION_DENIED) {
            document.getElementById('error').textContent = "Location denied by user";
        } else {
            document.getElementById('error').textContent = error.message;
        }

        console.error('Geolocation error:', error);
    }

    onLocationSet() {
        const actionButton = document.getElementById('actionButton');
        actionButton.disabled = false;
        actionButton.textContent = 'Preview Routes';
        actionButton.addEventListener('click', this.onPreviewClicked.bind(this), { once: true });
    }

    async onPreviewClicked() {
        const actionButton = document.getElementById('actionButton');
        actionButton.disabled = true;
        actionButton.textContent = 'Generating Routes...';

        this.settings.isMapInteractable = false;
        this.mapController.removeLocationMarker();

        const routes = await this.routingService.generateRoutes(4);
        actionButton.disabled = false;
        actionButton.textContent = 'Preview Routes';

        this.mapController.addRoutes(routes);
    }
}
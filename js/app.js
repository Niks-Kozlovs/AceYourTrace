import Settings from './models/Settings.js';
import MapController from './controllers/MapController.js';
import RoutingService from './services/RoutingService.js';
import UIController from './controllers/UIController.js';



document.addEventListener('DOMContentLoaded', () => {
    const settings = new Settings();
    const mapController = new MapController(settings);
    const routingService = new RoutingService('90827c9d-80ff-4c73-9e12-f26f3862106e');
    const uiController = new UIController(settings, mapController, routingService);
});
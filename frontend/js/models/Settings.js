export default class Settings {
    constructor() {
      this.value = 1;
      this.type = 'KM';
      this.trip = 'a-to-b';
      this._location = L.latLng(56.5033914, 21.0085047);
      this.listeners = [];
    }

    get distance() {
        if (this.type === 'KM') {
            return this.value * 1000;
        } else {
            return this.value * 5 * 1000;
        }
    }

    get distanceKM() {
        return (this.distance / 1000).toFixed(2);
    }


    set location(location) {
        this._location = location;
        this.notifyListeners('locationChanged');
    }

    get location() {
        return this._location;
    }

    addEventListener(type, listener) {
      this.listeners.push({ type, listener });
    }

    notifyListeners(sourceType) {
      this.listeners.forEach(({ type, listener }) => {
        if (type === sourceType) {
          listener(this.location);
        }
      });
    }
}
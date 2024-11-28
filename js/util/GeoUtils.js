const EARTH_RADIUS = 6378137; //In meters

export function addToLat(lat, distance) {
    const deltaLat = distance / EARTH_RADIUS;
    return lat + (deltaLat * (180 / Math.PI));
}

export function addToLon(lat, lng, distance) {
    const deltaLon = distance / (EARTH_RADIUS * Math.cos(Math.PI * lat / 180));
    return lng + (deltaLon * (180 / Math.PI));
}

export function getBoundingBox(point, distance) {
    return {
        south: addToLat(point.lat, -distance),
        west: addToLon(point.lat, point.lng, -distance),
        north: addToLat(point.lat, distance),
        east: addToLon(point.lat, point.lng, distance)
    };
}
export type LocationStatus = 'idle' | 'detecting' | 'found' | 'denied' | 'unavailable' | 'error';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ResolvedLocation {
  coords: GeoLocation;
  displayName: string;
  area?: string;
}

const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

export async function getCurrentPosition(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error('Location permission was denied. You can enter your location manually.'));
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          reject(new Error('Location information is unavailable. Try entering your location manually.'));
        } else if (err.code === err.TIMEOUT) {
          reject(new Error('Location request timed out. Try again or enter your location manually.'));
        } else {
          reject(new Error('Could not determine your location.'));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
}

export async function reverseGeocode(coords: GeoLocation): Promise<ResolvedLocation> {
  try {
    const url = `${REVERSE_GEOCODE_URL}?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();

    const parts: string[] = [];
    const addr = data.address || {};
    if (addr.suburb) parts.push(addr.suburb);
    if (addr.neighbourhood) parts.push(addr.neighbourhood);
    if (addr.city) parts.push(addr.city);
    else if (addr.town) parts.push(addr.town);
    else if (addr.village) parts.push(addr.village);
    if (addr.state) parts.push(addr.state);
    if (addr.country) parts.push(addr.country);

    const displayName = parts.length > 0 ? parts.join(', ') : data.display_name || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
    const area = [addr.city || addr.town || addr.village, addr.state, addr.country].filter(Boolean).join(', ');

    return { coords, displayName, area: area || displayName };
  } catch {
    return {
      coords,
      displayName: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
      area: undefined,
    };
  }
}

export async function detectLocation(): Promise<ResolvedLocation> {
  const coords = await getCurrentPosition();
  return reverseGeocode(coords);
}

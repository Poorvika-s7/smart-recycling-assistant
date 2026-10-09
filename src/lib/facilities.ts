import type { GeoLocation } from './geolocation';

export interface Facility {
  name: string;
  address: string;
  distance?: string;
  types: string[];
  category: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  verified: boolean;
}

const CATEGORY_SEARCH_TERMS: Record<string, string[]> = {
  Plastic: ['plastic recycling center', 'plastic waste collection'],
  Paper: ['paper recycling center', 'waste paper collection'],
  Cardboard: ['cardboard recycling', 'paper recycling center'],
  Glass: ['glass recycling center', 'glass bottle bank'],
  Metal: ['scrap metal dealer', 'metal recycling center'],
  'Organic Waste': ['composting facility', 'organic waste collection'],
  'Electronic Waste': ['e-waste collection center', 'electronics recycling'],
  Batteries: ['battery collection point', 'battery recycling center'],
  'Medical Waste': ['medical waste disposal', 'biomedical waste collection'],
  'Hazardous Waste': ['hazardous waste collection facility', 'household hazardous waste disposal'],
  Textile: ['textile recycling bin', 'clothes collection point'],
  Unknown: ['recycling center', 'waste collection center'],
};

export function getSearchTermsForCategory(category: string): string[] {
  return CATEGORY_SEARCH_TERMS[category] || CATEGORY_SEARCH_TERMS.Unknown;
}

export function buildGoogleMapsSearchUrl(query: string, location: GeoLocation): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location.latitude},${location.longitude},14z`;
}

export function buildGoogleMapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function buildGoogleMapsDirectionsUrlForQuery(query: string, location: GeoLocation): string {
  const ll = `${location.latitude},${location.longitude}`;
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}?ll=${ll}`;
}

export interface FacilitySearchResult {
  facilities: Facility[];
  hasApiAccess: boolean;
  message?: string;
}

export async function searchNearbyFacilities(
  category: string,
  location: GeoLocation,
  radiusKm: number
): Promise<FacilitySearchResult> {
  const searchTerms = getSearchTermsForCategory(category);
  const primaryQuery = searchTerms[0];

  // No Google Maps API key is available in this environment.
  // We provide a Google Maps search link instead of fabricating facilities.
  return {
    facilities: [],
    hasApiAccess: false,
    message: `No facility API is configured. Use the "Open in Google Maps" button below to search for nearby ${category.toLowerCase()} disposal centres using your current location.`,
  };
}

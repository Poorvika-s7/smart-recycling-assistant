import type { GeoLocation } from './geolocation';

export interface Facility {
  name: string;
  address: string;
  distance?: string;
  distanceKm?: number;
  types: string[];
  category: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  verified: boolean;
  rating?: number;
  openingHours?: string[];
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

export interface FacilitySearchResult {
  facilities: Facility[];
  hasApiAccess: boolean;
  apiError?: boolean;
  message?: string;
}

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recycle-ai`;

export async function searchNearbyFacilities(
  category: string,
  location: GeoLocation,
  radiusKm: number,
): Promise<FacilitySearchResult> {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'search_facilities',
        category,
        lat: location.latitude,
        lng: location.longitude,
        radius_km: radiusKm,
      }),
    });

    if (!response.ok) {
      return {
        facilities: [],
        hasApiAccess: false,
        message: `Search failed (server error ${response.status}). You can still use the Google Maps link below to search manually.`,
      };
    }

    const data = await response.json();

    if (data.error) {
      return {
        facilities: [],
        hasApiAccess: false,
        message: data.error,
      };
    }

    return {
      facilities: data.facilities || [],
      hasApiAccess: data.hasApiAccess ?? false,
      apiError: data.apiError ?? false,
      message: data.message,
    };
  } catch {
    return {
      facilities: [],
      hasApiAccess: false,
      message: 'Could not reach the server for facility search. You can still use the Google Maps link below to search manually.',
    };
  }
}

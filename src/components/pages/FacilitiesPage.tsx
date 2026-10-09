import { useState, useCallback, useEffect } from 'react';
import { MapPin, Loader2, Check, AlertCircle, Navigation, Search, ExternalLink, Radio, Star, Clock, MapPin as MapPinIcon } from 'lucide-react';
import LocationBar from '@/components/LocationBar';
import { buildGoogleMapsSearchUrl, getSearchTermsForCategory, searchNearbyFacilities, type FacilitySearchResult, type Facility } from '@/lib/facilities';
import type { ResolvedLocation } from '@/lib/geolocation';

type Page = 'home' | 'scanner' | 'chat' | 'dashboard' | 'history' | 'about' | 'facilities';

interface Props {
  onNavigate: (page: Page) => void;
  initialCategory?: string;
}

const CATEGORY_LIST = [
  'Plastic', 'Paper', 'Cardboard', 'Glass', 'Metal', 'Organic Waste',
  'Electronic Waste', 'Batteries', 'Medical Waste', 'Hazardous Waste', 'Textile',
];

const RADII = [5, 10, 20];

export default function FacilitiesPage({ onNavigate, initialCategory }: Props) {
  const [resolvedLocation, setResolvedLocation] = useState<ResolvedLocation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [radius, setRadius] = useState(5);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<FacilitySearchResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleLocationDetected = useCallback((loc: ResolvedLocation) => {
    setResolvedLocation(loc);
  }, []);

  const handleManualLocation = useCallback((loc: string) => {
    setResolvedLocation({ coords: { latitude: 0, longitude: 0 }, displayName: loc, area: loc });
  }, []);

  const handleSearch = useCallback(async (cat?: string, loc?: ResolvedLocation | null, rad?: number) => {
    const category = cat ?? selectedCategory;
    const location = loc ?? resolvedLocation;
    const searchRadius = rad ?? radius;

    if (!location || !category) return;

    // Skip real search if location is manual (0,0 coords)
    const isManualLocation = location.coords.latitude === 0 && location.coords.longitude === 0;

    setSearching(true);
    setHasSearched(true);

    let result: FacilitySearchResult;
    if (isManualLocation) {
      result = {
        facilities: [],
        hasApiAccess: false,
        message: 'Manual location does not provide coordinates for facility search. Use the Google Maps link below to search manually, or detect your GPS location for automatic results.',
      };
    } else {
      result = await searchNearbyFacilities(category, location.coords, searchRadius);
    }

    setSearchResult(result);
    setSearching(false);
  }, [selectedCategory, resolvedLocation, radius]);

  const mapsUrl = resolvedLocation && selectedCategory
    ? buildGoogleMapsSearchUrl(getSearchTermsForCategory(selectedCategory)[0], resolvedLocation.coords)
    : null;

  const renderFacility = (facility: Facility, i: number) => (
    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 truncate">{facility.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{facility.address}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {facility.verified ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Check className="w-3 h-3" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
              Unverified
            </span>
          )}
          {facility.rating !== undefined && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {facility.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {facility.distance && (
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          {facility.distance} away
        </p>
      )}

      {facility.types.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {facility.types.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
              {t.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {facility.openingHours && facility.openingHours.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Opening Hours
          </p>
          <div className="text-xs text-gray-600 space-y-0.5">
            {facility.openingHours.map((h) => (
              <p key={h}>{h}</p>
            ))}
          </div>
        </div>
      )}

      {facility.lat && facility.lng && (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </a>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-3">
          <MapPin className="w-4 h-4" />
          Nearby Disposal Centres
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Find Recycling Facilities Near You</h1>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Select your waste category and detect your location to find nearby disposal and recycling centres.
        </p>
      </div>

      {/* Location */}
      <div className="mb-6">
        <LocationBar
          onLocationDetected={handleLocationDetected}
          onManualLocation={handleManualLocation}
        />
      </div>

      {/* Category + radius selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waste Category
            {initialCategory && (
              <span className="ml-2 text-xs text-emerald-600 font-normal">
                (from your scan: {initialCategory})
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Radius
          </label>
          <div className="flex gap-2">
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  radius === r
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleSearch()}
          disabled={!resolvedLocation || !selectedCategory || searching}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {searching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching for facilities...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Find Facilities
            </>
          )}
        </button>

        {!resolvedLocation && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Please detect your location or enter it manually to search.
          </p>
        )}
      </div>

      {/* Search results */}
      {hasSearched && searchResult && !searching && (
        <div className="animate-slide-up space-y-4">
          {searchResult.facilities.length > 0 ? (
            <>
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Check className="w-4 h-4" />
                Found {searchResult.facilities.length} facilit{searchResult.facilities.length === 1 ? 'y' : 'ies'} within {radius} km
              </div>
              {searchResult.facilities.map((facility, i) => renderFacility(facility, i))}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {searchResult.hasApiAccess
                      ? 'No facilities found in this area'
                      : 'Facility search not available'}
                  </h3>
                  <p className="text-sm text-gray-600">{searchResult.message}</p>
                </div>
              </div>

              {mapsUrl && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-sm text-gray-700 mb-3">
                    You can search Google Maps directly for nearby disposal centres that accept{' '}
                    <strong>{selectedCategory}</strong>
                    {resolvedLocation?.area && <> near <strong>{resolvedLocation.area}</strong></>}:
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                </div>
              )}

              {!searchResult.hasApiAccess && (
                <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 flex items-start gap-2">
                  <Radio className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    To enable automatic facility search with real data, add a Google Maps API key
                    with the Places API (New) enabled as the secret <code className="font-mono font-bold">GOOGLE_MAPS_API_KEY</code> in your
                    Supabase Edge Function secrets. Without it, the Google Maps link above is the
                    recommended way to find nearby centres.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Wider search suggestion */}
          {searchResult.facilities.length === 0 && radius < 20 && (
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-gray-500">Try a wider search radius:</span>
              {RADII.filter((r) => r > radius).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRadius(r); handleSearch(selectedCategory, resolvedLocation, r); }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                >
                  {r} km
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick link to scanner */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-2">Not sure what category your waste is?</p>
        <button
          onClick={() => onNavigate('scanner')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-emerald-700 font-medium text-sm hover:bg-emerald-50 transition-colors"
        >
          <Search className="w-4 h-4" />
          Scan your waste first
        </button>
      </div>
    </div>
  );
}

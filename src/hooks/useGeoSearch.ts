import { useEffect, useRef, useState } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

export interface GeocodeResult {
  id: string;
  lat: number;
  lng: number;
  displayName: string;
}

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;

// A single shared provider instance. leaflet-geosearch supports swapping
// this for GoogleProvider / MapboxProvider / BingProvider / etc. later
// without touching any calling code.
const provider = new OpenStreetMapProvider({
  params: {
    addressdetails: 0,
    limit: 6,
  },
});

/**
 * Debounced address / city / place / landmark search, backed by
 * leaflet-geosearch's OpenStreetMapProvider (Nominatim under the hood).
 * Used headlessly — no GeoSearchControl / default UI is mounted.
 */
export function useGeosearch(query: string) {
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmed = query.trim();
  const queryTooShort = trimmed.length < MIN_QUERY_LENGTH;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (queryTooShort) return;

    debounceRef.current = setTimeout(async () => {
      const thisRequestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const raw = await provider.search({ query: trimmed });

        // Ignore stale responses if a newer search has since started.
        if (thisRequestId !== requestIdRef.current) return;

        setResults(
          raw.map((r) => ({
            id: `${r.x},${r.y},${r.label}`,
            lat: r.y,
            lng: r.x,
            displayName: r.label,
          }))
        );
      } catch {
        if (thisRequestId !== requestIdRef.current) return;
        setError('Could not search for that location. Try again.');
        setResults([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [queryTooShort, trimmed]);

  if (queryTooShort) {
    return { results: [], loading: false, error: null };
  }
  return { results, loading, error };
}
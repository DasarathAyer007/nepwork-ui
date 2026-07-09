import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
// Side-effect import: attaches the `L.Routing` namespace to the shared
// leaflet module. We only ever use the headless L.Routing.osrmv1 router
// below — L.Routing.control (the one that injects its own itinerary panel
// UI) is never instantiated.
import 'leaflet-routing-machine';

export type RoutingProfile = 'driving' | 'walking' | 'cycling';

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface RouteResult {
  /** [lat, lng] pairs, ready to feed straight into a Leaflet Polyline */
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
}

interface UseRouteReturn {
  route: RouteResult | null;
  loading: boolean;
  error: string | null;
}

// leaflet-routing-machine's OSRMv1 router expects the *service root*
// (it appends /route/v1/{profile}/... itself), unlike a raw OSRM fetch URL.
const OSRM_SERVICE_URL = 'https://router.project-osrm.org/route/v1';

function coordsKey(p: RoutePoint | null) {
  return p ? `${p.lat.toFixed(6)},${p.lng.toFixed(6)}` : 'null';
}

/**
 * Computes a route between two points using leaflet-routing-machine's
 * headless OSRMv1 router (no L.Routing.control / built-in UI involved),
 * and returns a polyline-ready coordinate list, distance and duration.
 * Pass `null` for either point to clear/skip routing — the caller decides
 * *when* start/end become non-null (e.g. only after an explicit
 * "Get Directions" confirmation).
 */
export function useRoute(
  start: RoutePoint | null,
  end: RoutePoint | null,
  profile: RoutingProfile = 'driving'
): UseRouteReturn {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const hasBothPoints = !!start && !!end;

  useEffect(() => {
    if (!start || !end) return;

    const thisRequestId = ++requestIdRef.current;
    // Kicking off the fetch: synchronously flipping into the loading state
    // here is the standard "fetch in an effect" pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    const router = L.Routing.osrmv1({
      serviceUrl: OSRM_SERVICE_URL,
      profile,
    });

    const waypoints = [
      L.Routing.waypoint(L.latLng(start.lat, start.lng)),
      L.Routing.waypoint(L.latLng(end.lat, end.lng)),
    ];

    router.route(waypoints, (err, routes) => {
      // Ignore stale callbacks if a newer request has since started.
      if (thisRequestId !== requestIdRef.current) return;

      if (err || !routes?.length) {
        setError(err?.message ?? 'No route could be found between these points.');
        setRoute(null);
        setLoading(false);
        return;
      }

      const best = routes[0];
      const coordinates: [number, number][] = best.coordinates.map((ll) => [ll.lat, ll.lng]);

      setRoute({
        coordinates,
        distanceKm: best.summary.totalDistance / 1000,
        durationMin: best.summary.totalTime / 60,
      });
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordsKey(start), coordsKey(end), profile]);

  if (!hasBothPoints) {
    return { route: null, loading: false, error: null };
  }
  return { route, loading, error };
}
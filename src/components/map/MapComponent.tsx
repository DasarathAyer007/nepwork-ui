import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, MapPin, X } from 'lucide-react';
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import { useGeolocation } from '@/hooks/useGeolocation';
import type { GeocodeResult } from '@/hooks/useGeoSearch';
import { type RoutePoint, type RoutingProfile, useRoute } from '@/hooks/useRoute';
import CurrentLocationButton from './CurrentLocationButton';
import DirectionsPanel from './DirectionsPanel';
import LocationSearchBox from './LocationSearchBox';
import { currentLocationIcon, destinationIcon, startPointIcon } from './MapIcons';

const FALLBACK_CENTER: [number, number] = [27.7, 85.3]; // Kathmandu
const ROUTE_LINE_COLOR = 'var(--color-primary)';

type StartPointSource = 'search' | 'map-click' | 'current-location';

interface StartPoint {
  lat: number;
  lng: number;
  label: string;
  source: StartPointSource;
}

export interface MapComponentProps {
  latitude: number | null;
  longitude: number | null;
  radiusKm?: number | null;
  /** Presence of this prop implies interactive mode unless `interactive` overrides it. */
  onSelect?: (lat: number, lng: number) => void;
  height?: number | string;
  label?: string;
  address?: string;
  showExpandButton?: boolean;
  /**
   * Explicit override for interaction mode. Defaults to `!!onSelect`.
   * Regardless of this flag, zoom/pan/touch gestures always stay enabled —
   * only "changing the core/destination location" is gated by this prop.
   */
  interactive?: boolean;
  /** Show the address/place search box. Defaults to true. */
  enableSearch?: boolean;
  /** Show the "use my current location" control. Defaults to true. */
  enableCurrentLocation?: boolean;
  /** Show the directions feature (non-interactive mode only). Defaults to true. */
  enableRouting?: boolean;
  routingProfile?: RoutingProfile;
  /**
   * Show the search box / current-location button in the non-expanded
   * (inline) view. Defaults to false — those controls only surface once
   * the map is expanded. Has no effect on the expanded (dialog) view,
   * where they're always shown.
   */
  showControlsWhenCollapsed?: boolean;
}

// ---------------------------------------------------------------------------
// Leaflet-context helper components (must live inside <MapContainer>)
// ---------------------------------------------------------------------------

function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Interactive mode only: flies the camera to the destination whenever it changes. */
function RecenterOnChange({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (latitude != null && longitude != null) {
      map.flyTo([latitude, longitude], Math.max(map.getZoom(), 13), {
        animate: true,
        duration: 0.75,
      });
    }
  }, [latitude, longitude, map]);
  return null;
}

/** Non-interactive mode only: flies to a newly picked start point, then fits
 * the map to the full route once directions are confirmed and computed. */
function FitRouteBounds({
  startPoint,
  destination,
  routeCoordinates,
}: {
  startPoint: RoutePoint | null;
  destination: RoutePoint | null;
  routeCoordinates: [number, number][] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 1) {
      map.fitBounds(L.latLngBounds(routeCoordinates), { padding: [48, 48] });
    } else if (startPoint) {
      map.flyTo([startPoint.lat, startPoint.lng], Math.max(map.getZoom(), 13), {
        animate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCoordinates, startPoint?.lat, startPoint?.lng, destination?.lat, destination?.lng]);

  return null;
}

// ---------------------------------------------------------------------------
// Map view (the actual Leaflet map + markers/route, no surrounding chrome)
// ---------------------------------------------------------------------------

interface MapViewInnerProps {
  latitude: number | null;
  longitude: number | null;
  radiusKm?: number | null;
  height: number | string;
  label?: string;
  isInteractive: boolean;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerDrag: (lat: number, lng: number) => void;
  pendingStart: StartPoint | null;
  routeCoordinates: [number, number][] | null;
}

function MapViewInner({
  latitude,
  longitude,
  radiusKm,
  height,
  label,
  isInteractive,
  onMapClick,
  onMarkerDrag,
  pendingStart,
  routeCoordinates,
}: MapViewInnerProps) {
  const center: [number, number] =
    latitude != null && longitude != null ? [latitude, longitude] : FALLBACK_CENTER;

  const destination: RoutePoint | null =
    latitude != null && longitude != null ? { lat: latitude, lng: longitude } : null;

  return (
    <MapContainer
      center={center}
      zoom={12}
      // Zoom, pan and touch gestures always stay usable — interaction mode
      // only governs whether the *core/destination location* can change.
      scrollWheelZoom
      dragging
      touchZoom
      doubleClickZoom
      // Default position (top-left) is exactly where we want it — search box
      // is top-right, current-location is bottom-right, expand button is
      // bottom-left, so top-left is free for Leaflet's native zoom control.
      zoomControl
      style={{ height, width: '100%', borderRadius: 'var(--radius)', zIndex: 0 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Always mounted: in interactive mode a click moves the destination;
          in non-interactive mode a click sets/updates the start point. */}
      <ClickHandler onSelect={onMapClick} />

      {isInteractive && <RecenterOnChange latitude={latitude} longitude={longitude} />}
      {!isInteractive && (
        <FitRouteBounds
          startPoint={pendingStart}
          destination={destination}
          routeCoordinates={routeCoordinates}
        />
      )}

      {latitude != null && longitude != null && (
        <>
          <Marker
            position={[latitude, longitude]}
            icon={destinationIcon}
            draggable={isInteractive}
            eventHandlers={
              isInteractive
                ? {
                    dragend: (e) => {
                      const pos = e.target.getLatLng();
                      onMarkerDrag(pos.lat, pos.lng);
                    },
                  }
                : undefined
            }>
            {label && <Popup>{label}</Popup>}
          </Marker>
          {radiusKm != null && radiusKm > 0 && (
            <Circle
              center={[latitude, longitude]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: ROUTE_LINE_COLOR,
                fillColor: 'var(--color-primary-container)',
                fillOpacity: 0.2,
                weight: 1.5,
              }}
            />
          )}
        </>
      )}

      {!isInteractive && pendingStart && (
        <Marker
          position={[pendingStart.lat, pendingStart.lng]}
          icon={pendingStart.source === 'current-location' ? currentLocationIcon : startPointIcon}>
          <Popup>{pendingStart.label}</Popup>
        </Marker>
      )}

      {!isInteractive && routeCoordinates && routeCoordinates.length > 1 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: ROUTE_LINE_COLOR,
            weight: 4,
            opacity: 0.85,
          }}
        />
      )}
    </MapContainer>
  );
}

// ---------------------------------------------------------------------------
// Overlay chrome (search box / current-location button / directions panel),
// rendered on top of the map, outside the Leaflet context.
// ---------------------------------------------------------------------------

interface MapOverlayControlsProps {
  isInteractive: boolean;
  /** True only when this instance is the expanded (dialog) view. */
  isExpandedView: boolean;
  /** Show search/current-location even when not expanded. */
  showControlsWhenCollapsed: boolean;
  enableSearch: boolean;
  enableCurrentLocation: boolean;
  enableRouting: boolean;
  onSearchSelect: (result: GeocodeResult) => void;
  onUseCurrentLocation: () => void;
  geoLoading: boolean;
  geoError: string | null;
  geoUnsupported: boolean;
  pendingStart: StartPoint | null;
  isRouteConfirmed: boolean;
  onConfirmDirections: () => void;
  onClearStart: () => void;
  route: { distanceKm: number; durationMin: number } | null;
  routeLoading: boolean;
  routeError: string | null;
}

function MapOverlayControls({
  isInteractive,
  isExpandedView,
  showControlsWhenCollapsed,
  enableSearch,
  enableCurrentLocation,
  enableRouting,
  onSearchSelect,
  onUseCurrentLocation,
  geoLoading,
  geoError,
  geoUnsupported,
  pendingStart,
  isRouteConfirmed,
  onConfirmDirections,
  onClearStart,
  route,
  routeLoading,
  routeError,
}: MapOverlayControlsProps) {
  const showLocationControls = isExpandedView || showControlsWhenCollapsed;
  const showSearch = enableSearch && showLocationControls;
  const showCurrentLocation = enableCurrentLocation && showLocationControls;

  const showDirectionsPanel = !isInteractive && enableRouting && pendingStart != null;

  return (
    <>
      {showSearch && (
        // Fixed width (not a shrink-to-fit flex item) so the dropdown
        // beneath it renders at a sane, predictable width.
        <div className="absolute top-3 right-3 z-[400] w-72 max-w-[calc(100vw-5.5rem)]">
          <LocationSearchBox
            placeholder={
              isInteractive
                ? 'Search for an address, city, or place'
                : 'Search a starting location'
            }
            onSelect={onSearchSelect}
          />
        </div>
      )}

      {(showDirectionsPanel || showCurrentLocation) && (
        // left-14 keeps this row clear of the expand/maximize button, which
        // is anchored separately at bottom-3 left-3.
        <div className="absolute bottom-3 left-16 right-3 z-[400] flex items-end gap-2">
          <div className="flex-1 min-w-0">
            {showDirectionsPanel && pendingStart && (
              <DirectionsPanel
                mode={isRouteConfirmed ? 'route' : 'confirm'}
                pointLabel={pendingStart.label}
                onConfirm={onConfirmDirections}
                distanceKm={route?.distanceKm}
                durationMin={route?.durationMin}
                loading={routeLoading}
                error={routeError}
                onClear={onClearStart}
              />
            )}
          </div>
          {showCurrentLocation && (
            <CurrentLocationButton
              onClick={onUseCurrentLocation}
              loading={geoLoading}
              disabled={geoUnsupported}
              errored={!!geoError}
              label={isInteractive ? 'Use current location' : 'Use current location as start'}
              className="shrink-0"
            />
          )}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MapComponent({
  latitude,
  longitude,
  radiusKm,
  onSelect,
  height = 260,
  label,
  address,
  showExpandButton,
  interactive,
  enableSearch = true,
  enableCurrentLocation = true,
  enableRouting = true,
  routingProfile = 'driving',
  showControlsWhenCollapsed = false,
}: MapComponentProps) {
  const isInteractive = interactive ?? !!onSelect;

  const [pendingStart, setPendingStart] = useState<StartPoint | null>(null);
  const [confirmedOrigin, setConfirmedOrigin] = useState<RoutePoint | null>(null);

  const geolocation = useGeolocation();
  const geoIntentRef = useRef<'destination' | 'start' | null>(null);
  const [geoRequestId, setGeoRequestId] = useState(0);

  const destination: RoutePoint | null =
    latitude != null && longitude != null ? { lat: latitude, lng: longitude } : null;

  const {
    route,
    loading: routeLoading,
    error: routeError,
  } = useRoute(
    !isInteractive && enableRouting ? confirmedOrigin : null,
    destination,
    routingProfile
  );

  // Sets/replaces the start point and always resets any previously
  // confirmed route — the user must press "Get Directions" again for a
  // newly picked point.
  const updatePendingStart = useCallback((point: StartPoint) => {
    setPendingStart(point);
    setConfirmedOrigin(null);
  }, []);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (isInteractive) {
        onSelect?.(lat, lng);
      } else {
        updatePendingStart({
          lat,
          lng,
          label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          source: 'map-click',
        });
      }
    },
    [isInteractive, onSelect, updatePendingStart]
  );

  const handleMarkerDrag = useCallback(
    (lat: number, lng: number) => {
      if (!isInteractive) return; // destination is never draggable outside interactive mode
      onSelect?.(lat, lng);
    },
    [isInteractive, onSelect]
  );

  const handleSearchSelect = useCallback(
    (result: GeocodeResult) => {
      if (isInteractive) {
        onSelect?.(result.lat, result.lng);
      } else {
        updatePendingStart({
          lat: result.lat,
          lng: result.lng,
          label: result.displayName,
          source: 'search',
        });
      }
    },
    [isInteractive, onSelect, updatePendingStart]
  );

  const handleUseCurrentLocation = useCallback(() => {
    geoIntentRef.current = isInteractive ? 'destination' : 'start';
    setGeoRequestId((n) => n + 1);
    geolocation.requestLocation();
  }, [isInteractive, geolocation]);

  useEffect(() => {
    if (geoRequestId === 0) return;
    if (geolocation.loading) return;
    if (geolocation.lat == null || geolocation.lng == null) return;
    const intent = geoIntentRef.current;
    if (!intent) return;

    geoIntentRef.current = null;

    if (intent === 'destination') {
      onSelect?.(geolocation.lat, geolocation.lng);
    } else {
      updatePendingStart({
        lat: geolocation.lat,
        lng: geolocation.lng,
        label: 'your current location',
        source: 'current-location',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoRequestId, geolocation.lat, geolocation.lng, geolocation.loading]);

  const handleConfirmDirections = useCallback(() => {
    if (!pendingStart) return;
    setConfirmedOrigin({ lat: pendingStart.lat, lng: pendingStart.lng });
  }, [pendingStart]);

  const clearStart = useCallback(() => {
    setPendingStart(null);
    setConfirmedOrigin(null);
  }, []);

  const routeSummary = useMemo(
    () => (route ? { distanceKm: route.distanceKm, durationMin: route.durationMin } : null),
    [route]
  );

  if (latitude == null && longitude == null && !isInteractive) {
    return (
      <div
        style={{ height }}
        className="w-full flex flex-col items-center justify-center gap-2 bg-surface-container rounded-lg text-on-surface-variant border border-outline-variant">
        <MapPin size={24} />
        <p className="text-body-sm">Location not available</p>
      </div>
    );
  }

  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  const baseOverlayProps = {
    isInteractive,
    showControlsWhenCollapsed,
    enableSearch,
    enableCurrentLocation,
    enableRouting,
    onSearchSelect: handleSearchSelect,
    onUseCurrentLocation: handleUseCurrentLocation,
    geoLoading: geolocation.loading,
    geoError: geolocation.error,
    geoUnsupported: geolocation.permissionStatus === 'unsupported',
    pendingStart,
    isRouteConfirmed: confirmedOrigin != null,
    onConfirmDirections: handleConfirmDirections,
    onClearStart: clearStart,
    route: routeSummary,
    routeLoading,
    routeError,
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-outline-variant">
      <div className="relative" style={{ height: resolvedHeight }}>
        <MapViewInner
          latitude={latitude}
          longitude={longitude}
          radiusKm={radiusKm}
          height="100%"
          label={label}
          isInteractive={isInteractive}
          onMapClick={handleMapClick}
          onMarkerDrag={handleMarkerDrag}
          pendingStart={pendingStart}
          routeCoordinates={route?.coordinates ?? null}
        />
        <MapOverlayControls {...baseOverlayProps} isExpandedView={false} />
      </div>

      {showExpandButton && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              title="Expand map"
              className="absolute bottom-3 left-3 z-[400] p-2 rounded-md bg-surface-container-lowest border border-outline-variant shadow-md hover:bg-surface-container transition-colors cursor-pointer">
              <Maximize2 size={16} className="text-on-surface-variant" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-on-background/40 z-[1000] backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-4xl bg-surface-container-lowest rounded-lg shadow-lg z-[1001] p-md border border-outline-variant">
              <div className="flex items-center justify-between mb-sm">
                <Dialog.Title className="font-headline-sm text-headline-sm text-on-surface">
                  {isInteractive ? 'Pick a location' : 'Location details'}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close"
                    className="p-1.5 rounded-md hover:bg-surface-container transition-colors cursor-pointer">
                    <X size={18} className="text-on-surface-variant" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="relative h-[70vh]">
                <MapViewInner
                  latitude={latitude}
                  longitude={longitude}
                  radiusKm={radiusKm}
                  height="100%"
                  label={label}
                  isInteractive={isInteractive}
                  onMapClick={handleMapClick}
                  onMarkerDrag={handleMarkerDrag}
                  pendingStart={pendingStart}
                  routeCoordinates={route?.coordinates ?? null}
                />
                <MapOverlayControls {...baseOverlayProps} isExpandedView />
              </div>

              {isInteractive ? (
                <p className="text-body-sm text-on-surface-variant mt-sm">
                  Click anywhere on the map, drag the marker, search, or use your current
                  location to pick a spot. Close this dialog when you're done.
                </p>
              ) : (
                address && (
                  <p className="text-body-sm text-on-surface-variant mt-sm">{address}</p>
                )
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
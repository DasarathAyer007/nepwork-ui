import { useEffect, useRef, useState } from 'react';

import type { ServiceResult } from '@/features/services/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Image as ImageIcon,
  LocateFixed,
  MapPin,
  Star,
  User,
  X,
} from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Link } from 'react-router-dom';

import CategoryIcon from '@/components/CategoryIcon';
import CurrentLocationButton from '@/components/map/CurrentLocationButton';
import DirectionsPanel from '@/components/map/DirectionsPanel';
import LocationSearchBox from '@/components/map/LocationSearchBox';
import { currentLocationIcon, startPointIcon } from '@/components/map/MapIcons';

import type { GeocodeResult } from '@/hooks/useGeoSearch';
import { type RoutePoint, useRoute } from '@/hooks/useRoute';

interface ServiceMapViewProps {
  services: ServiceResult[];
  totalCount: number;
  center: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  onBoundsChange: (lat: number, lng: number, radiusKm: number) => void;
  isLoading?: boolean;
  permissionStatus:
    | 'checking'
    | 'prompt'
    | 'granted'
    | 'denied'
    | 'unsupported';
  onRequestLocation: () => void;
  /** Whether a current-location request is in flight (for the directions "use current location" control). */
  geoLoading?: boolean;
  geoError?: string | null;
}

type StartPointSource = 'search' | 'map-click' | 'current-location';

interface StartPoint {
  lat: number;
  lng: number;
  label: string;
  source: StartPointSource;
}

const ROUTE_LINE_COLOR = 'var(--color-primary)';

const PIN_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

function getPinColor(categoryId?: string) {
  const id = categoryId ? parseInt(categoryId, 10) : null;
  return id == null || Number.isNaN(id)
    ? PIN_COLORS[0]
    : PIN_COLORS[id % PIN_COLORS.length];
}

const PIN_WIDTH = 30;
const PIN_HEIGHT = 40;
// Classic teardrop marker: a circular head that tapers to a sharp point at
// the bottom tip (where it touches the map), rather than a rotated-square.
const PIN_PATH =
  'M15 0C6.716 0 0 6.716 0 15c0 10.5 12.7 23.7 14.25 25.32a1 1 0 0 0 1.5 0C17.3 38.7 30 25.5 30 15 30 6.716 23.284 0 15 0z';

const iconCache = new Map<string, L.DivIcon>();

function getPinDivIcon(
  iconName: string | undefined,
  categoryId: string | undefined
) {
  const cacheKey = `${iconName ?? 'default'}-${categoryId ?? 'none'}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const color = getPinColor(categoryId);

  const html = renderToStaticMarkup(
    <div style={{ position: 'relative', width: PIN_WIDTH, height: PIN_HEIGHT }}>
      <svg
        width={PIN_WIDTH}
        height={PIN_HEIGHT}
        viewBox={`0 0 ${PIN_WIDTH} ${PIN_HEIGHT}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
        }}>
        <path d={PIN_PATH} fill={color} stroke="white" strokeWidth={1.5} />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 0,
          width: PIN_WIDTH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CategoryIcon iconname={iconName} size={13} color="white" />
      </div>
    </div>
  );

  const divIcon = L.divIcon({
    html,
    className: '',
    iconSize: [PIN_WIDTH, PIN_HEIGHT],
    iconAnchor: [PIN_WIDTH / 2, PIN_HEIGHT],
  });
  iconCache.set(cacheKey, divIcon);
  return divIcon;
}

const userLocationIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div style={{ position: 'relative', width: 20, height: 20 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: '#3b82f6',
          opacity: 0.25,
          transform: 'scale(1.8)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: '#3b82f6',
          border: '3px solid white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  ),
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Minimum fraction of the current search radius the map must move before we
// bother refetching — small pans/zooms within the already-fetched area would
// otherwise trigger a brand new API call every time.
const REFETCH_MOVE_THRESHOLD = 0.25;
const REFETCH_RADIUS_CHANGE_THRESHOLD = 0.15;

function MapEventsHandler({
  onBoundsChange,
}: {
  onBoundsChange: (lat: number, lng: number, radiusKm: number) => void;
}) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const lastEmittedRef = useRef<{
    lat: number;
    lng: number;
    radiusKm: number;
  } | null>(null);

  const map = useMapEvents({
    moveend: emit,
    zoomend: emit,
  });

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function emit() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const c = map.getCenter();
      const bounds = map.getBounds();
      const radiusKm =
        Math.round((c.distanceTo(bounds.getNorthEast()) / 1000) * 10) / 10;

      const last = lastEmittedRef.current;
      if (last) {
        const movedKm = c.distanceTo(L.latLng(last.lat, last.lng)) / 1000;
        const radiusChanged =
          Math.abs(radiusKm - last.radiusKm) / last.radiusKm >
          REFETCH_RADIUS_CHANGE_THRESHOLD;

        if (
          !radiusChanged &&
          movedKm < last.radiusKm * REFETCH_MOVE_THRESHOLD
        ) {
          return;
        }
      }

      lastEmittedRef.current = { lat: c.lat, lng: c.lng, radiusKm };
      onBoundsChange(c.lat, c.lng, radiusKm);
    }, 500);
  }

  return null;
}

// Auto-recenters exactly once, the first time a search center becomes available
// (e.g. right after mount or right after geolocation first resolves).
// Does NOT re-fire on every pan — that would fight the user's own map interaction.
function RecenterOnce({
  center,
}: {
  center: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const hasRecenteredRef = useRef(false);

  useEffect(() => {
    if (center && !hasRecenteredRef.current) {
      map.setView([center.lat, center.lng], 13);
      hasRecenteredRef.current = true;
    }
  }, [center, map]);

  return null;
}

// Imperative Leaflet control button placed in the same corner stack as zoom controls.
// Reads userLocation via a ref so the click handler always sees the latest value,
// without needing to re-create the control (and re-mount its DOM node) on every update.
function LocateControl({
  userLocation,
  onRequestLocation,
}: {
  userLocation: { lat: number; lng: number } | null;
  onRequestLocation: () => void;
}) {
  const map = useMap();
  const userLocationRef = useRef(userLocation);
  const onRequestLocationRef = useRef(onRequestLocation);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    onRequestLocationRef.current = onRequestLocation;
  }, [onRequestLocation]);

  useEffect(() => {
    const LocateButton = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control'
        );
        const button = L.DomUtil.create('a', '', container);
        button.href = '#';
        button.title = 'Go to my location';
        button.setAttribute('aria-label', 'Go to my location');
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '34px';
        button.style.height = '34px';
        button.innerHTML = renderToStaticMarkup(<LocateFixed size={18} />);

        L.DomEvent.on(button, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);

          if (userLocationRef.current) {
            // We already have a known location — just fly there immediately.
            map.setView(
              [userLocationRef.current.lat, userLocationRef.current.lng],
              15
            );
          } else {
            // No location yet (denied earlier, or first time) — ask again.
            // Once it resolves, the parent's effect updates userLocation and
            // the map will recenter through the prop update below.
            onRequestLocationRef.current();
          }
        });

        return container;
      },
    });

    const control = new LocateButton({ position: 'bottomright' });
    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map]);

  // If userLocation arrives/changes AFTER the button was already clicked once
  // (e.g. permission was just granted), snap to it automatically.
  const prevLocationRef = useRef(userLocation);
  useEffect(() => {
    if (userLocation && userLocation !== prevLocationRef.current) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
    prevLocationRef.current = userLocation;
  }, [userLocation, map]);

  return null;
}

/** Lets the user drop a custom directions start-point by clicking the map,
 * but only while a destination (selected service) is open. */
function StartPointClickHandler({
  enabled,
  onPick,
}: {
  enabled: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Fits the map to the computed route once available, otherwise flies to a
 * freshly-picked start point. */
function FitRouteBounds({
  startPoint,
  routeCoordinates,
}: {
  startPoint: RoutePoint | null;
  routeCoordinates: [number, number][] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 1) {
      map.fitBounds(L.latLngBounds(routeCoordinates), { padding: [64, 64] });
    } else if (startPoint) {
      map.flyTo([startPoint.lat, startPoint.lng], Math.max(map.getZoom(), 13), {
        animate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCoordinates, startPoint?.lat, startPoint?.lng]);

  return null;
}

const AVAILABILITY_BADGES: Record<string, { color: string; label: string }> = {
  available: { color: 'bg-green-500/90 text-white', label: 'Available' },
  unavailable: {
    color: 'bg-surface-container-high text-on-surface-variant',
    label: 'Unavailable',
  },
  break: { color: 'bg-warning/90 text-white', label: 'On Break' },
  holiday: { color: 'bg-warning/90 text-white', label: 'On Holiday' },
};

function buildLocationText(loc: ServiceResult['location']) {
  if (!loc) return 'Remote';
  return (
    [loc.address, loc.city, loc.state, loc.country]
      .filter(Boolean)
      .join(', ') || 'Remote'
  );
}

function formatPrice(service: ServiceResult) {
  if (!service.price) return null;
  const amount = Number(service.price).toLocaleString();
  return `${service.currency} ${amount}${service.price_type === 'hourly' ? '/hr' : ''}`;
}

function ServiceHoverCard({ service }: { service: ServiceResult }) {
  const availabilityBadge = AVAILABILITY_BADGES[
    service.availability_status
  ] ?? {
    color: 'bg-surface-container-high text-on-surface-variant',
    label: service.availability_status,
  };
  const priceText = formatPrice(service);
  const visibleSkills = service.skills.slice(0, 3);
  const extraSkills = service.skills.length - visibleSkills.length;

  return (
    <div className="relative w-64">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden">
        <div className="flex gap-3 p-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
            {service.thumbnail ? (
              <img
                src={service.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-outline">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              {service.category && (
                <span className="text-label-sm font-bold text-primary uppercase tracking-wider truncate">
                  {service.category.name}
                </span>
              )}
              <span
                className={`shrink-0 px-1.5 py-0.5 rounded-full text-label-sm font-medium leading-none ${availabilityBadge.color}`}>
                {availabilityBadge.label}
              </span>
            </div>
            <p className="text-body-md font-bold text-on-surface leading-snug line-clamp-1">
              {service.title}
            </p>
            {service.user && (
              <p className="text-body-sm text-on-surface-variant truncate">
                {service.user.username}
              </p>
            )}
          </div>
        </div>

        <div className="px-3 pb-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {buildLocationText(service.location)}
            </span>
          </div>

          {service.avg_rating > 0 && (
            <div className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current shrink-0" />
              <span className="font-bold text-on-surface">
                {service.avg_rating.toFixed(1)}
              </span>
              <span>· {service.total_applies} applies</span>
            </div>
          )}

          {visibleSkills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {visibleSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded-full text-label-sm">
                  {skill}
                </span>
              ))}
              {extraSkills > 0 && (
                <span className="text-label-sm text-outline px-1">
                  +{extraSkills}
                </span>
              )}
            </div>
          )}

          {priceText && (
            <div className="flex items-center justify-between pt-1.5 border-t border-outline-variant/40">
              <span className="text-label-sm text-outline uppercase tracking-wide">
                {service.price_type === 'hourly' ? 'From' : 'Fixed'}
              </span>
              <span className="text-body-sm font-bold text-primary">
                {priceText}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-surface-container-lowest border-r border-b border-outline-variant rotate-45" />
    </div>
  );
}

interface DirectionsState {
  pendingStart: StartPoint | null;
  isRouteConfirmed: boolean;
  route: { distanceKm: number; durationMin: number } | null;
  routeLoading: boolean;
  routeError: string | null;
  geoLoading: boolean;
  geoError: string | null;
  onSearchSelect: (result: GeocodeResult) => void;
  onUseCurrentLocation: () => void;
  onConfirm: () => void;
  onClear: () => void;
}

function DirectionsSection({ directions }: { directions: DirectionsState }) {
  const {
    pendingStart,
    isRouteConfirmed,
    route,
    routeLoading,
    routeError,
    geoLoading,
    geoError,
    onSearchSelect,
    onUseCurrentLocation,
    onConfirm,
    onClear,
  } = directions;

  return (
    <div className="space-y-2 pt-2 border-t border-outline-variant/50">
      <h4 className="text-body-md font-bold text-on-surface">Directions</h4>
      <LocationSearchBox
        placeholder="Search a starting location"
        onSelect={onSearchSelect}
      />
      <div className="flex items-center gap-2">
        <CurrentLocationButton
          onClick={onUseCurrentLocation}
          loading={geoLoading}
          errored={!!geoError}
          label="Use current location"
          className="flex-1"
        />
      </div>
      <p className="text-label-sm text-on-surface-variant">
        Or click anywhere on the map to drop a custom starting point.
      </p>
      {pendingStart && (
        <DirectionsPanel
          mode={isRouteConfirmed ? 'route' : 'confirm'}
          pointLabel={pendingStart.label}
          onConfirm={onConfirm}
          distanceKm={route?.distanceKm}
          durationMin={route?.durationMin}
          loading={routeLoading}
          error={routeError}
          onClear={onClear}
        />
      )}
    </div>
  );
}

function ServiceDetailPanel({
  service,
  onClose,
  directions,
}: {
  service: ServiceResult;
  onClose: () => void;
  directions: DirectionsState;
}) {
  const availabilityBadge = AVAILABILITY_BADGES[
    service.availability_status
  ] ?? {
    color: 'bg-surface-container-high text-on-surface-variant',
    label: service.availability_status,
  };
  const priceText = formatPrice(service);

  return (
    <div className="absolute inset-y-0 right-0 z-1000 w-full sm:w-96 bg-surface-container-lowest border-l border-outline-variant shadow-xl overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-lowest/95 backdrop-blur-sm">
        <h3 className="text-title-md font-bold text-on-surface">
          Service Details
        </h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-container-high">
          {service.thumbnail ? (
            <img
              src={service.thumbnail}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}
          <span
            className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-label-sm font-medium leading-none ${availabilityBadge.color}`}>
            {availabilityBadge.label}
          </span>
        </div>

        <div className="space-y-1">
          {service.category && (
            <div className="flex items-center gap-1.5">
              <CategoryIcon
                iconname={service.category.icon}
                size={14}
                color="var(--color-primary)"
              />
              <span className="text-label-md font-bold text-primary uppercase tracking-wider">
                {service.category.name}
              </span>
            </div>
          )}
          <h2 className="text-headline-sm font-bold text-on-surface leading-snug">
            {service.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-body-md text-on-surface-variant">
          {service.user && (
            <div className="flex items-center gap-1.5">
              {service.user.profile_picture ? (
                <img
                  src={service.user.profile_picture}
                  alt={service.user.username}
                  className="w-5 h-5 rounded-full object-cover border border-outline-variant"
                />
              ) : (
                <User className="w-4 h-4 text-outline" />
              )}
              <span>{service.user.username}</span>
            </div>
          )}
          {service.avg_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-bold text-on-surface">
                {service.avg_rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-body-md text-on-surface-variant">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{buildLocationText(service.location)}</span>
          </div>
        </div>

        {service.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-body-md font-bold text-on-surface">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {service.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full text-body-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/50">
          <div>
            <p className="text-label-sm text-outline uppercase tracking-wide">
              {service.price_type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
            </p>
            <p className="text-title-md font-bold text-primary">
              {priceText ?? 'Not specified'}
            </p>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            {service.total_applies} applies
          </p>
        </div>

        <Link
          to={`/services/${service.id}`}
          className="block w-full text-center px-4 py-2.5 bg-primary text-on-primary rounded-lg text-body-md font-medium hover:opacity-90 transition-opacity">
          View Details
        </Link>

        <DirectionsSection directions={directions} />
      </div>
    </div>
  );
}

export default function ServiceMapView({
  services,
  totalCount,
  center,
  userLocation,
  onBoundsChange,
  isLoading,
  permissionStatus,
  onRequestLocation,
  geoLoading = false,
  geoError = null,
}: ServiceMapViewProps) {
  const fallbackCenter = { lat: 27.7172, lng: 85.324 }; // Kathmandu
  const initialCenter = center ?? userLocation ?? fallbackCenter;

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const selectedService =
    services.find((s) => s.id === selectedServiceId) ?? null;

  // ── Directions: user picks a start point (search / current location /
  // map click), confirms, and we route to the currently-selected service. ──
  const [pendingStart, setPendingStart] = useState<StartPoint | null>(null);
  const [confirmedOrigin, setConfirmedOrigin] = useState<RoutePoint | null>(
    null
  );
  const awaitingGeoForStartRef = useRef(false);

  const destination: RoutePoint | null =
    selectedService && selectedService.location
      ? {
          lat: selectedService.location.point.lat,
          lng: selectedService.location.point.lng,
        }
      : null;

  const {
    route,
    loading: routeLoading,
    error: routeError,
  } = useRoute(confirmedOrigin, destination, 'driving');

  const updatePendingStart = (point: StartPoint) => {
    setPendingStart(point);
    setConfirmedOrigin(null);
  };

  const handleSearchSelect = (result: GeocodeResult) => {
    updatePendingStart({
      lat: result.lat,
      lng: result.lng,
      label: result.displayName,
      source: 'search',
    });
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      updatePendingStart({
        lat: userLocation.lat,
        lng: userLocation.lng,
        label: 'your current location',
        source: 'current-location',
      });
    } else {
      awaitingGeoForStartRef.current = true;
      onRequestLocation();
    }
  };

  useEffect(() => {
    if (awaitingGeoForStartRef.current && userLocation) {
      awaitingGeoForStartRef.current = false;
      updatePendingStart({
        lat: userLocation.lat,
        lng: userLocation.lng,
        label: 'your current location',
        source: 'current-location',
      });
    }
  }, [userLocation]);

  const handleMapPickStart = (lat: number, lng: number) => {
    updatePendingStart({
      lat,
      lng,
      label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      source: 'map-click',
    });
  };

  const handleConfirmDirections = () => {
    if (!pendingStart) return;
    setConfirmedOrigin({ lat: pendingStart.lat, lng: pendingStart.lng });
  };

  const handleClearDirections = () => {
    setPendingStart(null);
    setConfirmedOrigin(null);
  };

  const directionsState: DirectionsState = {
    pendingStart,
    isRouteConfirmed: confirmedOrigin != null,
    route: route
      ? { distanceKm: route.distanceKm, durationMin: route.durationMin }
      : null,
    routeLoading,
    routeError,
    geoLoading,
    geoError,
    onSearchSelect: handleSearchSelect,
    onUseCurrentLocation: handleUseCurrentLocation,
    onConfirm: handleConfirmDirections,
    onClear: handleClearDirections,
  };

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={[initialCenter.lat, initialCenter.lng]}
        zoom={12}
        scrollWheelZoom
        zoomControl={false}
        className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />

        <MapEventsHandler onBoundsChange={onBoundsChange} />
        <RecenterOnce center={center} />
        <LocateControl
          userLocation={userLocation}
          onRequestLocation={onRequestLocation}
        />
        <StartPointClickHandler
          enabled={selectedService != null}
          onPick={handleMapPickStart}
        />
        <FitRouteBounds
          startPoint={pendingStart}
          routeCoordinates={route?.coordinates ?? null}
        />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
            zIndexOffset={1000}>
            <Tooltip direction="top" offset={[0, -12]} opacity={1}>
              You are here
            </Tooltip>
          </Marker>
        )}

        {pendingStart && (
          <Marker
            position={[pendingStart.lat, pendingStart.lng]}
            icon={
              pendingStart.source === 'current-location'
                ? currentLocationIcon
                : startPointIcon
            }
            zIndexOffset={900}>
            <Tooltip direction="top" offset={[0, -32]} opacity={1}>
              Start: {pendingStart.label}
            </Tooltip>
          </Marker>
        )}

        {route && route.coordinates.length > 1 && (
          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: ROUTE_LINE_COLOR,
              weight: 4,
              opacity: 0.85,
            }}
          />
        )}

        {services
          .filter(
            (
              service
            ): service is ServiceResult & {
              location: NonNullable<ServiceResult['location']>;
            } => service.location !== null
          )
          .map((service) => (
            <Marker
              key={service.id}
              position={[
                service.location.point.lat,
                service.location.point.lng,
              ]}
              icon={getPinDivIcon(service.category?.icon, service.category?.id)}
              eventHandlers={{
                click: () => setSelectedServiceId(service.id),
              }}>
              <Tooltip
                direction="top"
                offset={[0, -36]}
                opacity={1}
                sticky
                className="map-pin-tooltip">
                <ServiceHoverCard service={service} />
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>

      {isLoading && (
        <div className="absolute bottom-4 right-4 z-500 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-body-sm text-on-surface-variant shadow-sm">
          Updating results…
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-500 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-body-sm text-on-surface-variant shadow-sm">
        {totalCount} service{totalCount === 1 ? '' : 's'} in this area
      </div>

      {(permissionStatus === 'prompt' || permissionStatus === 'denied') && (
        <div className="absolute inset-0 z-400 flex items-center justify-center bg-surface-container-lowest/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6  text-center shadow-md">
            <p className="text-body-md font-medium mb-1">
              See services near you
            </p>
            <p className="text-body-sm text-on-surface-variant mb-4">
              {permissionStatus === 'denied'
                ? "Location is currently blocked. You can still try requesting it, or enable it manually in your browser's site settings."
                : 'Allow location access to find jobs and services close to you on the map.'}
            </p>
            <button
              onClick={onRequestLocation}
              className="px-4 py-2 bg-primary text-on-primary rounded-md text-body-sm font-medium">
              {permissionStatus === 'denied' ? 'Try again' : 'Allow location'}
            </button>
          </div>
        </div>
      )}

      {selectedService && (
        <ServiceDetailPanel
          service={selectedService}
          onClose={() => setSelectedServiceId(null)}
          directions={directionsState}
        />
      )}
    </div>
  );
}

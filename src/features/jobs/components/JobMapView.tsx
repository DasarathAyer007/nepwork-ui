import { useEffect, useRef } from 'react';

import type { JobResult } from '@/features/jobs/jobTypes';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import CategoryIcon from '@/components/CategoryIcon';

interface JobMapViewProps {
  jobs: JobResult[];
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
}

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
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
      }}>
      <div style={{ transform: 'rotate(45deg)', display: 'flex' }}>
        <CategoryIcon iconname={iconName} size={15} color="white" />
      </div>
    </div>
  );

  const divIcon = L.divIcon({
    html,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
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
            map.setView(
              [userLocationRef.current.lat, userLocationRef.current.lng],
              15
            );
          } else {
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

  const prevLocationRef = useRef(userLocation);
  useEffect(() => {
    if (userLocation && userLocation !== prevLocationRef.current) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
    prevLocationRef.current = userLocation;
  }, [userLocation, map]);

  return null;
}

function formatSalary(job: JobResult) {
  const { salary_min, salary_max, currency } = job;
  if (!salary_min && !salary_max) return null;
  if (salary_min && salary_max)
    return `${currency} ${salary_min} - ${salary_max}`;
  return `${currency} ${salary_min ?? salary_max}`;
}

export default function JobMapView({
  jobs,
  totalCount,
  center,
  userLocation,
  onBoundsChange,
  isLoading,
  permissionStatus,
  onRequestLocation,
}: JobMapViewProps) {
  const fallbackCenter = { lat: 27.7172, lng: 85.324 }; // Kathmandu
  const initialCenter = center ?? userLocation ?? fallbackCenter;

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

        {jobs
          .filter(
            (
              job
            ): job is JobResult & {
              location: NonNullable<JobResult['location']>;
            } => job.location !== null
          )
          .map((job) => (
            <Marker
              key={job.id}
              position={[job.location.point.lat, job.location.point.lng]}
              icon={getPinDivIcon(
                (job.category as any)?.icon,
                (job.category as any)?.id
              )}>
              <Tooltip direction="top" offset={[0, -28]} opacity={1} sticky>
                <div className="flex gap-2 items-start max-w-[220px]">
                  {job.thumbnail && (
                    <img
                      src={job.thumbnail}
                      alt=""
                      className="w-10 h-10 rounded object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-body-sm font-medium truncate">
                      {job.title}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {job.category?.name}
                    </p>
                    <p className="text-body-sm text-on-surface-variant capitalize">
                      {job.work_mode} · {job.job_type}
                    </p>
                    {formatSalary(job) && (
                      <p className="text-body-sm font-medium">
                        {formatSalary(job)}
                      </p>
                    )}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>

      {isLoading && (
        <div className="absolute bottom-4 right-4 z-[500] bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-body-sm text-on-surface-variant shadow-sm">
          Updating results…
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-[500] bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-body-sm text-on-surface-variant shadow-sm">
        {totalCount} job{totalCount === 1 ? '' : 's'} in this area
      </div>

      {(permissionStatus === 'prompt' || permissionStatus === 'denied') && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-surface-container-lowest/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 text-center shadow-md">
            <p className="text-body-md font-medium mb-1">See jobs near you</p>
            <p className="text-body-sm text-on-surface-variant mb-4">
              {permissionStatus === 'denied'
                ? "Location is currently blocked. You can still try requesting it, or enable it manually in your browser's site settings."
                : 'Allow location access to find jobs close to you on the map.'}
            </p>
            <button
              onClick={onRequestLocation}
              className="px-4 py-2 bg-primary text-on-primary rounded-md text-body-sm font-medium">
              {permissionStatus === 'denied' ? 'Try again' : 'Allow location'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

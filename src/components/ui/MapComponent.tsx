import { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, MapPin, X } from 'lucide-react';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

// default leaflet marker icon (bundlers strip the built-in image paths)
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FALLBACK_CENTER: [number, number] = [27.7, 85.3]; // Kathmandu

interface MapComponentProps {
  latitude: number | null;
  longitude: number | null;
  radiusKm?: number | null;
  onSelect?: (lat: number, lng: number) => void;
  height?: number | string;
  label?: string;
  address?: string;
  showExpandButton?: boolean;
}

function ClickHandler({
  onSelect,
}: {
  onSelect?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (onSelect) {
        onSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

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
      map.setView([latitude, longitude], map.getZoom(), { animate: true });
    }
  }, [latitude, longitude, map]);
  return null;
}

function MapViewInner({
  latitude,
  longitude,
  radiusKm,
  onSelect,
  height,
  label,
}: Omit<MapComponentProps, 'showExpandButton' | 'address'>) {
  const center: [number, number] =
    latitude != null && longitude != null
      ? [latitude, longitude]
      : FALLBACK_CENTER;

  const isInteractive = !!onSelect;

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={isInteractive}
      style={{ height: height ?? '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isInteractive && <ClickHandler onSelect={onSelect} />}
      <RecenterOnChange latitude={latitude} longitude={longitude} />
      {latitude != null && longitude != null && (
        <>
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            {label && <Popup>{label}</Popup>}
          </Marker>
          {radiusKm != null && radiusKm > 0 && (
            <Circle
              center={[latitude, longitude]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: 'var(--color-primary, #004f60)',
                fillColor: 'var(--color-primary-container, #a8e6fd)',
                fillOpacity: 0.2,
                weight: 1.5,
              }}
            />
          )}
        </>
      )}
    </MapContainer>
  );
}

export default function MapComponent({
  latitude,
  longitude,
  radiusKm,
  onSelect,
  height = 260,
  label,
  address,
  showExpandButton = false,
}: MapComponentProps) {
  const isInteractive = !!onSelect;

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

  const numericHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-outline-variant">
      <div style={{ height: numericHeight }}>
        <MapViewInner
          latitude={latitude}
          longitude={longitude}
          radiusKm={radiusKm}
          onSelect={onSelect}
          height="100%"
          label={label}
        />
      </div>

      {showExpandButton && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              title="Expand map"
              className="absolute top-3 right-3 z-[400] p-2 rounded-md bg-surface-container-lowest border border-outline-variant shadow-md hover:bg-surface-container transition-colors cursor-pointer">
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

              <div className="h-[70vh]">
                <MapViewInner
                  latitude={latitude}
                  longitude={longitude}
                  radiusKm={radiusKm}
                  onSelect={onSelect}
                  height="100%"
                  label={label}
                />
              </div>

              {isInteractive ? (
                <p className="text-body-sm text-on-surface-variant mt-sm">
                  Click anywhere on the map to drop your marker. Close this dialog when you're done.
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

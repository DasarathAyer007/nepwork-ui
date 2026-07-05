import * as Dialog from '@radix-ui/react-dialog';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, MapPin, X } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// default leaflet marker icon (bundlers strip the built-in image paths)
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  latitude: number;
  longitude: number;
  label?: string;
  height: string;
}

function MapView({ latitude, longitude, label, height }: MapViewProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height, width: '100%', borderRadius: '0.5rem', zIndex: 0 }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={markerIcon}>
        {label && <Popup>{label}</Popup>}
      </Marker>
    </MapContainer>
  );
}

interface Props {
  latitude: number | null;
  longitude: number | null;
  address?: string;
  label?: string;
}

// View-only: no click-to-place, no draggable marker, no onSelect callback.
export default function JobLocationMap({
  latitude,
  longitude,
  address,
  label,
}: Props) {
  if (latitude == null || longitude == null) {
    return (
      <div className="h-[220px] flex flex-col items-center justify-center gap-2 bg-surface-container rounded-lg text-on-surface-variant">
        <MapPin size={24} />
        <p className="text-body-sm">Location not available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapView latitude={latitude} longitude={longitude} label={label} height="220px" />

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            type="button"
            title="Expand map"
            className="absolute top-3 right-3 z-[400] p-2 rounded-md bg-surface-container-lowest border border-outline-variant shadow-md hover:bg-surface-container transition-colors">
            <Maximize2 size={16} className="text-on-surface-variant" />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-on-background/40 z-[1000]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-4xl bg-surface-container-lowest rounded-lg shadow-lg z-[1001] p-md">
            <div className="flex items-center justify-between mb-sm">
              <Dialog.Title className="font-headline-sm text-headline-sm text-on-surface">
                Job location
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="p-1.5 rounded-md hover:bg-surface-container transition-colors">
                  <X size={18} className="text-on-surface-variant" />
                </button>
              </Dialog.Close>
            </div>

            <MapView latitude={latitude} longitude={longitude} label={label} height="70vh" />

            {address && (
              <p className="text-body-sm text-on-surface-variant mt-sm">{address}</p>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
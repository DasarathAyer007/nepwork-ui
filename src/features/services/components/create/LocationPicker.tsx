import { useEffect } from 'react';

import L from 'leaflet';
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

// Default marker icon fix for bundlers (Leaflet's default asset paths break under webpack/vite)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FALLBACK_CENTER: [number, number] = [27.7, 85.3]; // fallback default center

interface Props {
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
  onSelect: (lat: number, lng: number) => void;
  height?: number | string;
}

function ClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
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

export default function LocationPicker({
  latitude,
  longitude,
  radiusKm,
  onSelect,
  height = 260,
}: Props) {
  const center: [number, number] =
    latitude != null && longitude != null
      ? [latitude, longitude]
      : FALLBACK_CENTER;

  return (
    <div
      style={{ height }}
      className="w-full rounded-lg overflow-hidden border border-outline-variant">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={onSelect} />
        <RecenterOnChange latitude={latitude} longitude={longitude} />
        {latitude != null && longitude != null && (
          <>
            <Marker position={[latitude, longitude]} icon={markerIcon} />
            <Circle
              center={[latitude, longitude]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#004f60',
                fillColor: '#a8e6fd',
                fillOpacity: 0.2,
                weight: 1.5,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}

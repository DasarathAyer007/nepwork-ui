import React, { useMemo, useState } from 'react';

import type { Location } from '@/types/location.types';
import * as Dialog from '@radix-ui/react-dialog';
import 'leaflet/dist/leaflet.css';
import { MapPin, Maximize2, X } from 'lucide-react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import { useGetLocationDetailsQuery } from '../../api/profileApi';

function formatLocationText(location: Location): string {
  if (!location) return 'Location not shared';
  if ('address' in location) return location.address;
  if ('city' in location && 'state' in location && 'country' in location)
    return `${location.city}, ${location.state}, ${location.country}`;
  if ('city' in location && 'country' in location)
    return `${location.city}, ${location.country}`;
  if ('state' in location && 'country' in location)
    return `${location.state}, ${location.country}`;
  if ('country' in location) return location.country;
  if ('label' in location) return location.label;
  return 'Location not shared';
}

function MapView({
  center,
  zoom = 14,
  className = '',
}: {
  center: [number, number];
  zoom?: number;
  className?: string;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={center} />
    </MapContainer>
  );
}

function LocationCard({ user_id }: { user_id: string }) {
  const { data: location } = useGetLocationDetailsQuery({ userid: user_id });
  const [open, setOpen] = useState(false);

  const isExact = location?.type === 'exact' && 'point' in (location ?? {});

  const center = useMemo<[number, number] | null>(() => {
    if (!isExact || !location || !('point' in location)) return null;
    return [location.point.lat, location.point.lng];
  }, [location, isExact]);

  const locationText = formatLocationText(location ?? null);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Location
          </p>
        </div>

        {/* Map — only for exact locations */}
        {isExact && center ? (
          <div className="relative mx-4 mb-3 h-48 rounded-lg overflow-hidden border border-gray-100">
            <MapView center={center} zoom={14} className="h-full w-full" />

            {/* Expand button */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Expand map"
              className="
                absolute top-2 right-2 z-[400]
                flex items-center gap-1
                bg-white/90 backdrop-blur-sm
                border border-gray-200
                shadow-sm rounded-md
                px-2 py-1
                text-xs font-medium text-gray-600
                hover:bg-white hover:text-gray-900
                transition-colors
              ">
              <Maximize2 size={11} />
              Expand
            </button>
          </div>
        ) : null}

        {/* Address row */}
        <div className="flex items-start gap-2 px-4 pb-4 pt-1">
          <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
          <span className="text-sm text-gray-600 leading-snug">
            {locationText}
          </span>
        </div>
      </div>

      {/* Fullscreen dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          {/* Backdrop */}
          <Dialog.Overlay className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm" />

          {/* Dialog — max 600px wide, centered, not full-screen */}
          <Dialog.Content
            className="
    fixed z-[500]
    top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2

    w-[95vw]
    max-w-5xl
    h-[85vh]

    bg-white
    rounded-xl
    shadow-2xl
    overflow-hidden
    outline-none
  ">
            {/* MAP WRAPPER */}
            <div className="relative w-full h-full">
              {/* CLOSE BUTTON (floating top-right) */}
              <Dialog.Close asChild>
                <button
                  aria-label="Close map"
                  className="
          absolute top-3 right-3 z-[999]
          p-2 rounded-full
          bg-white/90 backdrop-blur-sm
          shadow-md
          text-gray-600 hover:text-gray-900
          hover:bg-white
          transition
        ">
                  <X size={18} />
                </button>
              </Dialog.Close>

              {/* MAP */}
              {isExact && center && (
                <div className="w-full h-full">
                  <MapView
                    center={center}
                    zoom={15}
                    className="h-full w-full"
                  />
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default LocationCard;

import { useMemo, useState } from 'react';

import type { Location } from '@/types/location.types';

import * as Dialog from '@radix-ui/react-dialog';

import 'leaflet/dist/leaflet.css';

import {
  MapPin,
  Maximize2,
  X,
} from 'lucide-react';

import {
  MapContainer,
  Marker,
  TileLayer,
} from 'react-leaflet';

import { useGetLocationDetailsQuery } from '../../api/profileApi';

function formatLocationText(
  location: Location | null
): string {
  if (!location) {
    return 'Location not shared';
  }

  if ('address' in location && location.address) {
    return location.address;
  }

  if (
    'city' in location &&
    'state' in location &&
    'country' in location
  ) {
    return `${location.city}, ${location.state}, ${location.country}`;
  }

  if (
    'city' in location &&
    'country' in location
  ) {
    return `${location.city}, ${location.country}`;
  }

  if (
    'state' in location &&
    'country' in location
  ) {
    return `${location.state}, ${location.country}`;
  }

  if (
    'country' in location &&
    location.country
  ) {
    return location.country;
  }

  if ('label' in location) {
    return location.label;
  }

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
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <Marker position={center} />
    </MapContainer>
  );
}

function LocationCard({
  user_id,
}: {
  user_id: string;
}) {
  const { data: location } =
    useGetLocationDetailsQuery({
      userid: user_id,
    });

  const [open, setOpen] =
    useState(false);

  const isExact =
    location?.type === 'exact' &&
    'point' in (location ?? {});

  const center = useMemo<
    [number, number] | null
  >(() => {
    if (
      !isExact ||
      !location ||
      !('point' in location)
    ) {
      return null;
    }

    return [
      location.point.lat,
      location.point.lng,
    ];
  }, [location, isExact]);

  const locationText =
    formatLocationText(location ?? null);

  return (
    <>
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="px-6 py-5 border-b border-outline-variant">

          <h2 className="text-xl font-semibold text-on-surface">
            Location
          </h2>

          <p className="mt-1 text-sm text-on-surface-variant">
            Shared location
          </p>

        </div>

        {/* LOCATION NAME */}

        <div className="px-6 pt-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">

              <MapPin
                size={20}
                className="text-primary"
              />

            </div>

            <div>

              <h3 className="text-lg font-semibold text-on-surface">
                {locationText}
              </h3>

              <p className="mt-1 text-sm text-on-surface-variant">
                Shared profile location
              </p>

            </div>

          </div>

        </div>

        {/* MAP */}

        {isExact && center && (

          <div className="relative px-6 pt-5 pb-6">

            <div className="h-72 overflow-hidden rounded-xl border border-outline-variant">

              <MapView
                center={center}
                zoom={14}
                className="h-full w-full"
              />

            </div>

            <button
              onClick={() =>
                setOpen(true)
              }
              className="
                absolute
                top-8
                right-8
                z-400
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-outline-variant
                bg-surface-container-lowest
                px-3
                py-2
                shadow-md
                transition
                hover:bg-surface-container
              "
            >
              <Maximize2 size={16} />

              <span className="text-sm font-medium">
                Expand
              </span>

            </button>

          </div>

        )}

        {!isExact && (
          <div className="px-6 pb-6 pt-4">

            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container p-10 text-center">

              <MapPin
                size={32}
                className="mx-auto mb-3 text-on-surface-variant"
              />

              <p className="font-medium text-on-surface">
                Map preview unavailable
              </p>

              <p className="mt-1 text-sm text-on-surface-variant">
                This user has shared an approximate
                location only.
              </p>

            </div>

          </div>
        )}
              </div>

      {/* FULLSCREEN MAP DIALOG */}

      <Dialog.Root
        open={open}
        onOpenChange={setOpen}
      >
        <Dialog.Portal>

          <Dialog.Overlay
            className="
              fixed
              inset-0
              z-500
              bg-black/40
              backdrop-blur-sm
            "
          />

          <Dialog.Content
            className="
              fixed
              top-1/2
              left-1/2
              z-500
              h-[85vh]
              w-[95vw]
              max-w-6xl
              -translate-x-1/2
              -translate-y-1/2
              overflow-hidden
              rounded-2xl
              bg-surface-container-lowest
              shadow-2xl
              outline-none
            "
          >

            <div className="relative h-full w-full">

              {/* CLOSE BUTTON */}

              <Dialog.Close asChild>

                <button
                  aria-label="Close map"
                  className="
                    absolute
                    right-4
                    top-4
                    z-999
                    rounded-full
                    bg-surface-container
                    p-2
                    shadow-md
                    transition
                    hover:bg-surface-container-high
                  "
                >
                  <X size={20} />
                </button>

              </Dialog.Close>

              {/* LARGE MAP */}

              {isExact && center && (

                <MapView
                  center={center}
                  zoom={15}
                  className="h-full w-full"
                />

              )}

            </div>

          </Dialog.Content>

        </Dialog.Portal>
      </Dialog.Root>

    </>
  );
}

export default LocationCard;
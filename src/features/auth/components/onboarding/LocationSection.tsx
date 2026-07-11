// components/LocationSection.tsx
import { useCallback, useEffect, useRef } from 'react';

import type { Map, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Controller, useFormContext } from 'react-hook-form';

import { Input, Label, TextArea } from '@/components/ui/forms';

type VisibilityOption = { label: string; value: number; icon: string };

const VISIBILITY_OPTIONS: VisibilityOption[] = [
  { label: 'Exact', value: 0, icon: 'map-pin' },
  { label: 'Street', value: 1, icon: 'road' },
  { label: 'Area', value: 2, icon: 'map-2' },
  { label: 'City', value: 3, icon: 'building' },
  { label: 'State', value: 4, icon: 'flag' },
  { label: 'Country', value: 5, icon: 'world' },
  { label: 'Hidden', value: 6, icon: 'eye-off' },
  { label: 'Private', value: 7, icon: 'lock' },
];

type Props = {
  namePrefix?: string;
};

export default function LocationSection({ namePrefix = '' }: Props) {
  const n = useCallback(
    (field: string) => `${namePrefix}${field}` as const,
    [namePrefix]
  );
  const { register, control, setValue, watch, getFieldState, formState } =
    useFormContext();

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const lat = watch(n('lat'));
  const lng = watch(n('lng'));
  const latError = getFieldState(n('lat'), formState).error?.message;
  const lngError = getFieldState(n('lng'), formState).error?.message;

  // ── Init Leaflet once ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    import('leaflet').then((L) => {
      const map = L.map(mapRef.current!).setView([28.3949, 84.124], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setValue(n('lat'), parseFloat(lat.toFixed(6)), {
          shouldValidate: true,
        });
        setValue(n('lng'), parseFloat(lng.toFixed(6)), {
          shouldValidate: true,
        });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }
      });

      leafletMap.current = map;
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
      markerRef.current = null;
    };
  }, [n, setValue]);

  // ── Sync marker if lat/lng set externally (e.g. edit mode) ────────────────
  useEffect(() => {
    if (!leafletMap.current || lat == null || lng == null) return;
    const map = leafletMap.current;
    import('leaflet').then((L) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
      map.setView([lat, lng], 13);
    });
  }, [lat, lng]);

  return (
    <div className="space-y-6">
      {/* MAP */}
      <div className="space-y-2">
        <Label>Pin location</Label>
        <div
          ref={mapRef}
          className="h-64 w-full rounded-lg overflow-hidden border border-border"
        />
        <p className="text-xs text-muted">
          Click anywhere on the map to drop a pin.
        </p>
      </div>

      {/* COORDS (read-only display) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Latitude</Label>
          <Input
            {...register(n('lat'), { required: 'Select a point on the map' })}
            readOnly
            placeholder="—"
          />
          {latError && <p className="text-error text-xs mt-1">{latError}</p>}
        </div>
        <div className="space-y-1">
          <Label>Longitude</Label>
          <Input
            {...register(n('lng'), { required: 'Select a point on the map' })}
            readOnly
            placeholder="—"
          />
          {lngError && <p className="text-error text-xs mt-1">{lngError}</p>}
        </div>
      </div>

      {/* ADDRESS */}
      <div className="space-y-2">
        <Label>Address</Label>
        <TextArea
          {...register(n('address'))}
          placeholder="Street address or description"
        />
      </div>

      {/* CITY / STATE / POSTAL */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label>City</Label>
          <Input {...register(n('city'))} placeholder="Nepalgunj" />
        </div>
        <div className="space-y-1">
          <Label>State</Label>
          <Input {...register(n('state'))} placeholder="Lumbini" />
        </div>
        <div className="space-y-1">
          <Label>Postal code</Label>
          <Input {...register(n('postal_code'))} placeholder="21900" />
        </div>
      </div>

      {/* COUNTRY / LABEL */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Country</Label>
          <Input {...register(n('country'))} placeholder="Nepal" />
        </div>
        <div className="space-y-1">
          <Label>Label</Label>
          <Input {...register(n('label'))} placeholder="Home, Office..." />
        </div>
      </div>

      {/* VISIBILITY */}
      <div className="space-y-2">
        <Label>Visibility</Label>
        <Controller
          control={control}
          name={n('visibility_level')}
          defaultValue={3}
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={`
                    flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-xs
                    transition-colors
                    ${
                      field.value === opt.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted hover:border-border-strong'
                    }
                  `}>
                  <i
                    className={`ti ti-${opt.icon} text-lg`}
                    aria-hidden="true"
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}

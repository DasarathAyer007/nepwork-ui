// import { useEffect, useRef } from 'react';
// import { renderToStaticMarkup } from 'react-dom/server';
// import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import * as Icons from 'lucide-react';
// import { MapPin } from 'lucide-react';
// import 'leaflet/dist/leaflet.css';
// import { LocateFixed } from 'lucide-react';
// import type { ServiceResult } from '@/features/services/types';
// interface ServiceMapViewProps {
//   services: ServiceResult[];
//   totalCount: number;
//   center: { lat: number; lng: number } | null;
//   onBoundsChange: (lat: number, lng: number, radiusKm: number) => void;
//   isLoading?: boolean;
//     permissionStatus: 'checking' | 'prompt' | 'granted' | 'denied' | 'unsupported';
//     onRequestLocation: () => void;
// }
// // Map category.icon (material-icon-style names from your backend) to a lucide icon
// const CATEGORY_ICON_MAP: Record<string, keyof typeof Icons> = {
//   yard: 'Trees',
//   cleaning_services: 'Sparkles',
//   build: 'Hammer',
//   plumbing: 'Wrench',
//   electrical_services: 'Zap',
//   handyman: 'Wrench',
//   local_shipping: 'Truck',
//   computer: 'Laptop',
//   design_services: 'Palette',
//   school: 'GraduationCap',
//   fitness_center: 'Dumbbell',
//   restaurant: 'UtensilsCrossed',
//   photo_camera: 'Camera',
//   content_cut: 'Scissors',
//   pets: 'PawPrint',
// };
// const PIN_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
// function getCategoryIcon(iconName?: string) {
//   const mapped = iconName ? CATEGORY_ICON_MAP[iconName] : undefined;
//   return mapped && Icons[mapped] ? (Icons[mapped] as typeof MapPin) : MapPin;
// }
// function getPinColor(categoryId?: string) {
//   const id = categoryId ? parseInt(categoryId, 10) : null;
//   return id == null ? PIN_COLORS[0] : PIN_COLORS[id % PIN_COLORS.length];
// }
// // Cache built divIcons per category so we don't re-render markup for every pin on every render
// const iconCache = new Map<string, L.DivIcon>();
// function getPinDivIcon(iconName: string | undefined, categoryId: string | undefined) {
//   const cacheKey = `${iconName ?? 'default'}-${categoryId ?? 'none'}`;
//   const cached = iconCache.get(cacheKey);
//   if (cached) return cached;
//   const IconComponent = getCategoryIcon(iconName);
//   const color = getPinColor(categoryId);
//   const html = renderToStaticMarkup(
//     <div
//       style={{
//         width: 32,
//         height: 32,
//         borderRadius: '50% 50% 50% 0',
//         transform: 'rotate(-45deg)',
//         background: color,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         border: '2px solid white',
//         boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
//       }}>
//       <div style={{ transform: 'rotate(45deg)', display: 'flex' }}>
//         <IconComponent size={15} color="white" strokeWidth={2.25} />
//       </div>
//     </div>
//   );
//   const divIcon = L.divIcon({ html, className: '', iconSize: [32, 32], iconAnchor: [16, 32] });
//   iconCache.set(cacheKey, divIcon);
//   return divIcon;
// }
// function MapEventsHandler({
//   onBoundsChange,
// }: {
//   onBoundsChange: (lat: number, lng: number, radiusKm: number) => void;
// }) {
//   const debounceRef = useRef<ReturnType<typeof setTimeout>>();
//   const map = useMapEvents({
//     moveend: emit,
//     zoomend: emit,
//   });
//   function emit() {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       const c = map.getCenter();
//       const bounds = map.getBounds();
//       const radiusKm = c.distanceTo(bounds.getNorthEast()) / 1000;
//       onBoundsChange(c.lat, c.lng, Math.round(radiusKm * 10) / 10);
//     }, 500);
//   }
//   return null;
// }
// function LocateControl({
//   userLocation,
//   onLocate,
// }: {
//   userLocation: { lat: number; lng: number } | null;
//   onLocate: () => void;
// }) {
//   const map = useMap();
//   useEffect(() => {
//     const LocateButton = L.Control.extend({
//       onAdd: function () {
//         const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
//         const button = L.DomUtil.create('a', '', container);
//         button.href = '#';
//         button.title = 'Go to my location';
//         button.setAttribute('aria-label', 'Go to my location');
//         button.style.display = 'flex';
//         button.style.alignItems = 'center';
//         button.style.justifyContent = 'center';
//         button.style.width = '34px';
//         button.style.height = '34px';
//         button.innerHTML = renderToStaticMarkup(<LocateFixed size={18} />);
//         L.DomEvent.on(button, 'click', (e) => {
//           L.DomEvent.stopPropagation(e);
//           L.DomEvent.preventDefault(e);
//           onLocateRef.current();
//         });
//         return container;
//       },
//     });
//     const control = new LocateButton({ position: 'bottomright' });
//     control.addTo(map);
//     return () => {
//       control.remove();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [map]);
//   // keep the click handler fresh without re-mounting the control
//   const onLocateRef = useRef(onLocate);
//   onLocateRef.current = onLocate;
//   return null;
// }
// const userLocationIcon = L.divIcon({
//   html: renderToStaticMarkup(
//     <div style={{ position: 'relative', width: 20, height: 20 }}>
//       <div
//         style={{
//           position: 'absolute',
//           inset: 0,
//           borderRadius: '50%',
//           background: '#3b82f6',
//           opacity: 0.25,
//           transform: 'scale(1.8)',
//         }}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           inset: 0,
//           borderRadius: '50%',
//           background: '#3b82f6',
//           border: '3px solid white',
//           boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
//         }}
//       />
//     </div>
//   ),
//   className: '',
//   iconSize: [20, 20],
//   iconAnchor: [10, 10],
// });
// function RecenterOnLocation({ center }: { center: { lat: number; lng: number } | null }) {
//   const map = useMap();
//   const hasRecenteredRef = useRef(false);
//   useEffect(() => {
//     if (center && !hasRecenteredRef.current) {
//       map.setView([center.lat, center.lng], 13);
//       hasRecenteredRef.current = true; // only auto-recenter once, so it doesn't fight the user's own panning later
//     }
//   }, [center, map]);
//   return null;
// }
// export default function ServiceMapView({
//   services,
//   totalCount,
//   center,
//   onBoundsChange,
//   isLoading,
//    permissionStatus,
//   onRequestLocation,
// }: ServiceMapViewProps) {
//   const fallbackCenter = { lat: 27.7172, lng: 85.324 }; // Kathmandu
//   const initialCenter = center ?? fallbackCenter;
//   return (
//     <div className="absolute inset-0">
//       <MapContainer
//         center={[initialCenter.lat, initialCenter.lng]}
//         zoom={12}
//         scrollWheelZoom
//         className="w-full h-full z-0">
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//           <MapEventsHandler onBoundsChange={onBoundsChange} />
//     <RecenterOnLocation center={center} />
//             <LocateControl userLocation={center} onLocate={onRequestLocation} />
//          {center && (
//           <Marker position={[center.lat, center.lng]} icon={userLocationIcon} zIndexOffset={1000}>
//             <Tooltip direction="top" offset={[0, -12]} opacity={1}>
//               You are here
//             </Tooltip>
//           </Marker>
//         )}
//         {services
//            .filter(
//     (
//             service
//             ): service is ServiceResult & {
//             location: NonNullable<ServiceResult["location"]>;
//             } => service.location !== null
//         )
//         .map((service) => (
//             <Marker
//               key={service.id}
//                position={[
//                 service.location.point.lat,
//                 service.location.point.lng,
//             ]}
//               icon={getPinDivIcon(service.category?.icon, service?.category?.id)}>
//               <Tooltip direction="top" offset={[0, -28]} opacity={1} sticky>
//                 <div className="flex gap-2 items-start max-w-[220px]">
//                   {service.thumbnail && (
//                     <img src={service.thumbnail} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
//                   )}
//                   <div className="min-w-0">
//                     <p className="text-body-sm font-medium truncate">{service.title}</p>
//                     <p className="text-body-sm text-on-surface-variant">{service.category?.name}</p>
//                     <p className="text-body-sm font-medium">
//                       {service.currency} {service.price}
//                       {service.price_type === 'hourly' ? '/hr' : ''}
//                     </p>
//                   </div>
//                 </div>
//               </Tooltip>
//             </Marker>
//           ))}
//       </MapContainer>
//       {isLoading && (
//         <div className="absolute bottom-4 right-4 z-[500] bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-body-sm text-on-surface-variant shadow-sm">
//           Updating results…
//         </div>
//       )}
//       <div className="absolute bottom-4 left-4 z-[500] bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-body-sm text-on-surface-variant shadow-sm">
//         {totalCount} service{totalCount === 1 ? '' : 's'} in this area
//       </div>
// {(permissionStatus === 'prompt' || permissionStatus === 'denied') && (
//   <div className="absolute inset-0 z-[400] flex items-center justify-center bg-surface-container-lowest/60 backdrop-blur-sm">
//     <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 max-w-sm text-center shadow-md">
//       <p className="text-body-md font-medium mb-1">See services near you</p>
//       <p className="text-body-sm text-on-surface-variant mb-4">
//         {permissionStatus === 'denied'
//           ? "Location is currently blocked. You can still try requesting it, or enable it manually in your browser's site settings."
//           : 'Allow location access to find jobs and services close to you on the map.'}
//       </p>
//       <button
//         onClick={onRequestLocation}
//         className="px-4 py-2 bg-primary text-on-primary rounded-md text-body-sm font-medium">
//         {permissionStatus === 'denied' ? 'Try again' : 'Allow location'}
//       </button>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }
import { useEffect, useRef } from 'react';

import type { ServiceResult } from '@/features/services/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Icons from 'lucide-react';
import { LocateFixed, MapPin } from 'lucide-react';
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

interface ServiceMapViewProps {
  services: ServiceResult[];
  totalCount: number;
  /** search center — changes as the user pans/zooms, drives the radius refetch */
  center: { lat: number; lng: number } | null;
  /** the device's actual GPS location — fixed, only used for the "you are here" marker and the locate button */
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

const CATEGORY_ICON_MAP: Record<string, keyof typeof Icons> = {
  yard: 'Trees',
  cleaning_services: 'Sparkles',
  build: 'Hammer',
  plumbing: 'Wrench',
  electrical_services: 'Zap',
  handyman: 'Wrench',
  local_shipping: 'Truck',
  computer: 'Laptop',
  design_services: 'Palette',
  school: 'GraduationCap',
  fitness_center: 'Dumbbell',
  restaurant: 'UtensilsCrossed',
  photo_camera: 'Camera',
  content_cut: 'Scissors',
  pets: 'PawPrint',
};

const PIN_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

function getCategoryIcon(iconName?: string) {
  const mapped = iconName ? CATEGORY_ICON_MAP[iconName] : undefined;
  return mapped && Icons[mapped] ? (Icons[mapped] as typeof MapPin) : MapPin;
}

// categoryId comes through as a number from the API (see sample response: "id": 12)
function getPinColor(categoryId?: number) {
  return categoryId == null
    ? PIN_COLORS[0]
    : PIN_COLORS[categoryId % PIN_COLORS.length];
}

const iconCache = new Map<string, L.DivIcon>();

function getPinDivIcon(
  iconName: string | undefined,
  categoryId: number | undefined
) {
  const cacheKey = `${iconName ?? 'default'}-${categoryId ?? 'none'}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const IconComponent = getCategoryIcon(iconName);
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
        <IconComponent size={15} color="white" strokeWidth={2.25} />
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

function MapEventsHandler({
  onBoundsChange,
}: {
  onBoundsChange: (lat: number, lng: number, radiusKm: number) => void;
}) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const map = useMapEvents({
    moveend: emit,
    zoomend: emit,
  });

  function emit() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const c = map.getCenter();
      const bounds = map.getBounds();
      const radiusKm = c.distanceTo(bounds.getNorthEast()) / 1000;
      onBoundsChange(c.lat, c.lng, Math.round(radiusKm * 10) / 10);
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

export default function ServiceMapView({
  services,
  totalCount,
  center,
  userLocation,
  onBoundsChange,
  isLoading,
  permissionStatus,
  onRequestLocation,
}: ServiceMapViewProps) {
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

        {/* Fixed device-location marker — only moves if userLocation itself changes
            (i.e. a fresh geolocation reading), never moves from panning the map. */}
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
              icon={getPinDivIcon(
                service.category?.icon,
                service.category?.id
              )}>
              <Tooltip direction="top" offset={[0, -28]} opacity={1} sticky>
                <div className="flex gap-2 items-start max-w-[220px]">
                  {service.thumbnail && (
                    <img
                      src={service.thumbnail}
                      alt=""
                      className="w-10 h-10 rounded object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-body-sm font-medium truncate">
                      {service.title}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {service.category?.name}
                    </p>
                    <p className="text-body-sm font-medium">
                      {service.currency} {service.price}
                      {service.price_type === 'hourly' ? '/hr' : ''}
                    </p>
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
        {totalCount} service{totalCount === 1 ? '' : 's'} in this area
      </div>

      {(permissionStatus === 'prompt' || permissionStatus === 'denied') && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-surface-container-lowest/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 max-w-sm text-center shadow-md">
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
    </div>
  );
}

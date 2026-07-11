import L from 'leaflet';

// Destination marker — used for the "core" location in both modes.
export const destinationIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Colored pins built as inline SVG divIcons so they inherit the app's CSS
// variables instead of depending on an external image asset.
function createPinDivIcon(colorVar: string) {
  return L.divIcon({
    className: 'map-pin-icon',
    html: `
      <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 24 14 24s14-13.5 14-24c0-7.73-6.27-14-14-14z"
              fill="${colorVar}" stroke="white" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="5.5" fill="white"/>
      </svg>
    `,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -34],
  });
}

// User-added start point (via search or map click) in non-interactive mode.
export const startPointIcon = createPinDivIcon('var(--color-primary, #004f60)');

// User's current location, in either mode.
export const currentLocationIcon = createPinDivIcon('#2e7d32');

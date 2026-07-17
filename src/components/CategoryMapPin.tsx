import L from 'leaflet';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export const CATEGORY_MAP_PIN_WIDTH = 32;
export const CATEGORY_MAP_PIN_HEIGHT = 42;

const DEFAULT_PIN_COLOR = '#3b82f6';
const ICON_SIZE = 16;
const ICON_OFFSET = (CATEGORY_MAP_PIN_WIDTH - ICON_SIZE) / 2;


const PIN_PATH =
  'M16 0C7.163 0 0 7.163 0 16c0 11.2 13.55 25.28 15.2 26.98a1.1 1.1 0 0 0 1.6 0C18.45 41.28 32 27.2 32 16 32 7.163 24.837 0 16 0z';

function toPascalCase(name: string) {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function resolveIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName) return Icons.CircleHelp;
  const Icon = Icons[toPascalCase(iconName) as keyof typeof Icons] as
    | LucideIcon
    | undefined;
  return Icon ?? Icons.CircleHelp;
}

interface CategoryMapPinProps {
  iconName?: string | null;
  color?: string | null;
}

export default function CategoryMapPin({ iconName, color }: CategoryMapPinProps) {
  const pinColor = color || DEFAULT_PIN_COLOR;
  const icon = createElement(resolveIcon(iconName), {
    width: ICON_SIZE,
    height: ICON_SIZE,
    color: pinColor,
    strokeWidth: 2,
  });

  return (
    <svg
      width={CATEGORY_MAP_PIN_WIDTH}
      height={CATEGORY_MAP_PIN_HEIGHT}
      viewBox={`0 0 ${CATEGORY_MAP_PIN_WIDTH} ${CATEGORY_MAP_PIN_HEIGHT}`}
      style={{ display: 'block', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))' }}>
      <path d={PIN_PATH} fill={pinColor} stroke="white" strokeWidth={1.5} />
      <circle cx={16} cy={16} r={11.5} fill="white" />
      <g transform={`translate(${ICON_OFFSET}, ${ICON_OFFSET})`}>{icon}</g>
    </svg>
  );
}

const iconCache = new Map<string, L.DivIcon>();

/** Builds (and caches) a Leaflet `L.DivIcon` for a category pin, keyed by
 * icon name + color so identical categories share one icon instance. */
export function getCategoryMapPinIcon(
  iconName: string | null | undefined,
  color: string | null | undefined
): L.DivIcon {
  const pinColor = color || DEFAULT_PIN_COLOR;
  const cacheKey = `${iconName ?? 'default'}-${pinColor}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const html = renderToStaticMarkup(
    <CategoryMapPin iconName={iconName} color={color} />
  );

  const divIcon = L.divIcon({
    html,
    className: '',
    iconSize: [CATEGORY_MAP_PIN_WIDTH, CATEGORY_MAP_PIN_HEIGHT],
    iconAnchor: [CATEGORY_MAP_PIN_WIDTH / 2, CATEGORY_MAP_PIN_HEIGHT],
  });
  iconCache.set(cacheKey, divIcon);
  return divIcon;
}

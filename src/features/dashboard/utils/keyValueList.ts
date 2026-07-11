export interface KeyValueEntry {
  key: string;
  value: string;
}

/** The backend has historically accepted this field as either an object map
 * or an array of single-pair objects — normalize whatever comes back into a
 * flat list the KeyValueListInput editor can work with. */
export function normalizeKeyValueList(raw: unknown): KeyValueEntry[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.flatMap((item) => {
      if (item && typeof item === 'object') {
        if ('key' in item && 'value' in item) {
          const entry = item as { key: unknown; value: unknown };
          return [{ key: String(entry.key), value: String(entry.value) }];
        }
        return Object.entries(item as Record<string, unknown>).map(
          ([key, value]) => ({ key, value: String(value) })
        );
      }
      return [];
    });
  }

  if (typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>).map(
      ([key, value]) => ({ key, value: String(value) })
    );
  }

  return [];
}

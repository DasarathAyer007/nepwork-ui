import * as Dialog from '@radix-ui/react-dialog';
import { Maximize2, X } from 'lucide-react';

import LocationPicker from './LocationPicker';

interface Props {
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
  onSelect: (lat: number, lng: number) => void;
}

export default function LocationMapDialog({
  latitude,
  longitude,
  radiusKm,
  onSelect,
}: Props) {
  return (
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
              Pick a location
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="p-1.5 rounded-md hover:bg-surface-container transition-colors">
                <X size={18} className="text-on-surface-variant" />
              </button>
            </Dialog.Close>
          </div>

          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            radiusKm={radiusKm}
            onSelect={onSelect}
            height="70vh"
          />

          <p className="text-body-sm text-on-surface-variant mt-sm">
            Click anywhere on the map to drop your marker. Close this dialog
            when you're done.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

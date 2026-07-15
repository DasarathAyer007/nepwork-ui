import { useCallback, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { Minus, Plus, X } from 'lucide-react';
import Cropper, { type Area } from 'react-easy-crop';

import { getCroppedImageFile } from '@/utils/cropImage';

interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  fileName: string;
  aspect?: number;
  outputWidth?: number;
  outputHeight?: number;
  onCancel: () => void;
  onSave: (file: File) => void;
  className?: string;
}

export function ImageCropDialog({
  open,
  imageSrc,
  fileName,
  aspect = 3 / 2,
  outputWidth = 1200,
  outputHeight = 800,
  onCancel,
  onSave,
  className,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) onCancel();
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setSaving(true);
      const file = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        fileName,
        outputWidth,
        outputHeight
      );
      onSave(file);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-sm" />
        <Dialog.Content
          className={` fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
            rounded-lg bg-surface-container-lowest shadow-lg border border-outline-variant p-4
           overflow-y-auto ${className ?? ''}`}>
          <div className="flex items-center justify-between mb-3">
            <Dialog.Title className="text-title-md font-bold text-on-surface">
              Crop your thumbnail
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onCancel}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="relative aspect-3/2 bg-surface-container rounded-md overflow-hidden w-4xl ">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect} // crop box keeps its own aspect
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom + Actions row */}
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Minus size={16} className="text-on-surface-variant shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-primary cursor-pointer"
                aria-label="Zoom"
              />
              <Plus size={16} className="text-on-surface-variant shrink-0" />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-all disabled:opacity-50 cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                disabled={!croppedAreaPixels || saving}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm bg-primary text-on-primary hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

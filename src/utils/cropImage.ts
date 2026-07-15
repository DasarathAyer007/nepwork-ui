export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

/**
 * Crops an image to the given pixel area and resizes it to the target
 * output dimensions, returning a File ready for upload.
 */
export async function getCroppedImageFile(
  imageSrc: string,
  cropArea: CropArea,
  fileName: string,
  outputWidth = 1200,
  outputHeight = 800,
  mimeType = 'image/jpeg'
): Promise<File> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const outName = fileName.replace(/\.[^/.]+$/, '') + '.jpg';
        resolve(new File([blob], outName, { type: mimeType }));
      },
      mimeType,
      0.92
    );
  });
}

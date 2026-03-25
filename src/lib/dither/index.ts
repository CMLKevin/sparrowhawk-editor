import { floydSteinberg } from './floyd-steinberg';
import { atkinson } from './atkinson';
import { bayer } from './bayer';
export type { BayerSize } from './bayer';
export { floydSteinberg, atkinson, bayer };

export type DitherAlgorithm = 'floyd-steinberg' | 'atkinson' | 'bayer-4x4' | 'bayer-8x8';

/**
 * Apply a dithering algorithm to an ImageData object.
 * Works in the browser via Canvas API.
 */
export function applyDither(
  imageData: ImageData,
  algorithm: DitherAlgorithm,
  threshold: number = 128
): ImageData {
  switch (algorithm) {
    case 'floyd-steinberg':
      return floydSteinberg(imageData, threshold);
    case 'atkinson':
      return atkinson(imageData, threshold);
    case 'bayer-4x4':
      return bayer(imageData, '4x4');
    case 'bayer-8x8':
      return bayer(imageData, '8x8');
    default:
      return imageData;
  }
}

/**
 * Convert an image URL to dithered ImageData via OffscreenCanvas.
 * Returns a data URL of the dithered result.
 */
export async function ditherImageFromUrl(
  url: string,
  algorithm: DitherAlgorithm,
  threshold: number = 128,
  maxWidth: number = 800
): Promise<string> {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });

  // Scale down if needed
  const scale = Math.min(1, maxWidth / img.width);
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const dithered = applyDither(imageData, algorithm, threshold);
  ctx.putImageData(dithered, 0, 0);

  return canvas.toDataURL('image/png');
}

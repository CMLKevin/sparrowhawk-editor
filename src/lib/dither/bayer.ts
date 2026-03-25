/**
 * Bayer ordered dithering (threshold map).
 * Creates a regular, pattern-based dither. Common matrix sizes: 2x2, 4x4, 8x8.
 */

// 4x4 Bayer threshold matrix (normalized to 0-255 range)
const BAYER_4X4 = [
  [ 0, 8, 2, 10],
  [12, 4, 14,  6],
  [ 3, 11, 1,  9],
  [15, 7, 13,  5],
].map(row => row.map(v => (v / 16) * 255));

// 8x8 Bayer threshold matrix
const BAYER_8X8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map(row => row.map(v => (v / 64) * 255));

export type BayerSize = '4x4' | '8x8';

export function bayer(
  imageData: ImageData,
  matrixSize: BayerSize = '4x4',
  spread: number = 1.0
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(new Uint8ClampedArray(data), width, height);
  const d = output.data;

  const matrix = matrixSize === '8x8' ? BAYER_8X8 : BAYER_4X4;
  const size = matrix.length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = 0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2];

      const threshold = matrix[y % size][x % size];
      // Apply spread factor — higher spread = more contrast
      const adjustedThreshold = 128 + (threshold - 128) * spread;

      const newVal = gray > adjustedThreshold ? 255 : 0;
      d[idx] = d[idx + 1] = d[idx + 2] = newVal;
    }
  }

  return output;
}

/**
 * Atkinson dithering algorithm (used by original Macintosh).
 * Distributes only 3/4 of the error, creating a lighter, more contrasty result.
 * Error kernel:
 *     [*] 1/8 1/8
 * 1/8 1/8 1/8
 *     1/8
 */
export function atkinson(
  imageData: ImageData,
  threshold: number = 128
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(new Uint8ClampedArray(data), width, height);
  const d = output.data;

  const distribute = (x: number, y: number, error: number) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = (y * width + x) * 4;
      const portion = error / 8;
      d[idx] += portion;
      d[idx + 1] += portion;
      d[idx + 2] += portion;
    }
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = 0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2];
      const newVal = gray < threshold ? 0 : 255;
      const error = gray - newVal;

      d[idx] = d[idx + 1] = d[idx + 2] = newVal;

      // Atkinson distributes 6/8 of error (not all of it)
      distribute(x + 1, y, error);
      distribute(x + 2, y, error);
      distribute(x - 1, y + 1, error);
      distribute(x, y + 1, error);
      distribute(x + 1, y + 1, error);
      distribute(x, y + 2, error);
    }
  }

  return output;
}

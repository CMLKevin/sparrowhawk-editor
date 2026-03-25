/**
 * Floyd-Steinberg dithering algorithm.
 * Distributes quantization error to neighboring pixels:
 *   [*] 7/16
 * 3/16 5/16 1/16
 */
export function floydSteinberg(
  imageData: ImageData,
  threshold: number = 128
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(new Uint8ClampedArray(data), width, height);
  const d = output.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Convert to grayscale
      const gray = 0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2];
      const newVal = gray < threshold ? 0 : 255;
      const error = gray - newVal;

      d[idx] = d[idx + 1] = d[idx + 2] = newVal;

      // Distribute error
      if (x + 1 < width) {
        const i = (y * width + x + 1) * 4;
        d[i] += error * 7 / 16;
        d[i + 1] += error * 7 / 16;
        d[i + 2] += error * 7 / 16;
      }
      if (y + 1 < height) {
        if (x - 1 >= 0) {
          const i = ((y + 1) * width + x - 1) * 4;
          d[i] += error * 3 / 16;
          d[i + 1] += error * 3 / 16;
          d[i + 2] += error * 3 / 16;
        }
        {
          const i = ((y + 1) * width + x) * 4;
          d[i] += error * 5 / 16;
          d[i + 1] += error * 5 / 16;
          d[i + 2] += error * 5 / 16;
        }
        if (x + 1 < width) {
          const i = ((y + 1) * width + x + 1) * 4;
          d[i] += error * 1 / 16;
          d[i + 1] += error * 1 / 16;
          d[i + 2] += error * 1 / 16;
        }
      }
    }
  }

  return output;
}

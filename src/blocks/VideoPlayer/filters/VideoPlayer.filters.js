/* global Math */
function getColorValue(value) {
  if (value > 255) {
    return 255;
  } if (value < 0) {
    return 0;
  }
  return value;
}

export function contrast(imageData, change) {
  const pixels = imageData.data;

  const contrastValue = ((100 + change) / 100) ** 2;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const rg = ((((r / 255) - 0.5) * contrastValue) + 0.5) * 255;
    const gg = ((((g / 255) - 0.5) * contrastValue) + 0.5) * 255;
    const bg = ((((b / 255) - 0.5) * contrastValue) + 0.5) * 255;

    pixels[i] = getColorValue(rg);
    pixels[i + 1] = getColorValue(gg);
    pixels[i + 2] = getColorValue(bg);
  }
  return imageData;
}

export function brightness(imageData, change) {
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    pixels[i] = r + change;
    pixels[i + 1] = g + change;
    pixels[i + 2] = b + change;
  }
  return imageData;
}

const filters = {
  brightness,
  contrast,
};

export default filters;

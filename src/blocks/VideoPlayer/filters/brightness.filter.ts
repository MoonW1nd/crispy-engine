export default function brightness(imageData, change) {
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

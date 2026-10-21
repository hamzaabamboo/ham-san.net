import sharp from 'sharp';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error(
    'usage: node tools/room-harness/key_acrylic_print.mjs <green-screen.jpg> <out.png>'
  );
  process.exit(1);
}

const targetWidth = 1024;
const targetHeight = 1536;

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const pixelCount = info.width * info.height;
const background = new Uint8Array(pixelCount);
for (let pixel = 0; pixel < pixelCount; pixel += 1) {
  const index = pixel * 4;
  const g = data[index + 1];
  if (g > 120 && g - Math.max(data[index], data[index + 2]) > 60) background[pixel] = 1;
}
const nearBackground = (x, y) => {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < info.width &&
        ny < info.height &&
        background[ny * info.width + nx]
      )
        return true;
    }
  }
  return false;
};
let transparent = 0;
for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const pixel = y * info.width + x;
    const index = pixel * 4;
    if (background[pixel]) {
      data[index + 3] = 0;
      transparent += 1;
      continue;
    }
    if (!nearBackground(x, y)) continue;
    const r = data[index];
    const b = data[index + 2];
    const dominance = data[index + 1] - Math.max(r, b);
    if (dominance > 18) {
      data[index + 1] = Math.max(r, b);
      data[index + 3] = Math.round(255 * Math.min(1, Math.max(0, (60 - dominance) / 42)));
    }
  }
}

const keyed = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
const scale = Math.min(targetWidth / info.width, targetHeight / info.height);
const width = Math.round(info.width * scale);
const height = Math.round(info.height * scale);
const resized = await keyed.resize(width, height, { kernel: 'lanczos3' }).png().toBuffer();
await sharp({
  create: {
    width: targetWidth,
    height: targetHeight,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
  .composite([
    {
      input: resized,
      left: Math.round((targetWidth - width) / 2),
      top: Math.round((targetHeight - height) / 2)
    }
  ])
  .png()
  .toFile(output);

console.log(`${output}: ${((transparent / pixelCount) * 100).toFixed(1)}% background removed`);

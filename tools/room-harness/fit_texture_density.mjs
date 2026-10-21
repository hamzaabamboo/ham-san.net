import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';

const [input, output, densityArg] = process.argv.slice(2);
if (!input || !output) {
  console.error(
    'usage: bun tools/room-harness/fit_texture_density.mjs <in.glb> <out.glb> [pixelsPerMetre]'
  );
  process.exit(1);
}

const pixelsPerMetre = Number(densityArg ?? 2400);
const minSide = 512;
const maxSide = 2048;

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const document = await io.read(input);
const root = document.getRoot();

const meshExtent = new Map();
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const { min, max } = getBounds(node);
  const extent = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
  if (Number.isFinite(extent)) meshExtent.set(mesh, Math.max(meshExtent.get(mesh) ?? 0, extent));
}

const materialExtent = new Map();
for (const mesh of root.listMeshes()) {
  const extent = meshExtent.get(mesh);
  if (extent === undefined) continue;
  for (const primitive of mesh.listPrimitives()) {
    const material = primitive.getMaterial();
    if (material) materialExtent.set(material, Math.max(materialExtent.get(material) ?? 0, extent));
  }
}

const powerOfTwoAtLeast = (value) => 2 ** Math.ceil(Math.log2(Math.max(value, 1)));
let before = 0;
let after = 0;
const report = [];

for (const texture of root.listTextures()) {
  const size = texture.getSize();
  const image = texture.getImage();
  if (!size || !image) continue;
  const extent = Math.max(
    0,
    ...texture
      .listParents()
      .filter((parent) => materialExtent.has(parent))
      .map((material) => materialExtent.get(material))
  );
  const [width, height] = size;
  before += width * height;
  const target = Math.min(
    Math.max(width, height),
    Math.min(maxSide, Math.max(minSide, powerOfTwoAtLeast(extent * pixelsPerMetre)))
  );
  if (!extent || target >= Math.max(width, height)) {
    after += width * height;
    continue;
  }
  const scale = target / Math.max(width, height);
  const nextWidth = Math.max(1, Math.round(width * scale));
  const nextHeight = Math.max(1, Math.round(height * scale));
  const resized = await sharp(image)
    .resize(nextWidth, nextHeight, { kernel: 'lanczos3' })
    .webp({ quality: 88, effort: 4 })
    .toBuffer();
  texture.setImage(new Uint8Array(resized)).setMimeType('image/webp');
  after += nextWidth * nextHeight;
  report.push(
    `${texture.getName() || texture.getURI()}: ${width}x${height} -> ${nextWidth}x${nextHeight} (extent ${extent.toFixed(2)} m)`
  );
}

const meshopt = document
  .getRoot()
  .listExtensionsUsed()
  .find((extension) => extension instanceof EXTMeshoptCompression);
meshopt?.setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
await io.write(output, document);

console.log(report.join('\n'));
console.log(
  `resized ${report.length} textures; texels ${(before / 1e6).toFixed(1)}M -> ${(after / 1e6).toFixed(1)}M`
);

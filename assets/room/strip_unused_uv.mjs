import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const [input, output] = process.argv.slice(2);
assert(input && output && input !== output);
const original = readFileSync(input);
assert.equal(original.readUInt32LE(0), 0x46546c67);
assert.equal(original.readUInt32LE(4), 2);
assert.equal(original.readUInt32LE(8), original.length);
assert.equal(original.readUInt32LE(16), 0x4e4f534a);
const jsonLength = original.readUInt32LE(12);
const document = JSON.parse(original.subarray(20, 20 + jsonLength).toString());
const binary = original.subarray(28 + jsonLength);
assert.equal(original.readUInt32LE(24 + jsonLength), 0x004e4942);
assert.equal(original.readUInt32LE(20 + jsonLength), binary.length);
assert.equal(document.buffers.length, 1);
assert(!document.buffers[0].uri);
assert(document.bufferViews.every((view) => view.buffer === 0 && !view.extensions));
assert(document.images.every((image) => Number.isInteger(image.bufferView)));
assert(!document.animations?.length && !document.skins?.length);
assert(!document.extensionsUsed?.includes('KHR_draco_mesh_compression'));
const usedChannels = (material) => {
  const channels = new Set();
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    for (const [key, item] of Object.entries(value)) {
      if (key.endsWith('Texture') && item && typeof item.index === 'number') {
        channels.add(item.extensions?.KHR_texture_transform?.texCoord ?? item.texCoord ?? 0);
      } else visit(item);
    }
  };
  visit(material);
  return channels;
};
let removedChannels = 0;
const retained = new Set();
for (const mesh of document.meshes) {
  for (const primitive of mesh.primitives) {
    assert(!primitive.extensions);
    const channels = usedChannels(document.materials?.[primitive.material]);
    for (const semantic of Object.keys(primitive.attributes)) {
      if (semantic.startsWith('TEXCOORD_') && !channels.has(Number(semantic.slice(9)))) {
        delete primitive.attributes[semantic];
        removedChannels++;
      }
    }
    Object.values(primitive.attributes).forEach((index) => retained.add(index));
    if (primitive.indices !== undefined) retained.add(primitive.indices);
    for (const target of primitive.targets ?? []) {
      Object.values(target).forEach((index) => retained.add(index));
    }
  }
}
const accessorMap = new Map();
document.accessors = document.accessors.filter((accessor, index) => {
  assert(!accessor.sparse);
  if (!retained.has(index)) return false;
  accessorMap.set(index, accessorMap.size);
  return true;
});
for (const mesh of document.meshes) {
  for (const primitive of mesh.primitives) {
    for (const attributes of [primitive.attributes, ...(primitive.targets ?? [])]) {
      for (const key of Object.keys(attributes)) attributes[key] = accessorMap.get(attributes[key]);
    }
    if (primitive.indices !== undefined) primitive.indices = accessorMap.get(primitive.indices);
  }
}
const views = new Set(document.accessors.map((accessor) => accessor.bufferView));
for (const image of document.images ?? []) views.add(image.bufferView);
const viewMap = new Map();
const chunks = [];
let offset = 0;
document.bufferViews = document.bufferViews.filter((view, index) => {
  if (!views.has(index)) return false;
  viewMap.set(index, viewMap.size);
  const padding = (4 - offset % 4) % 4;
  if (padding) chunks.push(Buffer.alloc(padding));
  offset += padding;
  const bytes = binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength);
  assert.equal(bytes.length, view.byteLength);
  chunks.push(bytes);
  view.byteOffset = offset;
  offset += bytes.length;
  return true;
});
for (const accessor of document.accessors) accessor.bufferView = viewMap.get(accessor.bufferView);
for (const image of document.images ?? []) image.bufferView = viewMap.get(image.bufferView);
document.buffers[0].byteLength = offset;
const payload = Buffer.concat([...chunks, Buffer.alloc((4 - offset % 4) % 4)]);
const encoded = Buffer.from(JSON.stringify(document));
const json = Buffer.concat([encoded, Buffer.alloc((4 - encoded.length % 4) % 4, 0x20)]);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + json.length + payload.length, 8);
header.writeUInt32LE(json.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
const binaryHeader = Buffer.alloc(8);
binaryHeader.writeUInt32LE(payload.length, 0);
binaryHeader.writeUInt32LE(0x004e4942, 4);
const result = Buffer.concat([header, json, binaryHeader, payload]);
writeFileSync(output, result);
console.log({ removedChannels, before: original.length, after: result.length, saved: original.length - result.length });

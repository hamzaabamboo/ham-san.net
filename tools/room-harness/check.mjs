import { createHash } from 'node:crypto'
import { readFile, stat, realpath } from 'node:fs/promises'
import { resolve, relative, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateComparison } from './comparison.mjs'
import { decodeImage } from './decode-image.mjs'

const repo = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const paths = {
  blend: 'assets/room/room.blend',
  candidate: 'assets/room/room-web-candidate.glb',
  export: 'assets/room/room-web-current.glb',
  lean: 'assets/room/room-web-lean.glb',
  public: 'apps/astro/public/models/room.glb',
  detailedRegression: 'tools/room-harness/fixtures/room-detailed-regression.glb',
  poster: 'assets/room/textures/illustrated-posters-minimal.png',
  spec: 'conductor/room-spec.md',
  task: 'conductor/CURRENT_TASK.md'
}
const runtimePaths = [
  'apps/astro/src/components/home/room-runtime.ts',
  'apps/astro/src/components/home/room-copy.ts',
  'apps/astro/src/components/home/room-logic.ts',
  'apps/astro/src/components/home/RoomHome.astro'
]
const posterObjects = [
  'Blue banner illustrated print',
  'Closet anime illustrated print',
  'Closet portrait illustrated print'
]
const canonicalPublicHash = 'c139bf14398e736969fbfc37b4ca123f67dd1371f06821d6059562455291db01'
const archivedMinimalHash = '3a29972c5aab6b8582bb407405d3d494604f4361bcf20798f2bdbfb22a34c5f1'
const candidatePosterMaterial = 'Illustrated poster atlas'
const detailedPosterMaterial = 'Restored illustrated poster set'
const posterImage = 'illustrated-posters-minimal'
const exportPosterNode = 'Web Blue banner illustrated print'
const archivedMinimalStructure = { nodes: 72, meshes: 69, materials: 42, images: 8 }
const canonicalArtifactStructure = { nodes: 133, meshes: 130, materials: 66, images: 18 }
const usage = 'Usage: bun tools/room-harness/check.mjs [--help] [--evidence <repo-relative-json>]\n\nWithout --evidence, the artifact checks run but the gate remains not_verified.\n--evidence requires a repository-relative JSON receipt.\n'

function parseArgs(args) {
  if (args.length === 0) return {}
  if (args.includes('--help')) {
    if (args.length !== 1) throw new Error('--help cannot be combined with other arguments')
    return { help: true }
  }
  let evidence
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== '--evidence') throw new Error(`unknown argument: ${args[index]}`)
    if (evidence !== undefined) throw new Error('--evidence may be provided once')
    const value = args[index + 1]
    if (!value || value.startsWith('--')) throw new Error('--evidence requires a JSON path')
    evidence = value
    index += 1
  }
  return { evidence }
}

function result(id, status, details) {
  return { id, status, details }
}

async function readArtifact(path) {
  const bytes = await readFile(resolve(repo, path))
  if (bytes.length < 20) throw new Error(`${path}: shorter than GLB header`)
  if (bytes.readUInt32LE(0) !== 0x46546c67) throw new Error(`${path}: invalid GLB magic`)
  if (bytes.readUInt32LE(4) !== 2) throw new Error(`${path}: unsupported GLB version`)
  const declaredLength = bytes.readUInt32LE(8)
  if (declaredLength !== bytes.length) throw new Error(`${path}: declared length ${declaredLength} != ${bytes.length}`)
  let offset = 12
  let json
  let chunks = 0
  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) throw new Error(`${path}: truncated chunk header`)
    const chunkLength = bytes.readUInt32LE(offset)
    if (chunkLength % 4 !== 0) throw new Error(`${path}: unaligned chunk length`)
    const chunkType = bytes.readUInt32LE(offset + 4)
    const start = offset + 8
    const end = start + chunkLength
    if (end > bytes.length) throw new Error(`${path}: chunk exceeds declared length`)
    if (chunks === 0) {
      if (chunkType !== 0x4e4f534a) throw new Error(`${path}: first chunk is not JSON`)
      json = JSON.parse(bytes.subarray(start, end).toString('utf8').trim())
    }
    offset = end
    chunks += 1
  }
  if (offset !== bytes.length || !chunks) throw new Error(`${path}: invalid chunk layout`)
  return { bytes, json }
}

async function sha256(path) {
  const bytes = await readFile(resolve(repo, path))
  return createHash('sha256').update(bytes).digest('hex')
}

function idsFromSpec(spec) {
  const ids = [...new Set([...spec.matchAll(/^\|\s*([A-Z]+-\d+[a-z]?)\s*\|/gm)].map((match) => match[1]))]
  if (!ids.length) throw new Error('room-spec.md: no requirement rows found')
  return ids
}

function taskCoverage(text) {
  const ids = new Set()
  let columns
  for (const line of text.split('\n')) {
    if (!line.startsWith('|')) { columns = undefined; continue }
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (cells.includes('Task') && cells.includes('Requirement IDs')) { columns = cells; continue }
    if (!columns) continue
    const task = cells[columns.indexOf('Task')]
    const state = cells[columns.indexOf('State')]
    if (!/^[A-Z]+-[A-Z0-9-]+(?:\s*\/\s*[A-Z]+-[A-Z0-9-]+)*$/.test(task ?? '') || !state) continue
    for (const id of (cells[columns.indexOf('Requirement IDs')] ?? '').match(/\b[A-Z]+-\d+[a-z]?\b/g) ?? []) ids.add(id)
  }
  return ids
}

function posterDetails(json, materialName) {
  const materialIndex = (json.materials ?? []).findIndex((material) => material.name === materialName)
  if (materialIndex < 0) throw new Error(`missing material ${materialName}`)
  const material = json.materials[materialIndex]
  const textureIndex = material.pbrMetallicRoughness?.baseColorTexture?.index
  if (!Number.isInteger(textureIndex)) throw new Error(`${materialName}: missing base-color texture`)
  const texture = json.textures?.[textureIndex]
  const image = Number.isInteger(texture?.source) ? json.images?.[texture.source] : undefined
  if (image?.name !== posterImage || image?.mimeType !== 'image/png') {
    throw new Error(`${materialName}: expected PNG image ${posterImage}`)
  }
  const nodes = []
  for (const node of json.nodes ?? []) {
    const mesh = json.meshes?.[node.mesh]
    if (mesh?.primitives?.some((primitive) => primitive.material === materialIndex)) nodes.push(node.name)
  }
  if (!nodes.includes(exportPosterNode)) throw new Error(`${materialName}: missing merged export node ${exportPosterNode}`)
  return { material: materialName, image: posterImage, nodes }
}

function structure(json, expected, label) {
  const actual = {
    nodes: (json.nodes ?? []).length,
    meshes: (json.meshes ?? []).length,
    materials: (json.materials ?? []).length,
    images: (json.images ?? []).length
  }
  for (const [key, value] of Object.entries(expected)) {
    if (actual[key] !== value) throw new Error(`${label} structure ${key}: expected ${value}, got ${actual[key]}`)
  }
  return actual
}

function withinRepo(path) {
  if (isAbsolute(path)) return false
  const candidate = resolve(repo, path)
  return relative(repo, candidate) && !relative(repo, candidate).startsWith('../')
}

async function validateReference(reference, repoReal) {
  if (!reference || typeof reference.source !== 'string' || !withinRepo(reference.source)) throw new Error('reference source must be repo-relative')
  let actual
  try {
    actual = await realpath(resolve(repo, reference.source))
  } catch {
    throw new Error('reference source file unavailable')
  }
  const rel = relative(repoReal, actual)
  if (!rel || rel.startsWith('../') || isAbsolute(rel)) throw new Error('reference source symlink outside repo')
  if (!(await stat(actual)).isFile()) throw new Error('reference source must be a regular file')
  const digest = createHash('sha256').update(await readFile(actual)).digest('hex')
  if (digest !== reference.sha256) throw new Error('reference hash mismatch')
}

function validateBrowser(browser, publicHash, publicBytes) {
  if (!browser || typeof browser.url !== 'string') throw new Error('browser evidence required')
  let url
  try {
    url = new URL(browser.url)
  } catch {
    throw new Error('browser evidence required')
  }
  if (!['http:', 'https:'].includes(url.protocol) || !['127.0.0.1', 'localhost'].includes(url.hostname)) throw new Error('local browser URL required')
  if (browser.modelHash !== publicHash || browser.decodedBodySize !== publicBytes || browser.reloaded !== true) throw new Error('browser model mismatch')
}

async function validateImages(images, repoReal, decodedImages) {
  if (!Array.isArray(images) || !images.length) throw new Error('image evidence required')
  for (const evidence of images) {
    if (typeof evidence.path !== 'string' || !withinRepo(evidence.path)) throw new Error('image path outside repo')
    const actual = await realpath(resolve(repo, evidence.path))
    const rel = relative(repoReal, actual)
    if (!rel || rel.startsWith('../') || isAbsolute(rel)) throw new Error('image symlink outside repo')
    const bytes = await readFile(actual)
    const png = bytes.length > 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.toString('ascii', 12, 16) === 'IHDR' && bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(20) > 0
    const jpeg = bytes.length > 4 && bytes[0] === 255 && bytes[1] === 216 && bytes.at(-2) === 255 && bytes.at(-1) === 217
    const webp = bytes.length > 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
    if (!png && !jpeg && !webp) throw new Error('evidence is not a supported image')
    if (createHash('sha256').update(bytes).digest('hex') !== evidence.sha256) throw new Error('image hash mismatch')
    if (!decodedImages.has(evidence.sha256)) {
      await decodeImage(actual)
      decodedImages.add(evidence.sha256)
    }
  }
}

async function validateCaptureTargets(comparison, repoReal) {
  if (comparison.kind === 'process') return
  const targets = await Promise.all([comparison.before.path, comparison.after.path].map(async (path) => {
    const actual = await realpath(resolve(repo, path))
    const rel = relative(repoReal, actual)
    if (!rel || rel.startsWith('../') || isAbsolute(rel)) throw new Error('comparison capture file outside repo')
    return actual
  }))
  if (targets[0] === targets[1]) throw new Error('distinct capture files required')
}

async function evidenceCheck(path, publicHash, expectedIds) {
  if (!path) return result('EVIDENCE-RECEIPTS', 'not_verified', 'pass --evidence <repo-relative-json>')
  if (!withinRepo(path)) return result('EVIDENCE-RECEIPTS', 'fail', 'evidence JSON must be repo-relative')
  let payload
  try {
    const actual = await realpath(resolve(repo, path))
    const rel = relative(await realpath(repo), actual)
    if (!rel || rel.startsWith('../') || isAbsolute(rel)) throw new Error('evidence JSON symlink outside repo')
    payload = JSON.parse(await readFile(actual, 'utf8'))
  } catch (error) {
    return result('EVIDENCE-RECEIPTS', 'fail', String(error.message))
  }
  try {
    if (payload?.schemaVersion !== 1 || !Array.isArray(payload.receipts)) throw new Error('schemaVersion 1 and receipts array required')
    const boundPaths = [paths.blend, paths.candidate, paths.poster, paths.spec, ...runtimePaths]
    const hashes = Object.fromEntries(await Promise.all(boundPaths.map(async (item) => [item, await sha256(item)])))
    const latestSourceTime = Math.max(...await Promise.all([...boundPaths, paths.export, paths.public].map(async (item) => (await stat(resolve(repo, item))).mtimeMs)))
    const publicBytes = (await stat(resolve(repo, paths.public))).size
    const byId = new Map()
    const invalid = []
    const warnings = []
    const repoReal = await realpath(repo)
    const decodedImages = new Set()
    for (const receipt of payload.receipts) {
      const id = receipt?.specId
      if (!expectedIds.includes(id) || byId.has(id)) throw new Error(`unknown or duplicate requirement: ${id}`)
      byId.set(id, receipt)
      try {
        if (receipt.status !== 'verified' || receipt.publicHash !== publicHash) throw new Error('status or public hash mismatch')
        if (Object.entries(hashes).some(([item, hash]) => receipt.sourceHashes?.[item] !== hash)) throw new Error('source fingerprint mismatch')
        const capturedAt = Date.parse(receipt.capturedAt)
        if (!Number.isFinite(capturedAt) || capturedAt > Date.now()) throw new Error('invalid or future capture time')
        if (capturedAt < latestSourceTime) warnings.push({
          specId: id,
          message: 'capture predates current source/export mtime; matching content hashes are authoritative and mtime is not provenance'
        })
        if (!receipt.reviewer?.trim() || !receipt.observation?.trim()) throw new Error('reviewer and observation required')
        const process = receipt.comparison?.kind === 'process'
        if (!process || receipt.browser !== undefined) validateBrowser(receipt.browser, publicHash, publicBytes)
        if (!process || receipt.images !== undefined) await validateImages(receipt.images, repoReal, decodedImages)
        if (id === 'ART-01' && JSON.stringify(receipt.posterObjects) !== JSON.stringify(posterObjects)) throw new Error('poster object coverage missing')
        validateComparison(receipt)
        await validateReference(receipt.comparison.reference, repoReal)
        await validateCaptureTargets(receipt.comparison, repoReal)
      } catch (error) {
        invalid.push({ specId: id, reason: String(error.message) })
      }
    }
    const missing = expectedIds.filter((id) => !byId.has(id))
    return result('EVIDENCE-RECEIPTS', missing.length || invalid.length ? 'not_verified' : 'pass', {
      path, publicHash, missing, invalid, warnings,
      limitation: 'Verifies evidence linkage only. Capture claims and visual acceptance require independent review; this is not room approval.'
    })
  } catch (error) {
    return result('EVIDENCE-RECEIPTS', 'fail', String(error.message))
  }
}

async function main() {
  let args
  try {
    args = parseArgs(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`${error.message}\n${usage}`)
    process.exitCode = 2
    return
  }
  if (args.help) {
    process.stdout.write(usage)
    return
  }
  const checks = []
  let publicHash
  let expectedIds = []

  try {
    const spec = await readFile(resolve(repo, paths.spec), 'utf8')
    expectedIds = idsFromSpec(spec)
    checks.push(result('SPEC-LEDGER', 'pass', { path: paths.spec, specIds: expectedIds.length }))
    const task = await readFile(resolve(repo, paths.task), 'utf8')
    const covered = taskCoverage(task)
    const orphanIds = expectedIds.filter((id) => !covered.has(id))
    checks.push(result('TASK-MAP', orphanIds.length ? 'not_verified' : 'pass', {
      path: paths.task,
      orphanIds
    }))
  } catch (error) {
    checks.push(result('SPEC-LEDGER', 'fail', String(error.message)))
  }

  const artifacts = {}
  for (const [name, path] of Object.entries({ candidate: paths.candidate, export: paths.export, lean: paths.lean, public: paths.public, detailedRegression: paths.detailedRegression })) {
    try {
      artifacts[name] = await readArtifact(path)
      checks.push(result(`GLB-${name.toUpperCase()}`, 'pass', { path, bytes: artifacts[name].bytes.length }))
    } catch (error) {
      checks.push(result(`GLB-${name.toUpperCase()}`, 'fail', String(error.message)))
    }
  }

  try {
    const candidateHash = await sha256(paths.candidate)
    const leanHash = await sha256(paths.lean)
    const archivedEqual = candidateHash === leanHash && candidateHash === archivedMinimalHash
    checks.push(result('ARCHIVED-MINIMAL-HASH', archivedEqual ? 'pass' : 'fail', {
      candidateHash,
      leanHash,
      archivedMinimalHash,
      equal: candidateHash === leanHash,
      expected: candidateHash === archivedMinimalHash
    }))
    const exportHash = await sha256(paths.export)
    publicHash = await sha256(paths.public)
    const equal = exportHash === publicHash
    const expected = publicHash === canonicalPublicHash
    checks.push(result('PUBLIC-EXPORT-HASH', equal && expected ? 'pass' : 'fail', {
      exportHash,
      publicHash,
      canonicalPublicHash,
      equal,
      expected
    }))
  } catch (error) {
    checks.push(result('PUBLIC-EXPORT-HASH', 'fail', String(error.message)))
  }

  try {
    const files = await Promise.all(Object.values(paths).map(async (path) => [path, await stat(resolve(repo, path))]))
    const mtime = new Map(files)
    const exportTime = mtime.get(paths.export).mtimeMs
    const newerSources = [paths.blend, paths.poster].filter((path) => mtime.get(path).mtimeMs > exportTime)
    checks.push(result('SOURCE-FRESHNESS', newerSources.length ? 'fail' : 'pass', {
      export: paths.export,
      exportMtimeMs: exportTime,
      newerSources,
      limitation: 'Timestamp heuristic only; does not establish source-to-export provenance.'
    }))
  } catch (error) {
    checks.push(result('SOURCE-FRESHNESS', 'fail', String(error.message)))
  }

  try {
    const candidatePoster = posterDetails(artifacts.candidate.json, candidatePosterMaterial)
    const leanPoster = posterDetails(artifacts.lean.json, candidatePosterMaterial)
    const exportPoster = posterDetails(artifacts.export.json, detailedPosterMaterial)
    const publicPoster = posterDetails(artifacts.public.json, detailedPosterMaterial)
    checks.push(result('POSTER-ATLAS', 'pass', {
      expectedSourceObjects: posterObjects,
      exportNode: exportPosterNode,
      archivedCandidate: candidatePoster,
      archivedLean: leanPoster,
      export: exportPoster,
      public: publicPoster,
      limitation: 'Material/image reference only; does not verify three source objects, artwork visibility, occlusion, or browser rendering.'
    }))
  } catch (error) {
    checks.push(result('POSTER-ATLAS', 'fail', String(error.message)))
  }

  try {
    const candidateStructure = structure(artifacts.candidate.json, archivedMinimalStructure, 'archived minimal')
    const leanStructure = structure(artifacts.lean.json, archivedMinimalStructure, 'archived minimal')
    checks.push(result('ARCHIVED-MINIMAL-STRUCTURE', 'pass', {
      expected: archivedMinimalStructure,
      candidate: candidateStructure,
      lean: leanStructure
    }))
  } catch (error) {
    checks.push(result('ARCHIVED-MINIMAL-STRUCTURE', 'fail', String(error.message)))
  }

  try {
    const exportStructure = structure(artifacts.export.json, canonicalArtifactStructure, 'canonical')
    const publicStructure = structure(artifacts.public.json, canonicalArtifactStructure, 'canonical')
    checks.push(result('CANONICAL-STRUCTURE', 'pass', {
      expected: canonicalArtifactStructure,
      export: exportStructure,
      public: publicStructure
    }))
  } catch (error) {
    checks.push(result('CANONICAL-STRUCTURE', 'fail', String(error.message)))
  }

  try {
    const detailedExportPoster = posterDetails(artifacts.export.json, detailedPosterMaterial)
    const publicPoster = posterDetails(artifacts.public.json, detailedPosterMaterial)
    const archivedPoster = posterDetails(artifacts.detailedRegression.json, detailedPosterMaterial)
    checks.push(result('DETAILED-POSTER-MATERIAL', 'pass', {
      export: detailedExportPoster,
      public: publicPoster,
      detailedRegression: archivedPoster,
      limitation: 'Validates only the accepted poster material/image reference; visual artwork visibility and occlusion still require independent browser review.'
    }))
  } catch (error) {
    checks.push(result('DETAILED-POSTER-MATERIAL', 'fail', String(error.message)))
  }

  checks.push(await evidenceCheck(args.evidence, publicHash, expectedIds))
  const failed = checks.filter((check) => check.status !== 'pass')
  process.stdout.write(`${JSON.stringify({ scope: 'static-artifact-only', checks, exit: failed.length ? 1 : 0 }, null, 2)}\n`)
  process.exitCode = failed.length ? 1 : 0
}

main().catch((error) => {
  process.stdout.write(`${JSON.stringify({ scope: 'static-artifact-only', checks: [result('HARNESS', 'fail', String(error.message))], exit: 1 }, null, 2)}\n`)
  process.exitCode = 1
})

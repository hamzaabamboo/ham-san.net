import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, symlink, utimes, writeFile, cp } from 'node:fs/promises'
import { promisify } from 'node:util'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const projectRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const checkSource = join(projectRoot, 'tools/room-harness/check.mjs')
const comparisonSource = join(projectRoot, 'tools/room-harness/comparison.mjs')
const decodeImageSource = join(projectRoot, 'tools/room-harness/decode-image.mjs')
const posterObjects = [
  'Blue banner illustrated print',
  'Closet anime illustrated print',
  'Closet portrait illustrated print'
]
const boundPaths = [
  'assets/room/room.blend',
  'assets/room/textures/illustrated-posters.png',
  'conductor/room-spec.md',
  'apps/astro/src/components/home/room-runtime.ts',
  'apps/astro/src/components/home/room-copy.ts',
  'apps/astro/src/components/home/room-logic.ts',
  'apps/astro/src/components/home/RoomHome.astro'
]
const ids = ['AUTH-01', 'ART-01', 'VAL-01', 'DOC-01']
const referencePath = 'conductor/reference.md'
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')

function glb() {
  const json = Buffer.from(JSON.stringify({
    asset: { version: '2.0' },
    materials: [{ name: 'Restored illustrated poster set', pbrMetallicRoughness: { baseColorTexture: { index: 0 } } }],
    textures: [{ source: 0 }],
    images: [{ name: 'illustrated-posters', mimeType: 'image/png' }],
    meshes: [{ primitives: [{ material: 0 }] }],
    nodes: [{ name: 'Web Blue banner illustrated print', mesh: 0 }]
  }))
  const padded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)])
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(20 + padded.length, 8)
  const chunk = Buffer.alloc(8)
  chunk.writeUInt32LE(padded.length, 0)
  chunk.writeUInt32LE(0x4e4f534a, 4)
  return Buffer.concat([header, chunk, padded])
}

async function hash(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex')
}

async function makeFixture(taskRequirements = ids) {
  const root = await mkdtemp(join('/tmp', 'room-harness-synthetic-'))
  await mkdir(join(root, 'tools/room-harness'), { recursive: true })
  await cp(checkSource, join(root, 'tools/room-harness/check.mjs'))
  await cp(comparisonSource, join(root, 'tools/room-harness/comparison.mjs'))
  await cp(decodeImageSource, join(root, 'tools/room-harness/decode-image.mjs'))
  for (const path of boundPaths) {
    const fullPath = join(root, path)
    await mkdir(dirname(fullPath), { recursive: true })
    await writeFile(fullPath, path.endsWith('.png') ? png : Buffer.from(`synthetic ${path}`))
  }
  await mkdir(join(root, 'apps/astro/public/models'), { recursive: true })
  const model = glb()
  for (const path of ['assets/room/room-web-current.glb', 'assets/room/room-web-lean.glb', 'apps/astro/public/models/room.glb']) {
    const fullPath = join(root, path)
    await mkdir(dirname(fullPath), { recursive: true })
    await writeFile(fullPath, model)
  }
  await writeFile(join(root, 'conductor/room-spec.md'), [
    '# Synthetic room spec',
    '',
    '## 1.1',
    '',
    '| ID | Requirement |',
    '| --- | --- |',
    '| AUTH-01 | prose mapping must not count |',
    '| ART-01 | poster evidence |',
    '| VAL-01 | export evidence |',
    '',
    '## Detailed requirements',
    '',
    '| ID | Requirement |',
    '| --- | --- |',
    '| DOC-01 | detailed requirement coverage |',
    '',
    '## 2. End',
    ''
  ].join('\n'))
  await writeFile(join(root, 'conductor/CURRENT_TASK.md'), [
    '# Synthetic current task',
    '',
    'AUTH-01 appears here only as prose.',
    '',
    '| Task | State | Requirement IDs |',
    '| --- | --- | --- |',
    `| HARNESS-TEST | open | ${taskRequirements.join(' / ')} |`,
    ''
  ].join('\n'))
  await writeFile(join(root, referencePath), Buffer.from('synthetic reference'))
  const sourceTime = Date.now() - 10_000
  for (const path of [...boundPaths, 'assets/room/room-web-current.glb', 'assets/room/room-web-lean.glb', 'apps/astro/public/models/room.glb']) {
    const seconds = sourceTime / 1000
    await utimes(join(root, path), seconds, seconds)
  }
  return root
}

async function runHarness(root, args = []) {
  try {
    const result = await execFileAsync(process.execPath, [join(root, 'tools/room-harness/check.mjs'), ...args], {
      cwd: root,
      maxBuffer: 2 * 1024 * 1024
    })
    return { code: 0, stdout: result.stdout, stderr: result.stderr }
  } catch (error) {
    return { code: Number(error.code), stdout: error.stdout ?? '', stderr: error.stderr ?? '' }
  }
}

function comparisonFor(specId, publicHash, beforePath, beforeHash, afterPath, afterHash, referenceHash) {
  const criteria = [{
    id: `${specId.toLowerCase()}-criterion`,
    expected: 'synthetic requirement state',
    observed: 'synthetic requirement state',
    verdict: 'pass',
    regressions: []
  }]
  const review = {
    author: 'synthetic-author',
    reviewer: 'synthetic-reviewer',
    observation: 'independent synthetic review',
    reproducedBy: 'synthetic-reviewer',
    reproduction: 'repeated synthetic fixture check'
  }
  if (specId === 'ART-01') {
    const conditions = {
      position: [0, 1, 2],
      target: [3, 4, 5],
      fov: 45,
      viewport: [1280, 720],
      renderer: 'WebGLRenderer',
      lighting: 'scene lights',
      curtains: 'open',
      locale: 'en',
      sceneTime: 'day',
      exposure: 0
    }
    return {
      kind: 'visual',
      reference: { source: referencePath, region: 'poster wall', sha256: referenceHash },
      criteria,
      review,
      before: { path: beforePath, sha256: beforeHash, artifactHash: 'b'.repeat(64), conditions },
      after: { path: afterPath, sha256: afterHash, artifactHash: publicHash, conditions: { ...conditions } },
      unchangedReason: 'synthetic captures intentionally show the unchanged state'
    }
  }
  return {
    kind: 'process',
    reference: { source: referencePath, region: 'export workflow', sha256: referenceHash },
    criteria,
    review,
    before: 'synthetic source state',
    after: 'synthetic export state'
  }
}

async function validEvidence(root, imagePath = 'evidence/capture.png') {
  const evidenceFile = join(root, imagePath)
  const afterImagePath = 'evidence/after.png'
  const afterEvidenceFile = join(root, afterImagePath)
  await mkdir(dirname(evidenceFile), { recursive: true })
  await mkdir(dirname(afterEvidenceFile), { recursive: true })
  if (imagePath.endsWith('.png')) await writeFile(evidenceFile, png)
  await writeFile(afterEvidenceFile, png)
  const publicPath = join(root, 'apps/astro/public/models/room.glb')
  const publicHash = await hash(publicPath)
  const sourceHashes = Object.fromEntries(await Promise.all(boundPaths.map(async (path) => [path, await hash(join(root, path))])))
  const capturedAt = new Date(Date.now() - 500).toISOString()
  const imageHash = await hash(evidenceFile)
  const afterImageHash = await hash(afterEvidenceFile)
  const referenceHash = await hash(join(root, referencePath))
  const browser = {
    url: 'http://127.0.0.1:4321/',
    modelHash: publicHash,
    decodedBodySize: (await readFile(publicPath)).length,
    reloaded: true
  }
  const receipts = ids.map((specId) => ({
    specId,
    status: 'verified',
    publicHash,
    sourceHashes: { ...sourceHashes },
    capturedAt,
    reviewer: 'synthetic fixture',
    observation: 'synthetic schema linkage only',
    browser: { ...browser },
    images: [
      { path: imagePath, sha256: imageHash },
      { path: afterImagePath, sha256: afterImageHash }
    ],
    comparison: comparisonFor(specId, publicHash, imagePath, imageHash, afterImagePath, afterImageHash, referenceHash),
    ...(specId === 'ART-01' ? { posterObjects: [...posterObjects] } : {})
  }))
  const path = 'evidence/receipts.json'
  await mkdir(dirname(join(root, path)), { recursive: true })
  await writeFile(join(root, path), JSON.stringify({ schemaVersion: 1, receipts }, null, 2))
  return { path, receipts, publicHash }
}

function output(result) {
  return JSON.parse(result.stdout)
}

async function main() {
  const cases = []
  const run = async (name, callback, taskRequirements = ids) => {
    const root = await makeFixture(taskRequirements)
    try {
      const result = await callback(root)
      cases.push({ name, ...result })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }

  await run('prose-only requirement mapping rejected', async (root) => {
    const result = await runHarness(root)
    const body = output(result)
    const taskMap = body.checks.find((check) => check.id === 'TASK-MAP')
    assert.equal(result.code, 1)
    assert.equal(taskMap.status, 'not_verified')
    assert.deepEqual(taskMap.details.orphanIds, ['AUTH-01'])
    return { code: result.code, status: taskMap.status, orphanIds: taskMap.details.orphanIds }
  }, ['ART-01', 'VAL-01', 'DOC-01'])

  await run('detailed-table requirement ID is required', async (root) => {
    const result = await runHarness(root)
    const body = output(result)
    const taskMap = body.checks.find((check) => check.id === 'TASK-MAP')
    assert.equal(result.code, 1)
    assert.equal(taskMap.status, 'not_verified')
    assert.deepEqual(taskMap.details.orphanIds, ['DOC-01'])
    return { code: result.code, status: taskMap.status, orphanIds: taskMap.details.orphanIds }
  }, ['AUTH-01', 'ART-01', 'VAL-01'])

  await run('arbitrary source file cannot masquerade as image evidence', async (root) => {
    const evidence = await validEvidence(root, 'tools/room-harness/check.mjs')
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.every((item) => item.reason.includes('supported image')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('correctly hashed truncated PNG rejected by decoder', async (root) => {
    const evidence = await validEvidence(root)
    const truncatedPath = 'evidence/truncated.png'
    const truncatedFile = join(root, truncatedPath)
    await writeFile(truncatedFile, png.subarray(0, 32))
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].images[0] = { path: truncatedPath, sha256: await hash(truncatedFile) }
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('image decode failed')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('stale runtime source hash rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].sourceHashes['apps/astro/src/components/home/room-runtime.ts'] = '0'.repeat(64)
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('source fingerprint mismatch')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('missing screenshots rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[1].images = []
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('image evidence required')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('visual receipt without browser rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    delete payload.receipts[1].browser
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('browser evidence required')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('stale capture time warns without invalidation', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].capturedAt = new Date(Date.now() - 60_000).toISOString()
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 0)
    assert.equal(receipt.status, 'pass')
    assert(receipt.details.warnings.some((warning) => warning.specId === 'AUTH-01'))
    return { code: result.code, status: receipt.status, warnings: receipt.details.warnings.length }
  })

  await run('touched unchanged source warns without invalidation', async (root) => {
    const evidence = await validEvidence(root)
    const touchedPath = join(root, 'apps/astro/src/components/home/room-runtime.ts')
    const now = Date.now() / 1000
    await utimes(touchedPath, now, now)
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 0)
    assert.equal(receipt.status, 'pass')
    assert(receipt.details.warnings.some((warning) => warning.specId === 'AUTH-01'))
    return { code: result.code, status: receipt.status, warnings: receipt.details.warnings.length }
  })

  await run('future capture time rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].capturedAt = new Date(Date.now() + 60_000).toISOString()
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('invalid or future capture time')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('invalid capture time rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].capturedAt = 'not-a-timestamp'
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('invalid or future capture time')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('missing comparison record rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    delete payload.receipts[0].comparison
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('comparison record required')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('missing comparison reference rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].comparison.reference.source = 'conductor/missing-reference.md'
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('reference source file unavailable')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('mismatched comparison reference hash rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].comparison.reference.sha256 = '0'.repeat(64)
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('reference hash mismatch')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('comparison reference escaping repo rejected', async (root) => {
    const evidence = await validEvidence(root)
    const outside = await mkdtemp(join('/tmp', 'room-harness-reference-outside-'))
    try {
      const outsideFile = join(outside, 'reference.md')
      await writeFile(outsideFile, 'synthetic reference')
      const linkedPath = join(root, 'conductor/reference-link.md')
      await symlink(outsideFile, linkedPath)
      const payloadPath = join(root, evidence.path)
      const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
      payload.receipts[0].comparison.reference.source = 'conductor/reference-link.md'
      await writeFile(payloadPath, JSON.stringify(payload, null, 2))
      const result = await runHarness(root, ['--evidence', evidence.path])
      const body = output(result)
      const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
      assert.equal(result.code, 1)
      assert.equal(receipt.status, 'not_verified')
      assert(receipt.details.invalid.some((item) => item.reason.includes('reference source symlink outside repo')))
      return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
    } finally {
      await rm(outside, { recursive: true, force: true })
    }
  })

  await run('comparison reference directory rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].comparison.reference.source = 'conductor'
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('reference source must be a regular file')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('missing visual after capture rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    delete payload.receipts[1].comparison.after
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('comparison after image linkage required')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('reused before and after capture rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[1].comparison.after.path = payload.receipts[1].comparison.before.path
    payload.receipts[1].comparison.after.sha256 = payload.receipts[1].comparison.before.sha256
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('distinct capture paths required')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('unchanged captures require justification', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    delete payload.receipts[1].comparison.unchangedReason
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('unchanged capture reason required')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('aliased before and after capture rejected', async (root) => {
    const evidence = await validEvidence(root)
    const aliasPath = join(root, 'evidence/after-link.png')
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    await symlink(join(root, payload.receipts[1].comparison.before.path), aliasPath)
    const after = payload.receipts[1].comparison.after
    after.path = 'evidence/after-link.png'
    payload.receipts[1].images.find((image) => image.path === 'evidence/after.png').path = after.path
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('distinct capture files required')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('mismatched comparison FOV rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[1].comparison.after.conditions.fov = 60
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('comparison capture conditions mismatch')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('unresolved comparison criterion rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[1].comparison.criteria[0].verdict = 'fail'
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('comparison condition unresolved')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('self-review rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].comparison.review.reviewer = payload.receipts[0].comparison.review.author
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('independent comparison review and reproduction required')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('evidence symlink escaping repo rejected', async (root) => {
    const evidence = await validEvidence(root)
    const outside = await mkdtemp(join('/tmp', 'room-harness-evidence-outside-'))
    try {
      const outsideFile = join(outside, 'receipts.json')
      await writeFile(outsideFile, await readFile(join(root, evidence.path)))
      const linkedPath = join(root, 'evidence/receipts-link.json')
      await symlink(outsideFile, linkedPath)
      const result = await runHarness(root, ['--evidence', 'evidence/receipts-link.json'])
      const body = output(result)
      const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
      assert.equal(result.code, 1)
      assert.equal(receipt.status, 'fail')
      assert(receipt.details.includes('symlink outside repo'))
      return { code: result.code, status: receipt.status, reason: receipt.details }
    } finally {
      await rm(outside, { recursive: true, force: true })
    }
  })

  await run('wrong image hash rejected', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    payload.receipts[0].images[0].sha256 = '0'.repeat(64)
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 1)
    assert.equal(receipt.status, 'not_verified')
    assert(receipt.details.invalid.some((item) => item.reason.includes('image hash mismatch')))
    return { code: result.code, status: receipt.status, reason: receipt.details.invalid[0].reason }
  })

  await run('process receipt without browser or images passes', async (root) => {
    const evidence = await validEvidence(root)
    const payloadPath = join(root, evidence.path)
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'))
    delete payload.receipts[0].browser
    delete payload.receipts[0].images
    await writeFile(payloadPath, JSON.stringify(payload, null, 2))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    assert.equal(result.code, 0)
    assert.equal(receipt.status, 'pass')
    return { code: result.code, status: receipt.status, process: 'nonvisual' }
  })

  await run('missing public GLB rejected', async (root) => {
    const evidence = await validEvidence(root)
    await rm(join(root, 'apps/astro/public/models/room.glb'))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const publicGlb = body.checks.find((check) => check.id === 'GLB-PUBLIC')
    assert.equal(result.code, 1)
    assert.equal(publicGlb.status, 'fail')
    return { code: result.code, status: publicGlb.status, reason: publicGlb.details }
  })

  await run('valid schema linkage passes without room acceptance', async (root) => {
    const evidence = await validEvidence(root)
    const payload = JSON.parse(await readFile(join(root, evidence.path), 'utf8'))
    const result = await runHarness(root, ['--evidence', evidence.path])
    const body = output(result)
    const receipt = body.checks.find((check) => check.id === 'EVIDENCE-RECEIPTS')
    const poster = body.checks.find((check) => check.id === 'POSTER-ATLAS')
    assert.equal(result.code, 0)
    assert.equal(body.scope, 'static-artifact-only')
    assert.equal(receipt.status, 'pass')
    assert(poster.details.limitation.includes('does not verify'))
    assert.equal(payload.receipts.find((item) => item.specId === 'ART-01').comparison.kind, 'visual')
    assert.equal(payload.receipts.find((item) => item.specId === 'AUTH-01').comparison.kind, 'process')
    assert.equal(payload.receipts.find((item) => item.specId === 'DOC-01').comparison.kind, 'process')
    return { code: result.code, scope: body.scope, evidence: receipt.status, visualArt: 'pass', processAuthDoc: 'pass', roomAcceptance: 'not_claimed' }
  })

  await run('help exits zero', async (root) => {
    const result = await runHarness(root, ['--help'])
    assert.equal(result.code, 0)
    assert(result.stdout.includes('Usage: bun tools/room-harness/check.mjs'))
    return { code: result.code }
  })

  await run('unknown argument exits two', async (root) => {
    const result = await runHarness(root, ['--unknown'])
    assert.equal(result.code, 2)
    return { code: result.code }
  })

  await run('missing evidence value exits two', async (root) => {
    const result = await runHarness(root, ['--evidence'])
    assert.equal(result.code, 2)
    return { code: result.code }
  })

  await run('duplicate evidence argument exits two', async (root) => {
    const result = await runHarness(root, ['--evidence', 'one.json', '--evidence', 'two.json'])
    assert.equal(result.code, 2)
    return { code: result.code }
  })

  process.stdout.write(`${JSON.stringify({ scope: 'synthetic-harness-tests', cases }, null, 2)}\n`)
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`)
  process.exitCode = 1
})

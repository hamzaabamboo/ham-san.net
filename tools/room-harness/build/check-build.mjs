import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = resolve(fileURLToPath(new URL('.', import.meta.url)))
const repo = resolve(here, '../../..')
const args = process.argv.slice(2)
const only = args.includes('--item') ? args[args.indexOf('--item') + 1] : null
const gateArg = args.includes('--gate') ? args[args.indexOf('--gate') + 1] : null
const asJson = args.includes('--json')

const plan = JSON.parse(await readFile(resolve(here, 'build-plan.json'), 'utf8'))
const audit = JSON.parse(await readFile(resolve(here, 'audit-latest.json'), 'utf8'))

const meshes = audit.objects.filter((o) => o.min && o.max)
const floor = meshes.find((o) => /^Floor base$/.test(o.name)) ?? meshes.find((o) => /floor/i.test(o.name))
if (!floor) {
  console.error('FAIL calibration: no floor mesh found; cannot map floorplan anchors')
  process.exit(2)
}
const cal = {
  x0: floor.min[0], x1: floor.max[0],
  yTop: floor.max[1], yBottom: floor.min[1],
}
const toScene = ([fx0, fy0, fx1, fy1]) => {
  const sx = (v) => cal.x0 + (v / plan.floorplan.width) * (cal.x1 - cal.x0)
  const sy = (v) => cal.yTop - (v / plan.floorplan.depth) * (cal.yTop - cal.yBottom)
  return { minX: sx(fx0), maxX: sx(fx1), minY: sy(fy1), maxY: sy(fy0) }
}
const tol = (units) => (units / plan.floorplan.width) * (cal.x1 - cal.x0)

const renderable = audit.objects.filter((o) => !o.hide_render)
const results = []
const push = (item, status, detail) => results.push({ item, status, detail })

const globalChecks = () => {
  const tris = audit.triangles_renderable
  push('BUDGET-TRIS', tris <= plan.budgets.trianglesRenderableMax ? 'pass' : 'fail', `${tris} / ${plan.budgets.trianglesRenderableMax}`)
  push('BUDGET-OBJECTS', renderable.length <= plan.budgets.objectsRenderableMax ? 'pass' : 'fail', `${renderable.length} / ${plan.budgets.objectsRenderableMax}`)
  const generic = audit.objects.filter((o) => new RegExp(plan.forbiddenNamePattern).test(o.name)).map((o) => o.name)
  push('NAMING-GENERIC', generic.length === 0 ? 'pass' : 'fail', generic.length ? generic.slice(0, 8).join(', ') : 'no generic names')
  const forbidden = audit.objects.filter((o) => plan.forbiddenObjects.some((w) => o.name.toLowerCase().includes(w))).map((o) => o.name)
  push('FORBIDDEN-OBJECTS', forbidden.length === 0 ? 'pass' : 'fail', forbidden.length ? forbidden.slice(0, 8).join(', ') : 'none')
  const outside = renderable.filter((o) => o.min && (o.max[0] < cal.x0 - 0.3 || o.min[0] > cal.x1 + 0.3 || o.max[1] < cal.yBottom - 0.3 || o.min[1] > cal.yTop + 1.4 || o.max[2] < -0.3)).map((o) => o.name)
  push('BOUNDS-ROOM', outside.length === 0 ? 'pass' : 'fail', outside.length ? `${outside.length} outside room: ${outside.slice(0, 6).join(', ')}` : 'all renderables inside room envelope')
  push('CALIBRATION', 'info', `floor x ${cal.x0}..${cal.x1}, y ${cal.yBottom}..${cal.yTop}`)
}

const itemCheck = (id, spec) => {
  const pattern = new RegExp(spec.namePattern)
  const types = spec.types ?? ['MESH', 'CURVE', 'FONT']
  let matched = audit.objects.filter((o) => types.includes(o.type) && pattern.test(o.name) && !o.hide_render)
  if (spec.requiredProps && spec.namePattern === '.*') {
    matched = matched.filter((o) => Object.entries(spec.requiredProps).some(([k, vals]) => vals.includes(String(o.props?.[k]))))
  }
  const problems = []
  if (matched.length < (spec.minObjects ?? 1)) problems.push(`objects ${matched.length} < ${spec.minObjects ?? 1}`)
  const tris = matched.reduce((s, o) => s + (o.tris ?? 0), 0)
  if (spec.maxTris && tris > spec.maxTris) problems.push(`tris ${tris} > ${spec.maxTris}`)
  if (spec.anchor && matched.length) {
    const box = toScene(spec.anchor)
    const t = tol(spec.anchorTolerance ?? 50)
    const withBounds = matched.filter((o) => o.min)
    const minX = Math.min(...withBounds.map((o) => o.min[0]))
    const maxX = Math.max(...withBounds.map((o) => o.max[0]))
    const minY = Math.min(...withBounds.map((o) => o.min[1]))
    const maxY = Math.max(...withBounds.map((o) => o.max[1]))
    const stray = withBounds.filter((o) => o.min[0] < box.minX - t || o.max[0] > box.maxX + t || o.min[1] < box.minY - t || o.max[1] > box.maxY + t)
    if (stray.length) problems.push(`${stray.length}/${withBounds.length} outside floorplan anchor (${stray.slice(0, 3).map((o) => o.name).join(', ')})`)
    if (withBounds.length && (isNaN(minX) || isNaN(maxX) || isNaN(minY) || isNaN(maxY))) problems.push('bounds unreadable')
  }
  if (spec.requiredProps) {
    for (const [key, values] of Object.entries(spec.requiredProps)) {
      const present = new Set(matched.map((o) => String(o.props?.[key])).filter((v) => v !== 'undefined'))
      const missing = values.filter((v) => !present.has(v))
      if (missing.length) problems.push(`missing ${key}=${missing.join('|')}`)
    }
  }
  if (spec.requiredMaterialsAny) {
    const mats = new Set(matched.flatMap((o) => o.materials ?? []))
    const ok = [...mats].some((m) => spec.requiredMaterialsAny.some((want) => m && m.toLowerCase().includes(want.toLowerCase())))
    if (!ok) problems.push(`no material matching ${spec.requiredMaterialsAny.join('|')}`)
  }
  if (spec.maxThickness && matched.length) {
    const thick = matched.filter((o) => o.min && Math.min(o.max[0] - o.min[0], o.max[1] - o.min[1]) > spec.maxThickness)
    if (thick.length > matched.length * 0.2) problems.push(`${thick.length}/${matched.length} thicker than ${spec.maxThickness}`)
  }
  if ((spec.minDims || spec.maxDims) && matched.length) {
    const ext = (o) => [o.max[0] - o.min[0], o.max[1] - o.min[1], o.max[2] - o.min[2]]
    const bad = matched.filter((o) => o.min).filter((o) => {
      const e = ext(o)
      const tooSmall = spec.minDims ? e.some((v, i) => v < spec.minDims[i]) : false
      const tooBig = spec.maxDims ? e.some((v, i) => v > spec.maxDims[i]) : false
      return tooSmall || tooBig
    })
    if (bad.length) problems.push(`${bad.length}/${matched.length} outside dims min ${JSON.stringify(spec.minDims ?? null)} max ${JSON.stringify(spec.maxDims ?? null)} (${bad.slice(0, 3).map((o) => o.name).join(', ')})`)
  }
  if (spec.distinctRootsMin) {
    const roots = new Set(matched.map((o) => o.name.replace(/\s+(lying body|oversized hair|face.*|cheek.*|eye.*|hand.*|mouth.*|accessory.*|\d+.*)$/i, '')))
    if (roots.size < spec.distinctRootsMin) problems.push(`distinct roots ${roots.size} < ${spec.distinctRootsMin}`)
  }
  if (spec.distinctHeightsMin && matched.length) {
    const heights = new Set(matched.filter((o) => o.min).map((o) => Math.round(o.min[2] * 20) / 20))
    if (heights.size < spec.distinctHeightsMin) problems.push(`distinct base heights ${heights.size} < ${spec.distinctHeightsMin}`)
  }
  push(id, problems.length ? 'fail' : 'pass', problems.length ? problems.join('; ') : `${matched.length} objects, ${tris} tris`)
}

globalChecks()
const physicsChecks = async () => {
  let physics
  try {
    physics = JSON.parse(await readFile(resolve(here, 'physics-latest.json'), 'utf8'))
  } catch {
    push('PHYSICS-AUDIT', 'fail', 'physics-latest.json missing; run physics_audit.py in Blender')
    return
  }
  const assembly = /Monitor|Piano|Rubik|kendama|Nikon|Tamron|Laptop|penspinning|yoyo|Desk pen|Darts accessory|Desk fan|Camera gear|Chair moulded shell|Shelf cover display|^Mouse|^Nesoberi/i
  const pairs = physics.intersections.filter((i) => !i.kind && !(assembly.test(i.a) && assembly.test(i.b)))
  const kinds = (k) => physics.intersections.filter((i) => i.kind === k)
  push('PHYSICS-PAIRS', pairs.length ? 'fail' : 'pass', pairs.length ? pairs.slice(0, 5).map((p) => `${p.a} × ${p.b}`).join('; ') : `${physics.intersections.length} pairs, all sub-assemblies`)
  push('PHYSICS-STRUCTURE', kinds('structure').length ? 'fail' : 'pass', `${kinds('structure').length} content-in-structure hits`)
  push('PHYSICS-FURNITURE', kinds('furniture').length ? 'fail' : 'pass', `${kinds('furniture').length} content-in-furniture hits`)
  push('PHYSICS-SINKS', (physics.sinks ?? []).length ? 'fail' : 'pass', `${(physics.sinks ?? []).length} objects sunk into a surface`)
  push('PHYSICS-CURVES', (physics.curve_hits ?? []).length ? 'fail' : 'pass', `${(physics.curve_hits ?? []).length} cable/string hits`)
  push('PHYSICS-COLLIDERS', (physics.collider_drift ?? []).length ? 'fail' : 'pass', `${(physics.collider_drift ?? []).length} walk colliders drifted`)
}
await physicsChecks()
const gateItems = gateArg ? plan.gates.find((g) => g.id === gateArg)?.items : null
if (gateArg && !gateItems) {
  console.error(`unknown gate ${gateArg}`)
  process.exit(2)
}
for (const [id, spec] of Object.entries(plan.items)) {
  if (only && id !== only) continue
  if (gateItems && !gateItems.includes('*') && !gateItems.includes(id)) continue
  itemCheck(id, spec)
}

const failed = results.filter((r) => r.status === 'fail')
if (asJson) {
  console.log(JSON.stringify({ calibration: cal, results, failed: failed.length }, null, 1))
} else {
  for (const r of results) console.log(`${r.status.toUpperCase().padEnd(5)} ${r.item.padEnd(22)} ${r.detail}`)
  console.log(`\n${results.length - failed.length - results.filter((r) => r.status === 'info').length} pass, ${failed.length} fail`)
}
process.exit(failed.length ? 1 : 0)

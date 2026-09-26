const text = (value) => typeof value === 'string' && value.trim().length > 0
const hash = (value) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
const vector = (value) => Array.isArray(value) && value.length === 3 && value.every(Number.isFinite)

function captureConditions(value) {
  if (!value || !vector(value.position) || !vector(value.target)) throw new Error('comparison camera vectors required')
  if (!Number.isFinite(value.fov) || value.fov <= 0 || value.fov >= 180) throw new Error('comparison FOV required')
  if (!Array.isArray(value.viewport) || value.viewport.length !== 2 || !value.viewport.every((item) => Number.isInteger(item) && item > 0)) throw new Error('comparison viewport required')
  for (const key of ['renderer', 'lighting', 'curtains', 'locale', 'sceneTime']) {
    if (!text(value[key])) throw new Error(`comparison ${key} required`)
  }
  if (!Number.isFinite(value.exposure)) throw new Error('comparison exposure required')
  return ['position', 'target', 'fov', 'viewport', 'renderer', 'lighting', 'curtains', 'locale', 'sceneTime', 'exposure'].map((key) => value[key])
}

export function validateComparison(receipt) {
  const comparison = receipt.comparison
  if (!comparison || !['visual', 'behavior', 'process'].includes(comparison.kind)) throw new Error('comparison record required')
  if (/^(GEO|AST|ART|LIT)-/.test(receipt.specId) && comparison.kind !== 'visual') throw new Error('visual requirement needs visual comparison')
  const reference = comparison.reference
  if (!reference || !text(reference.source) || !text(reference.region) || !hash(reference.sha256)) throw new Error('comparison reference and fingerprint required')
  if (!Array.isArray(comparison.criteria) || !comparison.criteria.length) throw new Error('comparison criteria required')
  const ids = new Set()
  for (const criterion of comparison.criteria) {
    if (!text(criterion.id) || ids.has(criterion.id) || !text(criterion.expected) || !text(criterion.observed)) throw new Error('unique comparison criteria with expected and observed values required')
    ids.add(criterion.id)
    if (criterion.verdict !== 'pass') throw new Error('comparison condition unresolved')
    if (!Array.isArray(criterion.regressions) || criterion.regressions.length) throw new Error('comparison regressions unresolved')
  }
  const review = comparison.review
  if (!review || !text(review.author) || !text(review.reviewer) || review.author === review.reviewer || !text(review.observation) || !text(review.reproducedBy) || !text(review.reproduction)) throw new Error('independent comparison review and reproduction required')
  if (comparison.kind === 'process') {
    if (!text(comparison.before) || !text(comparison.after)) throw new Error('process before/after observations required')
    return
  }
  for (const role of ['before', 'after']) {
    const capture = comparison[role]
    if (!capture || !hash(capture.artifactHash) || !receipt.images.some((image) => image.path === capture.path && image.sha256 === capture.sha256)) throw new Error(`comparison ${role} image linkage required`)
  }
  if (comparison.before.path === comparison.after.path) throw new Error('distinct capture paths required')
  if (comparison.before.sha256 === comparison.after.sha256 && !text(comparison.unchangedReason)) throw new Error('unchanged capture reason required')
  if (comparison.after.artifactHash !== receipt.publicHash) throw new Error('comparison AFTER artifact mismatch')
  const before = captureConditions(comparison.before.conditions)
  const after = captureConditions(comparison.after.conditions)
  if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('comparison capture conditions mismatch')
  if (comparison.kind === 'behavior' && (!text(comparison.actions) || !text(comparison.returnState))) throw new Error('behavior actions and return state required')
}

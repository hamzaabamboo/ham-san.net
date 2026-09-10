import fs from 'node:fs'
import readline from 'node:readline'
import { dirname, resolve } from 'node:path'

const [sourcePath, outputPath, cutoff] = process.argv.slice(2)
if (!sourcePath || !outputPath || !cutoff) throw new Error('Expected source, output, UTC cutoff')
const repo = '/Users/vittayapalotai.tanyawat/code/ham-san.net'
const calls = []
const outputs = new Map()
let lineNumber = 0
let lastLine = 0
let firstTimestamp
let lastTimestamp
let userMessages = 0
const redact = value => String(value)
  .replace(/gAAAAA[A-Za-z0-9_=-]{40,}/g, '[encrypted agent message unavailable]')
  .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[private-id]')
  .replace(/(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]+|https:\/\/hooks\.slack\.com\/services\/[^\s"'\\]+)/g, '[credential-redacted]')
  .replace(/data:image\/[^\s"']+/g, '[image omitted]')
  .replace(/^.*(?:FUCK|FUKING|BITCHING|SHIT.*MODELL|DUMP YOUR BRAIN).*$/gim, '[raw conversational wording omitted]')
function compact(value) {
  if (Array.isArray(value)) return value.filter(v => !['image', 'audio'].includes(v?.type)).map(compact)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([k]) => !['data', 'image_url', 'internal_chat_message_metadata_passthrough', 'stdout', 'objective', 'threadId'].includes(k))
    .map(([k, v]) => [k, compact(v)]))
  if (typeof value !== 'string') return value
  try { return compact(JSON.parse(value)) } catch {}
  const clean = redact(value)
  if (clean.length <= 2400) return clean
  return clean.slice(0, 1000) + '\n[bounded material-output excerpt; middle omitted]\n' + clean.slice(-1000)
}
for await (const line of readline.createInterface({ input: fs.createReadStream(sourcePath), crlfDelay: Infinity })) {
  lineNumber++
  const row = JSON.parse(line)
  if (row.timestamp > cutoff) break
  lastLine = lineNumber
  firstTimestamp ??= row.timestamp
  lastTimestamp = row.timestamp
  const p = row.payload ?? {}
  if (row.type === 'response_item' && p.type === 'message' && p.role === 'user') userMessages++
  if (row.type !== 'response_item') continue
  if (['function_call', 'custom_tool_call'].includes(p.type)) {
    let input = p.arguments ?? p.input ?? ''
    if (typeof input !== 'string') input = JSON.stringify(input, null, 2)
    input = input.replace(/text\(await tools\.apply_patch\(("(?:[^"\\]|\\.)*")\)\);/g, (call, encoded) => {
      const patch = JSON.parse(encoded)
      if (!/(?:CURRENT_TASK\.md|AGENTS\.md|HANDOFF|config\.toml)/.test(patch)) return call
      const paths = [...patch.matchAll(/(?:Update|Add|Delete) File: ([^\n]+)/g)].map(m => m[1])
      const kept = patch.split(/(?=\*\*\* (?:Update|Add|Delete) File: )/)
        .filter(part => /^\*\*\* (?:Update|Add|Delete) File: /.test(part) && !/^\*\*\* (?:Update|Add|Delete) File: [^\n]*(?:CURRENT_TASK\.md|AGENTS\.md|HANDOFF|config\.toml)/.test(part))
      return '[Documentation/configuration patch body omitted; paths: ' + paths.join(', ') + ']\n' + kept.join('\n')
    })
    calls.push({ line: lineNumber, timestamp: row.timestamp, name: p.name, namespace: p.namespace, id: p.call_id, input: redact(input) })
  }
  if (['function_call_output', 'custom_tool_call_output'].includes(p.type)) {
    const call = calls.find(c => c.id === p.call_id)
    if (call && /(?:sed -n|cat )[\s\S]*?(?:\.md|SKILL)/.test(call.input)) {
      outputs.set(p.call_id, { state: 'Source/document read output omitted; original invocation and coverage remain recorded' })
      continue
    }
    const value = compact(p.output)
    const encoded = JSON.stringify(value)
    outputs.set(p.call_id, encoded.length > 3000 ? { excerpt: encoded.slice(0, 1400) + '\n[bounded output omitted]\n' + encoded.slice(-1400) } : value)
  }
}
const header = '# Current-session modeling command and action ledger\n\n'
  + `CWD default: \`${repo}\`. Explicit workdir in an invocation overrides this. Source: current-project current session only, lines 1–${lastLine}, ${firstTimestamp} through ${lastTimestamp}. ${calls.length} calls; ${userMessages} direct-user message records counted, not copied.\n\n`
  + 'This is a mechanically extracted action record, not a chat or reasoning dump. Tool inputs are preserved except named privacy redactions and document/configuration patch bodies. Output excerpts are deliberately bounded; missing output is unknown, never success. Images are referenced by project paths in the full handoff. Historical commands are NOT a replay script: mutations, image generation, save/export and configuration patches require state checks; prohibited or superseded commands must not be repeated. Read-only inspection is normally safe after confirming exact scope.\n\n'
const sections = calls.map((c, i) => `## ${i + 1}. ${c.timestamp} — ${c.namespace ? c.namespace + '.' : ''}${c.name}\n\nSource line ${c.line}. CWD: project default unless invocation specifies otherwise. Intent and rerun hazards: phase interpretation in handoff sections 4, 5, 8, and 12.\n\n\`\`\`text\n${c.input}\n\`\`\`\n\nMaterial output/exit (bounded):\n\n\`\`\`json\n${JSON.stringify(outputs.get(c.id) ?? { state: 'No paired output in inspected range' }, null, 2)}\n\`\`\`\n`)
fs.mkdirSync(dirname(resolve(outputPath)), { recursive: true })
fs.writeFileSync(outputPath, header + sections.join('\n'))
console.log(JSON.stringify({ output: outputPath, calls: calls.length, sourceLines: lastLine, firstTimestamp, lastTimestamp, userMessages, bytes: fs.statSync(outputPath).size }))

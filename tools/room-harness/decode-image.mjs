import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execute = promisify(execFile)

export async function decodeImage(path) {
  const directory = await mkdtemp(join(tmpdir(), 'room-harness-decode-'))
  try {
    const output = join(directory, 'decoded.bmp')
    await execute('/usr/bin/sips', ['-Z', '2048', '-s', 'format', 'bmp', path, '--out', output], {
      timeout: 10000,
      maxBuffer: 16384
    })
    const bytes = await readFile(output)
    if (bytes.length < 54 || bytes.toString('ascii', 0, 2) !== 'BM' || bytes.readUInt32LE(2) !== bytes.length || bytes.readUInt32LE(10) >= bytes.length) throw new Error('decoded raster is invalid')
  } catch (error) {
    throw new Error(`image decode failed: ${error.code ?? error.message}`)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(resolve(root, 'docs/assets-manifest.json'), 'utf8'))
const capture = manifest.captureEnvironment

assert.equal(manifest.schemaVersion, 1, 'unsupported asset manifest schema')
assert.ok(capture?.playwrightCli, 'capture Playwright CLI version missing')
assert.ok(capture?.chromiumUserAgent, 'capture Chromium user agent missing')
assert.equal(capture?.deviceScaleFactor, 1, 'approved captures require deviceScaleFactor 1')
assert.ok(capture?.python && capture?.pillow, 'capture Python/Pillow versions missing')
assert.ok(Array.isArray(capture?.fonts) && capture.fonts.length >= 2, 'capture font fingerprints missing')
for (const font of capture.fonts) {
  assert.match(font.sha256, /^[a-f0-9]{64}$/, `${font.file}: invalid font SHA-256`)
  assert.ok(font.bytes > 0, `${font.file}: invalid font byte length`)
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function pngMetadata(buffer) {
  assert.equal(buffer.subarray(1, 4).toString('ascii'), 'PNG', 'invalid PNG signature')
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), frames: 1 }
}

function gifMetadata(buffer) {
  assert.match(buffer.subarray(0, 6).toString('ascii'), /^GIF8[79]a$/, 'invalid GIF signature')
  let offset = 13
  const packed = buffer[10]
  if (packed & 0x80) offset += 3 * (2 ** ((packed & 0x07) + 1))
  let frames = 0
  const skipSubBlocks = () => {
    while (offset < buffer.length) {
      const size = buffer[offset]
      offset += 1
      if (size === 0) return
      offset += size
    }
    assert.fail('unterminated GIF sub-block')
  }
  while (offset < buffer.length) {
    const marker = buffer[offset]
    offset += 1
    if (marker === 0x3b) break
    if (marker === 0x21) {
      offset += 1
      skipSubBlocks()
      continue
    }
    assert.equal(marker, 0x2c, `unexpected GIF marker 0x${marker.toString(16)}`)
    frames += 1
    const imagePacked = buffer[offset + 8]
    offset += 9
    if (imagePacked & 0x80) offset += 3 * (2 ** ((imagePacked & 0x07) + 1))
    offset += 1
    skipSubBlocks()
  }
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8), frames }
}

function svgMetadata(buffer) {
  const source = buffer.toString('utf8')
  const width = Number(source.match(/<svg[^>]*\bwidth="([0-9.]+)"/)?.[1])
  const height = Number(source.match(/<svg[^>]*\bheight="([0-9.]+)"/)?.[1])
  assert.ok(Number.isFinite(width) && Number.isFinite(height), 'SVG width/height missing')
  return { width, height, frames: 1 }
}

for (const asset of manifest.assets) {
  const path = resolve(root, 'docs', asset.file)
  const buffer = await readFile(path)
  const extension = extname(asset.file).toLowerCase()
  const metadata = extension === '.png'
    ? pngMetadata(buffer)
    : extension === '.gif'
      ? gifMetadata(buffer)
      : svgMetadata(buffer)
  assert.equal(buffer.length, asset.bytes, `${asset.file}: byte length drift`)
  assert.equal(sha256(buffer), asset.sha256, `${asset.file}: SHA-256 drift`)
  assert.deepEqual(metadata, {
    width: asset.width,
    height: asset.height,
    frames: asset.frames,
  }, `${asset.file}: media metadata drift`)
}

console.log(`verified ${manifest.assets.length} committed assets against docs/assets-manifest.json`)

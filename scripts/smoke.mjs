import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [pkgText, patch, client, server, preview, demoHtml, demoApp, demoCore] = await Promise.all([
  readFile(resolve(root, 'package.json'), 'utf8'),
  readFile(resolve(root, 'cordis.patch.yml'), 'utf8'),
  readFile(resolve(root, 'lib/client.js'), 'utf8'),
  readFile(resolve(root, 'lib/index.js'), 'utf8'),
  readFile(resolve(root, 'docs/preview.svg'), 'utf8').catch(() => ''),
  readFile(resolve(root, 'demo/index.html'), 'utf8'),
  readFile(resolve(root, 'demo/app.js'), 'utf8'),
  readFile(resolve(root, 'demo/core.js'), 'utf8'),
])
const pkg = JSON.parse(pkgText)
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
assert.equal(pkg.dsh.client.platform, 'web')
assert.match(patch, /name: 'dsh-agent-skyline'/)
assert.match(client, /window\.__ModuleLoader__\.load/)
assert.match(client, /conversation\.session\.header\.actions/)
assert.match(client, /HISTORY_STORAGE_KEY/)
assert.match(server, /export function apply\(\) \{\}/)
assert.ok(client.length > 50_000)
if (preview) {
  assert.match(preview, /^<svg xmlns=/)
  assert.doesNotMatch(preview, /SYNTHETIC_SECRET_PROMPT|Authorization: Bearer|\/Users\/example\/private/)
}
assert.match(demoHtml, /id="skyline-canvas"/)
assert.match(demoHtml, /src="\.\/core\.js"/)
assert.match(demoHtml, /src="\.\/app\.js"/)
assert.match(demoHtml, /Get the plugin/)
assert.match(demoApp, /window\.AgentSkylineDemo/)
assert.match(demoCore, /window\.AgentSkylineCore/)
assert.doesNotMatch(`${demoHtml}\n${demoApp}\n${demoCore}`, /SYNTHETIC_SECRET_PROMPT|Authorization: Bearer|\/Users\/example\/private/)

// Execute the built browser module against a minimal DSH-shaped host. This
// catches broken bundle wrappers and verifies the exact slot registration
// contract without requiring a network-installed DSH runtime.
let loadedModule = null
let browserExports = null
const appendedStyles = []
const documentStub = {
  body: {},
  head: { appendChild(node) { appendedStyles.push(node) } },
  createElement(tagName) {
    return {
      tagName,
      dataset: {},
      textContent: '',
      removed: false,
      remove() { this.removed = true },
    }
  },
}
const reactStub = {
  createElement() { return null },
  useCallback(callback) { return callback },
  useEffect() {},
  useMemo(factory) { return factory() },
  useRef(value) { return { current: value } },
  useState(value) { return [typeof value === 'function' ? value() : value, () => {}] },
}
const requireStub = name => {
  if (name === 'react') return reactStub
  if (name === 'react-dom') return { createPortal(value) { return value } }
  throw new Error(`Unexpected browser dependency: ${name}`)
}
const windowStub = {
  __ModuleLoader__: {
    load(definition) {
      loadedModule = definition
      browserExports = definition.factory(requireStub)
    },
  },
}
vm.runInNewContext(client, {
  window: windowStub,
  document: documentStub,
  console,
  Date,
  Math,
  Intl,
  Object,
  Array,
  Map,
  Set,
  RegExp,
  String,
  Number,
  Boolean,
  JSON,
  URL,
  Blob,
  TextEncoder,
  encodeURIComponent,
  decodeURIComponent,
  setTimeout,
  clearTimeout,
  queueMicrotask,
})
assert.equal(loadedModule?.id, 'dsh-agent-skyline')
assert.deepEqual(Array.from(browserExports.inject), ['sessions', 'slots', 'locale'])
assert.equal(typeof browserExports.apply, 'function')

let slotInjectionName = null
let registeredSlot = null
let registeredComponent = null
let localeRegistration = null
const cleanup = []
const ctx = {
  effect(factory, label) {
    const dispose = factory()
    cleanup.push({ label, dispose })
    return dispose
  },
  locale: {
    register(namespace, dictionaries) {
      localeRegistration = { namespace, dictionaries }
      return () => {}
    },
  },
  slots: {
    inject(name, factory) {
      slotInjectionName = name
      factory()
      return () => {}
    },
    register(definition, component) {
      registeredSlot = definition
      registeredComponent = component
      return () => {}
    },
  },
}
browserExports.apply(ctx)
assert.equal(slotInjectionName, 'conversation.session.header.actions')
assert.equal(registeredSlot?.id, 'agent-skyline')
assert.equal(registeredSlot?.name, 'conversation.session.header.actions')
assert.equal(registeredSlot?.locale, 'agentSkyline')
assert.equal(typeof registeredComponent, 'function')
assert.doesNotThrow(() => registeredComponent({
  sessionId: 'smoke-session',
  useSession(selector) {
    return selector({ running: false, chat: { nodes: { values: () => [] } } })
  },
  t(key, values = {}) {
    return Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, String(value)), key)
  },
}))
assert.equal(localeRegistration?.namespace, 'agentSkyline')
assert.ok(localeRegistration?.dictionaries?.zh)
assert.ok(localeRegistration?.dictionaries?.en)
assert.equal(appendedStyles.length, 1)
assert.equal(appendedStyles[0].dataset.plugin, 'dsh-agent-skyline')
assert.ok(appendedStyles[0].textContent.length > 10_000)
for (const entry of cleanup.reverse()) if (typeof entry.dispose === 'function') entry.dispose()

console.log('smoke: manifest, runtime bundle, header slot, locale, CSS, and privacy surface OK')

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createRequire } = require('node:module');
const { readFileSync } = require('node:fs');
const { dirname, resolve } = require('node:path');
const { pathToFileURL } = require('node:url');

const app = createRequire(resolve(__dirname, '../package.json'));
const privy = createRequire(app.resolve('@privy-io/react-auth'));
const payment = createRequire(privy.resolve('x402/types'));
const ethereum = createRequire(privy.resolve('@walletconnect/ethereum-provider'));
const appkit = createRequire(ethereum.resolve('@reown/appkit'));
const wallet = createRequire(appkit.resolve('@reown/appkit-wallet'));
const roots = [...new Set([app, payment, wallet].map(parent => parent.resolve('zod/package.json')))];

function trackedArray(length) {
  let reads = 0;
  const value = new Array(length);
  for (let index = 0; index < length; index++) {
    Object.defineProperty(value, index, { get() { reads++; return 'valid'; } });
  }
  return { value, reads: () => reads };
}

function bounded(z, schema, kind, exact = false) {
  const method = exact ? (kind === 'array' ? 'length' : 'size') : 'max';
  if (typeof schema[method] === 'function') return schema[method](2, 'collection limit');
  const check = kind === 'array'
    ? (exact ? z.length : z.maxLength)
    : (exact ? z.size : z.maxSize);
  return schema.check(check(2, { error: 'collection limit' }));
}

function refine(z, schema, fn) {
  return typeof schema.refine === 'function' ? schema.refine(fn) : schema.check(z.refine(fn));
}

function transform(z, schema, fn) {
  return typeof schema.transform === 'function' ? schema.transform(fn) : z.pipe(schema, z.transform(fn));
}

async function checkRuntime(t, z) {
  await t.test('oversized arrays fail before element reads or refinements, including async', async () => {
    for (const exact of [false, true]) {
      let refinements = 0;
      const schema = z.object({ items: refine(z, bounded(z, z.array(z.string()), 'array', exact), () => { refinements++; return true; }) });
      for (const async of [false, true]) {
        const input = trackedArray(10_000);
        const result = async ? await schema.safeParseAsync({ items: input.value }) : schema.safeParse({ items: input.value });
        assert.equal(result.success, false);
        assert.equal(input.reads(), 0);
        assert.equal(refinements, 0);
        assert.equal(result.error.issues.length, 1);
        assert.equal(result.error.issues[0].code, 'too_big');
        assert.equal(result.error.issues[0].message, 'collection limit');
        assert.deepEqual(result.error.issues[0].path, ['items']);
      }
    }
  });

  await t.test('bounded sets and supported maps stop element transforms', async () => {
    for (const kind of ['set', 'map']) {
      let visits = 0;
      const element = transform(z, z.string(), value => { visits++; return value.toUpperCase(); });
      const collection = kind === 'set' ? z.set(element) : z.map(element, element);
      // Zod 3 maps have no upper-size API; do not invent one in the backport.
      if (kind === 'map' && !collection._zod) continue;
      for (const exact of [false, true]) {
        const schema = bounded(z, collection, kind, exact);
        const input = kind === 'set' ? new Set(['a', 'b', 'c']) : new Map([['a', 'x'], ['b', 'y'], ['c', 'z']]);
        const result = await schema.safeParseAsync(input);
        assert.equal(result.success, false);
        assert.equal(result.error.issues[0].code, 'too_big');
        assert.equal(visits, 0);
      }
    }
  });

  await t.test('valid bounds, transforms, defaults, unions and malformed element paths remain intact', async () => {
    const item = transform(z, z.string(), value => value.toUpperCase());
    const schema = z.object({ items: bounded(z, z.array(item), 'array') });
    assert.deepEqual(await schema.parseAsync({ items: ['a', 'b'] }), { items: ['A', 'B'] });
    const invalid = schema.safeParse({ items: [1] });
    assert.equal(invalid.success, false);
    assert.deepEqual(invalid.error.issues[0].path, ['items', 0]);
    const wrongType = schema.safeParse({ items: 'abc' });
    assert.equal(wrongType.success, false);
    assert.equal(wrongType.error.issues[0].code, 'invalid_type');
    const array = bounded(z, z.array(z.string()), 'array');
    const withDefault = typeof array.default === 'function' ? array.default(['fallback']) : z._default(array, ['fallback']);
    assert.deepEqual(withDefault.parse(undefined), ['fallback']);
    assert.equal(z.union([array, z.literal('all')]).parse('all'), 'all');
    const withCatch = typeof array.catch === 'function' ? array.catch(['fallback']) : z.catch(array, ['fallback']);
    assert.deepEqual(withCatch.parse(['a', 'b', 'c']), ['fallback']);
  });

  await t.test('unbounded and minimum-only collections retain their acceptance semantics', () => {
    const values = Array.from({ length: 129 }, (_, index) => String(index));
    assert.deepEqual(z.array(z.string()).parse(values), values);
    const array = z.array(z.string());
    const minimum = typeof array.min === 'function' ? array.min(2) : array.check(z.minLength(2));
    assert.deepEqual(minimum.parse(values), values);
    assert.equal(minimum.safeParse(['one']).success, false);
  });

  if (typeof z.array(z.number()).overwrite === 'function') {
    await t.test('v4 overwrite before a bound can still reduce a collection', () => {
      const schema = z.array(z.number()).overwrite(values => values.slice(0, 2)).max(2);
      assert.deepEqual(schema.parse([1, 2, 3]), [1, 2]);
    });
  }
}

test('active Zod runtime entrypoints enforce collection size bounds', async t => {
  const seen = new Set();
  for (const manifestPath of roots) {
    const directory = dirname(manifestPath);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    for (const subpath of ['.', './v3', './v4', './v4/mini']) {
      const target = manifest.exports?.[subpath];
      if (!target || typeof target === 'string') continue;
      for (const format of ['require', 'import']) {
        const file = target[format];
        if (typeof file !== 'string') continue;
        const module = format === 'require' ? require(resolve(directory, file)) : await import(pathToFileURL(resolve(directory, file)).href);
        const z = module.z ?? module;
        if (seen.has(z.array)) continue;
        seen.add(z.array);
        await t.test(`${manifest.version} ${subpath} ${format}`, child => checkRuntime(child, z));
      }
    }
    if (manifest.version === '3.22.4') {
      await t.test('3.22.4 UMD bundle', child => checkRuntime(child, require(resolve(directory, 'lib/index.umd.js'))));
    }
  }
});

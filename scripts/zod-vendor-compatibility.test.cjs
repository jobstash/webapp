'use strict';

const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { test } = require('node:test');

// Resolve every dependency through its actual importer. A pnpm store can retain
// obsolete versions, so neither store scans nor app-level Zod imports test this graph.
const app = createRequire(resolve(__dirname, '..', 'package.json'));
const privy = createRequire(app.resolve('@privy-io/react-auth'));
const x402 = createRequire(privy.resolve('x402/types'));
const ethereum = createRequire(privy.resolve('@walletconnect/ethereum-provider'));
const appkit = createRequire(ethereum.resolve('@reown/appkit'));
const wagmi = createRequire(x402.resolve('wagmi'));
const connectors = createRequire(wagmi.resolve('@wagmi/connectors'));
const base = createRequire(connectors.resolve('@base-org/account'));
const cdp = createRequire(base.resolve('@coinbase/cdp-sdk'));

const address = '0x1111111111111111111111111111111111111111';
const hashRule = () => ({ action: 'accept', operation: 'signEvmHash' });
const addressCriterion = (addresses) => ({ type: 'evmAddress', operator: 'in', addresses });
const transactionRule = (criteria) => ({ action: 'accept', operation: 'signEvmTransaction', criteria });

function issues(schema, input) {
  const result = schema.safeParse(input);
  assert.equal(result.success, false, 'malformed input must fail validation');
  assert.ok(result.error instanceof Error);
  assert.ok(result.error.issues.length > 0);
  return result.error.issues;
}

function issueAt(errors, code, path) {
  const issue = errors.find((entry) => entry.code === code &&
    JSON.stringify(entry.path) === JSON.stringify(path));
  assert.ok(issue, 'expected ' + code + ' at ' + JSON.stringify(path));
  return issue;
}

// Instrument input reads, not SDK internals. No global mocks or schema mutation.
function observedArray(length, value) {
  let reads = 0;
  const values = Array.from({ length }, () => value);
  for (let index = 0; index < length; index++) {
    Object.defineProperty(values, index, {
      enumerable: true,
      get() { reads++; return value; },
    });
  }
  return { values, reads: () => reads };
}

async function assertBound(schema, payload, maximum, value, path) {
  for (const asynchronous of [false, true]) {
    const parse = (input) => asynchronous ? schema.safeParseAsync(input) : schema.safeParse(input);
    const boundary = observedArray(maximum, value);
    const valid = await parse(payload(boundary.values));
    assert.equal(valid.success, true, 'the exact collection boundary must remain valid');
    assert.ok(boundary.reads() > 0, 'valid elements must still be validated');

    const oversized = observedArray(maximum + 1, value);
    const invalid = await parse(payload(oversized.values));
    assert.equal(invalid.success, false);
    assert.equal(oversized.reads(), 0, 'oversized collections must abort before reading elements');
    const error = issueAt(invalid.error.issues, 'too_big', path);
    assert.equal(error.maximum, maximum);
    assert.equal(error.inclusive, true);
    assert.equal(invalid.error.issues.length, 1);
  }
}

// These are offline schema calls only: no provider, wallet, client, or user session
// is instantiated. Version-specific contracts are explicit rather than inferred
// from whichever unlinked package happens to remain in node_modules.
const expectedRuleLimit = 100;
const hasPrivyErrorSchema = false;

test('active wallet dependencies preserve Zod compatibility', async (t) => {
  const payment = privy('x402/types');
  const api = privy('@privy-io/api-base');
  const coinbase = base('@coinbase/cdp-sdk');
  const abi = cdp('abitype/zod');
  const { W3mFrameSchema, W3mFrameConstants } = await import(
    pathToFileURL(appkit.resolve('@reown/appkit-wallet')).href
  );

  await t.test('Reown validates email events and unbounded metadata icons', () => {
    const email = {
      type: W3mFrameConstants.APP_CONNECT_EMAIL,
      payload: { email: 'schema-test@example.com' },
    };
    assert.deepEqual(W3mFrameSchema.appEvent.parse(email), email);
    issues(W3mFrameSchema.appEvent, { ...email, payload: { email: 'not-an-email' } });
    issues(W3mFrameSchema.appEvent, { type: 'NOT_A_WALLET_EVENT' });

    const metadata = {
      name: 'Offline schema test', description: 'No wallet connection',
      url: 'https://example.com', icons: Array(301).fill('https://example.com/icon.png'),
    };
    const sync = {
      type: W3mFrameConstants.APP_SYNC_DAPP_DATA,
      payload: { projectId: 'offline-schema-test', metadata },
    };
    assert.deepEqual(W3mFrameSchema.appEvent.parse(sync), sync);
    issues(W3mFrameSchema.appEvent, {
      ...sync, payload: { ...sync.payload, metadata: { ...metadata, icons: [42] } },
    });
  });

  if (hasPrivyErrorSchema) {
    await t.test('Privy APIError validates real error payloads and native enum codes', () => {
      assert.equal(typeof api.APIError.safeParse, 'function');
      const valid = {
        error: 'Unauthorized', cause: 'expired',
        code: api.PrivyErrorCode.MISSING_OR_INVALID_TOKEN,
      };
      assert.deepEqual(api.APIError.parse(valid), valid);
      assert.deepEqual(api.APIError.parse({ error: 'Unauthorized' }), { error: 'Unauthorized' });
      issueAt(issues(api.APIError, { error: 401 }), 'invalid_type', ['error']);
      issueAt(issues(api.APIError, { error: 'Unauthorized', cause: 1 }), 'invalid_type', ['cause']);
      issueAt(issues(api.APIError, { error: 'Unauthorized', code: 'not-a-privy-code' }),
        'invalid_enum_value', ['code']);
    });
  } else {
    // api-base 2.0 no longer exports the legacy Zod schema. Do not reach into a
    // stale api-base 1.x installation to manufacture coverage for this app.
    assert.equal(api.APIError, undefined);
    await t.test('Privy APIError schema', { skip: 'active api-base 2.0 has no APIError schema export' }, () => {});
  }

  const requirements = {
    scheme: 'exact', network: 'base', maxAmountRequired: '1000',
    resource: 'https://example.com/paid-resource', description: 'Offline fixture',
    mimeType: 'application/json', payTo: address, maxTimeoutSeconds: 60, asset: address,
    outputSchema: { answer: { type: 'string' } },
    extra: { name: 'USD Coin', version: '2', nested: { enabled: true }, count: 1 },
  };

  await t.test('x402 preserves the one-argument record contract and payment validation', () => {
    assert.deepEqual(payment.PaymentRequirementsSchema.parse(requirements), requirements);
    issueAt(issues(payment.PaymentRequirementsSchema, { ...requirements, extra: [] }),
      'invalid_type', ['extra']);
    issueAt(issues(payment.PaymentRequirementsSchema, { ...requirements, outputSchema: 'not-a-record' }),
      'invalid_type', ['outputSchema']);
    issueAt(issues(payment.PaymentRequirementsSchema, { ...requirements, maxAmountRequired: '-1' }),
      'custom', ['maxAmountRequired']);
    issueAt(issues(payment.PaymentRequirementsSchema, { ...requirements, resource: 'not-a-url' }),
      'invalid_string', ['resource']);
    issues(payment.PaymentRequirementsSchema, { ...requirements, payTo: 'not-an-address' });
    issueAt(issues(payment.PaymentRequirementsSchema, { ...requirements, maxTimeoutSeconds: 1.5 }),
      'invalid_type', ['maxTimeoutSeconds']);
  });

  await t.test('x402 money transformations, bounds, and response refinements remain functional', () => {
    assert.equal(payment.moneySchema.parse('$1.25'), 1.25);
    assert.equal(payment.moneySchema.parse('$1,234.50'), 1234.5);
    assert.equal(payment.moneySchema.parse(0.0001), 0.0001);
    assert.equal(payment.moneySchema.parse(999999999), 999999999);
    for (const malformed of [0, -1, 1000000000, {}, '']) issues(payment.moneySchema, malformed);
    const response = { x402Version: 1, accepts: Array(301).fill(requirements) };
    assert.deepEqual(payment.x402ResponseSchema.parse(response), response);
    issueAt(issues(payment.x402ResponseSchema, { ...response, x402Version: 2 }), 'custom', ['x402Version']);
    issues(payment.x402ResponseSchema, { x402Version: 1, accepts: [{}] });
  });

  await t.test('abitype address transforms and legacy ABI preprocessing remain functional', () => {
    assert.equal(abi.Address.parse(address), address);
    issueAt(issues(abi.Address, 'bad'), 'custom', []);
    for (const [flags, stateMutability] of [
      [{ constant: true }, 'view'], [{ payable: true }, 'payable'], [{}, 'nonpayable'],
    ]) {
      const parsed = abi.Abi.parse([{ type: 'function', name: 'balance', inputs: [], outputs: [], ...flags }]);
      assert.equal(parsed[0].stateMutability, stateMutability);
      assert.ok(Object.isFrozen(parsed));
      assert.ok(Object.isFrozen(parsed[0].inputs));
      assert.ok(Object.isFrozen(parsed[0].outputs));
    }
    const explicit = abi.AbiFunction.parse({
      type: 'function', name: 'balance', inputs: [], outputs: [], constant: true, stateMutability: 'pure',
    });
    assert.equal(explicit.stateMutability, 'pure');
    issues(abi.Abi, [{ type: 'function', name: 'balance', inputs: [{ type: 'not-a-solidity-type' }], outputs: [] }]);
  });

  for (const [name, schema, prefix] of [
    ['create', coinbase.CreatePolicyBodySchema, { scope: 'account' }],
    ['update', coinbase.UpdatePolicyBodySchema, {}],
  ]) {
    await t.test('Coinbase ' + name + ' policy rule boundary and malformed errors', async () => {
      const payload = (rules) => ({ ...prefix, rules });
      assert.deepEqual(schema.parse(payload([hashRule()])), payload([hashRule()]));
      issueAt(issues(schema, payload([])), 'too_small', ['rules']);
      issueAt(issues(schema, payload([{ action: 'accept', operation: 'unknown' }])),
        'invalid_union_discriminator', ['rules', 0, 'operation']);
      await assertBound(schema, payload, expectedRuleLimit, hashRule(), ['rules']);
    });

    await t.test('Coinbase ' + name + ' nested criteria and addresses abort before traversal', async () => {
      const criteriaPayload = (criteria) => ({ ...prefix, rules: [transactionRule(criteria)] });
      await assertBound(schema, criteriaPayload, 10, addressCriterion([address]), ['rules', 0, 'criteria']);
      issueAt(issues(schema, criteriaPayload([])), 'too_small', ['rules', 0, 'criteria']);
      const addressPayload = (addresses) => criteriaPayload([addressCriterion(addresses)]);
      await assertBound(schema, addressPayload, 300, address, ['rules', 0, 'criteria', 0, 'addresses']);
      issueAt(issues(schema, addressPayload(['bad'])), 'custom', ['rules', 0, 'criteria', 0, 'addresses', 0]);
      assert.deepEqual(schema.parse(addressPayload([])), addressPayload([]));
    });
  }
});

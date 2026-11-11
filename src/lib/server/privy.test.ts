import type { User } from '@privy-io/node';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/auth/session/route';
import { GET as getLinkedAccounts } from '@/app/api/profile/linked-accounts/route';
import { getDisplayName } from '@/features/auth/server/get-display-name';
import {
  extractEmbeddedWallet,
  extractExternalWallets,
  getPrivyUser,
  verifyPrivyToken,
} from './privy';

const mocks = vi.hoisted(() => ({
  verifyAccessToken: vi.fn(),
  getUser: vi.fn(),
  save: vi.fn(),
  session: {} as Record<string, unknown>,
}));

vi.mock('@privy-io/node', () => ({
  PrivyClient: class {
    utils() {
      return { auth: () => ({ verifyAccessToken: mocks.verifyAccessToken }) };
    }
    users() {
      return { _get: mocks.getUser };
    }
  },
}));
vi.mock('@/lib/env/client', () => ({
  clientEnv: {
    PRIVY_APP_ID: 'test-app',
    MW_URL: 'https://middleware.test',
  },
}));
vi.mock('@/lib/env/server', () => ({
  serverEnv: { PRIVY_APP_SECRET: 'test-secret' },
}));
vi.mock('@/lib/server/session', () => ({
  getSession: async () => Object.assign(mocks.session, { save: mocks.save }),
}));

const verified = {
  first_verified_at: 1_700_000_000,
  latest_verified_at: 1_700_000_000,
  verified_at: 1_700_000_000,
};
const user: User = {
  id: 'did:privy:test-user',
  created_at: 1_700_000_000,
  has_accepted_terms: true,
  is_guest: false,
  mfa_methods: [],
  linked_accounts: [
    {
      ...verified,
      type: 'wallet',
      address: '0x1111111111111111111111111111111111111111',
      chain_type: 'ethereum',
      wallet_client: 'unknown',
      wallet_client_type: 'metamask',
    },
    {
      ...verified,
      type: 'wallet',
      id: 'embedded-wallet',
      address: '0x2222222222222222222222222222222222222222',
      chain_id: 'eip155:1',
      chain_type: 'ethereum',
      connector_type: 'embedded',
      delegated: false,
      imported: false,
      recovery_method: 'privy-v2',
      user_can_sign: true,
      wallet_client: 'privy',
      wallet_client_type: 'privy',
      wallet_index: 0,
    },
    {
      ...verified,
      type: 'github_oauth',
      subject: 'github-user',
      username: 'developer',
      email: null,
      name: null,
    },
    {
      ...verified,
      type: 'google_oauth',
      subject: 'google-user',
      email: 'google@example.test',
      name: null,
    },
    { ...verified, type: 'email', address: 'email@example.test' },
  ],
};

const request = () =>
  new NextRequest('https://frontend.test/api/auth/session', {
    method: 'POST',
    headers: {
      authorization: 'Bearer access-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ loginMethod: 'google' }),
  });

describe('Privy Node SDK migration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.session = {};
    mocks.getUser.mockResolvedValue(user);
    mocks.verifyAccessToken.mockResolvedValue({ user_id: user.id });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('uses access-token verification and fetches the user by DID', async () => {
    await expect(verifyPrivyToken('access-token')).resolves.toEqual({
      user_id: user.id,
    });
    await expect(getPrivyUser(user.id)).resolves.toBe(user);
    expect(mocks.verifyAccessToken).toHaveBeenCalledWith('access-token');
    expect(mocks.getUser).toHaveBeenCalledWith(user.id);
  });

  it('reads snake-case wallets and preserves identity preference and fallback', () => {
    expect(extractEmbeddedWallet(user)).toBe(
      '0x2222222222222222222222222222222222222222',
    );
    expect(extractExternalWallets(user)).toEqual([user.linked_accounts[0]]);
    expect(getDisplayName(user, 'google')).toEqual({
      displayName: 'google@example.test',
      identityType: 'google',
    });
    expect(getDisplayName(user, 'email')).toEqual({
      displayName: 'email@example.test',
      identityType: 'email',
    });
    expect(getDisplayName(user, 'wallet')).toEqual({
      displayName: '0x1111...1111',
      identityType: 'wallet',
    });
    expect(getDisplayName(user, 'unsupported')).toEqual({
      displayName: 'developer',
      identityType: 'github',
    });
    expect(getDisplayName({ ...user, linked_accounts: [] })).toBeNull();
  });

  it('stores user_id claims and exchanges only a verified token', async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({
        token: 'backend-token',
        cryptoNative: true,
        permissions: ['profile:read'],
        hasVerifiedEmail: true,
      }),
    );
    vi.stubGlobal('fetch', fetch);
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(mocks.getUser).toHaveBeenCalledWith(user.id);
    expect(fetch).toHaveBeenCalledWith(
      'https://middleware.test/privy/check-wallet',
      {
        headers: { Authorization: 'Bearer access-token' },
      },
    );
    expect(mocks.session).toMatchObject({
      privyDid: user.id,
      apiToken: 'backend-token',
      displayName: 'google@example.test',
      identityType: 'google',
    });
    expect(mocks.save).toHaveBeenCalledOnce();
  });

  it('does not fetch a user or exchange rejected tokens', async () => {
    mocks.verifyAccessToken.mockRejectedValue(
      new Error('Invalid access token'),
    );
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect((await POST(request())).status).toBe(401);
    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('still requires an embedded wallet before exchanging tokens', async () => {
    mocks.getUser.mockResolvedValue({ ...user, linked_accounts: [] });
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect((await POST(request())).status).toBe(422);
    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('preserves the linked-accounts response shape and ordering', async () => {
    mocks.session = { privyDid: user.id };
    const response = await getLinkedAccounts();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: [
        { type: 'google_oauth', email: 'google@example.test', username: null },
        { type: 'github_oauth', email: null, username: 'developer' },
        {
          type: 'wallet',
          email: null,
          username: '0x1111111111111111111111111111111111111111',
        },
        {
          type: 'embedded_wallet',
          email: null,
          username: '0x2222222222222222222222222222222222222222',
        },
        { type: 'email', email: 'email@example.test', username: null },
      ],
    });
  });
});

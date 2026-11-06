import { NextResponse } from 'next/server';

import {
  extractEmbeddedWallet,
  extractExternalWallets,
  getPrivyUser,
} from '@/lib/server/privy';
import { getSession } from '@/lib/server/session';

const ROUTE_TAG = '[GET /api/profile/linked-accounts]';

export const GET = async (): Promise<NextResponse> => {
  try {
    const { privyDid } = await getSession();

    if (!privyDid) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getPrivyUser(privyDid);
    const google = user.linked_accounts.find(
      (account) => account.type === 'google_oauth',
    );
    const github = user.linked_accounts.find(
      (account) => account.type === 'github_oauth',
    );
    const email = user.linked_accounts.find(
      (account) => account.type === 'email',
    );

    const data: {
      type: string;
      email: string | null;
      username: string | null;
    }[] = [];

    if (google) {
      data.push({
        type: 'google_oauth',
        email: google.email,
        username: null,
      });
    }

    if (github) {
      data.push({
        type: 'github_oauth',
        email: github.email,
        username: github.username,
      });
    }

    for (const wallet of extractExternalWallets(user)) {
      data.push({
        type: 'wallet',
        email: null,
        username: wallet.address ?? null,
      });
    }

    const embeddedWalletAddress = extractEmbeddedWallet(user);
    if (embeddedWalletAddress) {
      data.push({
        type: 'embedded_wallet',
        email: null,
        username: embeddedWalletAddress,
      });
    }

    if (email) {
      data.push({
        type: 'email',
        email: email.address,
        username: null,
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(`${ROUTE_TAG} Unexpected error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch linked accounts' },
      { status: 502 },
    );
  }
};

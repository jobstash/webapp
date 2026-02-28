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

    const data: {
      type: string;
      email: string | null;
      username: string | null;
    }[] = [];

    if (user.google) {
      data.push({
        type: 'google_oauth',
        email: user.google.email ?? null,
        username: null,
      });
    }

    if (user.github) {
      data.push({
        type: 'github_oauth',
        email: user.github.email ?? null,
        username: user.github.username ?? null,
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

    if (user.email) {
      data.push({
        type: 'email',
        email: user.email.address ?? null,
        username: null,
      });
    }

    // TODO: Farcaster temporarily hidden
    // if (user.farcaster) {
    //   data.push({
    //     type: 'farcaster',
    //     email: null,
    //     username: user.farcaster.username ?? null,
    //   });
    // }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(`${ROUTE_TAG} Unexpected error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch linked accounts' },
      { status: 502 },
    );
  }
};

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getIronSession } from 'iron-session';
import type { KyResponse } from 'ky';

import { CLIENT_ENVS } from '@/lib/shared/core/client.env';
import { SESSION_OPTIONS } from '@/lib/shared/core/constants.server';
import type { SessionSchema } from '@/lib/auth/core/schemas';
import { getProfileInfoDtoResponse } from '@/lib/profile/core/dtos';
import { toProfileInfo } from '@/lib/profile/core/mappers';

import { kyFetch } from '@/lib/shared/data/ky-fetch';

export const GET = async () => {
  const reqCookies = await cookies();
  const session = await getIronSession<SessionSchema>(reqCookies, SESSION_OPTIONS);

  if (!session.user) {
    // TODO: log, sentry report
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  let response: KyResponse<unknown>;
  try {
    const url = `${CLIENT_ENVS.MW_URL}/profile/info`;
    response = await kyFetch.get(url, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });
  } catch (error) {
    // TODO: log, sentry report
    console.error('API fetch failed: profile info', error);
    return NextResponse.json(
      { success: false, message: 'API fetch failed' },
      { status: 500 },
    );
  }

  if (!response.ok) {
    // TODO: log, sentry report
    return NextResponse.json(
      { success: false, message: 'API fetch failed' },
      { status: 500 },
    );
  }

  let jsonData: unknown;
  try {
    jsonData = await response.json();
  } catch (error) {
    // TODO: log, sentry report
    console.error('Malformed API response: profile info', error);
  }

  const parseResult = getProfileInfoDtoResponse.safeParse(jsonData);

  if (!parseResult.success) {
    // TODO: log, sentry report
    return NextResponse.json(
      { success: false, message: 'Invalid API response' },
      { status: 500 },
    );
  }

  const parsedDto = parseResult.data;

  if (!parsedDto.success) {
    // TODO: log, sentry report
    return NextResponse.json(
      { success: false, message: 'API response failed' },
      { status: 500 },
    );
  }

  if (!parsedDto.data) {
    // TODO: log, sentry report
    return NextResponse.json(
      { success: false, message: 'No data in API response' },
      { status: 500 },
    );
  }

  console.log(JSON.stringify(parsedDto, null, 2));

  return NextResponse.json({
    success: true,
    message: 'Profile info fetched successfully',
    data: toProfileInfo(parsedDto.data),
  });
};

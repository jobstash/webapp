import { NextResponse } from 'next/server';

import { z } from 'zod';

import { APP_STATUS_KIND } from '@/lib/shared/core/constants';

import packageJson from '../../../../package.json';

const semverSchema = z
  .string('Version is required')
  .min(1, 'Version cannot be empty')
  .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format: X.Y.Z');

const parseVersion = (version: string) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

const SUCCESS_MESSAGE = 'App status checked';
const FORCE_LOGOUT_VERSIONS = new Set<string>([]);
const MAINTENANCE_VERSIONS = new Set<string>([]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentParam = searchParams.get('current');

  const currentVersionResult = semverSchema.safeParse(currentParam);
  if (!currentVersionResult.success) {
    // TODO: log error, send to sentry
    const errorMessage = z.treeifyError(currentVersionResult.error).errors.at(0);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 400 },
    );
  }

  const serverVersionResult = semverSchema.safeParse(packageJson.version);
  if (!serverVersionResult.success) {
    // TODO: log error, send to sentry
    const errorMessage = z.treeifyError(serverVersionResult.error).errors.at(0);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }

  const client = parseVersion(currentVersionResult.data);
  const server = parseVersion(serverVersionResult.data);

  const isDiff = currentVersionResult.data !== serverVersionResult.data;
  const isMajorDiff = client.major !== server.major;
  const isMinorDiff = client.minor !== server.minor;
  const isPatchDiff = client.patch !== server.patch;
  const isPatchAhead = client.patch > server.patch; // Edge: Force reload
  const isMaintenance = MAINTENANCE_VERSIONS.has(serverVersionResult.data);
  const isForceLogout = isDiff && FORCE_LOGOUT_VERSIONS.has(serverVersionResult.data);
  const isForceReload = isMajorDiff || isMinorDiff || isPatchAhead;

  if (isMaintenance) {
    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGE,
        data: {
          kind: APP_STATUS_KIND.MAINTENANCE,
          serverVersion: serverVersionResult.data,
        },
      },
      { status: 200 },
    );
  }

  if (isForceLogout) {
    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGE,
        data: {
          kind: APP_STATUS_KIND.FORCE_LOGOUT,
          serverVersion: serverVersionResult.data,
        },
      },
      { status: 200 },
    );
  }

  if (isForceReload) {
    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGE,
        data: {
          kind: APP_STATUS_KIND.FORCE_RELOAD,
          serverVersion: serverVersionResult.data,
        },
      },
      { status: 200 },
    );
  }

  if (isPatchDiff) {
    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGE,
        data: {
          kind: APP_STATUS_KIND.UPDATE_NUDGE,
          serverVersion: serverVersionResult.data,
        },
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Invalid app status state',
    },
    { status: 500 },
  );
}

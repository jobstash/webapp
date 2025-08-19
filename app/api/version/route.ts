import { NextResponse } from 'next/server';

import { z } from 'zod';

import { VERSION_CLIENT_ACTION } from '@/lib/shared/core/constants';

import packageJson from '../../../package.json';

const semverSchema = z
  .string('Version is required')
  .min(1, 'Version cannot be empty')
  .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format: X.Y.Z');

const parseVersion = (version: string) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

const SUCCESS_MESSAGE = 'Version check successful';
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

  const version = serverVersionResult.data;
  const isDiff = version !== currentVersionResult.data;
  const isFirstVisit = currentVersionResult.data === '0.0.0';
  const isMajorDiff = client.major !== server.major;
  const isMinorDiff = client.minor !== server.minor;
  const isPatchDiff = client.patch !== server.patch;
  const isPatchAhead = client.patch > server.patch; // Edge: Force reload
  const isMaintenance = MAINTENANCE_VERSIONS.has(version);
  const isForceLogout = isDiff && FORCE_LOGOUT_VERSIONS.has(version);
  const isForceReload = !isFirstVisit && (isMajorDiff || isMinorDiff || isPatchAhead);

  if (isMaintenance) {
    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGE,
        data: {
          version,
          clientAction: VERSION_CLIENT_ACTION.MAINTENANCE,
        },
      },
      { status: 200 },
    );
  }

  if (isFirstVisit) {
    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGE,
        data: {
          version,
          clientAction: VERSION_CLIENT_ACTION.NO_OP,
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
          clientAction: VERSION_CLIENT_ACTION.FORCE_LOGOUT,
          version,
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
          clientAction: VERSION_CLIENT_ACTION.FORCE_RELOAD,
          version,
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
          clientAction: VERSION_CLIENT_ACTION.UPDATE_NUDGE,
          version,
        },
      },
      { status: 200 },
    );
  }

  if (!isDiff) {
    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGE,
        data: {
          clientAction: VERSION_CLIENT_ACTION.NO_OP,
          version,
        },
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Invalid version state',
    },
    { status: 500 },
  );
}

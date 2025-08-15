import { NextResponse } from 'next/server';

import { z } from 'zod';

import {
  VERSION_CLIENT_ACTION,
  VERSION_CLIENT_ACTION_MESSAGE,
} from '@/lib/shared/core/constants';

import packageJson from '../../../package.json';

const semverSchema = z
  .string('Version is required')
  .min(1, 'Version cannot be empty')
  .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format: X.Y.Z');

const parseVersion = (version: string) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

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
  const isMajorDiff = client.major !== server.major;
  const isMinorDiff = client.minor !== server.minor;
  const isPatchDiff = client.patch !== server.patch;
  const isPatchAhead = client.patch > server.patch; // Edge: Force reload
  const isMaintenance = MAINTENANCE_VERSIONS.has(version);
  const isForceLogout = isDiff && FORCE_LOGOUT_VERSIONS.has(version);
  const isForceReload = isMajorDiff || isMinorDiff || isPatchAhead;

  if (isMaintenance) {
    const clientAction = VERSION_CLIENT_ACTION.MAINTENANCE;
    const message = VERSION_CLIENT_ACTION_MESSAGE[clientAction];
    return NextResponse.json(
      {
        success: true,
        message,
        data: {
          version,
          clientAction,
        },
      },
      { status: 200 },
    );
  }

  if (isForceLogout) {
    const clientAction = VERSION_CLIENT_ACTION.FORCE_LOGOUT;
    const message = VERSION_CLIENT_ACTION_MESSAGE[clientAction];
    return NextResponse.json(
      {
        success: true,
        message,
        data: {
          clientAction,
          version,
        },
      },
      { status: 200 },
    );
  }

  if (isForceReload) {
    const clientAction = VERSION_CLIENT_ACTION.FORCE_RELOAD;
    const message = VERSION_CLIENT_ACTION_MESSAGE[clientAction];
    return NextResponse.json(
      {
        success: true,
        message,
        data: {
          clientAction,
          version,
        },
      },
      { status: 200 },
    );
  }

  if (isPatchDiff) {
    const clientAction = VERSION_CLIENT_ACTION.UPDATE_NUDGE;
    const message = VERSION_CLIENT_ACTION_MESSAGE[clientAction];
    return NextResponse.json(
      {
        success: true,
        message,
        data: {
          clientAction,
          version,
        },
      },
      { status: 200 },
    );
  }

  if (!isDiff) {
    const clientAction = VERSION_CLIENT_ACTION.NO_OP;
    const message = VERSION_CLIENT_ACTION_MESSAGE[clientAction];
    return NextResponse.json(
      {
        success: true,
        message,
        data: {
          clientAction,
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

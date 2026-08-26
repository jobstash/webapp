import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';

import { serverEnv } from '@/lib/env/server';

const UUID_REGEX = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

const s3 = new S3Client({
  region: 'auto',
  endpoint: serverEnv.R2_ENDPOINT,
  credentials: {
    accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
  },
});

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return Response.json({ error: 'Invalid resume ID' }, { status: 400 });
  }

  try {
    const listResult = await s3.send(
      new ListObjectsV2Command({
        Bucket: serverEnv.R2_BUCKET_NAME,
        Prefix: `${id}/`,
        MaxKeys: 1,
      }),
    );

    const key = listResult.Contents?.[0]?.Key;
    if (!key) {
      return Response.json({ error: 'Resume not found' }, { status: 404 });
    }

    const object = await s3.send(
      new GetObjectCommand({
        Bucket: serverEnv.R2_BUCKET_NAME,
        Key: key,
      }),
    );
    if (!object.Body) {
      return Response.json({ error: 'Resume not found' }, { status: 404 });
    }

    const fileName = key.split('/').at(-1) ?? 'resume';
    const headers = new Headers({
      'Cache-Control': 'private, no-store',
      'Content-Disposition':
        object.ContentDisposition ??
        `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      'Content-Type': object.ContentType ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    if (object.ContentLength !== undefined) {
      headers.set('Content-Length', String(object.ContentLength));
    }

    return new Response(object.Body.transformToWebStream(), { headers });
  } catch {
    return Response.json(
      { error: 'Failed to retrieve resume' },
      { status: 502 },
    );
  }
};

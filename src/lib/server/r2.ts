import 'server-only';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

import { serverEnv } from '@/lib/env/server';

const s3 = new S3Client({
  region: 'auto',
  endpoint: serverEnv.R2_ENDPOINT,
  credentials: {
    accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadResume(
  buffer: ArrayBuffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const uuid = randomUUID();
  const key = `${uuid}/${filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: serverEnv.R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: contentType,
    }),
  );

  return uuid;
}

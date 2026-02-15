import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client) return s3Client;

  if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
    throw new Error('Missing CLOUDFLARE_ACCOUNT_ID');
  }

  if (!process.env.CLOUDFLARE_ACCESS_KEY_ID) {
    throw new Error('Missing CLOUDFLARE_ACCESS_KEY_ID');
  }

  if (!process.env.CLOUDFLARE_SECRET_ACCESS_KEY) {
    throw new Error('Missing CLOUDFLARE_SECRET_ACCESS_KEY');
  }

  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
  });

  return s3Client;
}

export const R2_BUCKET = process.env.CLOUDFLARE_BUCKET || 'freemason-uploads';
export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';

// Generate public URL for R2 objects (using custom domain or public bucket URL)
export function getR2PublicUrl(key: string): string {
  // If you set up a custom domain in R2, use that
  // Otherwise use the default R2 public URL
  const customDomain = process.env.CLOUDFLARE_CUSTOM_DOMAIN;
  if (customDomain) {
    return `https://${customDomain}/${key}`;
  }
  return `https://pub-${CLOUDFLARE_ACCOUNT_ID}.r2.dev/${key}`;
}

// Upload file to R2
export async function uploadToR2(
  bucket: string,
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
) {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await client.send(command);
  return key;
}

// Delete file from R2
export async function deleteFromR2(bucket: string, key: string) {
  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

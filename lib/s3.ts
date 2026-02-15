import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client) return s3Client;

  if (!process.env.AWS_REGION) {
    throw new Error('Missing AWS_REGION');
  }

  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('Missing AWS_ACCESS_KEY_ID');
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('Missing AWS_SECRET_ACCESS_KEY');
  }

  s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  return s3Client;
}

export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'freemason-uploads';
export const AWS_S3_REGION = process.env.AWS_REGION || 'us-east-1';

// Generate public URL for S3 objects
export function getS3PublicUrl(key: string): string {
  return `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`;
}

// Upload file to S3
export async function uploadToS3(
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

// Delete file from S3
export async function deleteFromS3(bucket: string, key: string) {
  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

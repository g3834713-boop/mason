import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import dbConnect from './mongodb';

let gridFSBucket: GridFSBucket | null = null;

async function getGridFSBucket(): Promise<GridFSBucket> {
  if (gridFSBucket) return gridFSBucket;

  // Get the MongoDB connection from existing Mongoose connection
  const mongoose = require('mongoose');
  const mongooseConnection = mongoose.connection;

  if (!mongooseConnection.client) {
    throw new Error('MongoDB client not initialized');
  }

  const db = mongooseConnection.db;
  gridFSBucket = new GridFSBucket(db);

  return gridFSBucket;
}

// Upload file to GridFS
export async function uploadFileToGridFS(
  buffer: Buffer | Uint8Array,
  filename: string,
  contentType: string
): Promise<string> {
  const bucket = await getGridFSBucket();

  return new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      metadata: {
        contentType,
        uploadedAt: new Date(),
      },
    });

    stream.on('finish', (file: { _id: ObjectId }) => {
      resolve(file._id.toString());
    });

    stream.on('error', (error) => {
      reject(error);
    });

    const readable = Readable.from(Buffer.isBuffer(buffer) ? [buffer] : [Buffer.from(buffer)]);
    readable.pipe(stream);
  });
}

// Download file from GridFS
export async function getFileFromGridFS(fileId: string): Promise<Buffer> {
  const bucket = await getGridFSBucket();

  return new Promise((resolve, reject) => {
    const stream = bucket.openDownloadStream(new ObjectId(fileId));
    const chunks: any[] = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}

// Delete file from GridFS
export async function deleteFileFromGridFS(fileId: string): Promise<void> {
  const bucket = await getGridFSBucket();

  try {
    bucket.delete(new ObjectId(fileId));
  } catch (error) {
    throw error;
  }
}

// Get GridFS file URL (for serving files)
export function getGridFSUrl(fileId: string): string {
  return `/api/file/${fileId}`;
}

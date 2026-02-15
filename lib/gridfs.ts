import { Readable } from 'stream';
import mongoose from 'mongoose';
import dbConnect from './mongodb';

let gridFSBucket: any = null;

async function getGridFSBucket() {
  if (gridFSBucket) return gridFSBucket;

  // Ensure connection is established
  await dbConnect();

  // Get the MongoDB connection from Mongoose
  const mongooseConnection = mongoose.connection;

  if (!mongooseConnection.db) {
    throw new Error('MongoDB database not initialized');
  }

  const db = mongooseConnection.db;
  
  // Use GridFSBucket from mongoose's mongodb
  const { GridFSBucket } = mongoose.mongo;
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

    stream.on('finish', (file: any) => {
      resolve(file._id.toString());
    });

    stream.on('error', (error: Error) => {
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
    const objectId = new mongoose.Types.ObjectId(fileId);
    const stream = bucket.openDownloadStream(objectId);
    const chunks: any[] = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on('error', (error: Error) => {
      reject(error);
    });
  });
}

// Delete file from GridFS
export async function deleteFileFromGridFS(fileId: string): Promise<void> {
  const bucket = await getGridFSBucket();

  try {
    const objectId = new mongoose.Types.ObjectId(fileId);
    await bucket.delete(objectId);
  } catch (error) {
    throw error;
  }
}

// Get GridFS file URL (for serving files)
export function getGridFSUrl(fileId: string): string {
  return `/api/file/${fileId}`;
}

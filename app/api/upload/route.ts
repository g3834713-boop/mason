import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { uploadFileToGridFS, getGridFSUrl } from '@/lib/gridfs';
import dbConnect from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Missing file' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    const filename = `${timestamp}-${random}${ext}`;

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to MongoDB GridFS
    try {
      const fileId = await uploadFileToGridFS(
        new Uint8Array(buffer),
        filename,
        file.type
      );

      const publicUrl = getGridFSUrl(fileId);

      return NextResponse.json({
        filename: filename,
        originalName: file.name,
        url: publicUrl,
        path: fileId,
        fileId: fileId,
      });
    } catch (gridfsError: any) {
      console.error('GridFS upload error:', gridfsError);
      return NextResponse.json(
        { error: 'Failed to upload file to MongoDB: ' + gridfsError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Upload endpoint error:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    );
  }
}

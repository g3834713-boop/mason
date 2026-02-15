import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { uploadToR2, getR2PublicUrl, R2_BUCKET } from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
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

    // Upload to Cloudflare R2
    try {
      await uploadToR2(
        R2_BUCKET,
        filename,
        new Uint8Array(buffer),
        file.type
      );
    } catch (r2Error: any) {
      console.error('Cloudflare R2 upload error:', r2Error);
      return NextResponse.json(
        { error: 'Failed to upload file to R2: ' + r2Error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const publicUrl = getR2PublicUrl(filename);

    return NextResponse.json({
      filename: filename,
      originalName: file.name,
      url: publicUrl,
      path: filename,
    });
  } catch (error: any) {
    console.error('Upload endpoint error:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    );
  }
}

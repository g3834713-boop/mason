import { NextRequest, NextResponse } from 'next/server';
import { getFileFromGridFS } from '@/lib/gridfs';
import dbConnect from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    await dbConnect();

    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    // Get file from GridFS 
    const fileBuffer = await getFileFromGridFS(fileId);

    // Convert to Buffer if needed and prepare response
    const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=31536000',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error retrieving file:', error);
    return NextResponse.json(
      { error: 'File not found or error retrieving file' },
      { status: 404 }
    );
  }
}

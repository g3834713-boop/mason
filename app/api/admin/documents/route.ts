import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DocumentModel from '@/models/Document';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    // Parse JSON body (file is now uploaded client-side)
    const body = await request.json();
    const userId = body.userId as string;
    const category = body.category as string;
    const fileName = body.fileName as string;
    const originalName = body.originalName as string;
    const fileType = body.fileType as string;
    const fileSize = body.fileSize as number;
    const filePath = body.filePath as string;
    const storagePath = body.storagePath as string;

    if (!userId || !fileName) {
      return NextResponse.json({ error: 'userId and fileName are required' }, { status: 400 });
    }

    // Create document record
    const document = await DocumentModel.create({
      userId,
      fileName,
      originalName,
      fileType,
      fileSize,
      filePath,
      uploadedBy: payload.userId,
      description: body.description || '',
      category: category || 'OTHER',
      storagePath,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Document uploaded successfully',
      document
    }, { status: 201 });
  } catch (error) {
    console.error('Upload document error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const documents = await DocumentModel.find()
      .populate('userId', 'fullName email')
      .populate('uploadedBy', 'fullName')
      .sort({ createdAt: -1 });

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error('Get all documents error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

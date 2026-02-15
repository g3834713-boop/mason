import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import { getSupabaseServerClient } from '@/lib/supabase';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'File and userId are required' }, { status: 400 });
    }

    // Upload to Supabase
    const supabase = getSupabaseServerClient();
    const timestamp = Date.now();
    const originalName = file.name;
    const ext = originalName.substring(originalName.lastIndexOf('.'));
    const storagePath = `${timestamp}-${Math.random().toString(36).substring(7)}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('documents')
      .getPublicUrl(storagePath);

    // Create document record
    const document = await DocumentModel.create({
      userId,
      fileName: storagePath,
      originalName,
      fileType: file.type,
      fileSize: file.size,
      filePath: publicUrl.publicUrl,
      uploadedBy: payload.userId,
      description: description || '',
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

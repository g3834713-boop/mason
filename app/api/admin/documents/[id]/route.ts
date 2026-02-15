import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await dbConnect();

    const document = await DocumentModel.findById(id);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Delete file from Supabase
    if (document.storagePath) {
      try {
        const supabase = getSupabaseServerClient();
        await supabase.storage.from('documents').remove([document.storagePath]);
      } catch (err) {
        console.error('Error deleting file from Supabase:', err);
      }
    }

    // Delete document record
    await DocumentModel.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Document deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DocumentModel from '@/models/Document';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    // Get user's documents
    const documents = await DocumentModel.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'fullName email');

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

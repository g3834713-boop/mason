import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recruitment from '@/models/Recruitment';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET - List all recruitment applications (admin only)
export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const applications = await Recruitment.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching recruitment applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

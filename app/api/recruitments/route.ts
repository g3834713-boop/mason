import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recruitment from '@/models/Recruitment';
import Voucher from '@/models/Voucher';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

// POST - Submit recruitment application
export async function POST(request: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { voucherCode, ...applicationData } = body;

    // Validate voucher
    const voucher = await Voucher.findOne({ code: voucherCode.toUpperCase() });

    if (!voucher) {
      return NextResponse.json({ error: 'Invalid voucher code' }, { status: 400 });
    }

    if (voucher.isUsed) {
      return NextResponse.json({ error: 'This voucher has already been used' }, { status: 400 });
    }

    // Create recruitment application
    const recruitment = await Recruitment.create({
      ...applicationData,
      userId: decoded.userId,
      voucherCode: voucherCode.toUpperCase(),
    });

    // Mark voucher as used
    voucher.isUsed = true;
    voucher.usedBy = new mongoose.Types.ObjectId(decoded.userId);
    voucher.usedAt = new Date();
    await voucher.save();

    return NextResponse.json({ 
      success: true,
      message: 'Recruitment application submitted successfully',
      applicationId: recruitment._id,
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting recruitment application:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - Get user's recruitment applications
export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const applications = await Recruitment.find({ userId: decoded.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user recruitment applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

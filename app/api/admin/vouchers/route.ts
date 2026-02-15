import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Voucher from '@/models/Voucher';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Generate random voucher code (10 characters, mixed letters and numbers)
function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like O, 0, I, 1
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET - List all vouchers (admin only)
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

    const vouchers = await Voucher.find()
      .populate('createdBy', 'fullName email')
      .populate('usedBy', 'fullName email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ vouchers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new voucher (admin only)
export async function POST(request: Request) {
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

    const { amount, currency } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Generate unique code
    let code = generateVoucherCode();
    let exists = await Voucher.findOne({ code });
    
    // Regenerate if code already exists (very unlikely)
    while (exists) {
      code = generateVoucherCode();
      exists = await Voucher.findOne({ code });
    }

    const voucher = await Voucher.create({
      code,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      createdBy: decoded.userId,
    });

    return NextResponse.json({ 
      success: true,
      voucher: {
        code: voucher.code,
        amount: voucher.amount,
        currency: voucher.currency,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating voucher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

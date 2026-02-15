import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

// POST - Validate voucher code
export async function POST(request: Request) {
  try {
    await dbConnect();

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Voucher code is required' }, { status: 400 });
    }

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });

    if (!voucher) {
      return NextResponse.json({ 
        valid: false,
        error: 'Invalid voucher code' 
      }, { status: 404 });
    }

    if (voucher.isUsed) {
      return NextResponse.json({ 
        valid: false,
        error: 'This voucher has already been used' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      valid: true,
      amount: voucher.amount,
      currency: voucher.currency,
    }, { status: 200 });
  } catch (error) {
    console.error('Error validating voucher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

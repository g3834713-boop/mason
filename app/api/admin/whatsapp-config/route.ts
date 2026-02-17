import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import WhatsAppConfig from '@/models/WhatsAppConfig';

export async function GET() {
  try {
    await dbConnect();
    
    const config = await WhatsAppConfig.findOne().sort({ updatedAt: -1 });
    
    if (config) {
      return NextResponse.json({ 
        phoneNumber: config.phoneNumber,
        formVoucherPrice: config.formVoucherPrice || 50,
        formVoucherCurrency: config.formVoucherCurrency || 'USD'
      }, { status: 200 });
    }
    
    // Default fallback
    return NextResponse.json({ 
      phoneNumber: process.env.WHATSAPP_BUSINESS_NUMBER || '1234567890',
      formVoucherPrice: 50,
      formVoucherCurrency: 'USD'
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching WhatsApp config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    const { phoneNumber, formVoucherPrice, formVoucherCurrency } = await request.json();
    
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const updateData: any = {
      phoneNumber,
      updatedBy: decoded.userId,
    };

    // Only update Form Voucher price/currency if provided
    if (formVoucherPrice !== undefined) {
      updateData.formVoucherPrice = parseFloat(formVoucherPrice);
    }
    if (formVoucherCurrency !== undefined) {
      updateData.formVoucherCurrency = formVoucherCurrency;
    }

    // Delete old config and create new one (keep only latest)
    await WhatsAppConfig.deleteMany({});
    await WhatsAppConfig.create(updateData);

    return NextResponse.json({ 
      success: true,
      message: 'Configuration updated successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating WhatsApp config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

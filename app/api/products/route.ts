import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    
    const products = await Product.find(all ? {} : { inStock: true }).sort({ category: 1, name: 1 });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

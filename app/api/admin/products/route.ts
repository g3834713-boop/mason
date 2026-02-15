import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const products = await Product.find(all ? {} : { inStock: true }).sort({ category: 1, name: 1 });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
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

    // Parse JSON body (image is now uploaded client-side)
    const body = await request.json();
    const name = body.name as string;
    const description = body.description as string;
    const category = body.category as string;
    const price = parseFloat(body.price);
    const currency = body.currency as string || 'USD';
    const inStock = body.inStock === true;
    const stockQuantity = parseInt(body.stockQuantity) || 0;
    const sizes = Array.isArray(body.sizes) ? body.sizes : [];
    const imageUrl = body.imageUrl as string || '';

    // Validate required fields
    if (!name || !description || !category || isNaN(price)) {
      return NextResponse.json(
        { error: 'Name, description, category, and price are required' },
        { status: 400 }
      );
    }

    const product = new Product({
      name,
      description,
      category,
      price,
      currency,
      imageUrl,
      inStock,
      stockQuantity,
      sizes,
    });

    await product.save();

    return NextResponse.json(
      { 
        success: true,
        message: 'Product created successfully',
        product 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: (error as any).message
      },
      { status: 500 }
    );
  }
}

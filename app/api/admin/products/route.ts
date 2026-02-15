import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabase';

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

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    const currency = formData.get('currency') as string || 'USD';
    const inStock = formData.get('inStock') === 'true';
    const stockQuantity = parseInt(formData.get('stockQuantity') as string) || 0;
    const sizesInput = formData.get('sizes') as string;
    const sizes = sizesInput ? sizesInput.split(',').map(s => s.trim()) : [];
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (!name || !description || !category || isNaN(price)) {
      return NextResponse.json(
        { error: 'Name, description, category, and price are required' },
        { status: 400 }
      );
    }

    let imageUrl = '';

    // Upload image to Supabase if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const supabase = getSupabaseServerClient();
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const timestamp = Date.now();
        const ext = imageFile.name.substring(imageFile.name.lastIndexOf('.'));
        const storagePath = `products/${timestamp}-${Math.random().toString(36).substring(7)}${ext}`;

        const { data, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(storagePath, buffer, {
            contentType: imageFile.type,
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
          );
        }

        // Get public URL
        const { data: publicUrl } = supabase.storage
          .from('documents')
          .getPublicUrl(storagePath);

        imageUrl = publicUrl.publicUrl;
      } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
          { error: 'Failed to process image upload' },
          { status: 500 }
        );
      }
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

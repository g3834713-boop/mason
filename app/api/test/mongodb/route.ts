import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI starts with:', process.env.MONGODB_URI?.substring(0, 20));

    await dbConnect();

    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      mongodb_uri_sample: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'MISSING',
      node_env: process.env.NODE_ENV,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      jwt_secret_length: process.env.JWT_SECRET?.length || 0,
    });
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : String(error),
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      mongodb_uri_sample: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'MISSING',
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Test endpoint - check if admin user exists
export async function GET() {
  try {
    await dbConnect();
    
    const adminUser = await User.findOne({ email: 'admin@freemason.com' });
    
    if (!adminUser) {
      return NextResponse.json({ 
        status: 'ERROR',
        message: 'Admin user not found in database',
        email: 'admin@freemason.com'
      });
    }

    return NextResponse.json({ 
      status: 'SUCCESS',
      message: 'Admin user exists',
      user: {
        _id: adminUser._id,
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role,
        status: adminUser.status,
        passwordHashExists: !!adminUser.passwordHash
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'ERROR',
      error: 'Database error',
      details: (error as any).message
    }, { status: 500 });
  }
}

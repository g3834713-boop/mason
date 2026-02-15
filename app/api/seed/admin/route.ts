import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

/**
 * ONE-TIME ENDPOINT: Creates admin user in production
 * After running, delete this file for security
 * 
 * Usage: POST /api/seed/admin
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@freemason.com' });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists', user: existingAdmin },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash('admin2024', salt);

    // Create admin user
    const adminUser = await User.create({
      fullName: 'Admin User',
      email: 'admin@freemason.com',
      phone: '+1234567890',
      gender: 'Other',
      country: 'United States',
      city: 'Admin City',
      occupation: 'Administrator',
      passwordHash,
      role: 'ADMIN',
      status: 'APPROVED',
      emailVerified: true,
      applicationType: 'MEMBERSHIP',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Admin user created!',
        email: 'admin@freemason.com',
        password: 'admin2024',
        user: adminUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user', details: (error as any).message },
      { status: 500 }
    );
  }
}

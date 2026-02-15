import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import ActivityLog from '@/models/ActivityLog';
import { getClientIp } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { fullName, email, phone, gender, country, city, occupation, password, acceptTerms } = body;

    // Validation
    if (!fullName || !email || !phone || !gender || !country || !city || !occupation || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!acceptTerms) {
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      gender,
      country,
      city,
      occupation,
      passwordHash,
      role: 'USER',
      status: 'PENDING',
      emailVerified: false,
    });

    // Log activity
    const ipAddress = getClientIp(request);
    await ActivityLog.create({
      userId: user._id,
      action: 'SIGNUP',
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully. Your membership is pending review.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

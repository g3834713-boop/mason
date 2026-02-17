import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';
import ActivityLog from '@/models/ActivityLog';
import { getClientIp } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    console.log('🔐 Login attempt started');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await dbConnect();
    console.log('✅ DB connected');

    const body = await request.json();
    const { email, password } = body;
    console.log('📧 Login for email:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('👤 User found:', !!user);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    console.log('🎫 Token generated');

    // Log activity (non-blocking - don't let this crash the login)
    try {
      const ipAddress = getClientIp(request);
      await ActivityLog.create({
        userId: user._id,
        action: 'LOGIN',
        ipAddress,
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
      console.log('📝 Activity logged');
    } catch (logError) {
      console.error('⚠️ Activity log failed (non-critical):', logError);
    }

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'lax' needed for redirect navigation to work
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    console.log('✅ Login successful');

    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during login',
        details: (error as any).message
      },
      { status: 500 }
    );
  }
}
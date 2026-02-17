import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// Test endpoint to debug admin API access
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ 
        step: 'TOKEN_CHECK',
        status: 'FAILED',
        message: 'No token found',
        hasToken: false
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ 
        step: 'TOKEN_VERIFY',
        status: 'FAILED',
        message: 'Token verification failed',
        error: (err as any).message,
        hasToken: true,
        tokenValid: false
      });
    }

    if (!decoded) {
      return NextResponse.json({ 
        step: 'TOKEN_DECODE',
        status: 'FAILED',
        message: 'Token decoded to null',
        hasToken: true,
        tokenValid: false
      });
    }

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ 
        step: 'ROLE_CHECK',
        status: 'FAILED',
        message: 'User is not admin',
        hasToken: true,
        tokenValid: true,
        role: decoded.role,
        isAdmin: false
      });
    }

    return NextResponse.json({ 
      step: 'COMPLETE',
      status: 'SUCCESS',
      message: 'All checks passed - admin access should work',
      hasToken: true,
      tokenValid: true,
      isAdmin: true,
      user: {
        email: decoded.email,
        role: decoded.role,
        userId: decoded.userId
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      step: 'ERROR',
      status: 'ERROR',
      error: (error as any).message,
      stack: (error as any).stack
    }, { status: 500 });
  }
}

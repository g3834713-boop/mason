import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// Debug endpoint to check admin access
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ 
        hasToken: false, 
        message: 'No token found' 
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ 
        hasToken: true, 
        tokenValid: false,
        message: 'Token invalid or expired' 
      });
    }

    return NextResponse.json({ 
      hasToken: true, 
      tokenValid: true,
      isAdmin: decoded.role === 'ADMIN',
      user: {
        email: decoded.email,
        role: decoded.role,
        userId: decoded.userId
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Error checking access',
      details: (error as any).message 
    }, { status: 500 });
  }
}

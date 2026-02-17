import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

// Check for JWT_SECRET only in production runtime (not during build)
if (!JWT_SECRET && process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is required in production');
}

// Use JWT_SECRET or fallback for dev/build
const SECRET = JWT_SECRET || 'dev-secret-please-set-jwt-secret-in-env';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const result = jwt.verify(token, SECRET) as JWTPayload;
    return result;
  } catch (error) {
    console.error('[Auth] Token verification error:', (error as any).message);
    console.error('[Auth] Using SECRET:', SECRET ? 'SET' : 'NOT SET');
    console.error('[Auth] JWT_SECRET env:', JWT_SECRET ? 'SET' : 'NOT SET');
    return null;
  }
};

export const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
};

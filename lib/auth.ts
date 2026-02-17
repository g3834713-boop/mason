import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

// For development, provide a fallback only
const SECRET = JWT_SECRET || 'dev-secret-change-in-production-12345678901234567890';

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ WARNING: JWT_SECRET not found, using fallback');
}

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

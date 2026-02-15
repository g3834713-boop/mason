import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

/**
 * ONE-TIME ENDPOINT: Upgrade admin@freemason.com to ADMIN role
 * After running, delete this file for security
 */
export async function POST(request: Request) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json({ error: 'MONGODB_URI not configured' }, { status: 500 });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const usersCollection = db.collection('users');

    // Update admin user
    const result = await usersCollection.updateOne(
      { email: 'admin@freemason.com' },
      {
        $set: {
          role: 'ADMIN',
          status: 'APPROVED',
          emailVerified: true,
          updatedAt: new Date(),
        },
      }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Admin user upgraded!',
        email: 'admin@freemason.com',
        password: 'admin2024',
        role: 'ADMIN',
        status: 'APPROVED',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade admin', details: (error as any).message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';

/**
 * ONE-TIME ENDPOINT: Creates admin user in production via direct MongoDB connection
 * After running, delete this file for security
 * 
 * Usage: POST /api/seed/admin
 */
export async function POST(request: Request) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json(
        { error: 'MONGODB_URI not configured' },
        { status: 500 }
      );
    }

    console.log('Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('freemason');
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@freemason.com' });
    if (existingAdmin) {
      await client.close();
      return NextResponse.json(
        { error: 'Admin user already exists', user: existingAdmin },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash('admin2024', salt);

    // Create admin user
    const result = await usersCollection.insertOne({
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await client.close();

    return NextResponse.json(
      {
        success: true,
        message: 'Admin user created successfully!',
        email: 'admin@freemason.com',
        password: 'admin2024',
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create admin user', 
        details: (error as any).message,
        stack: (error as any).stack
      },
      { status: 500 }
    );
  }
}

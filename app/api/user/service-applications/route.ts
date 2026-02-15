import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import ServiceApplication from '@/models/ServiceApplication';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    if (!body.serviceType) {
      return NextResponse.json({ error: 'Service type is required' }, { status: 400 });
    }

    const validServices = ['MEMBERSHIP_CARD', 'CERTIFICATE', 'LETTER', 'ALL'];
    if (!validServices.includes(body.serviceType)) {
      return NextResponse.json({ error: 'Invalid service type' }, { status: 400 });
    }

    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create application in database
    const application = await ServiceApplication.create({
      userId: decoded.userId,
      userEmail: decoded.email,
      userFullName: user.fullName,
      serviceType: body.serviceType,
      urgency: body.urgency || 'STANDARD',
      details: body.details || '',
      status: 'PENDING',
    });

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user's applications
    const userApplications = await ServiceApplication.find({
      userId: decoded.userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ applications: userApplications }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

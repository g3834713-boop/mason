const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freemason';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const userCollection = mongoose.connection.collection('users');

    // Check if admin already exists
    const existingAdmin = await userCollection.findOne({ email: 'admin@freemason.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash('admin2024', salt);

    // Create admin user
    const adminUser = {
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
    };

    const result = await userCollection.insertOne(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@freemason.com');
    console.log('🔑 Password: admin2024');
    console.log('🎯 ID:', result.insertedId);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();

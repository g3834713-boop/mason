import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  city: string;
  occupation: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  emailVerified: boolean;
  applicationType: 'MEMBERSHIP' | 'MEMBERSHIP_CARD' | 'CERTIFICATE' | 'ALL';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    occupation: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    emailVerified: { type: Boolean, default: false },
    applicationType: { type: String, enum: ['MEMBERSHIP', 'MEMBERSHIP_CARD', 'CERTIFICATE', 'ALL'], default: 'MEMBERSHIP' },
  },
  {
    timestamps: true,
  }
);

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

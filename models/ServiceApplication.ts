import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceApplication extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userFullName: string;
  serviceType: 'MEMBERSHIP_CARD' | 'CERTIFICATE' | 'LETTER' | 'ALL';
  urgency: 'STANDARD' | 'EXPEDITED';
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

const ServiceApplicationSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true, lowercase: true },
    userFullName: { type: String, required: true },
    serviceType: {
      type: String,
      enum: ['MEMBERSHIP_CARD', 'CERTIFICATE', 'LETTER', 'ALL'],
      required: true,
    },
    urgency: {
      type: String,
      enum: ['STANDARD', 'EXPEDITED'],
      default: 'STANDARD',
    },
    details: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
ServiceApplicationSchema.index({ userId: 1 });
ServiceApplicationSchema.index({ status: 1 });
ServiceApplicationSchema.index({ createdAt: -1 });

const ServiceApplication: Model<IServiceApplication> =
  mongoose.models.ServiceApplication ||
  mongoose.model<IServiceApplication>('ServiceApplication', ServiceApplicationSchema);

export default ServiceApplication;

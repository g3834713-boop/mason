import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create indexes
ActivityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLog> = 
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;

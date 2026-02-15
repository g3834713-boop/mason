import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedBy: mongoose.Types.ObjectId;
  description: string;
  category: 'CERTIFICATE' | 'MEMBERSHIP_CARD' | 'LETTER' | 'FORM' | 'OTHER';
  storagePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    filePath: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' },
    category: { 
      type: String, 
      enum: ['CERTIFICATE', 'MEMBERSHIP_CARD', 'LETTER', 'FORM', 'OTHER'],
      default: 'OTHER'
    },
    storagePath: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Create indexes
DocumentSchema.index({ userId: 1, createdAt: -1 });
DocumentSchema.index({ category: 1 });

const DocumentModel: Model<IDocument> = 
  mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;

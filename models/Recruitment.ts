import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecruitment extends Document {
  userId: mongoose.Types.ObjectId;
  voucherCode: string;
  
  // Personal Information
  fullName: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  nationality: string;
  
  // Contact Information
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  // Professional Information
  occupation: string;
  employer: string;
  yearsInProfession: number;
  
  // Masonic Information
  reason: string;
  knowledgeOfFreemasonry: string;
  recommendedBy?: string;
  previouslyApplied: boolean;
  relativesInFreemasonry: boolean;
  relativeDetails?: string;
  
  // Character References (3 required)
  references: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;
  
  // Background
  criminalRecord: boolean;
  criminalDetails?: string;
  moralCharacter: string;
  beliefInSupremeBeing: boolean;
  
  // Status
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const RecruitmentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    voucherCode: { type: String, required: true },
    
    // Personal Information
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    placeOfBirth: { type: String, required: true },
    nationality: { type: String, required: true },
    
    // Contact Information
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    
    // Professional Information
    occupation: { type: String, required: true },
    employer: { type: String, required: true },
    yearsInProfession: { type: Number, required: true },
    
    // Masonic Information
    reason: { type: String, required: true },
    knowledgeOfFreemasonry: { type: String, required: true },
    recommendedBy: { type: String },
    previouslyApplied: { type: Boolean, default: false },
    relativesInFreemasonry: { type: Boolean, default: false },
    relativeDetails: { type: String },
    
    // Character References
    references: [{
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    }],
    
    // Background
    criminalRecord: { type: Boolean, default: false },
    criminalDetails: { type: String },
    moralCharacter: { type: String, required: true },
    beliefInSupremeBeing: { type: Boolean, required: true },
    
    // Status
    status: { 
      type: String, 
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'PENDING' 
    },
    reviewNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

RecruitmentSchema.index({ userId: 1 });
RecruitmentSchema.index({ status: 1 });
RecruitmentSchema.index({ voucherCode: 1 });

const Recruitment: Model<IRecruitment> = 
  mongoose.models.Recruitment || mongoose.model<IRecruitment>('Recruitment', RecruitmentSchema);

export default Recruitment;

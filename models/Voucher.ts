import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVoucher extends Document {
  code: string;
  amount: number;
  currency: string;
  isUsed: boolean;
  usedBy?: mongoose.Types.ObjectId;
  usedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VoucherSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    isUsed: { type: Boolean, default: false },
    usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// code already has unique: true which creates an index
VoucherSchema.index({ isUsed: 1 });

const Voucher: Model<IVoucher> = 
  mongoose.models.Voucher || mongoose.model<IVoucher>('Voucher', VoucherSchema);

export default Voucher;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWhatsAppConfig extends Document {
  phoneNumber: string;
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
}

const WhatsAppConfigSchema: Schema = new Schema(
  {
    phoneNumber: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const WhatsAppConfig: Model<IWhatsAppConfig> = 
  mongoose.models.WhatsAppConfig || mongoose.model<IWhatsAppConfig>('WhatsAppConfig', WhatsAppConfigSchema);

export default WhatsAppConfig;

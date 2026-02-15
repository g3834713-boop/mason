import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: 'UNIFORM' | 'RING' | 'BIBLE' | 'PERFUME' | 'ACCESSORY' | 'OTHER';
  price: number;
  currency: string;
  imageUrl: string;
  inStock: boolean;
  stockQuantity: number;
  sizes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['UNIFORM', 'RING', 'BIBLE', 'PERFUME', 'ACCESSORY', 'OTHER'],
      required: true
    },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    imageUrl: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },
    sizes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = 
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

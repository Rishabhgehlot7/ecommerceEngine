
import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { ICategory } from './Category';

export interface IProductMedia {
  type: 'image' | 'video';
  url: string;
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: Types.ObjectId | ICategory;
  media: IProductMedia[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductMediaSchema: Schema = new Schema({
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true },
});

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  media: [ProductMediaSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.pre('save', function(next) {
    if (this.isModified('salePrice') && this.salePrice && this.price) {
        if (this.salePrice >= this.price) {
            return next(new Error('Sale price must be less than the regular price.'));
        }
    }
    next();
});

export default models.Product || model<IProduct>('Product', ProductSchema);

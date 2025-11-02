
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  slug: string;
}

const SubcategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  description: string;
  subcategories: ISubcategory[];
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  subcategories: { type: [SubcategorySchema], default: [] },
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

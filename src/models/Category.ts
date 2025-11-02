
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parent: mongoose.Types.ObjectId | ICategory | null;
  ancestors: { _id: mongoose.Types.ObjectId; name: string; slug: string }[];
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: [true, 'Category name is required.'], trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  image: { type: String, required: [true, 'Category image is required.'] },
  description: { type: String, required: [true, 'Category description is required.'], trim: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  ancestors: [{ 
    _id: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    slug: String,
  }],
}, { timestamps: true });

// Ensure that for a given parent, the category name is unique.
CategorySchema.index({ parent: 1, name: 1 }, { unique: true });

async function createSlug(name: string): Promise<string> {
    const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    let slug = baseSlug;
    let count = 1;
    // `this.constructor` refers to the model
    while (await (this as any).constructor.findOne({ slug })) {
        slug = `${baseSlug}-${count}`;
        count++;
    }
    return slug;
}

// Pre-save hook to generate slug and ancestors
CategorySchema.pre<ICategory>('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = await createSlug.call(this, this.name);
  }

  if (this.isModified('parent')) {
    if (this.parent) {
      const parentCategory = await mongoose.model('Category').findById(this.parent) as ICategory;
      if (parentCategory) {
        this.ancestors = [
            ...parentCategory.ancestors, 
            { _id: parentCategory._id, name: parentCategory.name, slug: parentCategory.slug }
        ];
      }
    } else {
      this.ancestors = [];
    }
  }
  next();
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

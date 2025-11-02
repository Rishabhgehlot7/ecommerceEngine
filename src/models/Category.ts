
import mongoose, { Schema, Document } from 'mongoose';

// This will drop the problematic index from the collection.
// We are temporarily disabling the strict option to allow this operation.
mongoose.set('strict', false);
const categoryCollection = mongoose.connection.collections['categories'];
if (categoryCollection) {
    categoryCollection.dropIndex('subcategories.slug_1').catch(err => {
        if (err.code !== 27) { // 27 is "IndexNotFound"
            console.error('Error dropping index:', err);
        }
    });
}
mongoose.set('strict', true);


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
    _id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
  }],
}, { timestamps: true });


// Ensure that for a given parent, the category name is unique.
CategorySchema.index({ parent: 1, name: 1 }, { unique: true });

async function createSlug(name: string): Promise<string> {
    const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    let slug = baseSlug;
    let count = 1;
    const model = this.constructor as mongoose.Model<ICategory>;
    
    // Check for existing slug and append a number if it exists
    let existingCategory = await model.findOne({ slug });
    while (existingCategory && existingCategory._id.toString() !== this._id.toString()) {
        slug = `${baseSlug}-${count}`;
        count++;
        existingCategory = await model.findOne({ slug });
    }
    return slug;
}

// Pre-save hook to generate slug and ancestors
CategorySchema.pre<ICategory>('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = await createSlug.call(this, this.name);
  }

  if (this.isModified('parent')) {
    if (this.parent) {
      try {
        const parentCategory = await mongoose.model<ICategory>('Category').findById(this.parent);
        if (parentCategory) {
          this.ancestors = [
              ...parentCategory.ancestors, 
              { _id: parentCategory._id, name: parentCategory.name, slug: parentCategory.slug }
          ];
        } else {
            this.parent = null;
            this.ancestors = [];
        }
      } catch (error) {
          console.error("Error fetching parent category:", error);
          this.parent = null;
          this.ancestors = [];
      }
    } else {
      this.ancestors = [];
    }
  }
  next();
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

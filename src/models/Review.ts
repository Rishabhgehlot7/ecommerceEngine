
import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';
import Product from './Product';

export interface IReview extends Document {
  _id: string;
  user: Types.ObjectId | IUser;
  product: Types.ObjectId | IProduct;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true },
  comment: { type: String, required: true, trim: true },
}, { timestamps: true });


// After a review is saved, update the product's average rating
ReviewSchema.statics.calculateAverageRating = async function (productId: string) {
  const stats = await this.aggregate([
    { $match: { product: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numReviews: stats[0].numReviews,
      averageRating: stats[0].averageRating,
    });
  } else {
    // If no reviews, reset to default
    await Product.findByIdAndUpdate(productId, {
      numReviews: 0,
      averageRating: 0,
    });
  }
};

ReviewSchema.post('save', function () {
  // @ts-ignore
  this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('remove', function () {
    // @ts-ignore
  this.constructor.calculateAverageRating(this.product);
});


export default models.Review || model<IReview>('Review', ReviewSchema);

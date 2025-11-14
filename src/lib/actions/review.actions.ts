
'use server';

import dbConnect from '../db';
import Review, { type IReview } from '@/models/Review';
import Product from '@/models/Product';
import { getUserFromSession } from './user.actions';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Types } from 'mongoose';

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(1, "Title is required"),
  comment: z.string().min(1, "Comment is required"),
});

export async function createReview(formData: FormData) {
  const validatedFields = reviewSchema.safeParse({
    productId: formData.get('productId'),
    rating: formData.get('rating'),
    title: formData.get('title'),
    comment: formData.get('comment'),
  });

  if (!validatedFields.success) {
    throw new Error('Invalid review data.');
  }

  await dbConnect();
  const user = await getUserFromSession();
  if (!user) {
    throw new Error('You must be logged in to post a review.');
  }

  const { productId, rating, title, comment } = validatedFields.data;

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found.');
  }

  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({ product: productId, user: user._id });
  if (existingReview) {
    throw new Error('You have already reviewed this product.');
  }

  const newReview = new Review({
    product: productId,
    user: user._id,
    rating,
    title,
    comment,
  });

  await newReview.save();
  
  // Revalidate the product page to show the new review
  revalidatePath(`/products/${product.slug}`);
}

export async function getReviewsForProduct(productId: string): Promise<IReview[]> {
  await dbConnect();
  const reviews = await Review.find({ product: new Types.ObjectId(productId) })
    .populate('user', 'firstName lastName')
    .sort({ createdAt: -1 })
    .lean();
  
  return JSON.parse(JSON.stringify(reviews));
}

export async function getHomepageReviews(limit: number = 4): Promise<IReview[]> {
  await dbConnect();
  const reviews = await Review.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName')
    .lean();
  return JSON.parse(JSON.stringify(reviews));
}

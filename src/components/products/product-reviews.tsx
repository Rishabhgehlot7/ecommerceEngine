
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { IReview } from '@/models/Review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import ReviewForm from './review-form';

interface ProductReviewsProps {
  productId: string;
  initialReviews: IReview[];
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />
    ))}
  </div>
);

export default function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
  const { user, isUserLoading } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);

  const userHasReviewed = user ? reviews.some(review => (review.user as any)?._id === user.id) : false;

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              See what others are saying about this product.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                 const reviewUser = review.user as any;
                 return (
                  <div key={review._id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{reviewUser?.firstName || 'Anonymous'}</p>
                      <StarRating rating={review.rating} />
                    </div>
                     <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <h4 className="mt-2 font-medium">{review.title}</h4>
                    <p className="mt-1 text-muted-foreground">{review.comment}</p>
                  </div>
                 )
              })
            ) : (
              <p className="text-center text-muted-foreground">No reviews yet. Be the first to write one!</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            {isUserLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : user ? (
              userHasReviewed ? (
                <p className="text-muted-foreground">You've already reviewed this product. Thanks for your feedback!</p>
              ) : (
                <ReviewForm productId={productId} />
              )
            ) : (
              <p className="text-muted-foreground">
                You must be logged in to write a review.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

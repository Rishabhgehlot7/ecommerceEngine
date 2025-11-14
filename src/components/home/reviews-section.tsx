
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star } from 'lucide-react';
import { getHomepageReviews } from '@/lib/actions/review.actions';
import type { IReview } from '@/models/Review';
import type { IUser } from '@/models/User';

export default async function ReviewsSection() {
  const reviews: IReview[] = await getHomepageReviews(4);
  
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">What Our Customers Say</h2>
        <p className="mt-2 text-lg text-muted-foreground">Real reviews from satisfied shoppers.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => {
          const user = review.user as IUser;
          const userName = user ? `${user.firstName} ${user.lastName?.charAt(0)}.` : 'Anonymous';
          const userFallback = user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : 'A';
          
          return (
            <Card key={review._id} className="flex flex-col">
              <CardHeader>
                  <div className="flex items-center gap-4">
                      <Avatar>
                          <AvatarImage src={`https://i.pravatar.cc/40?u=${user?._id || review._id}`} alt={userName} />
                          <AvatarFallback>{userFallback}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold">{userName}</p>
                           <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}/>
                              ))}
                          </div>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                  <CardTitle className="text-lg mb-2">{review.title}</CardTitle>
                  <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}

import { getProductById, products } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductRecommendations from '@/components/products/product-recommendations';
import AddToCartButton from '@/components/products/add-to-cart-button';
import WishlistButton from '@/components/products/wishlist-button';
import { Badge } from '@/components/ui/badge';
import BuyNowButton from '@/components/products/buy-now-button';
import ProductMediaGallery from '@/components/products/product-media-gallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, CheckCircle } from 'lucide-react';
import { reviews } from '@/lib/reviews';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
    return products.map(product => ({
        id: product.id,
    }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const isOnSale = product.salePrice && product.salePrice < product.price;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <ProductMediaGallery media={product.media} isOnSale={isOnSale} />

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <div className="mt-6 flex items-baseline gap-4">
             <p className={`font-headline text-4xl font-bold ${isOnSale ? 'text-destructive' : 'text-primary'}`}>
                {formatPrice(isOnSale ? product.salePrice! : product.price)}
            </p>
            {isOnSale && (
                <p className="text-2xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                </p>
            )}
          </div>
           {product.highlights && (
             <ul className="mt-6 space-y-2 text-muted-foreground">
                {product.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span>{highlight}</span>
                    </li>
                ))}
             </ul>
            )}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AddToCartButton product={product} />
            <BuyNowButton product={product} />
            <WishlistButton product={product} />
          </div>
        </div>
      </div>
       <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
                <CardContent className="p-6 text-muted-foreground">
                    <p>{product.description}</p>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                   {product.specifications ? (
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="rounded-lg bg-muted/50 p-3">
                          <p className="font-medium">{key}</p>
                          <p className="text-muted-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                   ) : (
                    <p className="text-muted-foreground">No specifications available.</p>
                   )}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
             <Card>
                 <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {reviews.slice(0,2).map((review) => (
                        <div key={review.id}>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold">{review.name}</p>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}/>
                                    ))}
                                </div>
                            </div>
                            <h4 className="mt-1 font-medium">{review.title}</h4>
                            <p className="mt-1 text-muted-foreground">{review.comment}</p>
                        </div>
                    ))}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-16 md:mt-24">
        <ProductRecommendations currentProductId={product.id} />
      </div>
    </div>
  );
}

    

'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../products/product-card';
import { getProducts } from '@/lib/actions/product.actions';
import type { IProduct } from '@/models/Product';
import { Skeleton } from '../ui/skeleton';

export default function FeaturedProductsSection() {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
          <p className="mt-2 text-lg text-muted-foreground">Check out our latest products.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
        <p className="mt-2 text-lg text-muted-foreground">Check out our latest products.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8">
        {allProducts.map((product) => (
          <ProductCard key={product._id} product={product as any} />
        ))}
      </div>
    </div>
  );
}

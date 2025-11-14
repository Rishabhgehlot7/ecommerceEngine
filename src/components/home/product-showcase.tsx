'use client';

import ProductCard from '../products/product-card';
import type { IProduct } from '@/models/Product';

interface ProductShowcaseProps {
  title: string;
  description: string;
  products: IProduct[];
}

export default function ProductShowcase({ title, description, products }: ProductShowcaseProps) {

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product as any} />
        ))}
      </div>
    </div>
  );
}

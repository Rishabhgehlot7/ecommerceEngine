'use client';

import { categories } from '@/lib/categories';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader } from '../ui/card';
import { ArrowRight } from 'lucide-react';

export default function CategorySection() {
  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">Shop by Category</h2>
        <p className="mt-2 text-lg text-muted-foreground">Explore our curated product categories.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="group overflow-hidden">
            <Link href={category.href}>
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={category.image}
                    alt={`Image for ${category.name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={category.imageHint}
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </CardHeader>
              <div className="p-4">
                 <h3 className="text-xl font-bold">{category.name}</h3>
                 <div className="mt-2 flex flex-wrap gap-2">
                    {category.subcategories.map(sub => (
                        <Link key={sub.id} href={sub.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {sub.name}
                        </Link>
                    ))}
                 </div>
                 <div className="mt-4 flex items-center font-semibold text-primary">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                 </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

    
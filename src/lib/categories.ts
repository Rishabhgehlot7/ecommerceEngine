import type { Category } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const categoryDetails: Omit<Category, 'image' | 'imageHint'>[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    href: '/category/electronics',
    subcategories: [
      { id: 'headphones', name: 'Headphones', href: '/category/electronics/headphones' },
      { id: 'speakers', name: 'Speakers', href: '/category/electronics/speakers' },
      { id: 'cameras', name: 'Cameras', href: '/category/electronics/cameras' },
      { id: 'drones', name: 'Drones', href: '/category/electronics/drones' },
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    href: '/category/fashion',
    subcategories: [
      { id: 'watches', name: 'Watches', href: '/category/fashion/watches' },
      { id: 'backpacks', name: 'Backpacks', href: '/category/fashion/backpacks' },
      { id: 'shoes', name: 'Shoes', href: '/category/fashion/shoes' },
    ]
  },
  {
    id: 'home',
    name: 'Home Goods',
    href: '/category/home',
    subcategories: [
      { id: 'coffee-makers', name: 'Coffee Makers', href: '/category/home/coffee-makers' },
      { id: 'chairs', name: 'Chairs', href: '/category/home/chairs' },
    ]
  }
];

export const categories: Category[] = categoryDetails.map(detail => {
    const placeholder = PlaceHolderImages.find(p => p.id === `category-${detail.id}`);
    if (!placeholder) {
      throw new Error(`Placeholder image not found for category id: category-${detail.id}`);
    }
    return {
      ...detail,
      image: placeholder.imageUrl,
      imageHint: placeholder.imageHint
    };
  });

    
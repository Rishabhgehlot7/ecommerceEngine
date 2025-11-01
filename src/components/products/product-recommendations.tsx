"use client";

import { useEffect, useState, useMemo } from 'react';
import { productRecommendations } from '@/ai/flows/product-recommendations';
import { products, getProductById } from '@/lib/products';
import ProductCard from './product-card';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const VIEWING_HISTORY_KEY = 'bluecart_viewing_history';
const HISTORY_LENGTH = 5;

export default function ProductRecommendations({ currentProductId }: { currentProductId: string }) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackProducts = useMemo(() => {
    return products
      .filter(p => p.id !== currentProductId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [currentProductId]);
  
  useEffect(() => {
    const updateHistoryAndFetch = async () => {
      // 1. Update viewing history
      let history: string[] = [];
      try {
        history = JSON.parse(localStorage.getItem(VIEWING_HISTORY_KEY) || '[]');
      } catch (e) {
        console.error("Could not parse viewing history", e);
        history = [];
      }
      
      const newHistory = [currentProductId, ...history.filter(id => id !== currentProductId)].slice(0, HISTORY_LENGTH);
      localStorage.setItem(VIEWING_HISTORY_KEY, JSON.stringify(newHistory));

      // 2. Fetch recommendations
      setIsLoading(true);
      try {
        if (newHistory.length > 1) {
          const result = await productRecommendations({ viewingHistory: newHistory });
          const recommendedProducts = result.recommendedProducts
            .map(id => getProductById(id))
            .filter((p): p is Product => p !== undefined && p.id !== currentProductId)
            .slice(0, 4);
          
          if (recommendedProducts.length > 0) {
            setRecommendations(recommendedProducts);
          } else {
            setRecommendations(fallbackProducts);
          }
        } else {
          setRecommendations(fallbackProducts);
        }
      } catch (error) {
        console.error("Failed to fetch product recommendations:", error);
        setRecommendations(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    updateHistoryAndFetch();
  }, [currentProductId, fallbackProducts]);

  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold tracking-tight">You Might Also Like</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}


'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { search } from '@/lib/actions/search.actions';
import type { IProduct } from '@/models/Product';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import Image from 'next/image';
import Link from 'next/link';

interface SearchSuggestionsProps {
    onSelect?: () => void;
}

export default function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  const fetchSuggestions = useCallback(async () => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const results = await search(debouncedQuery);
      setSuggestions(results.products.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error('Search failed:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSelect?.();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = () => {
    onSelect?.();
    setQuery('');
    setSuggestions([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };
  
  const showSuggestions = isFocused && (suggestions.length > 0 || loading || query.length > 1);

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Search products..."
          className="w-full rounded-lg bg-background pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click on suggestions
          autoComplete="off"
        />
        {loading && <Loader2 className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </form>

      {showSuggestions && (
        <div className="absolute top-full mt-2 w-full rounded-lg border bg-background shadow-lg z-50">
          {suggestions.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="flex items-center gap-4 p-2 hover:bg-accent"
              onClick={handleSuggestionClick}
            >
              <Image
                src={product.media[0]?.url || '/placeholder.svg'}
                alt={product.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(product.salePrice ?? product.price)}</p>
              </div>
            </Link>
          ))}
          {!loading && suggestions.length === 0 && debouncedQuery.length > 1 && (
            <p className="p-4 text-center text-sm text-muted-foreground">No products found.</p>
          )}
          {query.length > 1 && (
            <button
              onClick={handleSearchSubmit}
              className="flex w-full items-center justify-center gap-2 border-t p-3 text-sm font-medium text-primary hover:bg-accent"
            >
              Search for "{query}" <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

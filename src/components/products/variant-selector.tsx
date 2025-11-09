
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { IProduct, IVariant } from '@/models/Product';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import AddToCartButton from './add-to-cart-button';
import BuyNowButton from './buy-now-button';
import WishlistButton from './wishlist-button';
import { useCart } from '@/hooks/use-cart';

interface VariantSelectorProps {
  product: IProduct;
}

export default function VariantSelector({ product }: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const optionTypes = useMemo(() => {
    const options: Record<string, string[]> = {};
    product.variants.forEach(variant => {
      variant.options.forEach(option => {
        if (!options[option.name]) {
          options[option.name] = [];
        }
        if (!options[option.name].includes(option.value)) {
          options[option.name].push(option.value);
        }
      });
    });
    return options;
  }, [product.variants]);

  // Set default selected options
  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const optionName in optionTypes) {
        defaults[optionName] = optionTypes[optionName][0];
    }
    setSelectedOptions(defaults);
  }, [optionTypes]);

  const selectedVariant = useMemo(() => {
    return product.variants.find(variant => 
      variant.options.every(opt => selectedOptions[opt.name] === opt.value)
    );
  }, [selectedOptions, product.variants]);


  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const productForButtons = {
    id: selectedVariant?.sku || product._id,
    name: selectedVariant?.name || product.name,
    price: selectedVariant?.price || product.salePrice || product.price,
    image: product.media?.[0]?.url || '',
  }

  return (
    <div className="mt-8">
      {Object.entries(optionTypes).map(([name, values]) => (
        <div key={name} className="mb-4">
          <Label className="text-lg font-semibold">{name}</Label>
          <RadioGroup 
            value={selectedOptions[name]} 
            onValueChange={(value) => handleOptionChange(name, value)}
            className="mt-2 flex flex-wrap gap-2"
          >
            {values.map(value => (
              <RadioGroupItem key={value} value={value} id={`${name}-${value}`} className="sr-only" />
            ))}
          </RadioGroup>
        </div>
      ))}
      
      {selectedVariant ? (
        <div className="mt-4 text-sm text-muted-foreground">
          SKU: {selectedVariant.sku} | Stock: {selectedVariant.stock}
        </div>
      ) : (
         product.variants && product.variants.length > 0 && (
          <div className="mt-4 text-sm text-destructive">
            Selected combination is not available.
          </div>
         )
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <AddToCartButton product={productForButtons as any} />
        <BuyNowButton product={productForButtons as any} />
        <WishlistButton product={product as any} />
      </div>
    </div>
  );
}


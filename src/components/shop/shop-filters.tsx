
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { ICategory } from '@/models/Category';

interface ShopFiltersProps {
  allCategories: ICategory[];
  selectedCategories: string[];
  handleCategoryChange: (categoryId: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  minPrice: number;
  maxPrice: number;
  onSaleOnly: boolean;
  setOnSaleOnly: (value: boolean) => void;
  formatPrice: (price: number) => string;
}

export default function ShopFilters({
  allCategories,
  selectedCategories,
  handleCategoryChange,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  onSaleOnly,
  setOnSaleOnly,
  formatPrice,
}: ShopFiltersProps) {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm md:shadow-none md:border-none md:p-0 md:bg-transparent">
      <h2 className="text-2xl font-bold md:hidden">Filters</h2>
      <Accordion
        type="multiple"
        defaultValue={['category', 'price']}
        className="w-full"
      >
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-semibold">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {allCategories.map((cat) => (
                <div key={cat._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat._id}`}
                    checked={selectedCategories.includes(cat._id)}
                    onCheckedChange={() => handleCategoryChange(cat._id)}
                  />
                  <Label htmlFor={`cat-${cat._id}`} className="font-normal">
                    {cat.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <div className="my-3 text-sm text-muted-foreground">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
                minStepsBetweenThumbs={1}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator />
      <div className="flex items-center justify-between">
        <Label htmlFor="sale-only" className="font-semibold">
          On Sale Only
        </Label>
        <Switch
          id="sale-only"
          checked={onSaleOnly}
          onCheckedChange={setOnSaleOnly}
        />
      </div>
    </div>
  );
}

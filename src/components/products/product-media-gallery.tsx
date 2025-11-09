
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { IProductMedia } from '@/models/Product';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductMediaGalleryProps {
  media: IProductMedia[];
  alt: string;
  isOnSale: boolean;
}

export default function ProductMediaGallery({ media, alt, isOnSale }: ProductMediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState(media[0]);

  useEffect(() => {
    setSelectedMedia(media[0]);
  }, [media]);

  if (!media || media.length === 0) {
      return (
          <div className="grid gap-4">
               <Card className="overflow-hidden">
                <div className="relative aspect-square bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No Image</p>
                </div>
              </Card>
          </div>
      )
  }

  const currentIndex = media.findIndex((item) => item.url === selectedMedia.url);

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + media.length) % media.length;
    setSelectedMedia(media[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % media.length;
    setSelectedMedia(media[nextIndex]);
  };


  return (
    <div className="grid gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Card className="overflow-hidden cursor-zoom-in">
            <div className="relative aspect-square">
              {isOnSale && (
                <Badge className="absolute top-4 left-4 z-10 text-lg" variant="destructive">Sale</Badge>
              )}
              <Image
                src={selectedMedia.url}
                alt={alt}
                width={800}
                height={800}
                className="h-full w-full object-cover transition-opacity duration-300"
                priority
              />
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-2 sm:p-4">
           <div className="relative aspect-square">
            <Image
                src={selectedMedia.url}
                alt={alt}
                fill
                className="object-contain"
              />
               {media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 z-20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 z-20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
           </div>
        </DialogContent>
      </Dialog>
      
      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedMedia(item)}
              className={cn(
                "overflow-hidden rounded-md border-2 transition-colors",
                selectedMedia.url === item.url ? "border-primary" : "border-transparent hover:border-primary/50"
              )}
            >
              <Image
                src={item.url}
                alt={`${alt} - thumbnail ${index + 1}`}
                width={150}
                height={150}
                className="aspect-square h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

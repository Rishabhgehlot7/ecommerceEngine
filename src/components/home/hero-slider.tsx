'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function HeroSlider() {
  const sliderImages = PlaceHolderImages.filter((img) =>
    img.id.startsWith('hero-slide')
  );

  const slides = [
    {
      id: 'slide1',
      title: 'Experience True Immersion',
      subtitle: 'With the new SoundScape Pro',
      buttonText: 'Shop Headphones',
      buttonLink: '/products/wireless-headphones',
      image: sliderImages.find((img) => img.id === 'hero-slide-1'),
    },
    {
      id: 'slide2',
      title: 'Timeless Elegance',
      subtitle: 'Discover the Azure Timepiece',
      buttonText: 'Shop Watches',
      buttonLink: '/products/blue-watch',
      image: sliderImages.find((img) => img.id === 'hero-slide-2'),
    },
    {
      id: 'slide3',
      title: 'Brew Perfection',
      subtitle: 'Your day starts with the Morning BrewMaster',
      buttonText: 'Shop Coffee Makers',
      buttonLink: '/products/coffee-maker',
      image: sliderImages.find((img) => img.id === 'hero-slide-3'),
    },
  ];

  return (
    <div className="w-full">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
                {slide.image && (
                  <Image
                    src={slide.image.imageUrl}
                    alt={slide.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={slide.image.imageHint}
                    priority={slide.id === 'slide1'}
                  />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                  <h2 className="font-headline text-3xl font-bold md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h2>
                  <p className="mt-2 text-lg md:text-xl">{slide.subtitle}</p>
                  <Button asChild className="mt-6" size="lg">
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
      </Carousel>
    </div>
  );
}

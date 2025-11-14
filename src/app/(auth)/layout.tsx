
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { getActiveBanners } from '@/lib/actions/banner.actions';
import type { IBanner } from '@/models/Banner';

async function getAuthImage() {
    try {
        const banners = await getActiveBanners();
        if (banners.length > 0) {
            const randomIndex = Math.floor(Math.random() * banners.length);
            return banners[randomIndex];
        }
    } catch (error) {
        console.error("Failed to fetch banners for auth layout:", error);
    }
    // Fallback image if no banners are found or if there's an error
    return {
        title: 'Auth background',
        image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
    };
}


export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authImage: { title: string; image: string } = await getAuthImage();

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="hidden bg-muted lg:block">
        <div className="flex h-full flex-col p-8 text-white">
          <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-foreground"
            >
              <ShoppingBag className="h-6 w-6" />
              <span>BlueCart</span>
          </Link>
          <div className="my-auto">
            <div className="relative h-[400px] w-full">
               <Image 
                src={authImage.image}
                alt={authImage.title}
                fill
                className="object-cover rounded-xl"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-primary/10 rounded-xl" />
            </div>
             <h1 className="mt-8 text-3xl font-bold text-foreground">
              Discover a World of Products
            </h1>
            <p className="mt-2 text-muted-foreground">
              Join our community and start shopping from the best brands.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}

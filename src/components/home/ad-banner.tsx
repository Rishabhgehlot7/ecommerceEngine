
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveBanners } from '@/lib/actions/banner.actions';
import type { IBanner } from '@/models/Banner';

export default function AdBanner() {
  const [banner, setBanner] = useState<IBanner | null>(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const banners = await getActiveBanners();
        if (banners.length > 0) {
          const randomIndex = Math.floor(Math.random() * banners.length);
          setBanner(banners[randomIndex]);
        }
      } catch (error) {
        console.error("Failed to fetch ad banner:", error);
      }
    }

    fetchBanner();
  }, []);

  if (!banner) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg group">
        <Link href={banner.link || '#'} target={banner.link ? "_blank" : "_self"} rel="noopener noreferrer">
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
           <div className="absolute inset-0 bg-black/30" />
        </Link>
      </div>
    </div>
  );
}

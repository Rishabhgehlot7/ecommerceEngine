
'use client';

import { Home, Search, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/hooks/use-auth';

export default function BottomBar() {
  const pathname = usePathname();
  const { totalItems: totalWishlistItems } = useWishlist();
  const { user } = useAuth();
  
  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/shop', icon: Search, label: 'Shop' },
    { href: '/wishlist', icon: Heart, label: 'Wishlist', badge: totalWishlistItems },
    { href: user ? '/profile' : '/login', icon: User, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              pathname === item.href && 'text-primary'
            )}
          >
            <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.badge && item.badge > 0 ? (
                    <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {item.badge}
                    </span>
                ) : null}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

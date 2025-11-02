'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isFullScreenPage = useMemo(() => {
    return pathname.startsWith('/admin') || pathname === '/login' || pathname === '/signup';
  }, [pathname]);

  if (isFullScreenPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

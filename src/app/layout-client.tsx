
'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BottomBar from '@/components/layout/bottom-bar';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = useMemo(() => {
    return pathname === '/login' || pathname === '/signup';
  }, [pathname]);

  const isAdminPage = useMemo(() => {
    return pathname.startsWith('/admin');
  }, [pathname]);

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomBar />
    </div>
  );
}

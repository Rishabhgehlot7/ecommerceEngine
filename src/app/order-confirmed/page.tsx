
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="mt-4 text-3xl">Order Confirmed!</CardTitle>
        <CardDescription>Thank you for your purchase.</CardDescription>
      </CardHeader>
      <CardContent>
        {orderId ? (
          <p className="text-muted-foreground">
            Your Order ID is: <span className="font-semibold text-foreground">#{orderId}</span>. 
            You will receive an email confirmation shortly.
          </p>
        ) : (
          <p className="text-muted-foreground">You will receive an email confirmation shortly.</p>
        )}
        <div className="mt-6 flex flex-col gap-4">
          {orderId && (
              <Button asChild variant="outline">
                  <Link href={`/orders`}>View My Orders</Link>
              </Button>
          )}
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderConfirmedSkeleton() {
    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <Skeleton className="mx-auto h-16 w-16 rounded-full" />
                <Skeleton className="h-9 w-48 mx-auto mt-4" />
                <Skeleton className="h-5 w-40 mx-auto mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <div className="mt-6 flex flex-col gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function OrderConfirmedPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<OrderConfirmedSkeleton />}>
        <OrderConfirmedContent />
      </Suspense>
    </div>
  );
}

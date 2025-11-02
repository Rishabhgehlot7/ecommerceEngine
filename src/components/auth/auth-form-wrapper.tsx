'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthFormWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export function AuthFormWrapper({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText,
}: AuthFormWrapperProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <div className="text-center text-sm w-full">
          {footerText}{' '}
          <Link href={footerLink} className="underline">
            {footerLinkText}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function SignupForm() {
  const router = useRouter();
  const { signInWithPhoneNumber, confirmOtp } = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(phoneNumber);
      setConfirmationResult(result);
      toast({ title: 'OTP Sent', description: 'An OTP has been sent to your phone.' });
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setLoading(true);
    try {
      await confirmOtp(confirmationResult, otp);
      toast({ title: 'Success', description: 'Your account has been created.' });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your phone number to create an account.
        </CardDescription>
      </CardHeader>
       {!confirmationResult ? (
        <form onSubmit={handleSendOtp}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 555-555-5555" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
             <div id="recaptcha-container"></div>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={handleConfirmOtp}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input id="otp" type="text" placeholder="123456" required value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP & Sign Up'}
            </Button>
          </CardFooter>
        </form>
      )}
       <CardFooter className="flex-col items-start gap-4">
          <div className="w-full text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
    </Card>
  );
}

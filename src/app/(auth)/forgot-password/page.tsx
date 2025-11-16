
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { requestPasswordReset } from '@/lib/actions/user.actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await requestPasswordReset(values.email);
      setSubmitted(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not process your request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-balance text-muted-foreground">
          {submitted
            ? "If an account with that email exists, we've sent a password reset link to it."
            : 'Enter your email and we will send you a link to reset your password.'}
        </p>
      </div>
      {!submitted && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>
      )}
      <div className="mt-4 text-center text-sm">
        Remembered your password?{' '}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}

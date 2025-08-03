'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signupUser } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import AuthFormWrapper from './AuthFormWrapper';

const SignupSchema = z.object({
  email: z.string().email('Invalid email address.').refine(val => val.endsWith('@gmail.com'), 'Only Gmail addresses are allowed.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters.'),
  referralCode: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the terms and privacy policy.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      referralCode: '',
      termsAccepted: false,
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      if (values.referralCode) formData.append('referralCode', values.referralCode);
      formData.append('termsAccepted', values.termsAccepted.toString());
      
      const result = await signupUser(formData);
      if (result.success) {
        setSuccess(result.message);
        toast({ title: 'Success', description: result.message });
        // Redirect to login page after successful signup
        window.location.href = '/auth/login'; 
      } else {
        setError(result.message || 'An unknown error occurred during signup.');
        toast({ title: 'Error', description: result.message || 'Signup failed.', variant: 'destructive' });
      }
    });
  };

  return (
    <AuthFormWrapper
      title="Create an Account"
      description="Join GenieOTP and experience magical OTP verification."
      footerContent={
        <p className="mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Gmail only)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@gmail.com" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referral Code (Optional)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter referral code" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-muted/30">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Accept terms and privacy policy
                  </FormLabel>
                  <FormDescription>
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
          {success && <p className="text-sm text-emerald-600 bg-emerald-500/10 p-3 rounded-md">{success}</p>}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}

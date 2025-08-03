
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import AuthFormWrapper from '@/components/auth/AuthFormWrapper';
import { cn } from '@/lib/utils';

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isFirebaseConfigured = !!auth;

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    setSuccess(null);
    setError(null);
    startTransition(async () => {
      if (!isFirebaseConfigured) {
        const message = "Password reset email sent (Mocked). Please check your inbox.";
        setSuccess(message);
        toast({ title: 'Success', description: message });
        return;
      }
      try {
        await sendPasswordResetEmail(auth, values.email);
        const message = "Password reset email sent. Please check your inbox.";
        setSuccess(message);
        toast({ title: 'Success', description: message });
      } catch (e: any) {
        const message = e.message || 'Failed to send password reset email.';
        setError(message);
        toast({ title: 'Error', description: message, variant: 'destructive' });
      }
    });
  };

  return (
     <AuthFormWrapper
      title="Forgot Your Password?"
      description="Enter your email to receive a password reset link."
      footerContent={
        <p className="mt-4">
          Remembered your password?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="space-y-6" disabled={isPending}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.email && "text-destructive")}>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className={cn(form.formState.errors.email && "border-destructive focus-visible:ring-destructive")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          
          {success && <p className="text-sm text-emerald-600 bg-emerald-500/10 p-3 rounded-md">{success}</p>}
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Recovery Link
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}


'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, Eye, EyeOff } from 'lucide-react';
import AuthFormWrapper from '@/components/auth/AuthFormWrapper';
import { WHATSAPP_PAYMENT_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const isFirebaseConfigured = !!auth;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });
  
  const handleWhatsAppSupport = () => {
    const message = "Hello GenieOTP, I am having a problem with my account. Can you please assist?";
    const whatsappUrl = `${WHATSAPP_PAYMENT_URL}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onSubmit = (values: LoginFormValues) => {
    setError(null);
    startTransition(async () => {
      if (!isFirebaseConfigured) {
        toast({ title: "Success (Mocked)", description: "Login successful! Redirecting..." });
        window.location.href = '/dashboard';
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Success", description: "Login successful! Redirecting..." });
        window.location.href = '/dashboard';
      } catch (e: any) {
        const errorMessage = e.code === 'auth/invalid-credential' 
          ? 'Invalid email or password.' 
          : e.message || 'Login failed. Please try again.';
        setError(errorMessage);
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      }
    });
  };

  return (
    <AuthFormWrapper
      title="Welcome Back!"
      description="Login to access your GenieOTP account."
      footerContent={
        <>
          <p className="mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Forgot your password?
            </Link>
          </p>
        </>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.password && "text-destructive")}>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        className={cn("pr-10", form.formState.errors.password && "border-destructive focus-visible:ring-destructive")}
                        {...field}
                      />
                    </FormControl>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>

          <div className="mt-6 text-center">
            <Button
              type="button"
              onClick={handleWhatsAppSupport}
              className="w-full md:w-auto bg-green-500 text-white hover:bg-green-600"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Having trouble? Contact Support
            </Button>
          </div>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}

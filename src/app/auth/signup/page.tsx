
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserProfile } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, MessageSquare } from 'lucide-react';
import AuthFormWrapper from '@/components/auth/AuthFormWrapper';
import { cn } from '@/lib/utils';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { WHATSAPP_PAYMENT_URL } from '@/lib/constants';

const provinces = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", 
  "Gilgit-Baltistan", "Islamabad Capital Territory", "Azad Jammu and Kashmir"
];

const SignupSchema = z.object({
  email: z.string().email('Invalid email address.').refine(val => val.endsWith('@gmail.com'), { message: "Only Gmail addresses are allowed." }),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string().min(8, 'Confirm password is required.'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  phoneNumber: z.string().optional(),
  referralCode: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the terms and privacy policy.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isFirebaseConfigured = !!auth;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      gender: '',
      province: '',
      city: '',
      phoneNumber: '',
      referralCode: '',
      termsAccepted: false,
    },
    mode: 'onBlur'
  });

  const handleWhatsAppSupport = () => {
    const message = "Hello GenieOTP, I am having a problem with my account. Can you please assist?";
    const whatsappUrl = `${WHATSAPP_PAYMENT_URL}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onSubmit = (values: SignupFormValues) => {
    setError(null);
    startTransition(async () => {
      if (!isFirebaseConfigured) {
        toast({ title: "Success (Mocked)", description: "Account created successfully! Please log in." });
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
        return;
      }

      try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // 2. Create user profile in Firestore
        const profileResult = await createUserProfile({
            uid: user.uid,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            city: values.city,
            province: values.province,
            phoneNumber: values.phoneNumber,
            referralCode: values.referralCode,
        });

        if (!profileResult.success) {
            // This is a tricky state: user is in Firebase but not our db.
            // For now, we'll alert the user and log it.
            console.error("Failed to create user profile:", profileResult.message);
            toast({ title: 'Account Sync Failed', description: 'Your account was created, but profile data could not be saved. Please contact support.', variant: 'destructive' });
        } else {
             toast({ title: "Success", description: "Account created successfully! Please log in." });
        }
       
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);

      } catch (e: any) {
        let errorMessage = e.message || 'An unknown error occurred.';
        if (e.code === 'auth/email-already-in-use') {
          errorMessage = 'This email address is already registered.';
        }
        setError(errorMessage);
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      }
    });
  };

  return (
    <AuthFormWrapper
      title="Create an Account"
      description="Join GenieOTP to get started."
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset className="space-y-4" disabled={isPending}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Gmail only)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      </FormControl>
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}><EyeOff className={cn("h-4 w-4", { 'hidden': !showPassword })} /><Eye className={cn("h-4 w-4", { 'hidden': showPassword })} /></Button>
                    </div>
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
                    <div className="relative">
                      <FormControl>
                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      </FormControl>
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}><EyeOff className={cn("h-4 w-4", { 'hidden': !showConfirmPassword })} /><Eye className={cn("h-4 w-4", { 'hidden': showConfirmPassword })} /></Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+92 300 1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Karachi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

             <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="Enter referral code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Accept terms and privacy policy
                      </FormLabel>
                      <FormDescription>
                        By signing up, you agree to our{' '}
                        <Link href="/terms" className="text-primary hover:underline" target="_blank">Terms of Service</Link> and{' '}
                        <Link href="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>.
                      </FormDescription>
                       <FormMessage className="text-destructive" />
                    </div>
                  </FormItem>
                )}
              />
          </fieldset>
          
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
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

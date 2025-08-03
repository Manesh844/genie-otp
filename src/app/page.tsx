
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, ShieldCheck, Users, Gift, MessageSquare } from 'lucide-react';
import CoinIcon from '@/components/common/CoinIcon';
import { WHATSAPP_PAYMENT_URL } from '@/lib/constants';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';

const FeatureCard = ({ icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
  const IconComponent = icon;
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <IconComponent className="h-10 w-10 text-primary" />
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default function HomePage() {
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
        window.location.href = '/dashboard';
    }
  }, [user, isUserLoading]);

  const handleWhatsAppSupport = () => {
    const message = "Hello GenieOTP, I am having a problem with my account. Can you please assist?";
    const whatsappUrl = `${WHATSAPP_PAYMENT_URL}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  // Render nothing or a loading spinner while checking auth state
  if (isUserLoading || user) {
    return (
       <div className="flex items-center justify-center min-h-screen">
          <Zap className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-lg shadow-inner">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-6 text-primary">
            GenieOTP: Secure Access, <span className="text-accent">Magically Simple</span>
          </h1>
          <p className="text-xl text-foreground mb-10 max-w-2xl mx-auto">
            Unlock seamless and secure OTP verifications with GenieOTP. Get started in minutes and enjoy robust features designed for your convenience.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link href="/auth/signup" passHref>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/auth/login" passHref>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Login to Your Account
              </Button>
            </Link>
             <Button size="lg" onClick={handleWhatsAppSupport} className="bg-green-500 text-white hover:bg-green-600">
              <MessageSquare className="mr-2 h-5 w-5" /> Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold font-headline text-center mb-12 text-primary">Why Choose GenieOTP?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Instant OTPs"
              description="Receive one-time passwords in seconds for a multitude of services."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Enhanced Security"
              description="Secure authentication with Firebase and AI-powered fraud detection to keep your account safe."
            />
            <FeatureCard
              icon={CoinIcon}
              title="Flexible Coin System"
              description="Easily manage your coin balance with multiple recharge options like Easypaisa and USDT."
            />
            <FeatureCard
              icon={Users}
              title="User-Friendly Dashboard"
              description="An intuitive interface to manage OTPs, transactions, and your profile effortlessly."
            />
            <FeatureCard
              icon={Gift}
              title="Referral Program"
              description="Invite friends and earn 20% coin credit when they successfully use our service."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Wide Service Support"
              description="Supports OTPs for popular services including WhatsApp, Telegram, Google, and more."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/50 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold font-headline text-center mb-12 text-primary">Simple Steps to Get Started</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-card rounded-lg shadow-md">
              <div className="text-5xl mb-4 text-accent">1</div>
              <h3 className="text-xl font-semibold mb-2 font-headline">Sign Up</h3>
              <p className="text-muted-foreground">Create your GenieOTP account quickly with your email address.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <div className="text-5xl mb-4 text-accent">2</div>
              <h3 className="text-xl font-semibold mb-2 font-headline">Recharge Coins</h3>
              <p className="text-muted-foreground">Add coins to your wallet via Easypaisa or USDT.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <div className="text-5xl mb-4 text-accent">3</div>
              <h3 className="text-xl font-semibold mb-2 font-headline">Get OTPs</h3>
              <p className="text-muted-foreground">Select your desired service and receive your OTP instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold font-headline mb-6 text-primary">Ready to Simplify Your Access?</h2>
          <p className="text-xl text-foreground mb-8 max-w-xl mx-auto">
            Join thousands of users enjoying secure and fast OTP verifications with GenieOTP.
          </p>
          <Link href="/auth/signup" passHref>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-12 py-6 text-lg">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

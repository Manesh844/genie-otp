
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Users, Copy, Share2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';

export default function ReferralPage() {
  const { toast } = useToast();
  const { user: currentUser, isUserLoading } = useUser();

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!isUserLoading && !currentUser && typeof window !== 'undefined') {
      window.location.href = '/auth/login';
      return;
    }

    if (currentUser?.email) {
      setReferralCode(currentUser.email);
      setReferralLink(`${window.location.origin}/auth/signup?ref=${currentUser.email}`);
    }
    setIsLoading(false);
  }, [currentUser, isUserLoading]);

  const copyToClipboard = (text: string | null, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard.` });
  };

  const shareReferralLink = () => {
    if (!referralCode || !referralLink) return;
    if (navigator.share) {
      navigator.share({
        title: 'Join GenieOTP!',
        text: `Sign up for GenieOTP using my referral code ${referralCode} and get started with secure OTPs!`,
        url: referralLink,
      }).then(() => {
        toast({ title: 'Referral link shared successfully.'});
      }).catch(console.error);
    } else {
      copyToClipboard(referralLink, 'Referral link');
      toast({ title: 'Link Copied', description: 'Web Share API not supported. Link copied to clipboard instead.' });
    }
  };

  if (isLoading || isUserLoading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your referral magic...</p>
        </div>
     );
  }

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <section className="text-center">
        <Gift className="mx-auto h-24 w-24 text-accent mb-6 animate-bounce" />
        <h1 className="text-5xl font-bold font-headline text-primary mb-4">GenieOTP Referral Program</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share the magic of GenieOTP with your friends! For every friend who signs up using your code and successfully receives an OTP, you get <span className="font-bold text-accent">20% of their first successful OTP's coin value</span> credited to your account.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Your Referral Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
              <span className="font-medium">Friends Referred:</span>
              <span className="text-2xl font-bold text-primary">0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
              <span className="font-medium">Total Coins Earned:</span>
              <span className="text-2xl font-bold text-accent flex items-center">
                0 <Users className="ml-2 h-5 w-5"/>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">This feature is currently being updated. Keep sharing to earn more soon!</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Share Your Code</CardTitle>
            <CardDescription>Use your unique code or link to invite friends.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="referralCode" className="text-sm font-medium">Your Referral Code:</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input id="referralCode" value={referralCode || 'Loading...'} readOnly className="font-code text-lg bg-muted/50" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(referralCode, 'Referral code')} aria-label="Copy referral code" disabled={!referralCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="referralLink" className="text-sm font-medium">Your Referral Link:</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input id="referralLink" value={referralLink} readOnly className="text-sm bg-muted/50 truncate" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(referralLink, 'Referral link')} aria-label="Copy referral link" disabled={!referralLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={shareReferralLink} disabled={!referralLink || !referralCode}>
              <Share2 className="mr-2 h-5 w-5" /> Share Now
            </Button>
          </CardContent>
        </Card>
      </div>

       <div className="relative w-full h-64 md:h-80 lg:h-96 my-8">
        <Image 
          src="https://placehold.co/600x300.png" 
          alt="Referral Program Illustration" 
          layout="fill" 
          objectFit="contain"
          className="rounded-lg"
          data-ai-hint="friends sharing"
        />
      </div>
    </div>
  );
}

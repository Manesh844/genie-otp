
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WHATSAPP_PAYMENT_URL } from '@/lib/constants';
import { Coins, DollarSign, Loader2, Copy, MessageSquare, Upload, UserCircle2 } from 'lucide-react';
import { useState, useRef, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import { submitPaymentForVerification } from '@/actions/authActions';

const DetailRow = ({ label, value, onCopy, icon: Icon }: { label: string; value: string; onCopy?: () => void, icon?: React.ElementType }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-border/50 last:border-b-0">
    <div className="flex items-center text-sm font-medium text-muted-foreground mb-1 sm:mb-0">
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {label}
    </div>
    <div className="flex items-center space-x-2">
      <span className="font-semibold text-foreground break-all text-sm sm:text-base">{value}</span>
      {onCopy && (
        <Button variant="ghost" size="icon" onClick={onCopy} aria-label={`Copy ${label}`}>
          <Copy className="h-4 w-4" />
        </Button>
      )}
    </div>
  </div>
);


export default function RechargePage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'easypaisa' | 'usdt' | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [isSubmitting, startTransition] = useTransition();
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  const EASYPAISA_ACCOUNT_NAME = "Manesh Kumar Harwani";
  const EASYPAISA_ACCOUNT_NUMBER = "03420286170";
  
  const USDT_ADDRESSES = {
    Aptos: "0xdd488590e5de2aa42209b84f2f4553f57349c480fcaaaabcf8909131501e9008",
    BEP20: "0x3f821414c8b403678101beca90837b408b5dda54",
    Arbitrum: "0x3f821414c8b403678101beca90837b408b5dda54",
    Optimism: "0x3f821414c8b403678101beca90837b408b5dda54",
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard.` });
  };

  const handlePaymentMethodSelect = (method: 'easypaisa' | 'usdt') => {
    setPaymentMethod(method);
    setShowPaymentDetails(true);
    setAmount('');
    setScreenshotFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleVerifyOnWhatsApp = (selectedMethod: 'easypaisa' | 'usdt') => {
    const userEmailForMessage = user?.email || '[YOUR_EMAIL_HERE]';
    let message = "";
    
    if (selectedMethod === 'easypaisa') {
        message = `Hello GenieOTP, I want to make a payment via EasyPaisa to Name: ${EASYPAISA_ACCOUNT_NAME}, Number: ${EASYPAISA_ACCOUNT_NUMBER}. My GenieOTP email is ${userEmailForMessage}. Please confirm.`;
    } else if (selectedMethod === 'usdt') {
        message = `Hello GenieOTP, I want to make a payment via USDT. My GenieOTP email is ${userEmailForMessage}. Please provide the current USDT address and network for the deposit.`;
    }
    
    const whatsappUrl = `${WHATSAPP_PAYMENT_URL}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setScreenshotFile(event.target.files[0]);
    } else {
      setScreenshotFile(null);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paymentMethod || !amount || !user?.email || !screenshotFile) {
      toast({ title: 'Error', description: 'Please select a payment method, enter an amount, and upload a screenshot.', variant: 'destructive' });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 1) {
        toast({ title: 'Error', description: 'Invalid amount entered. Minimum 1 coin.', variant: 'destructive' });
        return;
    }
    
    startTransition(async () => {
        const formData = new FormData();
        formData.append('uid', user.uid);
        formData.append('userEmail', user.email!);
        formData.append('amount', amount);
        formData.append('paymentMethod', paymentMethod);

        const result = await submitPaymentForVerification(formData);

        if (result.success) {
            toast({
                title: 'Submission Successful!',
                description: 'Your payment is pending verification. Please contact us on WhatsApp with your screenshot to get coins credited.',
                duration: 7000,
            });

            // Prepare WhatsApp message
            const userEmailForMessage = user?.email || '[YOUR_EMAIL_HERE]';
            const paymentMethodText = paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'USDT Crypto';
            let message = `Hello! I have submitted a payment verification request for ${numericAmount} coins. Please credit the coins to my account (${userEmailForMessage}).\n\n`;
            message += `🔹 Transaction Details:\n`;
            message += `- Coins Purchased: ${numericAmount}\n`;
            message += `- Payment Method: ${paymentMethodText}\n\n`;
            message += `I have the payment screenshot ready to share. Please confirm and process my request. Thank you!`;

            const whatsappUrl = `${WHATSAPP_PAYMENT_URL}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            // Reset form
            setAmount('');
            setScreenshotFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } else {
            toast({ title: 'Submission Failed', description: result.message, variant: 'destructive' });
        }
    });
  };

  if (isUserLoading && !user) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Recharge Your Coins</CardTitle>
          <CardDescription>Add coins to your GenieOTP wallet. Current balance: {user?.coins ?? 0} coins.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="font-semibold text-lg">Step 1: Choose Payment Method</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant={paymentMethod === 'easypaisa' ? 'default' : 'outline'}
              className="py-8 text-lg bg-green-500 hover:bg-green-600 text-white border-green-600 data-[state=open]:bg-green-600 data-[state=open]:text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-600 data-[variant=outline]:hover:bg-green-500/90 data-[variant=outline]:hover:text-white"
              onClick={() => handlePaymentMethodSelect('easypaisa')}
            >
              <DollarSign className="mr-2 h-6 w-6" /> EasyPaisa
            </Button>
            <Button
              variant={paymentMethod === 'usdt' ? 'default' : 'outline'}
              className="py-8 text-lg bg-blue-500 hover:bg-blue-600 text-white border-blue-600 data-[state=open]:bg-blue-600 data-[state=open]:text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-blue-600 data-[variant=outline]:hover:bg-blue-500/90 data-[variant=outline]:hover:text-white"
              onClick={() => handlePaymentMethodSelect('usdt')}
            >
              <Coins className="mr-2 h-6 w-6" /> USDT (Crypto)
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPaymentDetails && paymentMethod === 'easypaisa' && (
        <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline text-primary">EasyPaisa Payment</CardTitle>
             <CardDescription className="text-sm text-muted-foreground">
              Please follow the instructions below to make your payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
             <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1">
                    <DetailRow label="Payment Method" value="EasyPaisa" onCopy={() => copyToClipboard("EasyPaisa", "Payment Method")} icon={DollarSign} />
                    <DetailRow label="Phone Number" value={EASYPAISA_ACCOUNT_NUMBER} onCopy={() => copyToClipboard(EASYPAISA_ACCOUNT_NUMBER, "Phone Number")} icon={Copy} />
                    <DetailRow label="Account Name" value={EASYPAISA_ACCOUNT_NAME} icon={UserCircle2}/>
                </div>
                <div className="text-center md:text-left md:flex md:flex-col md:items-center">
                    <Label className="text-sm font-medium text-muted-foreground mb-1 block">Scan QR Code:</Label>
                    <Image
                        src="https://i.ibb.co/PGdK9Qx/QC-CODE-FOR-EASYPAISA.jpg" 
                        alt="EasyPaisa QR Code"
                        width={180}
                        height={180}
                        className="rounded-md shadow-sm border mx-auto object-contain"
                    />
                </div>
            </div>
            <Button 
              onClick={() => handleVerifyOnWhatsApp('easypaisa')}
              className="w-full mt-6 bg-green-500 text-white hover:bg-green-600 text-lg py-3"
            >
              <MessageSquare className="mr-2 h-5 w-5" /> Contact on WhatsApp for details
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              Important: After initiating payment, contact us on WhatsApp with your payment proof. Fraudulent activities will result in an account ban.
            </p>
          </CardFooter>
        </Card>
      )}

      {showPaymentDetails && paymentMethod === 'usdt' && (
         <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline text-accent">USDT Payment</CardTitle>
             <CardDescription className="text-sm text-muted-foreground">
              Please follow the instructions below to make your payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            <DetailRow label="Payment Method" value="USDT (TRC20, BEP20, etc.)" onCopy={() => copyToClipboard("USDT", "Payment Method")} icon={Coins} />
            <DetailRow label="USDT Address (Aptos)" value={USDT_ADDRESSES.Aptos} onCopy={() => copyToClipboard(USDT_ADDRESSES.Aptos, "USDT Aptos Address")} icon={Copy} />
            <DetailRow label="USDT Address (BEP20)" value={USDT_ADDRESSES.BEP20} onCopy={() => copyToClipboard(USDT_ADDRESSES.BEP20, "USDT BEP20 Address")} icon={Copy} />
            <DetailRow label="USDT Address (Arbitrum)" value={USDT_ADDRESSES.Arbitrum} onCopy={() => copyToClipboard(USDT_ADDRESSES.Arbitrum, "USDT Arbitrum Address")} icon={Copy} />
            <DetailRow label="USDT Address (Optimism)" value={USDT_ADDRESSES.Optimism} onCopy={() => copyToClipboard(USDT_ADDRESSES.Optimism, "USDT Optimism Address")} icon={Copy}/>
            
            <div className="mt-4 text-center">
                 <Label className="text-sm font-medium text-muted-foreground mb-1 block">Example QR Code for USDT:</Label>
                 <Image
                    src="https://i.ibb.co/yQ5g0mx/USDT-QR-Code.png" 
                    alt="USDT QR Code Example"
                    width={180}
                    height={180}
                    className="mx-auto mt-1 rounded-md shadow-sm border object-contain"
                    data-ai-hint="crypto qr code"
                />
                <p className="text-xs text-muted-foreground mt-1">This is a placeholder. Always verify the address and network from support before sending.</p>
            </div>

            <Button 
              onClick={() => handleVerifyOnWhatsApp('usdt')}
              className="w-full mt-6 bg-green-500 text-white hover:bg-green-600 text-lg py-3"
            >
              <MessageSquare className="mr-2 h-5 w-5" /> Contact on WhatsApp for details
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              Important: After initiating payment, contact us on WhatsApp with proof (including Transaction Hash/ID). Only send to addresses confirmed by support.
            </p>
          </CardFooter>
        </Card>
      )}

      {showPaymentDetails && paymentMethod && (
         <Card className="shadow-lg animate-in fade-in-50">
         <CardHeader>
           <CardTitle className="text-2xl font-headline text-primary">Step 2: Submit Verification Details</CardTitle>
           <CardDescription>After making the payment, enter the amount and upload your screenshot to log your request.</CardDescription>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleSubmitVerification} className="space-y-4">
             <div>
               <Label htmlFor="amount">Amount Paid (Coins equivalent)</Label>
               <Input
                 id="amount"
                 type="number"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 placeholder="e.g., 500"
                 required
                 min="1"
                 step="any"
                 disabled={isSubmitting}
               />
             </div>
             <div>
                <Label htmlFor="screenshot">Payment Screenshot</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="flex-grow"
                        disabled={isSubmitting}
                        required
                    />
                    {screenshotFile && <Upload className="h-5 w-5 text-green-500" />}
                </div>
                {screenshotFile && <p className="text-xs text-muted-foreground mt-1">Selected: {screenshotFile.name}</p>}
             </div>
             <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting || !user}>
               {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit for Coin Crediting"}
             </Button>
           </form>
         </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                After submission, your request will be logged. Please also send your proof of payment on WhatsApp to expedite the process. Coin crediting is manual upon verification.
            </p>
          </CardFooter>
       </Card>
      )}

      <Card>
        <CardHeader>
            <CardTitle className="text-xl font-headline">Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Coin crediting will occur after our team verifies your payment via WhatsApp and the submitted details.</p>
            <p>Please ensure your screenshot is clear and shows the transaction details.</p>
            <p>Contact support via WhatsApp if you have any questions before or after making a payment.</p>
        </CardContent>
      </Card>
    </div>
  );
}

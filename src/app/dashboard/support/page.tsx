
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WHATSAPP_PAYMENT_URL } from '@/lib/constants'; 
import { HelpCircle, MessageSquare, Mail } from 'lucide-react'; 
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I recharge my coins?",
    answer: "You can recharge your coins by going to the 'Recharge Coins' page in your dashboard. We currently support EasyPaisa and USDT. Follow the instructions on the page and contact us on WhatsApp for verification."
  },
  {
    question: "What if I don't receive an OTP?",
    answer: "If you don't receive an OTP after waiting on the virtual number page, first ensure you have given the service enough time (up to 3 minutes). If it times out, you can cancel the order (which may refund your coins depending on the provider's status) and try again. If the problem persists, please contact our support team."
  },
  {
    question: "How does the referral program work?",
    answer: "Share your referral code (your email) with friends. When they sign up and successfully use their first paid OTP service, you'll receive 20% of the coin value of that OTP. You can track your earnings on the 'Referral Program' page."
  },
  {
    question: "Is my payment information secure?",
    answer: "We do not directly process or store your full payment card details or cryptocurrency private keys on our servers. Payments are verified via WhatsApp. Please ensure you are communicating with our official WhatsApp number provided on the recharge page."
  },
  {
    question: "Can I change my registered email address?",
    answer: "Currently, changing your registered email address is not supported directly through the dashboard. Please contact support@genieotp.site for assistance with this."
  }
];

export default function SupportPage() {
  const handleWhatsAppRedirect = () => {
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : 'N/A';
    const message = `Hello GenieOTP Support, I need help with... (My email: ${userEmail || 'N/A'})`;
    const whatsappUrl = `${WHATSAPP_PAYMENT_URL}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <HelpCircle className="mr-3 h-8 w-8" /> Customer Support
          </CardTitle>
          <CardDescription>
            Need assistance? We&apos;re here to help!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <Image 
            src="https://i.ibb.co/yn1FTBq/gpt-image-1-can-u-create-a-pictu.png" 
            alt="Support Team Illustration" 
            width={600}
            height={300}
            className="rounded-lg shadow-md mx-auto mb-6 object-contain"
            data-ai-hint="customer support helpdesk"
          />
          <p className="text-lg text-foreground">
            If you need any help or you have any problem, please use one of the contact methods below.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleWhatsAppRedirect} 
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white text-lg py-6 px-8"
            >
              <MessageSquare className="mr-2 h-6 w-6" /> Contact on WhatsApp
            </Button>
            <a href="mailto:support@genieotp.site" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 text-lg py-6 px-8"
              >
                <Mail className="mr-2 h-6 w-6" /> Email: support@genieotp.site
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            Our team will get back to you as soon as possible. Please provide your registered email if possible for faster assistance.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="text-xl font-headline">Frequently Asked Questions (FAQ)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-left">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="hover:no-underline text-base text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground prose prose-sm max-w-none">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

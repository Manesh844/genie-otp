
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - GenieOTP',
  description: 'Read the Terms of Service for GenieOTP.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-lg max-w-none prose-headings:text-primary prose-a:text-accent">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="font-headline">1. Introduction</h2>
          <p>
            Welcome to GenieOTP! These Terms of Service (&quot;Terms&quot;) govern your use of our website, services, and applications (collectively, the &quot;Service&quot;) provided by GenieOTP (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our Service.
          </p>

          <h2 className="font-headline">2. Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
          <p>
            Only Gmail addresses are permitted for account registration during the initial phase. We reserve the right to verify the validity of email addresses and to refuse service or terminate accounts for use of non-Gmail addresses or fraudulent email information.
          </p>

          <h2 className="font-headline">3. Coin System and Payments</h2>
          <p>
            Our Service operates on a coin-based system. Coins can be purchased through designated payment methods (Easypaisa, USDT) by contacting us via WhatsApp for payment verification. Coin crediting is managed through our internal systems, potentially involving Google Sheets. We are not responsible for any transaction fees incurred from your payment provider. All coin purchases are final and non-refundable except as required by law or at our sole discretion.
          </p>

          <h2 className="font-headline">4. OTP Services</h2>
          <p>
            We integrate with third-party services like 5SIM to provide OTPs. We strive to use the cheapest available operators but do not guarantee availability or success for every OTP request. Coins will be deducted for successfully delivered OTPs. Our AI-based fraud detection system may prevent coin deduction for attempts deemed fraudulent or failed due to system issues, at our discretion.
          </p>

          <h2 className="font-headline">5. Referral Program</h2>
          <p>
            Our referral program allows you to earn coins by referring new users. Specific terms of the referral program (e.g., 20% coin credit to referrer after successful OTP delivery by the referred user) will be detailed on the referral page within the Service. We reserve the right to modify or terminate the referral program at any time.
          </p>
          
          <h2 className="font-headline">6. Prohibited Uses</h2>
          <p>
            You may not use the Service for any illegal or unauthorized purpose. You agree to comply with all laws, rules, and regulations applicable to your use of the Service.
          </p>

          <h2 className="font-headline">7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="font-headline">8. Limitation of Liability</h2>
          <p>
            In no event shall GenieOTP, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2 className="font-headline">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
          </p>

          <h2 className="font-headline">10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2 className="font-headline">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us via our{' '}
            <Link href="/dashboard/support" className="text-accent hover:underline">Support Page</Link> or by email at <a href="mailto:support@genieotp.site" className="text-accent hover:underline">support@genieotp.site</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

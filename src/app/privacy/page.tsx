
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - GenieOTP',
  description: 'Read the Privacy Policy for GenieOTP.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-lg max-w-none prose-headings:text-primary prose-a:text-accent">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="font-headline">1. Introduction</h2>
          <p>
            GenieOTP (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2 className="font-headline">2. Information We Collect</h2>
          <p>
            We may collect personal identification information, including but not limited to:
            <ul>
              <li>Email address (Gmail only during initial phase)</li>
              <li>First name, last name, province, city, gender, phone number</li>
              <li>Password (stored securely)</li>
              <li>Referral codes used or generated</li>
              <li>IP address, user agent, and request timestamps for security and fraud detection</li>
              <li>Transaction history (coin purchases, OTP requests)</li>
              <li>Phone numbers for which OTPs are requested (logged for service provision and security)</li>
            </ul>
          </p>
          <p>
            Information related to payments (e.g., Easypaisa or USDT transaction details) may be shared with us via WhatsApp for verification purposes. We do not directly process or store your full payment card details or cryptocurrency wallet private keys.
          </p>

          <h2 className="font-headline">3. How We Use Your Information</h2>
          <p>
            We use the collected information for various purposes:
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To manage your account and provide customer support</li>
              <li>To process transactions and credit coins to your account</li>
              <li>To monitor the usage of our Service and detect/prevent fraud (including through AI analysis)</li>
              <li>To implement and manage our referral program</li>
              <li>To communicate with you, including for service updates or promotional offers (with your consent)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </p>

          <h2 className="font-headline">4. Data Storage and Sharing</h2>
          <p>
            Your information, including OTP request logs and user data, may be stored and managed using Google Sheets or other secure database solutions. We implement security measures to protect your data.
          </p>
          <p>
            We may share your information with third-party service providers (e.g., 5SIM for OTP generation, Brevo/Resend for email delivery) only to the extent necessary to provide the Service. We do not sell your personal information.
          </p>

          <h2 className="font-headline">5. Security of Your Data</h2>
          <p>
            The security of your data is important to us. We use AI tools like `validateGmailAddress` and `detectFraudulentOtpAttempt` as part of our security measures. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security as no method of transmission over the Internet or method of electronic storage is 100% secure.
          </p>

          <h2 className="font-headline">6. Your Data Rights</h2>
          <p>
            Depending on your jurisdiction, you may have certain rights regarding your personal data, including the right to access, correct, or delete your information. Please contact us to make such requests.
          </p>

          <h2 className="font-headline">7. Children&apos;s Privacy</h2>
          <p>
            Our Service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
          </p>

          <h2 className="font-headline">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="font-headline">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our{' '}
            <Link href="/dashboard/support" className="text-accent hover:underline">Support Page</Link> or by email at <a href="mailto:support@genieotp.site" className="text-accent hover:underline">support@genieotp.site</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

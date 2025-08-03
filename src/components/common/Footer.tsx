import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground py-8 border-t">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/terms" passHref>
            <Button variant="link" className="text-muted-foreground hover:text-primary">
              <Shield className="mr-2 h-4 w-4" /> Terms of Service
            </Button>
          </Link>
          <Link href="/privacy" passHref>
            <Button variant="link" className="text-muted-foreground hover:text-primary">
              <Lock className="mr-2 h-4 w-4" /> Privacy Policy
            </Button>
          </Link>
        </div>
        <p className="text-sm">
          &copy; {currentYear} GenieOTP. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Secure Access, Magically Simple.
        </p>
      </div>
    </footer>
  );
}

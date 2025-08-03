
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { headers } from 'next/headers';
import { Providers } from '@/components/common/Providers';

export const metadata: Metadata = {
  title: 'GenieOTP: Secure Access Made Simple',
  description: 'Your magical solution for OTP verification.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heads = headers();
  const pathname = heads.get('next-url') || '';
  const isAdminPage = pathname.startsWith('/mayyan-admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Providers>
            {!isAdminPage && <Header />}
            <main className={isAdminPage ? "flex-grow" : "flex-grow container mx-auto px-4 py-8"}>
              {children}
            </main>
            {!isAdminPage && <Footer />}
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}

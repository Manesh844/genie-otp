
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { User, LogIn, UserPlus, LayoutDashboard, Gift, HomeIcon, Sun, Moon } from 'lucide-react';
import CoinIcon from './CoinIcon';
import { useTheme } from "next-themes";
import { useUser } from '@/context/UserContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function Header() {
  const { user, isUserLoading, logoutUserContext } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    // The actual sign out logic is now centralized in the UserContext
    // to handle the null-auth case gracefully.
    logoutUserContext();
    window.location.href = '/'; 
  };
  
  if (!mounted) {
    return (
      <header className="bg-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center space-x-2 md:space-x-4">
          {!isUserLoading && user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <Link href="/referral">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Gift className="mr-2 h-4 w-4" /> Referral
                </Button>
              </Link>
              <div className="flex items-center space-x-1 text-foreground">
                <CoinIcon size={20} />
                <span>{user.coins}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <User className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
             !isUserLoading && (
              <>
                <Link href="/">
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90"
                  >
                    <HomeIcon className="mr-2 h-4 w-4" /> Home
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </Link>
              </>
             )
          )}
           <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className="text-foreground hover:text-primary"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}


'use client';

import type { User, UserProfile } from '@/types/user';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/actions/authActions';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: User | null;
  isUserLoading: boolean;
  logoutUserContext: () => void;
  updateCoinsUserContext: (newCoinBalance: number) => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
    const profileResult = await getUserProfile(firebaseUser.uid);
    if (profileResult.success && profileResult.data) {
      setUser(profileResult.data);
    } else {
      console.error("Failed to fetch user profile:", profileResult.message);
      // Don't log out, just set user to null. The page logic will handle redirects.
      setUser(null);
    }
    setIsUserLoading(false);
  }, []);

  useEffect(() => {
    if (!auth) {
      setIsUserLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsUserLoading(true);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
        setIsUserLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);
  
  const logoutUserContext = useCallback(() => {
    if (auth) {
      auth.signOut().then(() => {
        setUser(null);
        router.push('/');
      });
    } else {
      setUser(null);
      router.push('/');
    }
  }, [router]);

  const updateCoinsUserContext = useCallback((newCoinBalance: number) => {
    setUser(prevUser => prevUser ? { ...prevUser, coins: newCoinBalance } : null);
  }, []);
  
  const refreshUser = useCallback(async () => {
    if (auth?.currentUser) {
      setIsUserLoading(true);
      await fetchUserProfile(auth.currentUser);
      setIsUserLoading(false);
    }
  }, [fetchUserProfile]);

  return (
    <UserContext.Provider value={{ user, isUserLoading, logoutUserContext, updateCoinsUserContext, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

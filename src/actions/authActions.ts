
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import type { UserProfile } from '@/types/user';

const NewUserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  phoneNumber: z.string().optional(),
  referralCode: z.string().optional(),
});

export const createUserProfile = async (userData: z.infer<typeof NewUserSchema>) => {
  if (!db) {
    console.error("Firestore is not configured. Skipping profile creation.");
    // Return success to not block signup flow if db is offline, but log it.
    return { success: true, message: "Profile creation skipped (DB not configured)." };
  }
  try {
    const userRef = doc(db, 'users', userData.uid);
    await setDoc(userRef, {
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      gender: userData.gender || '',
      city: userData.city || '',
      province: userData.province || '',
      phoneNumber: userData.phoneNumber || '',
      referralCode: userData.referralCode || '',
      coins: 0, // Start with 0 coins
      status: 'Active',
      joinDate: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
    return { success: true, message: "User profile created successfully!" };
  } catch (error) {
    console.error("Error creating user profile in Firestore:", error);
    return { success: false, message: "Failed to create user profile." };
  }
};

export async function getUserProfile(uid: string): Promise<{ success: boolean; data?: UserProfile; message: string }> {
  if (!db) {
    return { success: false, message: 'Database not configured.' };
  }
  if (!uid) {
    return { success: false, message: 'User ID is required.' };
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      // Update last login timestamp asynchronously
      updateDoc(userRef, { lastLogin: serverTimestamp() }).catch(err => console.error("Failed to update last login:", err));

      const profile: UserProfile = {
        uid: userSnap.id,
        email: userData.email,
        coins: userData.coins,
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber,
        city: userData.city,
        province: userData.province,
        joinDate: userData.joinDate?.toDate().toISOString() || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: userData.status,
      };
      return { success: true, data: profile, message: 'User data fetched.' };
    } else {
      return { success: false, message: 'User profile not found.' };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, message: 'Failed to fetch user data.' };
  }
}

export async function refreshUserCoins(uid: string): Promise<{ success: boolean; newCoinBalance?: number; message: string }> {
  if (!db || !uid) {
    return { success: false, message: 'Database not configured or user ID missing.' };
  }
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { success: true, newCoinBalance: userSnap.data().coins, message: 'Coin balance refreshed.' };
    }
    return { success: false, message: 'User not found.' };
  } catch (error) {
    console.error("Error refreshing coins:", error);
    return { success: false, message: 'Failed to refresh coins.' };
  }
}

export async function submitPaymentForVerification(formData: FormData) {
  if (!db) {
    return { success: false, message: 'Database not configured.' };
  }
  const userEmail = formData.get('userEmail')?.toString();
  const uid = formData.get('uid')?.toString();
  const amount = formData.get('amount')?.toString();
  const paymentMethod = formData.get('paymentMethod')?.toString();

  if (!uid || !userEmail || !amount || !paymentMethod) {
    return { success: false, message: 'Missing required form data.' };
  }

  try {
    const paymentsRef = collection(db, 'payments');
    await addDoc(paymentsRef, {
      uid,
      userEmail,
      amount: Number(amount),
      paymentMethod,
      status: 'pending',
      timestamp: serverTimestamp(),
    });

    return { success: true, message: 'Payment submitted for verification. Please follow up on WhatsApp.' };
  } catch (error) {
    console.error("Error submitting payment:", error);
    return { success: false, message: 'Failed to submit payment verification.' };
  }
}

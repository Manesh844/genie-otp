
'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function updateUserCoins(uid: string, amount: number) {
    if (!db || !uid) {
        return { success: false, message: "Database not configured or UID missing." };
    }
    if (isNaN(amount) || amount === 0) {
        return { success: false, message: "Invalid amount provided." };
    }

    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            coins: increment(amount)
        });

        // Revalidate the admin users page to show the updated coin balance
        revalidatePath('/mayyan-admin/users');
        // Also revalidate the user-facing dashboard so they see their new balance
        revalidatePath('/dashboard'); 
        
        return { success: true, message: `Successfully updated coins by ${amount} for user ${uid}.` };

    } catch (error) {
        console.error("Error updating coins:", error);
        // This could fail due to permissions or if the document doesn't exist.
        return { success: false, message: "Failed to update coins in the database." };
    }
}


'use server';

import * as fiveSim from '@/lib/5sim';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import type { Service } from '@/types/service';

const GetNumberSchema = z.object({
  service: z.string().min(1, "Service is required."),
  country: z.string().min(1, "Country is required."),
  uid: z.string().min(1, "User ID is required."),
});

// Helper function to get service details from Firestore
async function getServiceDetails(serviceName: string): Promise<Service | null> {
    if (!db) return null;
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, where("name", "==", serviceName));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const serviceDoc = querySnapshot.docs[0];
    return { id: serviceDoc.id, ...serviceDoc.data() } as Service;
}


export async function getNumberForService(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = GetNumberSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid input.', errors: validatedFields.error.flatten().fieldErrors };
  }

  const { service, country, uid } = validatedFields.data;
  
  if (!db) {
      return { success: false, message: "Database not configured." };
  }
  
  const serviceConfig = await getServiceDetails(service);
  if (!serviceConfig) {
    return { success: false, message: 'Configuration for the selected service not found.' };
  }
  
  const userRef = doc(db, "users", uid);

  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        return { success: false, message: "User not found." };
    }

    const userData = userSnap.data();
    const numberCost = serviceConfig.price;

    if (userData.coins < numberCost) {
        return { success: false, message: `Not enough coins. You need ${numberCost} coins.` };
    }

    const buyResult = await fiveSim.buyNumber(country, serviceConfig.apiProduct, serviceConfig.operator || 'any');

    if (!buyResult.success || !buyResult.data) {
      return { success: false, message: `Could not get a number: ${buyResult.message}.` };
    }
    
    // Deduct coins
    await updateDoc(userRef, { coins: increment(-numberCost) });

    const orderData = buyResult.data;
    const newCoinBalance = userData.coins - numberCost;

    // Log the OTP request to Firestore
    const otpLogsRef = collection(db, 'otp-logs');
    await addDoc(otpLogsRef, {
        uid: uid,
        userEmail: userData.email,
        orderId: orderData.id,
        service: service,
        country: country,
        number: orderData.phone,
        cost: numberCost,
        status: 'PENDING',
        requestTimestamp: serverTimestamp(),
    });


    return {
      success: true,
      message: 'Number acquired successfully!',
      order: {
        id: orderData.id,
        number: orderData.phone,
        cost: numberCost,
      },
      newCoinBalance,
    };
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred while getting number.";
     return { success: false, message: errorMessage };
  }
}

const CheckSmsSchema = z.object({
    orderId: z.coerce.number().min(1),
});

export async function checkSms(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = CheckSmsSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid order ID.' };
    }
    const { orderId } = validatedFields.data;
    
    if (!db) {
        return { success: false, message: "Database not configured." };
    }

    try {
        const result = await fiveSim.checkOrder(orderId);
        if (!result.success || !result.data) {
            return { success: false, message: result.message || 'Failed to check order status.' };
        }
        
        const orderStatus = result.data;
        if (orderStatus.status === 'RECEIVED' && orderStatus.sms && orderStatus.sms.length > 0) {
            const smsCode = orderStatus.sms[0].code;
            
            const logsQuery = query(collection(db, 'otp-logs'), where("orderId", "==", orderId));
            const logsSnapshot = await getDocs(logsQuery);
            if (!logsSnapshot.empty) {
                const logDocRef = logsSnapshot.docs[0].ref;
                await updateDoc(logDocRef, {
                    status: 'RECEIVED',
                    smsCode: smsCode,
                    receivedTimestamp: serverTimestamp()
                });
            }
            
            return { success: true, status: 'RECEIVED', code: smsCode };
        }

        return { success: true, status: orderStatus.status, code: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred while checking SMS.";
        return { success: false, message: errorMessage };
    }
}

const CancelOrderSchema = z.object({
  orderId: z.coerce.number().min(1),
  uid: z.string().min(1),
  cost: z.coerce.number().min(0),
});

export async function cancelOrder(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = CancelOrderSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid input.' };
    }
    const { orderId, uid, cost } = validatedFields.data;
    
    if (!db) {
        return { success: false, message: "Database not configured." };
    }
    
    try {
        const cancelResult = await fiveSim.cancelOrder(orderId);
        if (!cancelResult.success) {
            return { success: false, message: `Cancellation failed: ${cancelResult.message}` };
        }
        
        // Refund coins
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { coins: increment(cost) });
        
        const userSnap = await getDoc(userRef);
        const newCoinBalance = userSnap.exists() ? userSnap.data().coins : undefined;
        
        const logsQuery = query(collection(db, 'otp-logs'), where("orderId", "==", orderId));
        const logsSnapshot = await getDocs(logsQuery);
        if (!logsSnapshot.empty) {
            const logDocRef = logsSnapshot.docs[0].ref;
            await updateDoc(logDocRef, {
                status: 'CANCELLED',
                cancelledTimestamp: serverTimestamp()
            });
        }

        return {
            success: true,
            message: `Order cancelled successfully. ${cost} coins refunded.`,
            newCoinBalance,
        };
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred while cancelling order.";
        return { success: false, message: errorMessage };
    }
}

export async function getServices() {
  if (!db) return [];
  try {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, where("isActive", "==", true), orderBy("name", "asc"));
    const serviceSnapshot = await getDocs(q);
    const serviceList = serviceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    return serviceList;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

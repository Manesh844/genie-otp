
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { ApiConfig, CountryConfig } from '@/types/admin';
import type { Service } from '@/types/service';

// Schema for adding a new API configuration
const ApiConfigSchema = z.object({
  name: z.string().min(1, 'API name is required.'),
  url: z.string().url('Invalid URL format.'),
  apiKey: z.string().min(1, 'API key is required.'),
});

export async function addApiConfig(formData: FormData) {
  if (!db) return { success: false, message: 'Database not configured.' };

  const validatedFields = ApiConfigSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid input.', errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await addDoc(collection(db, 'apiConfigs'), validatedFields.data);
    revalidatePath('/mayyan-admin/api');
    return { success: true, message: 'API configuration added successfully.' };
  } catch (error) {
    console.error("Error adding API config:", error);
    return { success: false, message: 'Failed to add API configuration.' };
  }
}

export async function getApiConfigs(): Promise<ApiConfig[]> {
    if (!db) return [];
    try {
        const apiConfigsCol = collection(db, 'apiConfigs');
        const q = query(apiConfigsCol, orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApiConfig));
    } catch (error) {
        console.error("Error fetching API configs:", error);
        return [];
    }
}


// Schema for adding a new Country configuration
const CountryConfigSchema = z.object({
    apiId: z.string().min(1),
    apiName: z.string().min(1),
    name: z.string().min(1, 'Country name is required.'),
    code: z.string().min(1, 'Country code is required.'),
});

export async function addCountryConfig(formData: FormData) {
    if (!db) return { success: false, message: 'Database not configured.' };
    const validatedFields = CountryConfigSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid input.', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await addDoc(collection(db, 'countries'), validatedFields.data);
        revalidatePath('/mayyan-admin/country');
        return { success: true, message: 'Country added successfully.' };
    } catch (error) {
        console.error("Error adding country:", error);
        return { success: false, message: 'Failed to add country.' };
    }
}

export async function getCountryConfigs(): Promise<CountryConfig[]> {
    if (!db) return [];
    try {
        const countriesCol = collection(db, 'countries');
        const q = query(countriesCol, orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CountryConfig));
    } catch (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
}

// Schema for adding/updating a service
const ServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required.'),
  apiProduct: z.string().min(1, 'API Product code is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  countries: z.array(z.string()).min(1, 'At least one country must be selected.'),
  operator: z.string().optional(),
  isActive: z.boolean(),
});

export async function addService(data: z.infer<typeof ServiceSchema>) {
    if (!db) return { success: false, message: 'Database not configured.' };
    const validatedFields = ServiceSchema.safeParse(data);
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid input.', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await addDoc(collection(db, 'services'), validatedFields.data);
        revalidatePath('/mayyan-admin/social-media');
        return { success: true, message: 'Service added successfully.' };
    } catch (error) {
        console.error("Error adding service:", error);
        return { success: false, message: 'Failed to add service.' };
    }
}

export async function getServices(): Promise<Service[]> {
  if (!db) return [];
  try {
    const servicesCol = collection(db, 'services');
    const q = query(servicesCol, orderBy('name', 'asc'));
    const serviceSnapshot = await getDocs(q);
    return serviceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

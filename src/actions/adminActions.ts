
'use server';

import { z } from 'zod';

const AdminLoginSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

// This is a server action. The environment variables are only accessible on the server,
// ensuring they are never exposed to the client-side browser.
export async function handleAdminLogin(formData: FormData) {
  const validatedFields = AdminLoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid input.' };
  }

  const { email, username, password } = validatedFields.data;

  // As requested, hardcoding the admin credentials for now.
  // In a production environment, these should come from environment variables.
  const adminEmail = "genieotp@gmail.com";
  const adminUsername = "Genieotp";
  const adminPassword = "Genieotp(12)";

  const isEmailValid = email === adminEmail;
  const isUsernameValid = username === adminUsername;
  const isPasswordValid = password === adminPassword;

  if (isEmailValid && isUsernameValid && isPasswordValid) {
    // In a real-world scenario, you would create a secure, encrypted session cookie here.
    return { success: true, message: 'Login successful' };
  } else {
    // Generic error message to prevent leaking information about which field was incorrect.
    return { success: false, message: 'Invalid credentials. Please try again.' };
  }
}

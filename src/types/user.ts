
export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | '';
  province?: string;
  city?: string;
  phoneNumber?: string;
  coins: number;
  joinDate: string; // ISO string or human-readable string
  lastLogin: string; // ISO string or human-readable string
  status: 'Active' | 'Banned';
}

// User context type can be the same as the profile for simplicity
export type User = UserProfile;

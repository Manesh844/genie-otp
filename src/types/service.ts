
export interface Service {
  id: string;
  name: string;
  apiProduct: string; // The code used by the 5sim API (e.g., 'wa', 'tg')
  price: number;
  countries: string[]; // Array of country codes (e.g., ['russia', 'pakistan'])
  isActive: boolean;
  operator?: string; // Optional operator
}

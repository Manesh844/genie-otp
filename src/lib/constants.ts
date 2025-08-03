
import { MessageSquare, Facebook, Instagram, Music2, Send, Mail, ShoppingCart, Brain, Ghost, CreditCard, ShieldQuestion, type LucideIcon } from 'lucide-react';

export const WHATSAPP_PAYMENT_URL = "https://wa.me/+923420286170";

export const SERVICE_ICONS_MAP: { [key: string]: LucideIcon } = {
  'WhatsApp': MessageSquare,
  'Facebook': Facebook,
  'TikTok': Music2,
  'Instagram & Threads': Instagram,
  'Telegram': Send,
  'Google & YouTube': Mail,
  'Amazon': ShoppingCart,
  'OpenAI/ChatGPT': Brain,
  'Snapchat': Ghost,
  'PayPal': CreditCard,
  'Default': ShieldQuestion,
};

// This configuration is now stored in Firestore and fetched dynamically.
// This file is kept for the icon map and other constants.

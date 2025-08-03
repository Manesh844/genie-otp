# **App Name**: GenieOTP: Secure Access Made Simple

## Core Features:

- Landing Page: Attractive landing page explaining GenieOTP's features and benefits with clear CTAs for login/signup.
- Authentication System: Secure login and signup pages with optional referral code input and 'Terms and Privacy Policy' acceptance checkbox. Password recovery feature. Connect to Google sheets Users Sheet on login and signup.
- User Dashboard: Dashboard with OTP generation, coin balance display, recharge options (Easypaisa, USDT), transaction history, and profile management.
- Payment Verification: Redirect users to WhatsApp (https://wa.me/+923420286170) for payment verification. Coin crediting via Google Sheets Payments Sheet using script URL: https://script.google.com/macros/s/AKfycbxbCDwVbxx75w9Aa5wBN8tNuoJYGtuPNWe0hppir0VnZ7xhVUcOrCD40HP3acHbsSa3SA/exec.
- Referral Program: 20% coin credit to referrer after successful OTP delivery, explained on a dedicated referral page.
- 5SIM Protocol API Integration: Connect to a third-party service to fetch an OTP. Configure to use the cheapest operator. Log OTP requests to Google Sheets OTPLogs Sheet.
- Enhanced Security Measures: Gmail-only signup enforcing use of valid email addressses, along with fraud detection that does not deduct coins for failed OTP attempts; the AI acts as a tool in determining whether to block or permit specific actions.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) to evoke a sense of magic, mystery, and innovation, reflecting the 'Genie' aspect and modern tech focus.
- Background color: Very light purple (#F3E5F5) for a soft, clean backdrop that complements the deep purple.
- Accent color: Vibrant pink (#E91E63) to highlight key interactive elements like CTAs and buttons, drawing user attention and enhancing the visual appeal.
- Body text: 'PT Sans', sans-serif, offering a modern yet readable feel suitable for both headings and body content.
- Code snippets and API keys: 'Source Code Pro' monospace
- Custom coin icon to represent the in-app currency; use of SIM card icon in header (SIM card icon website logo). Icons related to the different services and pricing: WhatsApp, Facebook/Instagram, TikTok (join tiktok
https://www.tiktok.com/@uknumberin150rs1?is_from_webapp=1&sender_device=pc), Telegram (join telegram 
https://t.me/genieOTP), Gmail, Amazon, ChatGPT, Snapchat, PayPal.
- Subtle hover effects and GSAP/Framer Motion animations for a polished user experience, with an animated genie that reacts to user input during login/signup.
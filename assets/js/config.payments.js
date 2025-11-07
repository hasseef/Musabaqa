// Payment provider config
export const PAYMENTS = {
  provider: 'hyperpay',               // 'hyperpay' | 'mock'
  currency: 'SAR',
  endpoint: {
    create: '/.netlify/functions/pay-hyperpay', // Netlify Functions default path
    // If using Cloudflare Workers or Vercel, change to their function URL.
  }
};

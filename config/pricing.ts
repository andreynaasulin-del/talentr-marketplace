export const PRICING_CONFIG = {
  credits: {
    starter: { amount: 10, credits: 10, name: "Starter Pack" },
    creator: { amount: 30, credits: 50, name: "Creator Pack" },
    pro: { amount: 79, credits: 200, name: "Pro Pack" },
    agency: { amount: 149, credits: 600, name: "Agency Pack + Business AI" }
  },
  business: {
    amount: 39,
    credits: 0,
    name: "Business AI Subscription (30 Days)"
  }
} as const;

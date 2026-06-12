// Stripe product and price IDs mapping
export const stripeProducts = {
  website: {
    productId: "prod_UA8nRotwAJ1e4w",
    priceId: "price_1TBoVdRTMlADIN63yS7VRrsh",
    hostingPriceId: "price_1T8hBjRTMlADIN63D5czFXJn",
    mode: "subscription" as const,
  },
  eshop: {
    productId: "prod_UA8nXo292agotv",
    priceId: "price_1TBoVdRTMlADIN63tOQSn883",
    mode: "payment" as const,
  },
  qrBasic: {
    productId: "prod_UA8nzgc7VKayNI",
    priceId: "price_1TBoVeRTMlADIN63kVzVeIAU",
    mode: "subscription" as const,
  },
  qrSmart: {
    productId: "prod_U6zzWNqWHyfJQM",
    priceId: "price_1T8lzqRTMlADIN63Tz2M4lkR",
    mode: "subscription" as const,
  },
  videoEdit10: {
    productId: "prod_U8akKxDEZ2gDHI",
    priceId: "price_1TAJZ3RTMlADIN63gomBMeDO",
    mode: "payment" as const,
  },
  videoEdit20: {
    productId: "prod_U8ajEsGEn9KweG",
    priceId: "price_1TAJYORTMlADIN63t4gSuWRR",
    mode: "payment" as const,
  },
  videoEdit30: {
    productId: "prod_U8akWF6IWs4Zas",
    priceId: "price_1TAJYkRTMlADIN637wndttbY",
    mode: "payment" as const,
  },
  smStarter: {
    productId: "prod_U9EQfjFmFHWbau",
    priceId: "price_1TAvy3RTMlADIN63EFvn5y2h",
    mode: "subscription" as const,
  },
  smGrowth: {
    productId: "prod_UA8nFxRQXsDD4M",
    priceId: "price_1TBoVfRTMlADIN63Wq1GkxuT",
    mode: "subscription" as const,
  },
  smPro: {
    productId: "prod_UA8ne91dYuV8OY",
    priceId: "price_1TBoVgRTMlADIN63X1rtwajw",
    mode: "subscription" as const,
  },
} as const;

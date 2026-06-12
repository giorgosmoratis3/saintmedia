import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Whitelist of allowed Stripe price IDs to prevent arbitrary price abuse
const ALLOWED_PRICE_IDS = new Set([
  "price_1TBoVdRTMlADIN63yS7VRrsh", // website (€399)
  "price_1T8hBjRTMlADIN63D5czFXJn", // website hosting (€30/mo)
  "price_1TBoVdRTMlADIN63tOQSn883", // eshop (€499)
  "price_1TBoVeRTMlADIN63kVzVeIAU", // qr basic (€120/yr)
  "price_1T8lzqRTMlADIN63Tz2M4lkR", // qr smart (€49/mo)
  "price_1TAJZ3RTMlADIN63gomBMeDO", // video editing 10 (€99)
  "price_1TAJYORTMlADIN63t4gSuWRR", // video editing 20 (€179)
  "price_1TAJYkRTMlADIN637wndttbY", // video editing 30 (€249)
  "price_1TAvy3RTMlADIN63EFvn5y2h", // sm starter (€199/mo)
  "price_1TBoVfRTMlADIN63Wq1GkxuT", // sm growth (€299/mo)
  "price_1TBoVgRTMlADIN63X1rtwajw", // sm pro (€399/mo)
]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { priceId, mode, additionalPriceIds, customNote } = body;
    if (!priceId) throw new Error("Missing priceId");

    // Validate all price IDs against whitelist
    if (!ALLOWED_PRICE_IDS.has(priceId)) {
      throw new Error("Invalid price ID");
    }
    if (additionalPriceIds && Array.isArray(additionalPriceIds)) {
      for (const id of additionalPriceIds) {
        if (!ALLOWED_PRICE_IDS.has(id)) {
          throw new Error("Invalid additional price ID");
        }
      }
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://saintmedia.lovable.app";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: priceId, quantity: 1 },
    ];

    // Add additional line items (e.g. recurring hosting alongside one-time payment)
    if (additionalPriceIds && Array.isArray(additionalPriceIds)) {
      for (const id of additionalPriceIds) {
        lineItems.push({ price: id, quantity: 1 });
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: mode || "payment",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/packages`,
      allow_promotion_codes: true,
    };

    // Add custom note to checkout page (sanitized)
    if (customNote && typeof customNote === "string") {
      const safeNote = customNote
        .replace(/[\x00-\x1F\x7F]/g, "")
        .trim()
        .slice(0, 500);
      if (safeNote) {
        sessionParams.custom_text = {
          submit: { message: safeNote },
        };

        if (mode === "payment") {
          sessionParams.payment_intent_data = {
            description: safeNote,
          };
        }
      }
    }

    // Delay recurring hosting charge by 30 days (one-time fee charged immediately)
    if (additionalPriceIds && additionalPriceIds.length > 0 && mode === "subscription") {
      sessionParams.subscription_data = {
        trial_period_days: 30,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

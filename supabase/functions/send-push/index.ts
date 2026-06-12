import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const rawBody = await req.json().catch(() => ({}));
    const sanitize = (v: unknown, max = 80) =>
      typeof v === "string"
        ? v.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, max)
        : "";
    const name = sanitize(rawBody?.name, 80);
    const service_type = sanitize(rawBody?.service_type, 80);

    // Get VAPID keys
    const { data: config, error: configError } = await supabase
      .from("push_config")
      .select("*")
      .eq("id", "vapid")
      .single();

    if (configError || !config) {
      console.log("No VAPID config found, skipping push notifications");
      return new Response(JSON.stringify({ message: "No push config" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Set VAPID details
    webpush.setVapidDetails(
      "mailto:admin@saintmedia.gr",
      config.public_key,
      config.private_key
    );

    // Get all push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (subError || !subscriptions || subscriptions.length === 0) {
      console.log("No subscriptions found");
      return new Response(JSON.stringify({ message: "No subscriptions" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.stringify({
      title: "Νέο Αίτημα Συνεργασίας 🔔",
      body: `${name || "Κάποιος"} - ${service_type || "Υπηρεσία"}`,
    });

    console.log(`Sending push to ${subscriptions.length} subscriptions`);

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          const result = await webpush.sendNotification(pushSubscription, payload);
          console.log(`Push sent to ${sub.id}: status ${result.statusCode}`);
          return { id: sub.id, status: result.statusCode };
        } catch (err: any) {
          console.error(`Failed to send to ${sub.id}:`, err.statusCode, err.body);
          
          // Remove expired/invalid subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase.from("push_subscriptions").delete().eq("id", sub.id);
            console.log(`Removed expired subscription ${sub.id}`);
          }
          
          return { id: sub.id, error: err.statusCode || String(err) };
        }
      })
    );

    console.log("Push results:", JSON.stringify(results));

    return new Response(JSON.stringify({ sent: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

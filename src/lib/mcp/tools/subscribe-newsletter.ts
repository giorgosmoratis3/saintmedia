import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "subscribe_newsletter",
  title: "Subscribe to newsletter",
  description: "Subscribe an email address to the SaintMedia newsletter.",
  inputSchema: {
    email: z.string().email().describe("Email address to subscribe."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ email }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });
    if (error && !/duplicate|unique/i.test(error.message)) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Subscribed ${email} to the SaintMedia newsletter.` }],
      structuredContent: { email, subscribed: true },
    };
  },
});

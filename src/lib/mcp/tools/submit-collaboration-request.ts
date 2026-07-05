import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "submit_collaboration_request",
  title: "Submit collaboration request",
  description:
    "Submit a new collaboration request to SaintMedia. The team will follow up on the provided phone number.",
  inputSchema: {
    service_type: z
      .string()
      .min(1)
      .describe("The service the user is interested in (e.g. 'Website Setup', 'E-shop', 'AI Automation')."),
    phone: z.string().min(4).describe("Phone number the SaintMedia team should call back."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  needsApproval: true,
  handler: async ({ service_type, phone }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase
      .from("collaboration_requests")
      .insert({ service_type, phone })
      .select("id, created_at")
      .single();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [
        { type: "text", text: `Collaboration request submitted. Reference: ${data.id}` },
      ],
      structuredContent: { request: data },
    };
  },
});

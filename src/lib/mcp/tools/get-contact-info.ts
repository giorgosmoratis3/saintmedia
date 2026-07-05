import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact_info",
  title: "Get SaintMedia contact info",
  description: "Return SaintMedia's public contact details and website URLs.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      studio: "SaintMedia — Web & AI Studio",
      website: "https://saintmedia.gr",
      alt_domains: ["https://www.saintmedia.gr", "https://saintmedia.online"],
      services: [
        "Website setup & design",
        "E-shop setup (Shopify / WooCommerce)",
        "AI automation (n8n, workflows)",
        "Affiliate & partner programs",
      ],
      contact_page: "https://saintmedia.gr/contact",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});

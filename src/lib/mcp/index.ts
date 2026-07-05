import { defineMcp } from "@lovable.dev/mcp-js";
import listPackages from "./tools/list-packages";
import listPortfolio from "./tools/list-portfolio";
import getContactInfo from "./tools/get-contact-info";
import submitCollaborationRequest from "./tools/submit-collaboration-request";
import subscribeNewsletter from "./tools/subscribe-newsletter";

export default defineMcp({
  name: "saintmedia-mcp",
  title: "SaintMedia MCP",
  version: "0.1.0",
  instructions:
    "Tools for the SaintMedia web & AI studio: browse service packages and portfolio projects, get contact info, submit collaboration requests, and subscribe to the newsletter.",
  tools: [
    listPackages,
    listPortfolio,
    getContactInfo,
    submitCollaborationRequest,
    subscribeNewsletter,
  ],
});

import { useState, useEffect } from "react";
import chatgptLogo from "@/assets/chatgpt-logo.png";
import gmailLogo from "@/assets/gmail-logo.png";
import claudeLogo from "@/assets/claude-logo.svg";
import papakiLogo from "@/assets/papaki-logo.png";
import vivaLogo from "@/assets/vivawallet-logo.png";

interface Tool {
  name: string;
  logo: string;
  invert?: boolean;
  blend?: boolean;
}

const tools: Tool[] = [
  { name: "Shopify", logo: "https://cdn.simpleicons.org/shopify/95BF47" },
  { name: "Hostinger", logo: "https://cdn.simpleicons.org/hostinger/673DE6" },
  { name: "WordPress", logo: "https://cdn.simpleicons.org/wordpress/21759B" },
  { name: "GoDaddy", logo: "https://cdn.simpleicons.org/godaddy/1BDBDB" },
  { name: "Papaki", logo: papakiLogo, blend: true },
  { name: "Gmail", logo: gmailLogo },
  { name: "Claude", logo: claudeLogo },
  { name: "ChatGPT", logo: chatgptLogo, invert: true },
  { name: "n8n", logo: "https://cdn.simpleicons.org/n8n/EA4B71" },
  { name: "Stripe", logo: "https://cdn.simpleicons.org/stripe/635BFF" },
  { name: "Supabase", logo: "https://cdn.simpleicons.org/supabase/3FCF8E" },
  { name: "Viva Wallet", logo: vivaLogo },
];

const ToolsLogos = () => {
  const [activeSet, setActiveSet] = useState(0);
  const totalSets = Math.ceil(tools.length / 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSet((prev) => (prev + 1) % totalSets);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSets]);

  return (
    <section className="py-6 md:py-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs md:text-sm text-white/30 uppercase tracking-widest font-medium mb-6">
          Powered by tools
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-12 h-16">
          {tools.slice(activeSet * 3, activeSet * 3 + 3).map((tool, i) => (
            <div
              key={`${activeSet}-${tool.name}`}
              className="flex flex-col items-center gap-1.5 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img
                src={tool.logo}
                alt={tool.name}
                className={`w-8 h-8 md:w-10 md:h-10 object-contain ${tool.blend ? "rounded-lg" : ""}`}
                style={{
                  ...(tool.invert ? { filter: "invert(1)" } : {}),
                  ...(tool.blend ? { mixBlendMode: "lighten" as const } : {}),
                }}
              />
              <span className="text-[10px] md:text-xs text-white/40 font-medium">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsLogos;

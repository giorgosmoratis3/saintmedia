import { Instagram, Lock, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import saintmediaLogo from "@/assets/saintmedia-logo-white.png";
import { useLanguage } from "@/contexts/language-context";
import NewsletterBar from "./NewsletterBar";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

interface FooterContent {
  instagram_url: string;
  tiktok_url: string;
  website_url: string;
  copyright_text: string;
}

const defaultContent: FooterContent = {
  instagram_url: "https://instagram.com",
  tiktok_url: "https://tiktok.com",
  website_url: "https://saintmedia.gr",
  copyright_text: "© 2025 SaintMedia. All rights reserved.",
};

const Footer = () => {
  const { t, language } = useLanguage();
  const { data: content } = useQuery({
    queryKey: ["site-content", "footer"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("content").eq("section", "footer").maybeSingle();
      return data?.content as unknown as FooterContent | null;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const footerContent = content || defaultContent;
  const isEl = language === "el";

  const columns = [
    {
      title: isEl ? "ΥΠΗΡΕΣΙΕΣ" : "SERVICES",
      links: [
        { label: isEl ? "Ανάπτυξη Ιστοσελίδας" : "Website Development", href: "/website-setup" },
        { label: isEl ? "Ανάπτυξη E-Shop" : "E-Shop Development", href: "/eshop-setup" },
        { label: isEl ? "Υπηρεσίες" : "Services", href: "/services" },
        { label: isEl ? "Γίνε Συνεργάτης" : "Affiliate", href: "/affiliate" },
      ],
    },
    {
      title: isEl ? "ΕΤΑΙΡΕΙΑ" : "COMPANY",
      links: [
        { label: isEl ? "Αρχική" : "Home", href: "/" },
        { label: isEl ? "Επικοινωνία" : "Contact", href: "/contact" },
      ],
    },
    {
      title: isEl ? "ΥΠΟΣΤΗΡΙΞΗ" : "SUPPORT",
      links: [
        { label: t.footer.privacyPolicy, href: "/privacy-policy" },
        { label: t.footer.termsOfUse, href: "/terms-of-use" },
      ],
    },
  ];

  return (
    <footer className="relative pt-0 mt-16">
      <div
        className="relative pt-16 pb-10"
        style={{
          background:
            "linear-gradient(180deg, #1E3A8A 0%, #1E40AF 40%, #0F172A 100%)",
        }}
      >
        {/* Animated wave — rises out of the footer top, no seam */}
        <div
          className="absolute left-0 right-0 bottom-full h-24 md:h-32 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="absolute inset-x-0 w-[200%] animate-footer-wave"
            style={{ bottom: "-1px", height: "calc(100% + 2px)" }}
            viewBox="0 0 2880 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,120 C240,40 480,200 720,120 C960,40 1200,200 1440,120 C1680,40 1920,200 2160,120 C2400,40 2640,200 2880,120 L2880,210 L0,210 Z"
              fill="#1E3A8A"
              opacity="0.35"
            />
            <path
              d="M0,140 C240,80 480,200 720,140 C960,80 1200,200 1440,140 C1680,80 1920,200 2160,140 C2400,80 2640,200 2880,140 L2880,210 L0,210 Z"
              fill="#1E3A8A"
              opacity="0.65"
            />
            <path
              d="M0,160 C240,110 480,200 720,160 C960,110 1200,200 1440,160 C1680,110 1920,200 2160,160 C2400,110 2640,200 2880,160 L2880,210 L0,210 Z"
              fill="#1E3A8A"
            />
          </svg>
        </div>


        {/* Soft glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)" }} />

        <div className="container-max px-6 md:px-12 relative z-10">
          {/* Newsletter signup */}
          <div className="mb-12 text-center">
            <p className="text-sm md:text-base text-white/70 mb-4">
              {isEl ? "Μείνε ενημερωμένος για νέα και αυτοματισμούς" : "Stay updated with new releases and AI automations"}
            </p>
            <NewsletterBar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-10 md:gap-8">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img src={saintmediaLogo} alt="SaintMedia" className="h-16 w-auto" />
                <div>
                  <span className="text-2xl font-bold tracking-tight text-white">SaintMedia</span>
                  <p className="text-white/50 text-sm">{t.footer.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={footerContent.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white hover:text-[#1E3A8A] hover:scale-110 transition-all duration-300 text-white" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={footerContent.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white hover:text-[#1E3A8A] hover:scale-110 transition-all duration-300 text-white" aria-label="TikTok">
                  <TikTokIcon />
                </a>
                <a href="https://www.linkedin.com/in/giorgos-moratis-59b223377/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white hover:text-[#1E3A8A] hover:scale-110 transition-all duration-300 text-white" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h3 className="text-white font-extrabold text-2xl tracking-tight">{col.title}</h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <a href={link.href} className="text-white/70 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-12 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
              <p>{footerContent.copyright_text}</p>
              <div className="flex items-center gap-6">
                <a href={footerContent.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">saintmedia.gr</a>
                <a href="/admin-auth" className="flex items-center gap-1 hover:text-white transition-colors">
                  <Lock className="w-3 h-3" />
                  {t.footer.adminLogin}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface PackagesCarouselProps {
  onSelect: (serviceType: string) => void;
}

type Pkg = {
  id: string;
  badge: string;
  name: string;
  tagline: string;
  features: { text: string; included: boolean }[];
  cta: string;
  serviceType: string;
  accent: string;
  glow: string;
};

const PackagesCarousel = ({ onSelect }: PackagesCarouselProps) => {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const isEl = language === "el";

  const packages: Pkg[] = [
    {
      id: "website",
      badge: isEl ? "ΙΣΤΟΣΕΛΙΔΑ" : "GROWTH",
      name: isEl ? "Ιστοσελίδα" : "Website",
      tagline: isEl ? "Ιδανικό για νέες & αναπτυσσόμενες επιχειρήσεις" : "Perfect for new and growing businesses",
      features: [
        { text: isEl ? " Ενσωμάτωση Google Reviews" : "Google Reviews Widget", included: true },
        { text: isEl ? "Responsive σε όλες τις συσκευές" : "Fully responsive design", included: true },
        { text: isEl ? "Βασικό SEO setup" : "Basic SEO setup", included: true },
        { text: isEl ? "Φόρμα επικοινωνίας" : "Contact form", included: true },
        { text: isEl ? "AI Automations" : "AI Automations", included: false },
      ],
      cta: isEl ? "ΞΕΚΙΝΑ" : "GET STARTED",
      serviceType: isEl ? "Κατασκευή Ιστοσελίδας" : "Website Development",
      accent: "hsl(195 100% 50%)",
      glow: "hsl(195 100% 50% / 0.35)",
    },
    {
      id: "eshop",
      badge: isEl ? "ΔΗΜΟΦΙΛΕΣ" : "POPULAR",
      name: "E-Shop Pro",
      tagline: isEl ? "Πλήρες κατάστημα Shopify έτοιμο να πουλήσει" : "Full Shopify store ready to sell",
      features: [
        { text: isEl ? "Setup Shopify καταστήματος" : "Shopify store setup", included: true },
        { text: isEl ? "Σύνσεση Box Now " : "Box Now Integration ", included: true },
        {
          text: isEl ? "Σύνδεση Apple & Google Pay πληρωμών" : "Apple & Google Pay Payment integration",
          included: true,
        },
        { text: isEl ? "Email & Order automations" : "Email & order automations", included: true },
        { text: isEl ? "Advanced upsell flows" : "Advanced upsell flows", included: true },
      ],
      cta: isEl ? "ΞΕΚΙΝΑ" : "GET STARTED",
      serviceType: "E-shop",
      accent: "hsl(210 100% 60%)",
      glow: "hsl(210 100% 60% / 0.4)",
    },
    {
      id: "ai",
      badge: isEl ? "ΝΕΟ" : "NEW",
      name: "AI Automation",
      tagline: isEl ? "Αυτοματισμοί που εξοικονομούν ώρες κάθε εβδομάδα" : "Workflows that save hours every week",
      features: [
        { text: isEl ? "Custom AI workflow με n8n" : "Custom AI workflow with n8n", included: true },
        { text: isEl ? "Σύνδεση με τα εργαλεία σου" : "Integration with your tools", included: true },
        { text: isEl ? "AI Chatbot / Agent" : "AI Chatbot / Agent", included: true },
        { text: isEl ? "Documentation & training" : "Documentation & training", included: true },
        { text: isEl ? "30 ημέρες support" : "30 days support", included: true },
      ],
      cta: isEl ? "ΞΕΚΙΝΑ" : "GET STARTED",
      serviceType: "AI Automation",
      accent: "hsl(180 100% 55%)",
      glow: "hsl(180 100% 55% / 0.35)",
    },
  ];

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % packages.length);
  }, [packages.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + packages.length) % packages.length);
  }, [packages.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const getPosition = (i: number) => {
    const diff = (i - current + packages.length) % packages.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === packages.length - 1) return "left";
    return "hidden";
  };

  const styles: Record<string, React.CSSProperties> = {
    center: {
      transform: "translateX(0) scale(1) rotateY(0deg)",
      zIndex: 10,
      opacity: 1,
      filter: "none",
    },
    left: {
      transform: "translateX(-65%) scale(0.78) rotateY(28deg)",
      zIndex: 5,
      opacity: 0.5,
      filter: "blur(1px)",
    },
    right: {
      transform: "translateX(65%) scale(0.78) rotateY(-28deg)",
      zIndex: 5,
      opacity: 0.5,
      filter: "blur(1px)",
    },
    hidden: {
      transform: "translateX(0) scale(0.5) rotateY(0deg)",
      zIndex: 0,
      opacity: 0,
    },
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const d = touchStart - touchEnd;
    if (d > 50) next();
    else if (d < -50) prev();
  };

  return (
    <section
      className="relative py-12 md:py-20 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="container-max section-padding">
        <div className="text-center mb-10 md:mb-14">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-[10px] md:text-xs font-medium text-white/70 tracking-wider uppercase"
            style={{
              background: "hsl(0 0% 100% / 0.08)",
              border: "1px solid hsl(0 0% 100% / 0.12)",
              backdropFilter: "blur(12px)",
            }}
          >
            {isEl ? "Πακέτα" : "Packages"}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white tracking-tight">
            {isEl ? "Διάλεξε το πακέτο σου" : "Choose your package"}
          </h2>
          <p className="mt-3 text-white/55 text-sm md:text-base max-w-xl mx-auto">
            {isEl
              ? "Λύσεις προσαρμοσμένες στις ανάγκες σου. Ζήτησε προσφορά για να μάθεις περισσότερα."
              : "Solutions tailored to your needs. Request a quote to learn more."}
          </p>
        </div>

        <div
          className="relative h-[560px] md:h-[600px] flex items-center justify-center"
          style={{ perspective: "1600px" }}
        >
          {packages.map((pkg, i) => {
            const pos = getPosition(i);
            return (
              <div
                key={pkg.id}
                onClick={() => {
                  if (pos === "center") onSelect(pkg.serviceType);
                  else setCurrent(i);
                }}
                className="absolute w-[88%] sm:w-[68%] md:w-[44%] lg:w-[36%] cursor-pointer"
                style={{
                  ...styles[pos],
                  transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="rounded-3xl overflow-hidden relative"
                  style={{
                    background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)",
                    backdropFilter: "blur(40px) saturate(180%)",
                    WebkitBackdropFilter: "blur(40px) saturate(180%)",
                    border: "1px solid hsl(0 0% 100% / 0.12)",
                    boxShadow:
                      pos === "center"
                        ? `0 30px 60px -20px hsl(0 0% 0% / 0.6), 0 0 80px -20px ${pkg.glow}, inset 0 1px 0 hsl(0 0% 100% / 0.1)`
                        : "0 10px 30px -10px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
                  }}
                >
                  {/* Accent glow */}
                  <div
                    className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-50 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${pkg.glow} 0%, transparent 70%)` }}
                  />
                  <div
                    className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full opacity-30 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${pkg.glow} 0%, transparent 70%)` }}
                  />

                  {/* Header */}
                  <div className="relative p-6 md:p-8 pb-4 md:pb-5">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider"
                      style={{
                        background: "hsl(0 0% 100% / 0.1)",
                        border: `1px solid ${pkg.accent}`,
                        color: pkg.accent,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {pkg.badge}
                    </span>
                    <h3 className="mt-5 text-2xl md:text-3xl font-bold text-white tracking-tight">{pkg.name}</h3>
                    <p className="mt-3 text-sm md:text-base text-white/65 leading-relaxed">{pkg.tagline}</p>
                  </div>

                  {/* Divider */}
                  <div
                    className="mx-6 md:mx-8 h-px"
                    style={{
                      background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.15), transparent)",
                    }}
                  />

                  {/* Features */}
                  <div className="relative p-6 md:p-8 pt-5 md:pt-6">
                    <ul className="space-y-3 md:space-y-3.5">
                      {pkg.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm md:text-[15px]">
                          {f.included ? (
                            <Check
                              className="w-5 h-5 flex-shrink-0 mt-0.5"
                              style={{ color: pkg.accent }}
                              strokeWidth={3}
                            />
                          ) : (
                            <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-white/25" strokeWidth={3} />
                          )}
                          <span className={f.included ? "text-white/85" : "text-white/35"}>{f.text}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(pkg.serviceType);
                      }}
                      className="mt-7 md:mt-8 w-full py-4 rounded-2xl text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, hsl(0 0% 100% / 0.12) 0%, hsl(0 0% 100% / 0.06) 100%)",
                        border: `1px solid ${pkg.accent}`,
                        backdropFilter: "blur(12px)",
                        boxShadow: `0 8px 24px -8px ${pkg.glow}`,
                      }}
                    >
                      {pkg.cta}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-6">
          {packages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Package ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesCarousel;

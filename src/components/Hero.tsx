import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, QrCode, BellRing, CalendarCheck, Mail, Bot, Loader2, Send } from "lucide-react";
import CollaborationRequestModal from "./CollaborationRequestModal";
import CardDetailModal, { CardDetail } from "./CardDetailModal";
import { useLanguage } from "@/contexts/language-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import shopifyLogo from "@/assets/shopify-logo.png";
import wordpressLogo from "@/assets/wordpress-logo.png";
import n8nLogo from "@/assets/n8n-logo.png";

type SlideType = "website" | "eshop" | "email" | "qrmenu" | "waiter" | "booking" | "automation" | "chatbot";

const Hero = () => {
  const { t, language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalServiceType, setModalServiceType] = useState("");
  const [detail, setDetail] = useState<CardDetail | null>(null);

  // Email capture state
  const [email, setEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const openCollaborationModal = (serviceType: string) => {
    setModalServiceType(serviceType);
    setModalOpen(true);
  };

  const openDetail = (d: CardDetail) => setDetail(d);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error(t.newsletter?.errorEmail || "Please enter a valid email");
      return;
    }

    setIsSubmittingEmail(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers" as any)
        .insert({ email: email.trim().toLowerCase() } as any);

      if (error) {
        if (error.code === "23505") {
          toast.info(t.newsletter?.alreadySubscribed || "You're already subscribed!");
        } else {
          throw error;
        }
      } else {
        toast.success(t.newsletter?.success || "Successfully subscribed!");
        setEmail("");
        supabase.functions.invoke("send-push", {
          body: { name: email.trim(), service_type: "Newsletter Signup" },
        }).catch(console.error);
      }
    } catch (error) {
      console.error("Email capture error:", error);
      toast.error(t.newsletter?.errorGeneral || "Something went wrong. Please try again.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const slides: Array<{
    type: SlideType;
    badge: string;
    headline: string;
    description: string;
    cta: string;
    icon: JSX.Element;
    serviceType: string;
  }> = [
    {
      type: "website",
      badge: language === "el" ? "Ιστοσελίδα" : "Website",
      headline: t.hero.websiteHeadline,
      description: t.hero.websiteSub,
      cta: t.hero.websiteCta,
      icon: <img src={wordpressLogo} alt="WordPress" className="w-7 h-7 md:w-10 md:h-10 object-contain" />,
      serviceType: language === "el" ? "Κατασκευή Ιστοσελίδας" : "Website Development",
    },
    {
      type: "eshop",
      badge: "E-Commerce",
      headline: t.comingSoon.shopifyTitle,
      description: t.comingSoon.shopifyDesc,
      cta: t.hero.eshopCta,
      icon: <img src={shopifyLogo} alt="Shopify" className="w-10 h-10 md:w-14 md:h-14 object-contain" />,
      serviceType: "E-shop",
    },
    {
      type: "email",
      badge: language === "el" ? "Email System" : "Email System",
      headline: language === "el" ? "Email System" : "Email System",
      description:
        language === "el"
          ? "Automated email flows που κρατάνε την επιχείρησή σου οργανωμένη. Από ειδοποιήσεις φόρμας επικοινωνίας έως επιβεβαιώσεις πελατών και follow-ups, συνδέουμε την ιστοσελίδα σου με ένα απλό σύστημα που εξοικονομεί χρόνο και σε βοηθάει να απαντάς γρηγορότερα."
          : "Automated email flows that keep your business organized. From contact form notifications to customer confirmations and follow-ups, we connect your website with a simple system that saves time and helps you respond faster.",
      cta: language === "el" ? "Μάθε περισσότερα" : "Learn more",
      icon: <Mail className="w-7 h-7 md:w-10 md:h-10 text-white/70" strokeWidth={1.5} />,
      serviceType: "Email System",
    },
    {
      type: "chatbot",
      badge: language === "el" ? "AI Chatbot" : "AI Chatbot",
      headline: language === "el" ? "AI Chatbot" : "AI Chatbot",
      description:
        language === "el"
          ? "Ένας έξυπνος βοηθός ιστοσελίδας που απαντάει συχνές ερωτήσεις, συλλέγει στοιχεία πελατών και καθοδηγεί τους επισκέπτες στο σωστό επόμενο βήμα. Ιδανικό για inquiries, bookings, ερωτήσεις υπηρεσιών και lead qualification."
          : "An intelligent website assistant that answers common questions, collects customer details, and guides visitors to the right next step. Perfect for inquiries, bookings, service questions, and lead qualification.",
      cta: language === "el" ? "Μάθε περισσότερα" : "Learn more",
      icon: <Bot className="w-7 h-7 md:w-10 md:h-10 text-white/70" strokeWidth={1.5} />,
      serviceType: "AI Chatbot",
    },
    {
      type: "qrmenu",
      badge: t.hero.qrBadge,
      headline: t.hero.qrHeadline,
      description: t.hero.qrSub,
      cta: t.hero.qrCta,
      icon: <QrCode className="w-7 h-7 md:w-10 md:h-10 text-white/70" strokeWidth={1.5} />,
      serviceType: "QR Menu",
    },
    {
      type: "waiter",
      badge: "QR Menu",
      headline: t.comingSoon.waiterTitle,
      description: t.comingSoon.waiterDesc,
      cta: t.hero.qrCta,
      icon: <BellRing className="w-7 h-7 md:w-10 md:h-10 text-white/70" strokeWidth={1.5} />,
      serviceType: "QR Menu - Κλήση Σερβιτόρου",
    },
    {
      type: "booking",
      badge: "Booking",
      headline: t.comingSoon.bookingTitle,
      description: t.comingSoon.bookingDesc,
      cta: t.hero.qrCta,
      icon: <CalendarCheck className="w-7 h-7 md:w-10 md:h-10 text-white/70" strokeWidth={1.5} />,
      serviceType: "Booking System",
    },
    {
      type: "automation",
      badge: "AI Automation",
      headline: "AI Automation",
      description:
        language === "el"
          ? "Συνδέουμε τα εργαλεία σου με AI για να τρέχουν οι διαδικασίες μόνες τους."
          : "We connect your tools with AI so your workflows run on autopilot.",
      cta: language === "el" ? "Μάθε περισσότερα" : "Learn more",
      icon: <img src={n8nLogo} alt="AI Automation" className="w-10 h-10 md:w-14 md:h-14 object-contain" />,
      serviceType: "AI Automation",
    },
  ];

  const minSwipeDistance = 50;

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [next]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) next();
    else if (distance < -minSwipeDistance) prev();
  };

  const getPosition = (index: number) => {
    const diff = (index - current + slides.length) % slides.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === slides.length - 1) return "left";
    return "hidden";
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
      transform: "translateX(0) scale(1)",
      zIndex: 10,
      opacity: 1,
      filter: "none",
    },
    left: {
      transform: "translateX(-62%) scale(0.78)",
      zIndex: 5,
      opacity: 0.45,
      filter: "blur(2px)",
    },
    right: {
      transform: "translateX(62%) scale(0.78)",
      zIndex: 5,
      opacity: 0.45,
      filter: "blur(2px)",
    },
    hidden: {
      transform: "translateX(0) scale(0.6)",
      zIndex: 0,
      opacity: 0,
      filter: "blur(4px)",
    },
  };

  const renderHeadline = (headline: string, type: SlideType) => {
    const keywords =
      type === "qrmenu"
        ? ["QR-MENU"]
        : type === "website"
          ? ["Website", "Ιστοσελίδα", "βιτρίνα", "storefront"]
          : type === "eshop"
            ? ["E-Shop"]
            : [];
    if (keywords.length === 0) return headline;
    const pattern = new RegExp(
      `(${keywords.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "g",
    );
    const parts = headline.split(pattern);

    return parts.map((part, index) =>
      keywords.includes(part) ? (
        <span key={`${part}-${index}`} className="text-gradient">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden touch-pan-y pt-8 pb-12 md:pt-12 md:pb-20"
      style={{ background: "var(--gradient-hero)" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full bg-white/5 blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 md:w-[500px] h-80 md:h-[500px] rounded-full bg-white/3 blur-[100px] md:blur-[120px]" />
      </div>

      <div className="container-max section-padding relative z-10 w-full">
        {/* Hero header */}
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12 px-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-10 md:mb-14 animate-fade-in"
            style={{
              background: "hsl(0 0% 100% / 0.08)",
              border: "1px solid hsl(0 0% 100% / 0.12)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] md:text-xs font-medium text-white/70 tracking-wider uppercase">
              SAINTMEDIA · Web & AI Studio
            </span>
          </div>
          <h1
            key={language}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-background"
          >
            {(() => {
              const tokens: Array<{ text: string; className?: string }> =
                language === "el"
                  ? [
                      { text: "Web Development", className: "hero-shimmer-blue" },
                      { text: "&" },
                      { text: "AI Automation", className: "hero-shimmer-red" },
                      { text: "που" },
                      { text: "επιταχύνουν" },
                      { text: "την" },
                      { text: "επιχείρησή" },
                      { text: "σου." },
                    ]
                  : [
                      { text: "Smart" },
                      { text: "Web Development", className: "hero-shimmer-blue" },
                      { text: "&" },
                      { text: "AI Automation", className: "hero-shimmer-red" },
                      { text: "for" },
                      { text: "fast-growing" },
                      { text: "companies." },
                    ];
              return tokens.map((tok, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom pb-1 -mb-1">
                  <span
                    className={`inline-block hero-word-reveal ${tok.className ?? ""}`}
                    style={{ animationDelay: `${i * 0.09}s` }}
                  >
                    {tok.text}
                  </span>
                  {i < tokens.length - 1 && "\u00A0"}
                </span>
              ));
            })()}
          </h1>
          <p
            className="mt-4 md:mt-5 text-sm md:text-base text-white/55 max-w-xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {language === "el"
              ? "Ιστοσελίδες που λειτουργούν ως ψηφιακή βιτρίνα και αυτοματισμοί AI που σου λύνουν τα χέρια."
              : "From high-converting websites to custom AI workflows. We design, build, and automate your digital operations so you can focus on scaling."}
          </p>

          {/* Audience branches */}
          <div
            className="mt-8 md:mt-10 grid grid-cols-2 gap-3 md:gap-6 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Left card - Fast-growing startups */}
            <div className="relative">
              {/* Arrow from title to left card */}
              <svg
                className="absolute -top-7 md:-top-9 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 text-white/40 -rotate-[25deg]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m5 12 7 7 7-7" />
              </svg>
              <div
                className="rounded-2xl p-4 md:p-5 text-left h-full"
                style={{
                  background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.02) 100%)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid hsl(0 0% 100% / 0.12)",
                }}
              >
                <span className="text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">
                  {t.hero.forLabel}
                </span>
                <h3 className="mt-1 text-sm md:text-lg font-bold text-white leading-tight">
                  {language === "el" ? "Startups" : "Startups"}
                </h3>
                <p className="mt-1.5 text-[11px] md:text-sm text-white/55 leading-snug">
                  {language === "el"
                    ? "Αυτοματισμοί AI και ιστοσελίδες που μετατρέπουν επισκέπτες σε πελάτες."
                    : "Scale faster with AI workflows and conversion-focused websites."}
                </p>
              </div>
            </div>

            {/* Right card - Local business */}
            <div className="relative">
              <svg
                className="absolute -top-7 md:-top-9 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 text-white/40 rotate-[25deg]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m5 12 7 7 7-7" />
              </svg>
              <div
                className="rounded-2xl p-4 md:p-5 text-left h-full"
                style={{
                  background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.02) 100%)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid hsl(0 0% 100% / 0.12)",
                }}
              >
                <span
                  className="text-[10px] md:text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#FF6D5A" }}
                >
                  {t.hero.forLabel}
                </span>
                <h3 className="mt-1 text-sm md:text-lg font-bold text-white leading-tight">
                  {language === "el" ? "Τοπικές Επιχειρήσεις" : "Local Businesses"}
                </h3>
                <p className="mt-1.5 text-[11px] md:text-sm text-white/55 leading-snug">
                  {language === "el"
                    ? "Έξυπνες ιστοσελίδες που φέρνουν πραγματικούς πελάτες."
                    : "Get found online with smart websites that bring real customers."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* F1-Style Email Capture Bar */}
        <div className="max-w-4xl mx-auto px-4 -mt-1 mb-8 md:mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {/* Outer glow wrapper */}
          <div
            className="relative p-[1px]"
            style={{
              borderRadius: "120px 6px 120px 6px",
              background: "linear-gradient(180deg, hsl(210 100% 55% / 0.4) 0%, hsl(0 100% 60% / 0.3) 50%, transparent 75%, hsl(210 100% 55% / 0.6) 100%)",
              boxShadow: "0 0 50px hsl(210 100% 55% / 0.15), 0 0 30px hsl(0 100% 60% / 0.1), 0 4px 20px hsl(0 0% 0% / 0.5)",
            }}
          >
            <div
              className="relative flex items-center gap-3 px-6 py-2.5 md:px-10 md:py-3"
              style={{
                background: "linear-gradient(180deg, hsl(0 0% 7%) 0%, hsl(0 0% 3%) 40%, hsl(0 0% 3%) 60%, hsl(0 0% 7%) 100%)",
                borderRadius: "120px 6px 120px 6px",
                boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.04)",
              }}
            >
              {/* Bottom neon trace line */}
              <div
                className="absolute bottom-[1px] left-[6%] right-[6%] h-[2px] rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, hsl(210 100% 55% / 0.8) 30%, hsl(0 100% 60% / 0.8) 70%, transparent 100%)",
                  filter: "blur(0.5px)",
                  boxShadow: "0 0 8px hsl(210 100% 55% / 0.4), 0 0 12px hsl(0 100% 60% / 0.3)",
                }}
              />

              <Mail className="w-4 h-4 md:w-5 md:h-5 text-white/40 flex-shrink-0" strokeWidth={1.5} />
              <form onSubmit={handleEmailSubmit} className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  type="email"
                  placeholder={language === "el" ? "Συμπλήρωσε το email σου" : "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-white text-sm md:text-base placeholder:text-white/50 outline-none min-w-0"
                />
                <button
                  type="submit"
                  disabled={isSubmittingEmail}
                  className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, hsl(210 100% 55%) 0%, hsl(0 100% 60%) 100%)",
                    boxShadow: "0 0 18px hsl(210 100% 55% / 0.4), 0 0 10px hsl(0 100% 60% / 0.3)",
                  }}
                >
                  {isSubmittingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 3D Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="relative h-[420px] md:h-[440px] flex items-center justify-center">
            {slides.map((slide, i) => {
              const pos = getPosition(i);
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (pos === "center") {
                      let accent = "hsl(0 0% 60%)";
                      let glow = "hsl(0 0% 60% / 0.35)";
                      if (slide.type === "website") {
                        accent = "hsl(210 100% 55%)";
                        glow = "hsl(210 100% 55% / 0.35)";
                      } else if (slide.type === "eshop") {
                        accent = "hsl(270 100% 65%)";
                        glow = "hsl(270 100% 65% / 0.40)";
                      } else if (slide.type === "automation") {
                        accent = "hsl(0 100% 60%)";
                        glow = "hsl(0 100% 60% / 0.40)";
                      }
                      openDetail({
                        badge: slide.badge,
                        title: slide.headline,
                        description: slide.description,
                        icon: slide.icon,
                        accent,
                        glow,
                        serviceType: slide.serviceType,
                      });
                    } else {
                      setCurrent(i);
                    }
                  }}
                  className="absolute w-[85%] sm:w-[65%] md:w-[55%] lg:w-[48%] group/card"
                  style={{
                    ...positionStyles[pos],
                    transition: "all 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="rounded-2xl md:rounded-3xl p-5 md:p-7 flex flex-col items-center text-center gap-3 md:gap-4"
                    style={{
                      background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.03) 100%)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      border: "1px solid hsl(0 0% 100% / 0.12)",
                      boxShadow:
                        pos === "center"
                          ? "0 12px 40px hsl(0 0% 0% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.08)"
                          : "0 4px 16px hsl(0 0% 0% / 0.1)",
                    }}
                  >
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] md:text-xs font-medium text-white/70"
                      style={{
                        background: "hsl(0 0% 100% / 0.08)",
                        border: "1px solid hsl(0 0% 100% / 0.1)",
                      }}
                    >
                      {slide.badge}
                    </span>

                    <div
                      className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                        border: "1px solid hsl(0 0% 100% / 0.1)",
                      }}
                    >
                      {slide.icon}
                    </div>

                    <h3 className="text-base md:text-xl font-bold text-white leading-tight whitespace-pre-line px-1">
                      {renderHeadline(slide.headline, slide.type)}
                    </h3>

                    <p className="text-white/60 text-xs md:text-sm max-w-xs leading-relaxed line-clamp-2">{slide.description}</p>

                    {/* Learn more hint */}
                    {pos === "center" && (
                      <div className="mt-1 md:mt-2 inline-flex items-center gap-1.5 text-xs md:text-sm text-white/70 group-hover/card:text-white transition-colors">
                        <span>{t.hero.learnMore}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/card:translate-x-1" />
                      </div>
                    )}

                    {slide.type === "eshop" && pos === "center" && (
                      <Link
                        to="/eshop-setup"
                        className="text-[11px] md:text-xs text-white/45 hover:text-white/80 transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t.hero.eshopLink}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <CollaborationRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceType={modalServiceType}
      />

      <CardDetailModal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        detail={detail}
        onRequest={openCollaborationModal}
      />
    </section>
  );
};

export default Hero;

import { useState, useCallback, useEffect } from "react";
import { Video, FileText, Megaphone, TrendingUp, Globe, QrCode, ShoppingCart, Bot, Phone, Truck, Wallet, Package, Bell, ArrowRight, Workflow, Mail, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollaborationRequestModal from "./CollaborationRequestModal";
import { useLanguage } from "@/contexts/language-context";
import { useSwipe } from "@/hooks/useSwipe";

const WordPressIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.2c4.857 0 8.8 3.943 8.8 8.8 0 4.857-3.943 8.8-8.8 8.8-4.857 0-8.8-3.943-8.8-8.8C3.2 7.143 7.143 3.2 12 3.2zM3.86 12c0-1.18.253-2.3.705-3.31l3.886 10.646A8.149 8.149 0 013.86 12zm8.14 8.14c-.8 0-1.572-.117-2.302-.331l2.444-7.1 2.503 6.86c.017.04.037.077.06.112a8.13 8.13 0 01-2.705.459zm1.123-11.96c.49-.026.931-.077.931-.077.438-.052.387-.696-.052-.67 0 0-1.318.103-2.168.103-.799 0-2.143-.103-2.143-.103-.439-.026-.49.644-.052.67 0 0 .415.051.853.077l1.267 3.471-1.78 5.337-2.96-8.808c.49-.026.931-.077.931-.077.438-.052.386-.696-.052-.67 0 0-1.318.103-2.168.103-.152 0-.331-.004-.521-.01A8.135 8.135 0 0112 3.86c2.124 0 4.058.812 5.51 2.142-.035-.002-.07-.006-.106-.006-.799 0-1.366.696-1.366 1.443 0 .67.387 1.237.799 1.907.31.541.67 1.237.67 2.24 0 .696-.267 1.503-.618 2.627l-.81 2.704-2.937-8.737zm2.978 10.81l2.488-7.187c.464-1.16.618-2.09.618-2.917 0-.3-.02-.58-.057-.84a8.135 8.135 0 01-3.05 11.05z"/>
  </svg>
);

const Services = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const websiteServices = [
    { icon: WordPressIcon, title: t.services.web1Title },
    { icon: FileText, title: t.services.web2Title },
    { icon: Megaphone, title: t.services.web3Title },
    { icon: TrendingUp, title: t.services.web4Title },
  ];

  const eshopServices = [
    { icon: ShoppingCart, title: t.services.shop1Title },
    { icon: Truck, title: t.services.ws2Title },
    { icon: Wallet, title: t.services.ws3Title },
    { icon: Package, title: t.services.ws4Title },
  ];

  const qrMenuServices = [
    { icon: QrCode, title: t.services.qr1Title },
    { icon: ShoppingCart, title: t.services.qr2Title },
    { icon: Bot, title: t.services.qr3Title },
    { icon: Bell, title: t.services.qr4Title },
  ];

  const socialMediaServices = [
    { icon: Video, title: t.services.sm1Title },
    { icon: FileText, title: t.services.sm2Title },
    { icon: Megaphone, title: t.services.sm3Title },
    { icon: TrendingUp, title: t.services.sm4Title },
  ];

  const aiServices = [
    { icon: Workflow, title: t.services.ai1Title },
    { icon: Bot, title: t.services.ai2Title },
    { icon: Mail, title: t.services.ai3Title },
    { icon: Plug, title: t.services.ai4Title },
  ];

  const slides = [
    { title: t.services.websiteTitle, services: websiteServices, badge: "Website" },
    { title: t.services.eshopTitle, services: eshopServices, badge: "E-Shop" },
    { title: t.services.socialTitle, services: socialMediaServices, badge: "Social Media" },
    { title: t.services.qrTitle, services: qrMenuServices, badge: "QR Menu" },
    { title: t.services.aiTitle, services: aiServices, badge: "AI Automations" },
  ];

  const liquidGlassStyle = {
    background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.05) 100%)',
    backdropFilter: 'blur(12px) saturate(150%)',
    WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    border: '1px solid hsl(0 0% 100% / 0.15)',
    boxShadow: '0 4px 16px hsl(0 0% 0% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.1)',
  };

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const swipeHandlers = useSwipe(next, prev);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const getPosition = (index: number) => {
    const diff = (index - current + slides.length) % slides.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === slides.length - 1) return "left";
    return "hidden";
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    center: { transform: "translateX(0) scale(1)", zIndex: 10, opacity: 1, filter: "none" },
    left: { transform: "translateX(-65%) scale(0.78)", zIndex: 5, opacity: 0.4, filter: "blur(2px)" },
    right: { transform: "translateX(65%) scale(0.78)", zIndex: 5, opacity: 0.4, filter: "blur(2px)" },
    hidden: { transform: "translateX(0) scale(0.65)", zIndex: 0, opacity: 0, filter: "blur(8px)", pointerEvents: "none" },
  };

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-background/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-background/3 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-background/5 blur-[150px]" />

      <div className="container-max relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-background/80 text-sm font-semibold mb-4" style={liquidGlassStyle}>
            {t.services.badge}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">{t.services.title}</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">{t.services.subtitle}</p>
        </div>

        {/* 3D Carousel */}
        <div className="relative h-[320px] sm:h-[300px] md:h-[340px] flex items-center justify-center" {...swipeHandlers}>
          {slides.map((slide, i) => {
            const pos = getPosition(i);
            return (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                className="absolute w-[80%] sm:w-[65%] md:w-[50%] cursor-pointer"
                style={{
                  ...positionStyles[pos],
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div
                  className="rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col items-center text-center gap-3"
                  style={{
                    background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.03) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid hsl(0 0% 100% / 0.12)",
                    boxShadow: pos === "center"
                      ? "0 8px 32px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.08)"
                      : "0 4px 16px hsl(0 0% 0% / 0.1)",
                  }}
                >
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-[10px] md:text-xs font-medium text-white/70"
                    style={{ background: "hsl(0 0% 100% / 0.08)", border: "1px solid hsl(0 0% 100% / 0.1)" }}
                  >
                    {slide.badge}
                  </span>
                  <h3 className="text-base md:text-xl font-bold text-white leading-tight">
                    {slide.title}
                  </h3>
                  <div className="w-full space-y-2.5 mt-1">
                    {slide.services.map((service) => (
                      <div key={service.title} className="flex items-center gap-3 text-left px-3">
                        <service.icon className="w-4 h-4 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-white/70 text-xs md:text-sm">{service.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={slide.title}
            />
          ))}
        </div>

        {/* Single CTA */}
        <div className="flex justify-center mt-10">
          <Button variant="hero" size="lg" onClick={() => setModalOpen(true)} className="group">
            <Phone className="w-4 h-4 mr-2" />
            {t.services.ctaButton}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      <CollaborationRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} serviceType="Υπηρεσίες" />
    </section>
  );
};

export default Services;

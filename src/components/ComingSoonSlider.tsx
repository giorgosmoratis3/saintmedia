import { useState, useEffect, useCallback } from "react";
import { BellRing, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import shopifyLogo from "@/assets/shopify-logo.png";
import { useSwipe } from "@/hooks/useSwipe";

const ComingSoonSlider = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      icon: <BellRing className="w-8 h-8 md:w-12 md:h-12 text-white/60" strokeWidth={1.5} />,
      title: t.comingSoon.waiterTitle,
      description: t.comingSoon.waiterDesc,
      badge: "QR Menu",
    },
    {
      icon: <CalendarCheck className="w-8 h-8 md:w-12 md:h-12 text-white/60" strokeWidth={1.5} />,
      title: t.comingSoon.bookingTitle,
      description: t.comingSoon.bookingDesc,
      badge: "Booking",
    },
    {
      icon: (
        <img src={shopifyLogo} alt="Shopify" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
      ),
      title: t.comingSoon.shopifyTitle,
      description: t.comingSoon.shopifyDesc,
      badge: "E-Commerce",
    },
  ];

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const swipeHandlers = useSwipe(next, prev);

  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next]);

  const getPosition = (index: number) => {
    const diff = (index - current + slides.length) % slides.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    return "left";
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
      transform: "translateX(0) scale(1)",
      zIndex: 10,
      opacity: 1,
      filter: "none",
    },
    left: {
      transform: "translateX(-65%) scale(0.78)",
      zIndex: 5,
      opacity: 0.5,
      filter: "blur(2px)",
    },
    right: {
      transform: "translateX(65%) scale(0.78)",
      zIndex: 5,
      opacity: 0.5,
      filter: "blur(2px)",
    },
  };

  return (
    <section className="py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 3D Carousel */}
        <div className="relative h-[260px] md:h-[300px] flex items-center justify-center" {...swipeHandlers}>
          {slides.map((slide, i) => {
            const pos = getPosition(i);
            return (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                className="absolute w-[75%] sm:w-[60%] md:w-[50%] cursor-pointer"
                style={{
                  ...positionStyles[pos],
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div
                  className="rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col items-center text-center gap-3"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.03) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid hsl(0 0% 100% / 0.12)",
                    boxShadow:
                      pos === "center"
                        ? "0 8px 32px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.08)"
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
                    className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                      border: "1px solid hsl(0 0% 100% / 0.1)",
                    }}
                  >
                    {slide.icon}
                  </div>

                  <h3 className="text-base md:text-xl font-bold text-white leading-tight">
                    {slide.title}
                  </h3>

                  <p className="text-white/50 text-xs md:text-sm max-w-xs leading-relaxed line-clamp-3">
                    {slide.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-8 h-2 bg-primary"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSlider;

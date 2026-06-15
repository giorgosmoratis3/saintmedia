import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Zap, Package, Workflow, LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface CardItem {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

const WhyUsRotatingCards = () => {
  const { t, language } = useLanguage();

  const cards: CardItem[] = [
    { icon: CheckCircle2, title: t.whyUs.reason1Title, description: t.whyUs.reason1Desc, accent: "hsl(195 100% 55%)" },
    { icon: Zap, title: t.whyUs.reason2Title, description: t.whyUs.reason2Desc, accent: "hsl(210 100% 60%)" },
    { icon: Package, title: t.whyUs.reason3Title, description: t.whyUs.reason3Desc, accent: "hsl(180 100% 55%)" },
    { icon: Workflow, title: t.whyUs.reason4Title, description: t.whyUs.reason4Desc, accent: "hsl(225 100% 65%)" },
  ];

  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const radius = 320; // px depth radius
  const angleStep = 360 / cards.length;

  // Auto-rotation
  useEffect(() => {
    if (isHovering) return;
    const id = setInterval(() => setActive((a) => (a + 1) % cards.length), 3500);
    return () => clearInterval(id);
  }, [isHovering, cards.length]);

  // Drag to rotate
  const dragRef = useRef<{ startX: number; startActive: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startActive: active };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const stepPx = 110;
    const delta = Math.round(-dx / stepPx);
    const next = ((dragRef.current.startActive + delta) % cards.length + cards.length) % cards.length;
    if (next !== active) setActive(next);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  return (
    <div
      key={language}
      className="relative w-full select-none"
      style={{ perspective: "1400px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="relative h-[420px] md:h-[460px] w-full flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative w-[280px] md:w-[340px] h-[360px] md:h-[400px]"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${-active * angleStep}deg)`,
            transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            const isActive = i === active;
            return (
              <div
                key={card.title}
                className="absolute inset-0 rounded-3xl p-7 md:p-8 flex flex-col"
                style={{
                  transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
                  background:
                    "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.03) 100%)",
                  border: `1px solid ${isActive ? card.accent : "hsl(0 0% 100% / 0.12)"}`,
                  backdropFilter: "blur(50px) saturate(180%)",
                  WebkitBackdropFilter: "blur(50px) saturate(180%)",
                  boxShadow: isActive
                    ? `0 30px 80px ${card.accent.replace(")", " / 0.35)")}, inset 0 1px 0 hsl(0 0% 100% / 0.12)`
                    : "0 20px 50px hsl(0 0% 0% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
                  opacity: isActive ? 1 : 0.55,
                  transition: "opacity 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease",
                }}
              >
                {/* Accent glow corner */}
                <div
                  className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${card.accent.replace(")", " / 0.4)")} 0%, transparent 70%)`,
                    opacity: isActive ? 1 : 0.4,
                    transition: "opacity 0.6s ease",
                  }}
                />

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "linear-gradient(135deg, hsl(0 0% 100% / 0.12) 0%, hsl(0 0% 100% / 0.04) 100%)",
                    border: `1px solid ${card.accent}`,
                    boxShadow: `0 0 24px ${card.accent.replace(")", " / 0.45)")}`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.accent }} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-white/65 text-sm md:text-base leading-relaxed">
                  {card.description}
                </p>
                <div className="mt-auto pt-4 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot navigation */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {cards.map((c, i) => (
          <button
            key={i}
            aria-label={`Go to card ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: i === active ? 28 : 8,
              background: i === active ? c.accent : "hsl(0 0% 100% / 0.2)",
              boxShadow: i === active ? `0 0 12px ${c.accent.replace(")", " / 0.6)")}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WhyUsRotatingCards;

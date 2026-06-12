import { useState, useEffect } from "react";
import { Hourglass, Rocket, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface PilotPhaseProps {
  onOpenModal: () => void;
}

const COMPLETED = 4;
const TOTAL = 20;

const PilotPhase = ({ onOpenModal }: PilotPhaseProps) => {
  const { language } = useLanguage();
  const remaining = TOTAL - COMPLETED;
  const progress = (COMPLETED / TOTAL) * 100;

  // Countdown to 14 days from a fixed start
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 9, minutes: 9, seconds: 58 });

  useEffect(() => {
    // Set a fixed end date 14 days from a stable reference
    const target = new Date();
    target.setDate(target.getDate() + 14);
    target.setHours(target.getHours() + 9);
    target.setMinutes(target.getMinutes() + 9);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const t = {
    el: {
      badge: `${COMPLETED}/${TOTAL} ΕΡΓΑ ΟΛΟΚΛΗΡΩΜΕΝΑ`,
      pilotBadge: "ΝΕΟ ΞΕΚΙΝΗΜΑ · ΠΙΛΟΤΙΚΗ ΦΑΣΗ",
      headline: "Είμαστε σε ",
      highlight: "πιλοτική φάση",
      headlineEnd: " ως νέα επιχείρηση",
      description: (
        <>
          Βρισκόμαστε σε πιλοτική φάση: <strong className="text-white/90">20 επιχειρήσεις</strong>, 20 ψηφιακές λύσεις, 1 στόχος — να καταλάβουμε ακριβώς τι χρειάζεται η αγορά πριν φτιάξουμε μια scalable SaaS (Software as a Service) πλατφόρμα.
        </>
      ),
      remaining: (
        <>
          Μόνο <strong className="text-primary">{remaining} θέσεις</strong> απομένουν
        </>
      ),
      offerEnds: "Η ΠΡΟΣΦΟΡΑ ΤΗΣ ΠΙΛΟΤΙΚΗΣ ΦΑΣΗΣ ΛΗΓΕΙ ΣΕ",
      labels: { days: "ΗΜΕΡΕΣ", hours: "ΩΡΕΣ", minutes: "ΛΕΠΤΑ", seconds: "ΔΕΥΤ." },
      cta: "ΚΛΕΙΣΤΕ ΤΗ ΘΕΣΗ ΣΑΣ ΤΩΡΑ",
      footer: "Η κατασκευή ξεκινά άμεσα μετά την προκαταβολή.",
    },
    en: {
      badge: `${COMPLETED}/${TOTAL} PROJECTS COMPLETED`,
      pilotBadge: "STARTUP · PILOT PHASE",
      headline: "We are in ",
      highlight: "pilot phase",
      headlineEnd: " as a new startup",
      description: (
        <>
          We're in pilot phase: <strong className="text-white/90">20 businesses</strong>, 20 digital solutions, 1 goal — to understand exactly what the market needs before building a scalable SaaS (Software as a Service) platform.
        </>
      ),
      remaining: (
        <>
          Only <strong className="text-primary">{remaining} spots</strong> remaining
        </>
      ),
      offerEnds: "PILOT OFFER ENDS IN",
      labels: { days: "DAYS", hours: "HOURS", minutes: "MIN", seconds: "SEC" },
      cta: "RESERVE YOUR SPOT NOW",
      footer: "Development starts immediately after deposit.",
    },
  };

  const copy = language === "el" ? t.el : t.en;

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div
      className="flex-1 aspect-square flex flex-col items-center justify-center rounded-xl md:rounded-2xl"
      style={{
        background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.02) 100%)",
        border: "1px solid hsl(0 0% 100% / 0.12)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <span className="text-2xl md:text-4xl font-bold text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] md:text-[10px] font-medium text-white/50 tracking-wider mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-3xl p-6 md:p-10"
          style={{
            background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.02) 100%)",
            border: "1px solid hsl(0 0% 100% / 0.12)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 12px 40px hsl(0 0% 0% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
          }}
        >
          {/* Top badges */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: "hsl(0 0% 100% / 0.08)",
                border: "1px solid hsl(0 0% 100% / 0.12)",
              }}
            >
              <Rocket className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[10px] md:text-xs font-medium text-white/70 tracking-wider uppercase">
                {copy.pilotBadge}
              </span>
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: "hsl(0 0% 100% / 0.08)",
                border: "1px solid hsl(0 0% 100% / 0.12)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] md:text-xs font-medium text-white/70 tracking-wider uppercase">
                {copy.badge}
              </span>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-2xl md:text-4xl font-bold text-center text-white leading-tight tracking-tight mb-4">
            {copy.headline}
            <span className="text-gradient">{copy.highlight}</span>
            {copy.headlineEnd}
          </h2>

          {/* Description */}
          <p className="text-center text-white/55 text-sm md:text-base leading-relaxed mb-6 max-w-xl mx-auto">
            {copy.description}
          </p>

          {/* Progress bar */}
          <div
            className="rounded-2xl p-3 md:p-4 mb-6 flex items-center gap-3"
            style={{
              background: "hsl(0 0% 100% / 0.05)",
              border: "1px solid hsl(0 0% 100% / 0.10)",
            }}
          >
            <Hourglass className="w-5 h-5 text-white/60 flex-shrink-0" />
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  background: "var(--gradient-primary, linear-gradient(90deg, hsl(217 91% 60%) 0%, hsl(217 91% 75%) 100%))",
                }}
              />
            </div>
            <span className="text-xs md:text-sm text-white/65 whitespace-nowrap">
              {copy.remaining}
            </span>
          </div>

          {/* Countdown */}
          <p className="text-center text-[10px] md:text-xs font-medium text-white/45 tracking-wider mb-3 uppercase">
            {copy.offerEnds}
          </p>
          <div className="flex gap-2 md:gap-3 mb-6">
            <TimeBox value={timeLeft.days} label={copy.labels.days} />
            <TimeBox value={timeLeft.hours} label={copy.labels.hours} />
            <TimeBox value={timeLeft.minutes} label={copy.labels.minutes} />
            <TimeBox value={timeLeft.seconds} label={copy.labels.seconds} />
          </div>

          {/* CTA */}
          <button
            onClick={onOpenModal}
            className="w-full group flex items-center justify-center gap-3 py-4 md:py-5 rounded-2xl font-bold text-sm md:text-base text-white tracking-wider transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, hsl(0 0% 100% / 0.10) 0%, hsl(0 0% 100% / 0.03) 100%)",
              border: "1px solid hsl(0 0% 100% / 0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: "0 8px 24px hsl(0 0% 0% / 0.2)",
            }}
          >
            {copy.cta}
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-center text-[11px] md:text-xs text-white/45 mt-4">
            {copy.footer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PilotPhase;

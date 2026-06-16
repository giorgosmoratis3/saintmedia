import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import AnimatedSection from "@/components/AnimatedSection";
import Globe3D from "@/components/Globe3D";
import { Globe2 } from "lucide-react";

const WhyUs = () => {
  const { t, language } = useLanguage();

  const slides = [
    { title: t.whyUs.reason1Title, description: t.whyUs.reason1Desc },
    { title: t.whyUs.reason2Title, description: t.whyUs.reason2Desc },
    { title: t.whyUs.reason3Title, description: t.whyUs.reason3Desc },
    { title: t.whyUs.reason4Title, description: t.whyUs.reason4Desc },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section id="why-us" className="relative overflow-hidden py-16 md:py-24">
      {/* Ambient glows */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse pointer-events-none"
        style={{ background: "hsl(195 100% 50% / 0.18)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[420px] h-[420px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "hsl(210 100% 60% / 0.15)" }}
      />

      <div className="container-max section-padding relative z-10">
        <AnimatedSection>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-6 items-center min-h-[640px]">
            {/* Left: gray glass slides */}
            <div key={language} className="relative w-full max-w-xl">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white/80 mb-6 tracking-wider uppercase"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                  border: "1px solid hsl(0 0% 100% / 0.15)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                }}
              >
                <Globe2 className="w-3.5 h-3.5" style={{ color: "hsl(0 0% 75%)" }} />
                {t.whyUs.badge}
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white tracking-tight leading-tight">
                Why{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(0 0% 60%) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  us
                </span>
                .
              </h2>

              {/* Slide stack */}
              <div className="relative h-[260px] md:h-[240px]">
                {slides.map((slide, i) => {
                  const isActive = i === active;
                  return (
                    <div
                      key={i}
                      className="absolute inset-0 rounded-2xl p-6 md:p-8 flex flex-col justify-center transition-all duration-700"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.02) 100%)",
                        border: "1px solid hsl(0 0% 100% / 0.12)",
                        backdropFilter: "blur(40px) saturate(180%)",
                        WebkitBackdropFilter: "blur(40px) saturate(180%)",
                        boxShadow: isActive
                          ? "0 30px 70px hsl(0 0% 0% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.1)"
                          : "0 10px 30px hsl(0 0% 0% / 0.3)",
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateY(0) scale(1)"
                          : "translateY(20px) scale(0.97)",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[11px] tracking-[0.25em] font-semibold text-white/45">
                          {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                        </span>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
                        {slide.title}
                      </h3>
                      <p className="text-white/65 text-sm md:text-base leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Dot indicators */}
              <div className="flex items-center gap-2 mt-6">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: i === active ? 32 : 10,
                      background:
                        i === active ? "hsl(0 0% 90%)" : "hsl(0 0% 100% / 0.18)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: smaller globe */}
            <div className="relative h-[420px] md:h-[520px] lg:h-[600px] w-full">
              <Globe3D className="absolute inset-0 w-full h-full" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyUs;

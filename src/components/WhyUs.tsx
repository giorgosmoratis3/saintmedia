import { useLanguage } from "@/contexts/language-context";
import AnimatedSection from "@/components/AnimatedSection";
import Globe3D from "@/components/Globe3D";
import { Globe2 } from "lucide-react";

const WhyUs = () => {
  const { t } = useLanguage();

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
      <div
        className="absolute top-10 left-10 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
        style={{ background: "hsl(180 100% 55% / 0.1)" }}
      />

      <div className="container-max section-padding relative z-10">
        <AnimatedSection>
          {/* Horizon-framed realistic 3D globe */}
          <div className="relative -mx-4 md:-mx-8 h-[100vh] min-h-[640px] rounded-3xl overflow-hidden">

            <Globe3D className="absolute inset-0 w-full h-full" />

            {/* Overlay copy (only top portion, nothing below) */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-center">
              <div className="max-w-2xl text-center">
                <span
                  className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white/80 mb-4 tracking-wider uppercase"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                    border: "1px solid hsl(0 0% 100% / 0.15)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  <Globe2 className="w-3.5 h-3.5" style={{ color: "hsl(195 100% 60%)" }} />
                  {t.whyUs.badge}
                </span>
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 text-white tracking-tight leading-tight">
                  Συνδέουμε επιχειρήσεις με τον{" "}
                  <span
                    style={{
                      background: "var(--gradient-accent)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    κόσμο
                  </span>
                  .
                </h3>
                <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                  Από την Πάτρα έως κάθε γωνιά του πλανήτη.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyUs;

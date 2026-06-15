import { useState, useEffect } from "react";
import { Sparkles, Globe2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language-context";
import AnimatedSection from "@/components/AnimatedSection";
import Globe3D from "@/components/Globe3D";
import WhyUsRotatingCards from "@/components/WhyUsRotatingCards";


interface WhyUsContent {
  title: string;
  subtitle: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
}

const WhyUs = () => {
  const { t } = useLanguage();
  const defaultContent: WhyUsContent = {
    title: t.whyUs.defaultTitle,
    subtitle: t.whyUs.defaultSubtitle,
    stat1_value: "5x",
    stat1_label: "Reach",
    stat2_value: "48h",
    stat2_label: "Response",
    stat3_value: "0",
    stat3_label: "Hidden Fees",
  };

  const [content, setContent] = useState<WhyUsContent>(defaultContent);




  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("site_content").select("content").eq("id", "why_us").maybeSingle();
      if (data?.content) setContent(data.content as unknown as WhyUsContent);
    };
    fetchContent();
  }, []);

  const renderTitle = () => {
    if (content.title.includes("agency")) {
      const parts = content.title.split("agency");
      return (
        <>
          {parts[0]}
          <span style={{ background: "var(--gradient-accent)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            agency
          </span>
          {parts[1]}
        </>
      );
    }
    return content.title;
  };

  return (
    <section id="why-us" className="relative overflow-hidden py-16 md:py-24">
      {/* Ambient glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse pointer-events-none"
        style={{ background: "hsl(195 100% 50% / 0.18)" }} />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "hsl(210 100% 60% / 0.15)" }} />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
        style={{ background: "hsl(180 100% 55% / 0.1)" }} />

      <div className="container-max section-padding relative z-10">
        <AnimatedSection>
          {/* Full-screen realistic 3D globe */}
          <div className="relative -mx-4 md:-mx-8 mb-16 md:mb-20 h-[100vh] min-h-[600px] rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, hsl(210 100% 55% / 0.18) 0%, transparent 65%)",
              }}
            />
            <Globe3D className="absolute inset-0 w-full h-full" />

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
                  </span>.
                </h3>
                <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                  Σύρε τη γη με τον κέρσορα και πέρνα πάνω από μια χώρα για να την εξερευνήσεις.
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
              <span
                className="px-3 py-1.5 rounded-full text-[11px] text-white/60"
                style={{
                  background: "hsl(0 0% 0% / 0.35)",
                  border: "1px solid hsl(0 0% 100% / 0.12)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                Drag to rotate • Hover για χώρα
              </span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
            <div>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold text-white/80 mb-5 tracking-wider uppercase"
                style={{
                  background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                  border: "1px solid hsl(0 0% 100% / 0.15)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(195 100% 50%)" }} />
                {t.whyUs.badge}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white tracking-tight">
                {renderTitle()}
              </h2>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8">
                {content.subtitle}
              </p>

              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {[
                  { v: content.stat1_value, l: content.stat1_label },
                  { v: content.stat2_value, l: content.stat2_label },
                  { v: content.stat3_value, l: content.stat3_label },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="relative p-4 md:p-5 rounded-2xl text-center overflow-hidden group transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)",
                      border: "1px solid hsl(0 0% 100% / 0.12)",
                      backdropFilter: "blur(40px) saturate(180%)",
                      WebkitBackdropFilter: "blur(40px) saturate(180%)",
                      boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.08)",
                    }}
                  >
                    <div className="text-2xl md:text-3xl font-bold"
                      style={{ background: "var(--gradient-accent)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {stat.v}
                    </div>
                    <div className="text-[10px] md:text-xs text-white/55 mt-1 tracking-wider uppercase">
                      {stat.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="flex items-center justify-center">
              <WhyUsRotatingCards />
            </div>

        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyUs;

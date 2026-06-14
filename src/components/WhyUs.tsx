import { useState, useEffect } from "react";
import { CheckCircle2, Zap, Package, Workflow, Sparkles, Globe2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language-context";
import AnimatedSection from "@/components/AnimatedSection";
import Globe3D from "@/components/Globe3D";

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

  const reasons = [
    { icon: CheckCircle2, title: t.whyUs.reason1Title, description: t.whyUs.reason1Desc, accent: "hsl(195 100% 50%)" },
    { icon: Zap, title: t.whyUs.reason2Title, description: t.whyUs.reason2Desc, accent: "hsl(210 100% 60%)" },
    { icon: Package, title: t.whyUs.reason3Title, description: t.whyUs.reason3Desc, accent: "hsl(180 100% 55%)" },
    { icon: Workflow, title: t.whyUs.reason4Title, description: t.whyUs.reason4Desc, accent: "hsl(225 100% 65%)" },
  ];

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
          {/* Globe showcase */}
          <div
            className="relative mb-16 md:mb-20 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(0 0% 100% / 0.06) 0%, hsl(0 0% 100% / 0.02) 100%)",
              border: "1px solid hsl(0 0% 100% / 0.10)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.06), 0 30px 80px hsl(210 100% 50% / 0.10)",
            }}
          >
            <div className="grid lg:grid-cols-2 gap-0 items-center">
              <div className="p-8 md:p-12 lg:p-14 order-2 lg:order-1">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white/80 mb-5 tracking-wider uppercase"
                  style={{
                    background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                    border: "1px solid hsl(0 0% 100% / 0.15)",
                  }}
                >
                  <Globe2 className="w-3.5 h-3.5" style={{ color: "hsl(195 100% 60%)" }} />
                  {t.whyUs.badge}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white tracking-tight leading-tight">
                  Συνδέουμε επιχειρήσεις με τον <span style={{ background: "var(--gradient-accent)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>κόσμο</span>.
                </h3>
                <p className="text-white/65 text-sm md:text-base leading-relaxed mb-6">
                  Στόχος μας είναι να φέρουμε την επιχείρησή σου μπροστά στο σωστό κοινό — οπουδήποτε κι αν βρίσκεται. Από την Πάτρα έως κάθε γωνιά του πλανήτη, χτίζουμε ψηφιακές γέφυρες που μετατρέπουν επισκέπτες σε πελάτες.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Global Reach", "Live Automation", "24/7 Presence", "Smart Targeting"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs text-white/70"
                      style={{
                        background: "hsl(0 0% 100% / 0.06)",
                        border: "1px solid hsl(0 0% 100% / 0.12)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative h-[360px] md:h-[460px] lg:h-[520px] order-1 lg:order-2">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, hsl(210 100% 55% / 0.18) 0%, transparent 60%)",
                  }}
                />
                <Globe3D className="absolute inset-0" />
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {reasons.map((reason, i) => (
                <div
                  key={reason.title}
                  className="group relative flex gap-4 p-5 md:p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)",
                    border: "1px solid hsl(0 0% 100% / 0.12)",
                    backdropFilter: "blur(40px) saturate(180%)",
                    WebkitBackdropFilter: "blur(40px) saturate(180%)",
                    boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.08)",
                    animation: `fade-in 0.6s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${reason.accent}40 0%, transparent 70%)` }}
                  />
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative"
                    style={{
                      background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                      border: `1px solid ${reason.accent}60`,
                      boxShadow: `0 0 20px ${reason.accent}30`,
                    }}
                  >
                    <reason.icon className="w-5 h-5" style={{ color: reason.accent }} />
                  </div>
                  <div className="relative z-10 flex-1">
                    <h3 className="font-semibold text-base md:text-lg mb-1 text-white">
                      {reason.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyUs;

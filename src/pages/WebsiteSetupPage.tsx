import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Globe, Palette, Search, FileText, CheckCircle2, Rocket, ArrowRight, Info, Handshake, Calendar, Video, BookOpen, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import AnimatedSection from "@/components/AnimatedSection";

const WebsiteSetupPage = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Handshake, title: t.websiteSetup.step0Title, description: t.websiteSetup.step0Desc },
    { icon: BookOpen, title: t.websiteSetup.step1Title, description: t.websiteSetup.step1Desc },
    { icon: Settings, title: t.websiteSetup.step2Title, description: t.websiteSetup.step2Desc },
    { icon: Palette, title: t.websiteSetup.step3Title, description: t.websiteSetup.step3Desc },
    { icon: FileText, title: t.websiteSetup.step4Title, description: t.websiteSetup.step4Desc },
    { icon: Search, title: t.websiteSetup.step5Title, description: t.websiteSetup.step5Desc },
    { icon: CheckCircle2, title: t.websiteSetup.step6Title, description: t.websiteSetup.step6Desc },
    { icon: Rocket, title: t.websiteSetup.step7Title, description: t.websiteSetup.step7Desc },
  ];

  const extras = [
    { icon: Calendar, title: t.websiteSetup.extra1Title, desc: t.websiteSetup.extra1Desc },
    { icon: Smartphone, title: t.websiteSetup.extra2Title, desc: t.websiteSetup.extra2Desc },
    { icon: Search, title: t.websiteSetup.extra3Title, desc: t.websiteSetup.extra3Desc },
    { icon: Globe, title: t.websiteSetup.extra4Title, desc: t.websiteSetup.extra4Desc },
  ];

  return (
    <PageLayout>
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="container-max max-w-5xl mx-auto">
          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.15) 0%, hsl(0 0% 100% / 0.05) 100%)", border: "1px solid hsl(0 0% 100% / 0.2)" }}>
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-background/80">{t.websiteSetup.badge}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-background mb-4">{t.websiteSetup.title}</h1>
              <p className="text-lg md:text-xl text-background/70 max-w-2xl mx-auto">{t.websiteSetup.subtitle}</p>
            </div>
          </AnimatedSection>

          {/* Process Steps */}
          <AnimatedSection delay={0.1}>
            <div className="mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-background text-center mb-10">{t.websiteSetup.processTitle}</h2>
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-background/20 -translate-x-1/2" />
                <div className="space-y-6 md:space-y-0">
                  {steps.map((step, index) => (
                    <div key={index} className={`relative md:flex md:items-center md:gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                        <Card className="border-0 transition-all duration-300 hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.03) 100%)", backdropFilter: "blur(12px)", border: "1px solid hsl(0 0% 100% / 0.12)" }}>
                          <CardContent className="p-5 md:p-6">
                            <div className={`flex items-start gap-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                              <div className="p-3 rounded-xl shrink-0" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
                                <step.icon className="w-5 h-5 text-background/40" />
                              </div>
                              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                                <h3 className="text-lg font-semibold text-background mb-2">{step.title}</h3>
                                <p className="text-sm text-background/70 leading-relaxed">{step.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center text-sm font-bold text-background/60" style={{ background: "hsl(0 0% 100% / 0.1)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>{index + 1}</div>
                      <div className="md:hidden absolute -left-2 top-5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-background/60" style={{ background: "hsl(0 0% 100% / 0.1)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>{index + 1}</div>
                      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Timeline */}
          <AnimatedSection delay={0.15}>
            <div className="mb-12 md:mb-16">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.15) 0%, hsl(0 0% 100% / 0.05) 100%)", border: "1px solid hsl(0 0% 100% / 0.2)" }}>
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-background/80">{t.websiteSetup.timelineBadge}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-background">{t.websiteSetup.timelineTitle}</h2>
              </div>
              {(() => {
                const items = [
                  { icon: Calendar, title: t.websiteSetup.timelineDuration, desc: t.websiteSetup.timelineDurationDesc },
                  { icon: Video, title: t.websiteSetup.timelineMeetings, desc: t.websiteSetup.timelineMeetingsDesc },
                  { icon: FileText, title: t.websiteSetup.timelineContent, desc: t.websiteSetup.timelineContentDesc },
                ];
                return (
                  <div className="relative">
                    <div className="absolute top-6 md:top-7 left-[18%] right-[18%] h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.25), transparent)" }} />
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 relative">
                      {items.map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 md:mb-5 shrink-0" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.12) 0%, hsl(0 0% 100% / 0.04) 100%)", backdropFilter: "blur(12px)", border: "1px solid hsl(0 0% 100% / 0.2)", boxShadow: "0 4px 20px hsl(0 0% 0% / 0.15)" }}>
                            <item.icon className="w-4 h-4 md:w-5 md:h-5 text-background/70" />
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-background/80" style={{ background: "hsl(0 0% 100% / 0.15)", border: "1px solid hsl(0 0% 100% / 0.25)", backdropFilter: "blur(8px)" }}>{i + 1}</div>
                          </div>
                          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-background mb-1 md:mb-2 leading-tight">{item.title}</h3>
                          <p className="text-[11px] sm:text-xs md:text-sm text-background/70 leading-snug">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </AnimatedSection>

          {/* Extras */}
          <AnimatedSection delay={0.17}>
            <div className="mb-12 md:mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-background mb-2">{t.websiteSetup.extrasTitle}</h2>
                <p className="text-background/70">{t.websiteSetup.extrasSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extras.map((ex, i) => (
                  <Card key={i} className="border-0 transition-all duration-300 hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.02) 100%)", backdropFilter: "blur(12px)", border: "1px solid hsl(0 0% 100% / 0.12)" }}>
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl shrink-0" style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
                          <ex.icon className="w-5 h-5 text-background/50" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-background mb-1">{ex.title}</h3>
                          <p className="text-sm text-background/70 leading-relaxed">{ex.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Disclaimer */}
          <AnimatedSection delay={0.18}>
            <div className="mb-12 md:mb-16">
              <Card className="border-0" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)", backdropFilter: "blur(12px)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ background: "hsl(0 0% 100% / 0.1)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
                      <Info className="w-5 h-5 text-background/60" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-background mb-1">{t.websiteSetup.disclaimerTitle}</h3>
                      <p className="text-sm text-background/70 leading-relaxed">{t.websiteSetup.disclaimerText}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection delay={0.2}>
            <div className="text-center">
              <Card className="border-0 inline-block" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.03) 100%)", backdropFilter: "blur(12px)", border: "1px solid hsl(0 0% 100% / 0.12)" }}>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-background mb-3">{t.websiteSetup.ctaTitle}</h3>
                  <p className="text-background/70 mb-6">{t.websiteSetup.ctaSubtitle}</p>
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/contact" className="gap-2">
                      {t.websiteSetup.ctaButton}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
};

export default WebsiteSetupPage;

import { Button } from "@/components/ui/button";
import { Check, Globe, QrCode, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/language-context";
import AnimatedSection from "@/components/AnimatedSection";

const liquidGlassCard = {
  background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)",
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  border: "1px solid hsl(0 0% 100% / 0.12)",
  boxShadow: "0 8px 32px hsl(0 0% 0% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
};

const liquidGlassPopular = {
  background: "linear-gradient(135deg, hsl(0 0% 100% / 0.15) 0%, hsl(0 0% 100% / 0.08) 100%)",
  backdropFilter: "blur(20px) saturate(200%)",
  WebkitBackdropFilter: "blur(20px) saturate(200%)",
  border: "1px solid hsl(0 0% 100% / 0.25)",
  boxShadow: "0 12px 48px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.15)",
};

const WebsiteOfferPage = () => {
  const { t } = useLanguage();

  const packages = [
    {
      id: "qr-simple",
      name: t.websiteOffer.qrBasicName,
      price: t.websiteOffer.qrBasicPrice,
      period: t.websiteOffer.qrBasicPeriod,
      description: t.websiteOffer.qrBasicDesc,
      features: t.websiteOffer.qrBasicFeatures,
      isPopular: false,
      icon: <QrCode className="w-7 h-7 text-white" />,
    },
    {
      id: "qr-smart",
      name: t.websiteOffer.qrSmartName,
      price: t.websiteOffer.qrSmartPrice,
      period: t.websiteOffer.qrSmartPeriod,
      description: t.websiteOffer.qrSmartDesc,
      features: t.websiteOffer.qrSmartFeatures,
      isPopular: true,
      badge: t.websiteOffer.popular,
      icon: <Bot className="w-7 h-7 text-white" />,
    },
    {
      id: "website",
      name: t.websiteOffer.websiteName,
      price: t.websiteOffer.websitePrice,
      period: t.websiteOffer.websitePeriod,
      description: t.websiteOffer.websiteDesc,
      features: t.websiteOffer.websiteFeatures,
      isPopular: false,
      badge: t.websiteOffer.bestValue,
      icon: <Globe className="w-7 h-7 text-white" />,
    },
  ];

  return (
    <PageLayout showFooter={false}>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">{t.websiteOffer.title}</h1>
              <p className="max-w-2xl mx-auto text-lg text-white/60">{t.websiteOffer.subtitle}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] ${pkg.isPopular ? "md:-mt-4 md:mb-4" : ""}`}
                style={pkg.isPopular ? liquidGlassPopular : liquidGlassCard}
              >
                {pkg.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap" style={{ background: "hsl(0 0% 100% / 0.2)", border: "1px solid hsl(0 0% 100% / 0.3)" }}>
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8 pt-2">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={liquidGlassCard}>
                    {pkg.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-white/60 text-sm mb-4 min-h-[40px]">{pkg.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">€{pkg.price}</span>
                    <span className="text-white/50">{pkg.period}</span>
                  </div>
                  {pkg.id === "website" && (
                    <p className="text-white/40 text-xs mt-2">{t.websiteOffer.hostingNote}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "hsl(0 0% 100% / 0.15)", border: "1px solid hsl(0 0% 100% / 0.2)" }}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact">
                  <Button className={`w-full font-semibold py-6 ${pkg.isPopular ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"}`}>
                    {t.websiteOffer.startNow}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          </AnimatedSection>
        </div>
      </section>

      <AnimatedSection>
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60 mb-4">{t.websiteOffer.customCta}</p>
          <Link to="/contact">
            <Button variant="ghost" className="text-white hover:text-white/80">
              {t.websiteOffer.contactLink}
            </Button>
          </Link>
        </div>
      </section>
      </AnimatedSection>
    </PageLayout>
  );
};

export default WebsiteOfferPage;

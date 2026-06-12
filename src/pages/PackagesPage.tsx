import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Check, Globe, QrCode, Bot, Video, Loader2, ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language-context";
import { stripeProducts } from "@/lib/stripe-products";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";

interface Package {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  is_popular: boolean;
  sort_order: number;
}

interface WebsitePackage {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  badge?: string;
}

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

const PackagesPage = () => {
  const { t, language } = useLanguage();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, mode: "payment" | "subscription", additionalPriceIds?: string[], customNote?: string) => {
    setCheckoutLoading(priceId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, mode, additionalPriceIds, customNote },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(language === "el" ? "Σφάλμα κατά την πληρωμή" : "Checkout error");
      console.error(err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const defaultPackages: Package[] = [
    { id: "1", name: t.packages.smStarterName, price: t.packages.smStarterPrice, description: t.packages.smStarterDesc, features: t.packages.smStarterFeatures, is_popular: false, sort_order: 0 },
    { id: "2", name: t.packages.smGrowthName, price: t.packages.smGrowthPrice, description: t.packages.smGrowthDesc, features: t.packages.smGrowthFeatures, is_popular: true, sort_order: 1 },
    { id: "3", name: t.packages.smProName, price: t.packages.smProPrice, description: t.packages.smProDesc, features: t.packages.smProFeatures, is_popular: false, sort_order: 2 },
    { id: "4", name: t.packages.smShootName, price: t.packages.smShootPrice, description: t.packages.smShootDesc, features: t.packages.smShootFeatures, is_popular: false, sort_order: 3 },
  ];

  const websitePackages: WebsitePackage[] = [
    {
      id: "website",
      name: t.packages.wpName,
      price: t.packages.wpPrice,
      period: t.packages.wpPeriod,
      description: t.packages.wpDesc,
      features: t.packages.wpFeatures,
      isPopular: false,
    },
    {
      id: "eshop",
      name: (t.packages as any).eshopName || "E-Shop",
      price: (t.packages as any).eshopPrice || "400",
      period: (t.packages as any).eshopPeriod || "/one-time",
      description: (t.packages as any).eshopDesc || "Full online store development",
      features: (t.packages as any).eshopFeatures || [],
      isPopular: false,
      badge: t.packages.bestValue,
    },
    {
      id: "qr-simple",
      name: t.packages.qrBasicName,
      price: t.packages.qrBasicPrice,
      period: t.packages.qrBasicPeriod,
      description: t.packages.qrBasicDesc,
      features: t.packages.qrBasicFeatures,
      isPopular: false,
    },
    {
      id: "qr-smart",
      name: t.packages.qrSmartName,
      price: t.packages.qrSmartPrice,
      period: t.packages.qrSmartPeriod,
      description: t.packages.qrSmartDesc,
      features: t.packages.qrSmartFeatures,
      isPopular: true,
      badge: t.packages.popular,
    },
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      const { data } = await supabase
        .from("packages")
        .select("id, name, price, description, features, is_popular, sort_order")
        .eq("is_visible", true)
        .order("sort_order");

      if (data && data.length > 0 && language === "el") {
        setPackages(data);
      } else {
        setPackages(defaultPackages);
      }
      setLoading(false);
    };

    fetchPackages();
  }, [t, language]);

  const displayPackages = packages.length > 0 ? packages : defaultPackages;

  const getWebsitePackageIcon = (id: string) => {
    switch (id) {
      case "qr-simple":
        return <QrCode className="w-7 h-7 text-background" />;
      case "qr-smart":
        return <Bot className="w-7 h-7 text-background" />;
      case "website":
        return <Globe className="w-7 h-7 text-background" />;
      case "eshop":
        return <ShoppingBag className="w-7 h-7 text-background" />;
      default:
        return <Globe className="w-7 h-7 text-background" />;
    }
  };

  return (
    <PageLayout>
      <section className="section-padding relative overflow-hidden min-h-screen">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-background/5 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-background/3 blur-[120px]" />

        <div className="container-max relative z-10">
          {/* Header */}
          <AnimatedSection>
          <div className="text-center mb-16">
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 text-background/80"
              style={liquidGlassCard}
            >
              {t.packages.badge}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-background">{t.packages.title}</h1>
            <p className="max-w-2xl mx-auto text-lg text-background/60">{t.packages.subtitle}</p>
          </div>
          </AnimatedSection>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Website Section */}
              <AnimatedSection>
              <div id="website-eshop" className="mb-20 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-background text-center mb-10">
                  {t.packages.websiteTitle}
                </h2>
               <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {websitePackages.filter(pkg => pkg.id === "website" || pkg.id === "eshop").map((pkg) => {
                    const sp = pkg.id === "website" ? stripeProducts.website : stripeProducts.eshop;
                    const extraPrices = pkg.id === "website" && stripeProducts.website.hostingPriceId ? [stripeProducts.website.hostingPriceId] : undefined;
                    const note = pkg.id === "website" ? t.packages.hostingNote : (t.packages as any).eshopNote;
                    return (
                      <div
                        key={pkg.id}
                        className="relative rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] w-full"
                        style={liquidGlassCard}
                      >
                        {pkg.badge && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span
                              className="px-4 py-1.5 rounded-full text-xs font-bold text-background whitespace-nowrap"
                              style={{
                                background: "hsl(0 0% 100% / 0.2)",
                                border: "1px solid hsl(0 0% 100% / 0.3)",
                              }}
                            >
                              {pkg.badge}
                            </span>
                          </div>
                        )}

                        <div className="text-center mb-8 pt-2">
                          <div
                            className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                            style={liquidGlassCard}
                          >
                            {getWebsitePackageIcon(pkg.id)}
                          </div>
                          <h3 className="text-xl font-bold text-background mb-2">{pkg.name}</h3>
                          <p className="text-background/60 text-sm mb-4 min-h-[40px]">{pkg.description}</p>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-background">€{pkg.price}</span>
                            <span className="text-background/50">{pkg.period}</span>
                          </div>
                          <p className="text-background/40 text-xs mt-2">{note}</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: "hsl(0 0% 100% / 0.15)",
                                  border: "1px solid hsl(0 0% 100% / 0.2)",
                                }}
                              >
                                <Check className="w-3 h-3 text-background" />
                              </div>
                              <span className="text-background/80 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          onClick={() => {
                            const eshopNote = pkg.id === "eshop" 
                              ? (language === "el" 
                                ? "Σημείωση: Μετά τους πρώτους 3 μήνες (1$/μήνα στο Shopify), η μηνιαία συνδρομή Shopify γίνεται ~30€/μήνα." 
                                : "Note: After the first 3 months ($1/month on Shopify), the monthly Shopify subscription becomes ~€30/month.")
                              : undefined;
                            handleCheckout(sp.priceId, sp.mode, extraPrices, eshopNote);
                          }}
                          disabled={checkoutLoading === sp.priceId}
                          className="w-full font-semibold py-6 bg-background/10 text-background hover:bg-background/20 border border-background/20"
                        >
                          {checkoutLoading === sp.priceId && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                          {t.packages.startNow}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
              </AnimatedSection>

              {/* QR Menu Section */}
              <AnimatedSection delay={0.1}>
              <div id="qr-menu" className="mb-20 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-background text-center mb-10">
                  {t.packages.qrTitle}
                </h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {websitePackages.filter(pkg => pkg.id.startsWith("qr-")).map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                        pkg.isPopular ? "md:-mt-4 md:mb-4" : ""
                      }`}
                      style={pkg.isPopular ? liquidGlassPopular : liquidGlassCard}
                    >
                      {pkg.badge && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span
                            className="px-4 py-1.5 rounded-full text-xs font-bold text-background whitespace-nowrap"
                            style={{
                              background: "hsl(0 0% 100% / 0.2)",
                              border: "1px solid hsl(0 0% 100% / 0.3)",
                            }}
                          >
                            {pkg.badge}
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-8 pt-2">
                        <div
                          className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                          style={liquidGlassCard}
                        >
                          {getWebsitePackageIcon(pkg.id)}
                        </div>
                        <h3 className="text-xl font-bold text-background mb-2">{pkg.name}</h3>
                        <p className="text-background/60 text-sm mb-4 min-h-[40px]">{pkg.description}</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-background">€{pkg.price}</span>
                          <span className="text-background/50">{pkg.period}</span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                background: "hsl(0 0% 100% / 0.15)",
                                border: "1px solid hsl(0 0% 100% / 0.2)",
                              }}
                            >
                              <Check className="w-3 h-3 text-background" />
                            </div>
                            <span className="text-background/80 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {(() => {
                        const sp = pkg.id === "qr-simple" ? stripeProducts.qrBasic : stripeProducts.qrSmart;
                        return (
                          <Button
                            onClick={() => handleCheckout(sp.priceId, sp.mode)}
                            disabled={checkoutLoading === sp.priceId}
                            className={`w-full font-semibold py-6 ${
                              pkg.isPopular
                                ? "bg-background text-foreground hover:bg-background/90"
                                : "bg-background/10 text-background hover:bg-background/20 border border-background/20"
                            }`}
                          >
                            {checkoutLoading === sp.priceId && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {t.packages.startNow}
                          </Button>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </div>
              </AnimatedSection>

              {/* Social Media Marketing Section */}
              <AnimatedSection delay={0.2}>
              <div id="social-media" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-background text-center mb-10">
                  {t.packages.socialTitle}
                </h2>

                {/* SM Management Packages */}
                <h3 className="text-xl font-semibold text-background/80 text-center mt-16 mb-10">
                  {language === "el" ? "Κάθετη Παραγωγή Βίντεο" : "Vertical Video Creation"}
                </h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                  {[
                    { name: t.packages.smStarterName, price: "199", period: language === "el" ? "/μήνα" : "/month", desc: t.packages.smStarterDesc, features: t.packages.smStarterFeatures, stripe: stripeProducts.smStarter, popular: false },
                    { name: t.packages.smGrowthName, price: "299", period: language === "el" ? "/μήνα" : "/month", desc: t.packages.smGrowthDesc, features: t.packages.smGrowthFeatures, stripe: stripeProducts.smGrowth, popular: true },
                    { name: t.packages.smProName, price: "399", period: language === "el" ? "/μήνα" : "/month", desc: t.packages.smProDesc, features: t.packages.smProFeatures, stripe: stripeProducts.smPro, popular: false },
                  ].map((pkg) => (
                    <div
                      key={pkg.stripe.priceId}
                      className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                        pkg.popular ? "md:-mt-4 md:mb-4" : ""
                      }`}
                      style={pkg.popular ? liquidGlassPopular : liquidGlassCard}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span
                            className="px-4 py-1.5 rounded-full text-xs font-bold text-background"
                            style={{
                              background: "hsl(0 0% 100% / 0.2)",
                              border: "1px solid hsl(0 0% 100% / 0.3)",
                            }}
                          >
                            {t.packages.popular}
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-8">
                        <div
                          className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                          style={liquidGlassCard}
                        >
                          <Users className="w-7 h-7 text-background" />
                        </div>
                        <h3 className="text-xl font-bold text-background mb-2">{pkg.name}</h3>
                        <p className="text-background/60 text-sm mb-4">{pkg.desc}</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-background">€{pkg.price}</span>
                          <span className="text-background/50">{pkg.period}</span>
                        </div>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feature: string) => (
                          <li key={feature} className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{
                                background: "hsl(0 0% 100% / 0.15)",
                                border: "1px solid hsl(0 0% 100% / 0.2)",
                              }}
                            >
                              <Check className="w-3 h-3 text-background" />
                            </div>
                            <span className="text-background/80 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleCheckout(pkg.stripe.priceId, pkg.stripe.mode)}
                        disabled={checkoutLoading === pkg.stripe.priceId}
                        variant={pkg.popular ? "hero" : "glass"}
                        className="w-full"
                      >
                        {checkoutLoading === pkg.stripe.priceId && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {t.packages.startNow}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Video Editing Packages */}
                <h3 className="text-xl font-semibold text-background/80 text-center mt-16 mb-10">
                  {language === "el" ? "Short-form Editing" : "Short-form Editing"}
                </h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {[
                    { name: t.packages.smShootName, price: t.packages.smShootPrice, desc: t.packages.smShootDesc, features: t.packages.smShootFeatures, stripe: stripeProducts.videoEdit10, popular: false },
                    { name: (t.packages as any).smShoot20Name || "Video Editing Plus", price: (t.packages as any).smShoot20Price || "179€", desc: (t.packages as any).smShoot20Desc || "", features: (t.packages as any).smShoot20Features || [], stripe: stripeProducts.videoEdit20, popular: true },
                    { name: (t.packages as any).smShoot30Name || "Video Editing Pro", price: (t.packages as any).smShoot30Price || "249€", desc: (t.packages as any).smShoot30Desc || "", features: (t.packages as any).smShoot30Features || [], stripe: stripeProducts.videoEdit30, popular: false },
                  ].map((pkg) => (
                    <div
                      key={pkg.stripe.priceId}
                      className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                        pkg.popular ? "md:-mt-4 md:mb-4" : ""
                      }`}
                      style={pkg.popular ? liquidGlassPopular : liquidGlassCard}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span
                            className="px-4 py-1.5 rounded-full text-xs font-bold text-background"
                            style={{
                              background: "hsl(0 0% 100% / 0.2)",
                              border: "1px solid hsl(0 0% 100% / 0.3)",
                            }}
                          >
                            {t.packages.popular}
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-8">
                        <div
                          className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                          style={liquidGlassCard}
                        >
                          <Video className="w-7 h-7 text-background" />
                        </div>
                        <h3 className="text-xl font-bold text-background mb-2">{pkg.name}</h3>
                        <p className="text-background/60 text-sm mb-4">{pkg.desc}</p>
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-background">{pkg.price}</span>
                        </div>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feature: string) => (
                          <li key={feature} className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{
                                background: "hsl(0 0% 100% / 0.15)",
                                border: "1px solid hsl(0 0% 100% / 0.2)",
                              }}
                            >
                              <Check className="w-3 h-3 text-background" />
                            </div>
                            <span className="text-background/80 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleCheckout(pkg.stripe.priceId, pkg.stripe.mode)}
                        disabled={checkoutLoading === pkg.stripe.priceId}
                        variant={pkg.popular ? "hero" : "glass"}
                        className="w-full"
                      >
                        {checkoutLoading === pkg.stripe.priceId && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {t.packages.startNow}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              </AnimatedSection>
            </>
          )}

          {/* CTA */}
          <AnimatedSection delay={0.25}>
          <div className="text-center mt-16">
            <p className="text-background/60 mb-4">{t.packages.subtitle}</p>
            <Link to="/contact">
              <Button variant="ghost" className="text-background hover:text-background/80">
                {t.eshop.ctaButton} →
              </Button>
            </Link>
          </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
};

export default PackagesPage;

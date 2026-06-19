import { useState, useEffect, useCallback } from "react";
import Hero from "@/components/Hero";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Link } from "react-router-dom";
import saintmediaLogo from "@/assets/saintmedia-logo-white.png";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import CollaborationRequestModal from "@/components/CollaborationRequestModal";

import ToolsLogos from "@/components/ToolsLogos";
import CtaCarousel from "@/components/CtaCarousel";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/language-context";
import FlowingWavesShader from "@/components/ui/flowing-waves-shader";
import AnimatedSection from "@/components/AnimatedSection";
import PackagesCarousel from "@/components/PackagesCarousel";
import FaqSection from "@/components/FaqSection";

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleLoadingFinished = useCallback(() => setLoading(false), []);
  const { t, language } = useLanguage();

  const navItems = [
    { title: t.nav.home, url: "/" },
    { title: t.nav.services, url: "/services" },
    
    
    { title: t.nav.eshopSetup, url: "/eshop-setup" },
    { title: t.nav.websiteSetup, url: "/website-setup" },
    { title: t.nav.affiliate, url: "/affiliate" },
    { title: t.nav.contact, url: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onFinished={handleLoadingFinished} />}
      <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full relative overflow-x-hidden" style={{ background: "var(--gradient-hero)" }}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header
            className={`fixed left-1/2 -translate-x-1/2 z-50 mx-auto rounded-2xl transition-all duration-500 ease-out ${
              isScrolled
                ? "py-2 top-2 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-5xl shadow-2xl"
                : "py-3 top-4 w-[calc(100%-2rem)] md:w-[calc(100%-2rem)] max-w-[calc(100%-2rem)]"
            }`}
            style={{
              background: isScrolled
                ? "linear-gradient(135deg, hsl(0 0% 100% / 0.12) 0%, hsl(0 0% 100% / 0.06) 100%)"
                : "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)",
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)",
              border: "1px solid hsl(0 0% 100% / 0.15)",
              boxShadow: isScrolled
                ? "0 8px 32px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.1)"
                : "0 4px 16px hsl(0 0% 0% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
            }}
          >
            <div className="flex items-center justify-between px-4 md:px-6">
              <Link to="/" className="flex items-center gap-2 md:gap-3">
                <img
                  src={saintmediaLogo}
                  alt="SaintMedia"
                  className={`w-auto transition-all duration-300 ${isScrolled ? "h-12 md:h-14" : "h-14 md:h-16"}`}
                />
                <span
                  className={`font-bold text-background transition-all duration-300 ${
                    isScrolled ? "text-sm sm:text-base md:text-lg" : "text-base sm:text-lg md:text-xl"
                  }`}
                >
                  SaintMedia
                </span>
              </Link>

              <div className="flex items-center gap-4">
                <nav className="hidden lg:flex items-center gap-0.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.url}
                      to={item.url}
                      className={`px-3 lg:px-4 text-background/70 hover:text-background transition-all duration-300 font-medium rounded-lg hover:bg-background/10 ${
                        isScrolled ? "py-1.5 text-sm" : "py-2 text-sm"
                      }`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>

                <LanguageToggle isScrolled={isScrolled} />

                <SidebarTrigger
                  className="lg:hidden text-background hover:text-background/70 transition-colors w-12 h-12 flex items-center justify-center rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, hsl(0 0% 100% / 0.15) 0%, hsl(0 0% 100% / 0.08) 100%)",
                    border: "1px solid hsl(0 0% 100% / 0.2)",
                  }}
                >
                  <div className="flex flex-col gap-1.5 w-6">
                    <span className="block h-[3px] w-full bg-background rounded-full" />
                    <span className="block h-[3px] w-full bg-background rounded-full" />
                    <span className="block h-[3px] w-full bg-background rounded-full" />
                  </div>
                </SidebarTrigger>
              </div>
            </div>
          </header>

          <main className="flex-1 pt-20 md:pt-24">
            <Hero />

            {/* Packages */}
            <AnimatedSection>
              <PackagesCarousel onSelect={() => setModalOpen(true)} />
            </AnimatedSection>

            {/* Tools Logos */}
            <AnimatedSection>
              <ToolsLogos />
            </AnimatedSection>

            {/* Newsletter + CTA Carousel */}
            <AnimatedSection>
              <CtaCarousel onOpenModal={() => setModalOpen(true)} />
            </AnimatedSection>

            {/* Discreet built-with line */}
            <div className="text-center py-6">
              <p className="text-[11px] md:text-xs text-white/35 tracking-wider uppercase">
                Built with Saintflow Systems
              </p>
            </div>
          </main>
          <AnimatedSection>
            <FaqSection />
          </AnimatedSection>
          <Footer />
        </div>
      </div>

      <CollaborationRequestModal
        key={`modal-${language}`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceType="Γενικό Αίτημα - Αρχική Σελίδα"
      />
    </SidebarProvider>
    </>
  );
};

export default Index;

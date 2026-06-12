import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Footer from "./Footer";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/contexts/language-context";

import { Link } from "react-router-dom";
import saintmediaLogo from "@/assets/saintmedia-logo-white.png";

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const PageLayout = ({ children, showFooter = true }: PageLayoutProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full" style={{ background: "var(--gradient-hero)" }}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
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
                  className={`w-auto transition-all duration-300 ${isScrolled ? "h-8 md:h-10" : "h-10 md:h-12"}`}
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
                {/* Desktop Navigation */}
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

                {/* Language Toggle */}
                <LanguageToggle isScrolled={isScrolled} />

                {/* Mobile Hamburger */}
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

          <main className="flex-1 pt-20 md:pt-24">{children}</main>

          {showFooter && (
            <>
              <Footer />
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PageLayout;

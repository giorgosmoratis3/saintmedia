import { Briefcase, Mail, Home, Package, X, Play, ShoppingBag, Handshake, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import saintmediaLogo from "@/assets/saintmedia-logo-white.png";
import { useLanguage } from "@/contexts/language-context";

export function AppSidebar() {
  const location = useLocation();
  const { state, setOpenMobile } = useSidebar();
  const { t } = useLanguage();

  const menuItems = [
    { title: t.nav.home, url: "/", icon: Home },
    { title: t.nav.services, url: "/services", icon: Briefcase },
    
    
    { title: t.nav.eshopSetup, url: "/eshop-setup", icon: ShoppingBag },
    { title: t.nav.websiteSetup, url: "/website-setup", icon: Globe },
    { title: t.nav.affiliate, url: "/affiliate", icon: Handshake },
    { title: t.nav.contact, url: "/contact", icon: Mail },
  ];

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar className="w-[340px] transition-all duration-300 fixed z-[100]" collapsible="offcanvas" side="left">
      <SidebarContent
        className="relative overflow-hidden"
        style={{
          background: "hsl(0 0% 0%)",
          border: "1px solid hsl(0 0% 100% / 0.08)",
          boxShadow: "0 8px 32px hsl(0 0% 0% / 0.5)",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpenMobile(false)}
          className="absolute top-6 right-6 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Subtle gradient overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 20% 20%, hsl(220 30% 15% / 0.5) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 80% 80%, hsl(220 30% 12% / 0.3) 0%, transparent 50%)",
          }}
        />

        {/* Logo section */}
        <div className="relative z-10 px-8 pt-8 pb-12">
          <Link to="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            <img
              src={saintmediaLogo}
              alt="SaintMedia"
              className="h-12 w-auto transition-transform group-hover:scale-105"
            />
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">SaintMedia</span>
              <p className="text-white/30 text-xs mt-0.5 tracking-wide uppercase">{t.sidebar.tagline}</p>
            </div>
          </Link>
        </div>

        {/* Separator line */}
        <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-8">
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                    <Link
                      to={item.url}
                      onClick={handleLinkClick}
                      className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)"
                          : "transparent",
                        border: isActive ? "1px solid hsl(0 0% 100% / 0.1)" : "1px solid transparent",
                      }}
                    >
                      {/* Hover background */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: !isActive
                            ? "linear-gradient(135deg, hsl(0 0% 100% / 0.04) 0%, hsl(0 0% 100% / 0.01) 100%)"
                            : "transparent",
                        }}
                      />

                      {/* Active indicator */}
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full"
                          style={{
                            background: "linear-gradient(180deg, hsl(0 0% 100% / 0.6) 0%, hsl(0 0% 100% / 0.2) 100%)",
                          }}
                        />
                      )}




                      <span
                        className="relative z-10 font-medium text-[14px] tracking-wide transition-colors duration-300 whitespace-nowrap"
                        style={{
                          color: isActive ? "hsl(0 0% 100%)" : "hsl(0 0% 100% / 0.6)",
                        }}
                      >
                        {item.title}
                      </span>

                      {/* Arrow indicator for active */}
                      {isActive && (
                        <div className="ml-auto relative z-10">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(0 0% 100% / 0.5)" }} />
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
          <p className="text-white/20 text-xs text-center">© 2025 SaintMedia</p>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

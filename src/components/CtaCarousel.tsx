import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Loader2, Handshake } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSwipe } from "@/hooks/useSwipe";
import gmailLogo from "@/assets/gmail-logo.png";
import googleMeetLogo from "@/assets/google-meet-logo.png";

const CtaCarousel = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error(t.newsletter?.errorEmail || "Please enter a valid email");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers" as any)
        .insert({ email: email.trim().toLowerCase() } as any);
      if (error) {
        if (error.code === "23505") {
          toast.info(t.newsletter?.alreadySubscribed || "You're already subscribed!");
        } else {
          throw error;
        }
      } else {
        toast.success(t.newsletter?.success || "Successfully subscribed!");
        setEmail("");
        supabase.functions.invoke("send-push", {
          body: { name: email.trim(), service_type: "Newsletter Signup" },
        }).catch(console.error);
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast.error(t.newsletter?.errorGeneral || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slides = [
    { id: "newsletter" },
    { id: "cta" },
    { id: "estimate" },
  ];

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const swipeHandlers = useSwipe(next, prev);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const getPosition = (index: number) => {
    const diff = (index - current + slides.length) % slides.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    return "left";
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
      transform: "translateX(0) scale(1)",
      zIndex: 10,
      opacity: 1,
      filter: "none",
    },
    left: {
      transform: "translateX(-65%) scale(0.78)",
      zIndex: 5,
      opacity: 0.4,
      filter: "blur(2px)",
    },
    right: {
      transform: "translateX(65%) scale(0.78)",
      zIndex: 5,
      opacity: 0.4,
      filter: "blur(2px)",
    },
  };

  return (
    <section className="py-4 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative h-[220px] md:h-[240px] flex items-center justify-center" {...swipeHandlers}>
          {slides.map((slide, i) => {
            const pos = getPosition(i);
            return (
              <div
                key={slide.id}
                onClick={() => setCurrent(i)}
                className="absolute w-[85%] sm:w-[75%] md:w-[65%] cursor-pointer"
                style={{
                  ...positionStyles[pos],
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div
                  className="rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col items-center text-center gap-3"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.03) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid hsl(0 0% 100% / 0.12)",
                    boxShadow:
                      pos === "center"
                        ? "0 8px 32px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.08)"
                        : "0 4px 16px hsl(0 0% 0% / 0.1)",
                  }}
                >
                  {slide.id === "newsletter" ? (
                    <>
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                          border: "1px solid hsl(0 0% 100% / 0.1)",
                        }}
                      >
                        <img src={gmailLogo} alt="Gmail" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                      </div>
                      <h3 className="text-base md:text-xl font-bold text-white leading-tight">
                        {t.newsletter?.title || "Stay in the loop"}
                      </h3>
                      <p className="text-white/50 text-xs md:text-sm max-w-xs">
                        {t.newsletter?.subtitle || "Get the latest tips, offers & updates"}
                      </p>
                      {pos === "center" && (
                        <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full max-w-xs mt-1">
                          <Input
                            type="email"
                            placeholder={t.newsletter?.placeholder || "your@email.com"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary flex-1 h-9 text-sm"
                          />
                          <Button type="submit" disabled={isSubmitting} variant="hero" size="sm" className="flex-shrink-0">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                          </Button>
                        </form>
                      )}
                    </>
                  ) : slide.id === "cta" ? (
                    <>
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                          border: "1px solid hsl(0 0% 100% / 0.1)",
                        }}
                      >
                        <Handshake className="w-6 h-6 md:w-8 md:h-8 text-white/60" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base md:text-xl font-bold text-white leading-tight">
                        {t.indexCta.title}
                      </h3>
                      <p className="text-white/50 text-xs md:text-sm max-w-xs">
                        {t.indexCta.subtitle}
                      </p>
                      {pos === "center" && (
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
                          className="group mt-1"
                        >
                          {t.indexCta.title}
                          <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                          border: "1px solid hsl(0 0% 100% / 0.1)",
                        }}
                      >
                        <img src={googleMeetLogo} alt="Google Meet" className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <h3 className="text-base md:text-xl font-bold text-white leading-tight">
                        {t.freeEstimate.title}
                      </h3>
                      <p className="text-white/50 text-xs md:text-sm max-w-xs">
                        {t.freeEstimate.subtitle}
                      </p>
                      {pos === "center" && (
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
                          className="group mt-1"
                        >
                          <img src={googleMeetLogo} alt="Google Meet" className="w-3 h-3 mr-1.5" />
                          {t.freeEstimate.button}
                          <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CtaCarousel;

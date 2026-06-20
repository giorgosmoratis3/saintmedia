import { useState } from "react";
import { Mail, Loader2, Send } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NewsletterBar = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error(t.newsletter?.errorEmail || "Please enter a valid email");
      return;
    }

    setIsSubmittingEmail(true);
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
      console.error("Email capture error:", error);
      toast.error(t.newsletter?.errorGeneral || "Something went wrong. Please try again.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
      {/* Outer glow wrapper */}
      <div
        className="relative p-[1px]"
        style={{
          borderRadius: "120px 6px 120px 6px",
          background: "linear-gradient(180deg, hsl(210 100% 55% / 0.4) 0%, hsl(0 100% 60% / 0.3) 50%, transparent 75%, hsl(210 100% 55% / 0.6) 100%)",
          boxShadow: "0 0 50px hsl(210 100% 55% / 0.15), 0 0 30px hsl(0 100% 60% / 0.1), 0 4px 20px hsl(0 0% 0% / 0.5)",
        }}
      >
        <div
          className="relative flex items-center gap-3 px-6 py-2.5 md:px-10 md:py-3"
          style={{
            background: "linear-gradient(180deg, hsl(0 0% 7%) 0%, hsl(0 0% 3%) 40%, hsl(0 0% 3%) 60%, hsl(0 0% 7%) 100%)",
            borderRadius: "120px 6px 120px 6px",
            boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.04)",
          }}
        >
          {/* Bottom neon trace line */}
          <div
            className="absolute bottom-[1px] left-[6%] right-[6%] h-[2px] rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(210 100% 55% / 0.8) 30%, hsl(0 100% 60% / 0.8) 70%, transparent 100%)",
              filter: "blur(0.5px)",
              boxShadow: "0 0 8px hsl(210 100% 55% / 0.4), 0 0 12px hsl(0 100% 60% / 0.3)",
            }}
          />

          <Mail className="w-4 h-4 md:w-5 md:h-5 text-white/40 flex-shrink-0" strokeWidth={1.5} />
          <form onSubmit={handleEmailSubmit} className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="email"
              placeholder={language === "el" ? "Συμπλήρωσε το email σου" : "Enter your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent text-white text-sm md:text-base placeholder:text-white/50 outline-none min-w-0"
            />
            <button
              type="submit"
              disabled={isSubmittingEmail}
              className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, hsl(210 100% 55%) 0%, hsl(0 100% 60%) 100%)",
                boxShadow: "0 0 18px hsl(210 100% 55% / 0.4), 0 0 10px hsl(0 100% 60% / 0.3)",
              }}
            >
              {isSubmittingEmail ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBar;

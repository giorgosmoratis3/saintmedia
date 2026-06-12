import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
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
        
        // Notify admins
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

  return (
    <section className="-mt-4 md:-mt-8 py-4 px-4">
      <div
        className="max-w-4xl mx-auto rounded-2xl md:rounded-3xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.02) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid hsl(0 0% 100% / 0.1)",
          boxShadow: "0 8px 32px hsl(0 0% 0% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
        }}
      >
        <div className="flex flex-col items-center gap-4 md:gap-5">
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {t.newsletter?.title || "Stay in the loop"}
            </h3>
            <p className="text-white/50 text-xs md:text-sm mt-1">
              {t.newsletter?.subtitle || "Get the latest tips, offers & updates"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
            <Input
              type="email"
              placeholder={t.newsletter?.placeholder || "your@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary flex-1"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="hero"
              size="default"
              className="flex-shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline mr-1">{t.newsletter?.button || "Subscribe"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;

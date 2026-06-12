import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useLanguage } from "@/contexts/language-context";


interface ContactContent {
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  location: string;
}

const Contact = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbContent, setDbContent] = useState<ContactContent | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", business: "", message: "" });

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("site_content").select("content").eq("id", "contact").maybeSingle();
      if (data?.content) setDbContent(data.content as unknown as ContactContent);
    };
    fetchContent();
  }, []);

  const content: ContactContent = language === "el" && dbContent
    ? dbContent
    : {
        title: t.contact.defaultTitle,
        subtitle: t.contact.defaultSubtitle,
        phone: dbContent?.phone || "+30 697 532 8943",
        email: dbContent?.email || "saintmediagr@gmail.com",
        location: t.contact.defaultLocation,
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const contactSchema = z.object({
      name: z.string().trim().min(1).max(100),
      email: z.string().trim().email().max(255),
      phone: z.string().max(20).optional().nullable(),
      business: z.string().max(200).optional().nullable(),
      message: z.string().trim().min(1).max(2000),
    });

    try {
      const validatedData = contactSchema.parse({
        name: formData.name, email: formData.email,
        phone: formData.phone || null, business: formData.business || null,
        message: formData.message,
      });

      const { error } = await supabase.from("contact_submissions").insert({
        name: validatedData.name, email: validatedData.email,
        phone: validatedData.phone, business: validatedData.business,
        message: validatedData.message,
      });

      if (error) throw error;

      // Notify admins
      supabase.functions.invoke("send-push", {
        body: { name: validatedData.name, service_type: "Φόρμα Επικοινωνίας" },
      }).catch(console.error);

      toast({ title: t.contact.successTitle, description: t.contact.successDesc });
      setFormData({ name: "", email: "", phone: "", business: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: t.contact.inputErrorTitle, description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({ title: t.contact.errorTitle, description: t.contact.errorDesc, variant: "destructive" });
      }
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderTitle = () => {
    if (content.title.includes("επιχείρησή")) {
      const parts = content.title.split("επιχείρησή");
      return <>{parts[0]}<span className="text-gradient">επιχείρησή</span>{parts[1]}</>;
    }
    if (content.title.includes("business")) {
      const parts = content.title.split("business");
      return <>{parts[0]}<span className="text-gradient">business</span>{parts[1]}</>;
    }
    return content.title;
  };

  const liquidGlassStyle = {
    background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.05) 100%)",
    backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)",
    border: "1px solid hsl(0 0% 100% / 0.15)",
    boxShadow: "0 4px 16px hsl(0 0% 0% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
  };

  const liquidGlassCardStyle = {
    background: "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)",
    backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: "1px solid hsl(0 0% 100% / 0.12)",
    boxShadow: "0 8px 32px hsl(0 0% 0% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden min-h-screen">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-background/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-background/3 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-background/5 blur-[150px]" />

      <div className="container-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-background/80 text-sm font-semibold mb-4" style={liquidGlassStyle}>
              {t.contact.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">{renderTitle()}</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-10">{content.subtitle}</p>

            <div className="space-y-5">
              
              <div className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={liquidGlassStyle}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.15) 0%, hsl(0 0% 100% / 0.08) 100%)", border: "1px solid hsl(0 0% 100% / 0.2)" }}>
                  <Mail className="w-5 h-5 text-background/80" />
                </div>
                <div>
                  <p className="text-sm text-white/50">{t.contact.email}</p>
                  <p className="font-semibold text-white">{content.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={liquidGlassStyle}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.15) 0%, hsl(0 0% 100% / 0.08) 100%)", border: "1px solid hsl(0 0% 100% / 0.2)" }}>
                  <MapPin className="w-5 h-5 text-background/80" />
                </div>
                <div>
                  <p className="text-sm text-white/50">{t.contact.location}</p>
                  <p className="font-semibold text-white">{content.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl" style={liquidGlassCardStyle}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-white/80">{t.contact.nameLabel}</label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder={t.contact.namePlaceholder} required className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-white/80">{t.contact.emailLabel}</label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10" />
                </div>
              </div>
              <div>
                <label htmlFor="business" className="block text-sm font-medium mb-2 text-white/80">{t.contact.businessLabel}</label>
                <Input id="business" name="business" value={formData.business} onChange={handleChange} placeholder={t.contact.businessPlaceholder} className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-white/80">{t.contact.messageLabel}</label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder={t.contact.messagePlaceholder} required rows={5} className="resize-none bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10" />
              </div>
              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t.contact.submitting : (<>{t.contact.submit}<Send className="ml-2 w-5 h-5" /></>)}
              </Button>
              <p className="text-center text-sm text-white/50">{t.contact.responseTime}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, Send, User, Briefcase, MessageSquare, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface CollaborationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType?: string;
}

const CollaborationRequestModal = ({ isOpen, onClose, serviceType }: CollaborationRequestModalProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedService, setSelectedService] = useState(serviceType || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceOptions = [
    { value: "Κατασκευή Ιστοσελίδας", label: t.modal.serviceWebsite },
    { value: "Eshop με Shopify", label: t.modal.serviceEshop },
    { value: "QR Menu", label: t.modal.serviceQR },
    { value: "Social Media Marketing", label: t.modal.serviceSMM },
    { value: "Πρόγραμμα Συνεργατών", label: t.modal.serviceAffiliate },
    { value: "Κάτι άλλο", label: t.modal.serviceOther },
  ];

  useEffect(() => {
    if (serviceType) setSelectedService(serviceType);
  }, [serviceType, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.length < 2) { toast.error(t.modal.errorName); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { toast.error(t.modal.errorEmail); return; }
    if (!selectedService) { toast.error(t.modal.errorService); return; }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("collaboration_requests").insert({
        service_type: selectedService,
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        message: message.trim() || null,
      });
      if (error) throw error;
      
      // Trigger push notification to admins (fire and forget)
      supabase.functions.invoke("send-push", {
        body: { name: name.trim(), service_type: selectedService },
      }).catch(console.error);
      
      toast.success(t.modal.successMsg);
      setName(""); setEmail(""); setPhone(""); setMessage(""); setSelectedService(""); onClose();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error(t.modal.errorGeneral);
    } finally { setIsSubmitting(false); }
  };

  const liquidGlassStyle = {
    background: 'linear-gradient(135deg, hsl(0 0% 15% / 0.85) 0%, hsl(0 0% 8% / 0.9) 100%)',
    backdropFilter: 'blur(60px) saturate(180%)',
    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
    border: '1px solid hsl(0 0% 100% / 0.15)',
    boxShadow: '0 8px 32px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.1)',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl border-0 max-h-[85vh] overflow-y-auto" style={liquidGlassStyle}>
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{t.modal.title}</DialogTitle>
          <DialogDescription className="text-white/60">{t.modal.subtitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="service" className="text-white/80 flex items-center gap-2"><Briefcase className="w-4 h-4" />{t.modal.serviceLabel}</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary"><SelectValue placeholder={t.modal.servicePlaceholder} /></SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 z-50">
                {serviceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/80 flex items-center gap-2"><User className="w-4 h-4" />{t.modal.nameLabel}</Label>
            <Input id="name" type="text" placeholder={t.modal.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80 flex items-center gap-2"><Mail className="w-4 h-4" />{t.modal.emailLabel}</Label>
            <Input id="email" type="email" placeholder={t.modal.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/80 flex items-center gap-2"><Phone className="w-4 h-4" />{t.modal.phoneLabel}</Label>
            <Input id="phone" type="tel" placeholder={t.modal.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white/80 flex items-center gap-2"><MessageSquare className="w-4 h-4" />{t.modal.messageLabel}</Label>
            <Textarea id="message" placeholder={t.modal.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary min-h-[80px] resize-none" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full" variant="hero">
            {isSubmitting ? t.modal.submitting : (<><Send className="w-4 h-4 mr-2" />{t.modal.submit}</>)}
          </Button>
          <p className="text-xs text-white/40 text-center">{t.modal.callbackNote}</p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationRequestModal;

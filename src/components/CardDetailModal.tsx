import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export interface CardDetail {
  badge?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
  accent?: string;
  glow?: string;
  serviceType: string;
}

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: CardDetail | null;
  onRequest: (serviceType: string) => void;
}

const CardDetailModal = ({ isOpen, onClose, detail, onRequest }: CardDetailModalProps) => {
  const { language } = useLanguage();
  if (!detail) return null;

  const accent = detail.accent ?? "hsl(195 100% 50%)";
  const glow = detail.glow ?? "hsl(195 100% 50% / 0.35)";

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl border-0 p-0 overflow-hidden bg-transparent shadow-none"
      >
        <div
          className="relative rounded-3xl overflow-hidden p-8 md:p-10"
          style={{
            background: "linear-gradient(135deg, hsl(0 0% 8% / 0.95) 0%, hsl(0 0% 4% / 0.95) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid hsl(0 0% 100% / 0.12)",
            boxShadow: `0 30px 80px -20px hsl(0 0% 0% / 0.8), 0 0 100px -20px ${glow}, inset 0 1px 0 hsl(0 0% 100% / 0.08)`,
          }}
        >
          {/* Accent glows */}
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-50 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full opacity-30 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
          />

          <div className="relative">
            {detail.badge && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider"
                style={{
                  background: "hsl(0 0% 100% / 0.08)",
                  border: `1px solid ${accent}`,
                  color: accent,
                  backdropFilter: "blur(8px)",
                }}
              >
                {detail.badge}
              </span>
            )}

            {detail.icon && (
              <div
                className="mt-5 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.04) 100%)",
                  border: "1px solid hsl(0 0% 100% / 0.1)",
                }}
              >
                {detail.icon}
              </div>
            )}

            <h2 className="mt-5 text-2xl md:text-4xl font-bold text-white tracking-tight">
              {detail.title}
            </h2>

            <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
              {detail.description}
            </p>

            {detail.features && detail.features.length > 0 && (
              <ul className="mt-6 space-y-3">
                {detail.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm md:text-[15px]">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: accent }} strokeWidth={3} />
                    <span className="text-white/85">{f}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => {
                onClose();
                onRequest(detail.serviceType);
              }}
              className="mt-8 w-full py-4 rounded-2xl text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 100% / 0.12) 0%, hsl(0 0% 100% / 0.06) 100%)",
                border: `1px solid ${accent}`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 24px -8px ${glow}`,
              }}
            >
              {language === "el" ? "Ζήτησε προσφορά" : "Request a quote"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailModal;

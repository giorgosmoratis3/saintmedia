import { useLanguage } from "@/contexts/language-context";

interface LanguageToggleProps {
  isScrolled?: boolean;
}

const LanguageToggle = ({ isScrolled = false }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="flex items-center rounded-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.05) 100%)",
        border: "1px solid hsl(0 0% 100% / 0.15)",
      }}
    >
      <button
        onClick={() => setLanguage("el")}
        className={`px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
          language === "el"
            ? "bg-white/20 text-white"
            : "text-white/50 hover:text-white/80"
        }`}
      >
        GR
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
          language === "en"
            ? "bg-white/20 text-white"
            : "text-white/50 hover:text-white/80"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;

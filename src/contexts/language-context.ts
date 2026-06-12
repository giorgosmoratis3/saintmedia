import { createContext, useContext } from "react";
import { el } from "@/translations/el";
import { en } from "@/translations/en";

export type Language = "el" | "en";
export type Translations = typeof el;

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

export const translations = { el, en };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export function detectLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const saved = window.localStorage.getItem("lang");
  if (saved === "el" || saved === "en") return saved;

  const browserLang = window.navigator.language?.slice(0, 2);
  return browserLang === "el" ? "el" : "en";
}
import PageLayout from "@/components/PageLayout";
import { HelpCircle, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import AnimatedSection from "@/components/AnimatedSection";

const AffiliatePage = () => {
  const { t } = useLanguage();
  const isGreek = (t as any)?.nav?.affiliate === "Γίνε Συνεργάτης";

  const title = isGreek ? "Πρόγραμμα Συνεργασίας" : "Partner Program";
  const subtitle = isGreek
    ? "Κάτι νέο ετοιμάζεται για συνεργασίες που φέρνουν πραγματική αξία."
    : "Something new is coming for partnerships that create real value.";
  const description = isGreek
    ? "Σύντομα θα μπορείς να συστήνεις επιχειρήσεις και να κερδίζεις από κάθε νέα συνεργασία."
    : "Soon you’ll be able to refer businesses and earn from every new collaboration.";
  const badge = isGreek ? "Άγνωστο" : "Classified";

  return (
    <PageLayout>
      <section className="py-20 md:py-32 px-4 min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          <AnimatedSection>
            <div
              className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center"
              style={{
                background:
                  "linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.02) 100%)",
                border: "1px solid hsl(0 0% 100% / 0.12)",
                backdropFilter: "blur(60px) saturate(180%)",
                WebkitBackdropFilter: "blur(60px) saturate(180%)",
                boxShadow: "0 20px 60px -20px hsl(0 0% 0% / 0.5)",
              }}
            >
              {/* Mysterious floating question marks */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07]">
                <span className="absolute top-6 left-8 text-7xl font-bold text-background animate-pulse">?</span>
                <span className="absolute top-20 right-10 text-5xl font-bold text-background animate-pulse" style={{ animationDelay: "0.5s" }}>?</span>
                <span className="absolute bottom-12 left-16 text-6xl font-bold text-background animate-pulse" style={{ animationDelay: "1s" }}>?</span>
                <span className="absolute bottom-20 right-20 text-4xl font-bold text-background animate-pulse" style={{ animationDelay: "1.5s" }}>?</span>
                <span className="absolute top-1/2 left-1/3 text-8xl font-bold text-background animate-pulse" style={{ animationDelay: "0.8s" }}>?</span>
              </div>

              <div className="relative z-10">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.05) 100%)",
                    border: "1px solid hsl(0 0% 100% / 0.15)",
                  }}
                >
                  <Lock className="w-3.5 h-3.5 text-background/60" />
                  <span className="text-xs font-semibold text-background/70 tracking-[0.2em] uppercase">
                    {badge}
                  </span>
                </div>

                <div
                  className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center relative"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0 0% 100% / 0.12) 0%, hsl(0 0% 100% / 0.04) 100%)",
                    border: "1px solid hsl(0 0% 100% / 0.15)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <HelpCircle className="w-12 h-12 text-background/80" strokeWidth={1.2} />
                  <div className="absolute inset-0 rounded-2xl animate-pulse" style={{ boxShadow: "0 0 40px hsl(0 0% 100% / 0.1)" }} />
                </div>

                <h1
                  className="text-3xl md:text-5xl font-bold text-background mb-5 tracking-tight"
                  style={{ filter: "blur(0.3px)" }}
                >
                  {title}
                </h1>
                <p className="text-background/70 text-base md:text-lg mb-3">{subtitle}</p>
                <p className="text-background/40 text-sm md:text-base max-w-md mx-auto italic">
                  {description}
                </p>

                {/* Redacted bars */}
                <div className="mt-10 flex flex-col items-center gap-2.5 max-w-sm mx-auto">
                  <div className="h-2.5 rounded-full bg-background/10 w-full" />
                  <div className="h-2.5 rounded-full bg-background/10 w-4/5" />
                  <div className="h-2.5 rounded-full bg-background/10 w-3/5" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
};

export default AffiliatePage;

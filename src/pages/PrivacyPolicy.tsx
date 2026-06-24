import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/language-context";

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <main className="py-20 px-6" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container-max max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-background mb-8">
            {t.privacy.title}
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-background/80">
            <p className="text-lg leading-relaxed">{t.privacy.intro}</p>
            
            {t.privacy.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold text-background mb-3">{section.title}</h2>
                <p className="leading-relaxed">{section.text}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default PrivacyPolicy;

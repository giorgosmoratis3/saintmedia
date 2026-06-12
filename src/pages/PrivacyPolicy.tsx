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
          
          <div className="prose prose-invert max-w-none space-y-6 text-background/80">
            {(['s1', 's2', 's3', 's4'] as const).map((key) => (
              <section key={key}>
                <h2 className="text-xl font-semibold text-background mb-3">{t.privacy[`${key}Title`]}</h2>
                <p>{t.privacy[`${key}Text`]}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default PrivacyPolicy;

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/language-context";

const FaqSection = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 mb-16" key={language}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-white/60 uppercase mb-4">
            {t.faq.eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t.faq.title}
          </h2>
        </div>

        <div
          className="rounded-3xl p-2 md:p-4"
          style={{
            background: "linear-gradient(135deg, hsl(0 0% 100% / 0.06) 0%, hsl(0 0% 100% / 0.02) 100%)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            border: "1px solid hsl(0 0% 100% / 0.1)",
            boxShadow: "0 8px 32px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
          }}
        >
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {t.faq.items.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-b border-white/10 last:border-b-0 px-4 md:px-6"
              >
                <AccordionTrigger className="text-white text-left text-base md:text-lg font-medium hover:no-underline py-5 [&>svg]:text-white/70 [&>svg]:h-5 [&>svg]:w-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-sm md:text-base leading-relaxed whitespace-pre-line pb-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

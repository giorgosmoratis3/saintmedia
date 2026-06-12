import { useState, useEffect } from "react";
import { Star, Quote, Globe, Smartphone, ShoppingCart, QrCode, BarChart3 } from "lucide-react";

const testimonials = [
  {
    name: "Αγγελική",
    business: "Κατάστημα Ενδυμάτων",
    service: "TikTok Marketing",
    text: "Τα βίντεο στο TikTok μας έφεραν νέους πελάτες που δεν θα βρίσκαμε αλλιώς. Πολύ καλή συνεργασία.",
    rating: 5,
  },
  {
    name: "Ειρήνη",
    business: "Κοσμηματοπωλείο",
    service: "E-shop",
    text: "Το e-shop είναι εύχρηστο και μας βοήθησε να ξεκινήσουμε τις online πωλήσεις ομαλά.",
    rating: 5,
  },
  {
    name: "Φώτης",
    business: "Καφετέρια",
    service: "QR Menu",
    text: "Το ψηφιακό μενού διευκόλυνε την εξυπηρέτηση και οι πελάτες το βρίσκουν πρακτικό.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { icon: Globe, label: "Ιστοσελίδες" },
    { icon: ShoppingCart, label: "E-shop" },
    { icon: QrCode, label: "QR Menu" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Smartphone, label: "Social Media" },
  ];

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Service Icons */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12">
          {services.map((service, index) => (
            <div 
              key={index}
              className="flex flex-col items-center gap-2 group"
            >
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.1) 0%, hsl(0 0% 100% / 0.05) 100%)',
                  border: '1px solid hsl(0 0% 100% / 0.1)',
                }}
              >
                <service.icon className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                {service.label}
              </span>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-white/20" />
          <span className="text-xs md:text-sm text-white/40 uppercase tracking-[0.15em] font-medium">
            Τι λένε οι πελάτες μας
          </span>
          <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        {/* Testimonial Card */}
        <div 
          className="relative p-6 md:p-10 rounded-2xl md:rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.06) 0%, hsl(0 0% 100% / 0.02) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid hsl(0 0% 100% / 0.08)',
          }}
        >
          {/* Quote Icon */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6">
            <Quote className="w-8 h-8 md:w-12 md:h-12 text-white/10" />
          </div>

          {/* Content */}
          <div className="text-center">
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-4 md:mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-primary text-primary" />
              ))}
            </div>

            {/* Quote Text */}
            <p 
              key={activeIndex}
              className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed mb-6 md:mb-8 animate-fade-in font-light italic"
            >
              "{testimonials[activeIndex].text}"
            </p>

            {/* Author */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <p className="text-base md:text-lg font-semibold text-white">
                {testimonials[activeIndex].name}
              </p>
              <p className="text-sm text-white/60">
                {testimonials[activeIndex].business}
              </p>
              <p className="text-xs text-primary/80 mt-1">
                {testimonials[activeIndex].service}
              </p>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex 
                  ? "w-6 h-1.5 bg-primary" 
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

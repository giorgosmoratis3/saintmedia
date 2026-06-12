const LogoMarquee = () => {
  const stats = [
    "20+ Τοπικές Επιχειρήσεις",
    "Pilot Phase",
    "20 Digital Λύσεις",
    "Made in Patras",
    "100% Ελληνική Αγορά",
    "Real Results",
  ];

  const duplicated = [...stats, ...stats, ...stats, ...stats];

  return (
    <section className="py-6 md:py-8 relative w-full max-w-[100vw] bg-black">
      <div className="overflow-hidden w-full">
        <div className="flex animate-marquee items-center" style={{ width: "max-content" }}>
          {duplicated.map((stat, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <span className="mx-8 md:mx-14 text-white/40 text-lg md:text-2xl font-light tracking-wide whitespace-nowrap">
                {stat}
              </span>
              <span className="text-white/15 text-xl">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;

export default function FeaturedIn() {
  const logos = [
    { name: 'VOGUE', font: 'font-serif' },
    { name: 'ELLE', font: 'font-sans font-bold' },
    { name: "Harper's BAZAAR", font: 'font-serif font-bold' },
    { name: 'Cosmopolitan', font: 'font-serif italic' },
  ];

  return (
    <section className="py-12 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-8">
          Featured In
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
          {logos.map((logo) => (
            <span
              key={logo.name}
              className={`text-xl md:text-2xl text-zinc-800 ${logo.font}`}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
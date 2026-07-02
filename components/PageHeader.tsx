export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative bg-charcoal pt-28 lg:pt-36 pb-14 lg:pb-20 overflow-hidden">
      {/* subtle gold glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-gold/30 blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-light mb-3">{eyebrow}</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-balance mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

"use client";
import { useQuoteWizard } from "./QuoteWizardProvider";

export function AboutCTA({
  title,
  body,
  button,
}: {
  title: string;
  body: string;
  button: string;
}) {
  const { open } = useQuoteWizard();
  return (
    <section className="py-16 lg:py-20 bg-charcoal">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">{title}</h2>
        <p className="text-gray-300 mb-8">{body}</p>
        <button
          onClick={open}
          className="bg-gold hover:bg-gold-light text-ink font-bold rounded-full px-8 py-3.5 text-base transition-all hover:shadow-lg"
        >
          {button}
        </button>
      </div>
    </section>
  );
}

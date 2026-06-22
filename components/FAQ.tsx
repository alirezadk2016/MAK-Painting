"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "@/data/site";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-black text-charcoal mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-500 mb-6">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a href="#contact" className="text-blue-brand font-semibold hover:underline">
                Contact us
              </a>{" "}
              and we&apos;ll be happy to help.
            </p>
            <div className="bg-blue-muted rounded-2xl p-6">
              <p className="text-sm font-bold text-charcoal mb-2">Need a quick answer?</p>
              <p className="text-sm text-gray-500 mb-4">Call us now — we answer during business hours.</p>
              <a
                href="tel:0411234567"
                className="flex items-center gap-2 bg-blue-brand text-white font-bold rounded-xl px-4 py-3 text-sm hover:bg-blue-dark transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M4.4 7.2c.93 1.87 2.53 3.4 4.4 4.4l1.47-1.47c.2-.2.47-.27.67-.13.73.27 1.53.4 2.4.4.37 0 .66.3.66.67V13.33c0 .37-.3.67-.67.67A11.33 11.33 0 0 1 2 3.33c0-.36.3-.66.67-.66H5c.37 0 .67.3.67.66 0 .87.13 1.67.4 2.4.13.2.06.47-.14.67L4.4 7.2z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                0411 234 567
              </a>
            </div>
          </div>

          <div className="space-y-0 divide-y divide-gray-100">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  aria-expanded={open === i}
                >
                  <span className="text-base font-bold text-charcoal group-hover:text-blue-brand transition-colors">
                    {faq.q}
                  </span>
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    open === i
                      ? "bg-blue-brand border-blue-brand text-white rotate-45"
                      : "border-gray-300 text-gray-400"
                  }`}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-gray-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import { EXTRAS } from "@/data/site";

export function Extras() {
  return (
    <section className="py-16 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">Customise your job</p>
          <h2 className="text-3xl lg:text-4xl font-black text-charcoal mb-3">Add-on extras</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Tailor your painting project with any of these popular extras. Just let us know when booking.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {EXTRAS.map((extra, i) => (
            <motion.span
              key={extra}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex items-center gap-2 bg-white text-charcoal font-semibold text-sm rounded-full px-4 py-2.5 border border-gray-200 shadow-sm hover:border-blue-brand hover:text-gold-deep hover:shadow-card transition-all cursor-default"
            >
              <svg className="w-3.5 h-3.5 text-terra" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {extra}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { REVIEWS } from "@/data/site";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function Reviews() {
  const row1 = REVIEWS.slice(0, 4);
  const row2 = REVIEWS.slice(4);

  return (
    <section id="reviews" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-blue-brand" />
      <div className="absolute top-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z" fill="white"/>
        </svg>
      </div>
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">What clients say</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-3">
            Our customers say great things
          </h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-4 py-1.5">
              <span className="text-amber-300 text-sm">★★★★★</span>
              <span className="text-white text-sm font-semibold">4.9</span>
            </div>
            <p className="text-blue-200 text-sm">
              200+ verified reviews on{" "}
              <a href="#" className="text-white font-bold underline underline-offset-2">Google</a>{" "}
              &amp;{" "}
              <a href="#" className="text-white font-bold underline underline-offset-2">Trustpilot</a>
            </p>
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {row1.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-brand text-white flex items-center justify-center text-xs font-black">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-charcoal">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.suburb}</p>
                  </div>
                </div>
                <GoogleIcon />
              </div>
              <div className="text-amber-400 text-sm mb-2">{"★".repeat(r.rating)}</div>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{r.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {row2.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 + 0.2 }}
              className="bg-white rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-terra text-white flex items-center justify-center text-xs font-black">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-charcoal">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.suburb}</p>
                  </div>
                </div>
                <GoogleIcon />
              </div>
              <div className="text-amber-400 text-sm mb-2">{"★".repeat(r.rating)}</div>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

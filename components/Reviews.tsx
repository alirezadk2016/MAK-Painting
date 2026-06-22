"use client";
import { motion } from "framer-motion";
import { REVIEWS, BRAND } from "@/data/site";

const MAPS_URL = "https://www.google.com/maps/place/MAK+Painting+Group/@-37.9725665,145.0531353,17z";

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= rating ? "text-amber-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
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
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Our customers say great things
          </h2>

          {/* Live Google rating badge */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-lg hover:shadow-xl transition-shadow group"
          >
            <GoogleIcon />
            <div className="flex items-center gap-2">
              <span className="font-black text-charcoal text-lg leading-none">{BRAND.googleRating}</span>
              <StarRating rating={5} />
              <span className="text-gray-500 text-sm">({BRAND.googleReviewCount} reviews)</span>
            </div>
            <span className="text-xs text-blue-brand font-semibold group-hover:underline">View on Google →</span>
          </a>
        </div>

        {/* Row 1 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {row1.map((r, i) => (
            <motion.a
              key={r.id}
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-lg transition-shadow block"
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
              <StarRating rating={r.rating} />
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mt-2">{r.text}</p>
            </motion.a>
          ))}
        </div>

        {/* Row 2 */}
        {row2.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {row2.map((r, i) => (
              <motion.a
                key={r.id}
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.2 }}
                className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-lg transition-shadow block"
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
                <StarRating rating={r.rating} />
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mt-2">{r.text}</p>
              </motion.a>
            ))}
          </div>
        )}

        {/* CTA to leave review */}
        <div className="text-center mt-10">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-full px-6 py-3 text-sm transition-colors border border-white/20"
          >
            <GoogleIcon />
            Leave us a review on Google
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQuoteWizard } from "./QuoteWizardProvider";

const MAPS_URL = "https://www.google.com/maps/place/MAK+Painting+Group/@-37.9725665,145.0531353,17z";

export function Hero() {
  const { open } = useQuoteWizard();
  const [postcode, setPostcode] = useState("");
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-screen bg-canvas overflow-hidden flex items-center pt-16">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23141821' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-muted text-gold-deep rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 bg-blue-brand rounded-full animate-pulse" />
              {t("badge")}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal leading-[1.1] tracking-tight mb-5 text-balance">
              {t("title")}
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-6 max-w-xl">
              {t("subtitle")}
            </p>

            <ul className="space-y-2.5 mb-8">
              {[t("trust1"), t("trust2"), t("trust3")].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-charcoal">
                  <span className="w-5 h-5 bg-blue-brand rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-ink" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Postcode form */}
            <div className="flex bg-white rounded-2xl shadow-card-lg p-1.5 max-w-md border border-gray-100">
              <div className="flex items-center pl-3 gap-2 flex-1">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2a6 6 0 0 1 6 6c0 5-6 10-6 10S4 13 4 8a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder={t("postcodePlaceholder")}
                  className="flex-1 text-sm font-medium text-charcoal placeholder:text-gray-400 bg-transparent outline-none py-2"
                  aria-label={t("postcodePlaceholder")}
                />
              </div>
              <button
                onClick={open}
                className="bg-terra hover:bg-terra-dark text-ink text-sm font-bold rounded-xl px-5 py-2.5 transition-all hover:shadow-md whitespace-nowrap"
              >
                {t("getMyQuote")}
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex -space-x-2">
                {["JM","SR","KP","DL","MT"].map((init, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-blue-brand border-2 border-white flex items-center justify-center text-ink text-xs font-bold">
                    {init[0]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {"★★★★★"}
                </div>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 font-medium hover:text-gold-deep transition-colors">{t("socialProof")}</a>
              </div>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover aspect-[4/5]">
              <Image
                src="/1.png"
                alt="MAK Painting Group — Melbourne painting services van"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1200px) 50vw, 600px"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 start-6 end-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-card-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gold-deep" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-charcoal">{t("warrantyTitle")}</p>
                    <p className="text-xs text-gray-500">{t("warrantySub")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="absolute -start-6 top-12 bg-white rounded-2xl shadow-card-lg px-4 py-3 border border-gray-50 hover:shadow-card-hover transition-shadow block">
              <p className="text-2xl font-black text-charcoal">7</p>
              <p className="text-xs text-gray-500 font-medium">{t("googleReviews")}</p>
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="absolute -end-4 top-1/3 bg-terra rounded-2xl shadow-card-lg px-4 py-3 hover:bg-terra-dark transition-colors">
              <p className="text-2xl font-black text-ink">5.0★</p>
              <p className="text-xs text-ink/70 font-medium">{t("googleRating")}</p>
            </a>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

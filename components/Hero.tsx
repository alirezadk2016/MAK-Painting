"use client";
import { useState } from "react";
import Image from "next/image";
import { useQuoteWizard } from "./QuoteWizardProvider";

export function Hero() {
  const { open } = useQuoteWizard();
  const [postcode, setPostcode] = useState("");

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
            <div className="inline-flex items-center gap-2 bg-blue-muted text-blue-brand rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 bg-blue-brand rounded-full animate-pulse" />
              Melbourne&apos;s #1 rated painters
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal leading-[1.05] tracking-tight mb-5 text-balance">
              Stress-free painting{" "}
              <span className="text-blue-brand relative">
                you can
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 10 C50 2, 150 2, 198 10" stroke="#E5572B" strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
              </span>{" "}
              depend on.
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-6 max-w-xl">
              Relax — your home&apos;s in expert hands. Premium prep, flawless finish, fully insured Melbourne painters.
            </p>

            <ul className="space-y-2.5 mb-8">
              {[
                "Free on-site quote — no obligation",
                "7-year workmanship warranty",
                "500+ homes painted across Melbourne",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-charcoal">
                  <span className="w-5 h-5 bg-blue-brand rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
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
                  placeholder="Enter your postcode or suburb"
                  className="flex-1 text-sm font-medium text-charcoal placeholder:text-gray-400 bg-transparent outline-none py-2"
                  aria-label="Postcode or suburb"
                />
              </div>
              <button
                onClick={open}
                className="bg-terra hover:bg-terra-dark text-white text-sm font-bold rounded-xl px-5 py-2.5 transition-all hover:shadow-md whitespace-nowrap"
              >
                Get my free quote
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex -space-x-2">
                {["JM","SR","KP","DL","MT"].map((init, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-blue-brand border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {init[0]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {"★★★★★"}
                </div>
                <a href="https://www.google.com/maps/place/MAK+Painting+Group/@-37.9725665,145.0531353,17z" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 font-medium hover:text-blue-brand transition-colors">7 verified Google reviews →</a>
              </div>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=900&q=85"
                alt="Professional MAK painter applying a flawless finish"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1200px) 50vw, 600px"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-card-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-brand" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-charcoal">7-Year Workmanship Warranty</p>
                    <p className="text-xs text-gray-500">On every residential &amp; commercial job</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -left-6 top-12 bg-white rounded-2xl shadow-card-lg px-4 py-3 border border-gray-50">
              <p className="text-2xl font-black text-charcoal">500+</p>
              <p className="text-xs text-gray-500 font-medium">Homes painted</p>
            </div>
            <a href="https://www.google.com/maps/place/MAK+Painting+Group/@-37.9725665,145.0531353,17z" target="_blank" rel="noopener noreferrer" className="absolute -right-4 top-1/3 bg-terra rounded-2xl shadow-card-lg px-4 py-3 hover:bg-terra-dark transition-colors">
              <p className="text-2xl font-black text-white">5.0★</p>
              <p className="text-xs text-white/80 font-medium">Google rating</p>
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

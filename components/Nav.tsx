"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuoteWizard } from "./QuoteWizardProvider";
import { SERVICES } from "@/data/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { open } = useQuoteWizard();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-brand flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-sm tracking-tight">M</span>
            </div>
            <span className="font-black text-charcoal text-sm tracking-tight leading-tight">
              MAK<br />
              <span className="text-blue-brand font-semibold text-xs">Painting Group</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <Link href="#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">
              How it works
            </Link>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">
                Services
                <svg className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-card-lg border border-gray-100 py-2 z-50">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-muted hover:text-blue-brand transition-colors rounded-xl mx-1"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="#gallery" className="text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">Gallery</Link>
            <Link href="#reviews" className="text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">Reviews</Link>
            <Link href="#contact" className="text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">Quote</Link>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="tel:0404000772" className="text-sm font-semibold text-blue-brand border border-blue-brand/30 rounded-full px-4 py-2 hover:bg-blue-muted transition-colors">
              04xx xxx xxx
            </Link>
            <button
              onClick={open}
              className="bg-terra hover:bg-terra-dark text-white text-sm font-bold rounded-full px-5 py-2 transition-all hover:shadow-md hover:-translate-y-px active:translate-y-0"
            >
              Get a free quote
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 text-charcoal"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`block w-5 h-0.5 bg-charcoal transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-charcoal mt-1.5 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-charcoal mt-1.5 transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {["#how-it-works", "#gallery", "#reviews", "#contact"].map((href) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 px-3 text-sm font-semibold text-charcoal hover:bg-blue-muted rounded-xl transition-colors"
            >
              {href.replace("#", "").replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Services</p>
            {SERVICES.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 text-sm font-medium text-gray-600 hover:bg-blue-muted rounded-xl transition-colors"
              >
                {s.title}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={() => { open(); setMenuOpen(false); }}
              className="w-full bg-terra text-white font-bold rounded-2xl py-3 text-sm"
            >
              Get a free quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

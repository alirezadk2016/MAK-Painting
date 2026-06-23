"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useQuoteWizard } from "./QuoteWizardProvider";
import { SERVICES } from "@/data/site";

const SVC_KEY: Record<string, string> = {
  "interior": "interior", "exterior": "exterior", "roof": "roof",
  "commercial": "commercial", "special-finishes": "specialFinishes", "repaints": "repaints",
};

function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 text-xs font-bold">
      <Link
        href={pathname}
        locale="en"
        className={`px-2 py-1 rounded-md transition-colors ${locale === "en" ? "bg-charcoal text-gold" : "text-gray-500 hover:text-charcoal"}`}
        aria-label="English"
      >
        EN
      </Link>
      <span className="text-gray-300">|</span>
      <Link
        href={pathname}
        locale="fa"
        className={`px-2 py-1 rounded-md transition-colors ${locale === "fa" ? "bg-charcoal text-gold" : "text-gray-500 hover:text-charcoal"}`}
        aria-label="فارسی"
      >
        fa
      </Link>
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { open } = useQuoteWizard();
  const t = useTranslations("Nav");
  const tSvc = useTranslations("ServicesData");

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
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="MAK Painting Group — home">
            <Image
              src="/logo.jpg"
              alt="MAK Painting Group"
              width={150}
              height={90}
              priority
              className="h-11 w-auto rounded-lg object-contain ring-1 ring-gold/20 shadow-sm"
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">
              {t("about")}
            </Link>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <Link href="/services" className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">
                {t("services")}
                <svg className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              {servicesOpen && (
                <div className="absolute top-full start-0 pt-2 w-56 z-[60]">
                <div className="bg-white rounded-2xl shadow-card-lg border border-gray-100 py-2">
                  {SERVICES.map((s) => {
                    const k = SVC_KEY[s.id];
                    const title = k ? (tSvc as (k: string) => string)(`${k}.title`) : s.title;
                    return (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-muted hover:text-gold-deep transition-colors rounded-xl mx-1"
                    >
                      {title}
                    </Link>
                  )})}
                </div>
                </div>
              )}
            </div>

            <Link href="/gallery" className="text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">{t("gallery")}</Link>
            <Link href="/contact" className="text-sm font-semibold text-gray-600 hover:text-charcoal transition-colors">{t("contact")}</Link>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <a href="tel:0404000772" className="text-sm font-semibold text-gold-deep border border-blue-brand/30 rounded-full px-4 py-2 hover:bg-blue-muted transition-colors whitespace-nowrap" dir="ltr">
              0404 000 772
            </a>
            <button
              onClick={() => open()}
              className="bg-terra hover:bg-terra-dark text-ink text-sm font-bold rounded-full px-5 py-2 transition-all hover:shadow-md hover:-translate-y-px active:translate-y-0 whitespace-nowrap"
            >
              {t("getQuote")}
            </button>
          </div>

          {/* Mobile burger */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="p-2 text-charcoal"
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          <Link href="/about" onClick={() => setMenuOpen(false)}
            className="block py-3 px-3 text-sm font-semibold text-charcoal hover:bg-blue-muted rounded-xl transition-colors">
            {t("about")}
          </Link>

          {/* Services — collapsible */}
          <div>
            <button
              onClick={() => setMobileServicesOpen(o => !o)}
              className="w-full flex items-center justify-between py-3 px-3 text-sm font-semibold text-charcoal hover:bg-blue-muted rounded-xl transition-colors"
            >
              {t("services")}
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileServicesOpen && (
              <div className="mt-1 ml-3 space-y-0.5 border-l-2 border-gold/30 pl-3">
                <Link href="/services" onClick={() => { setMenuOpen(false); setMobileServicesOpen(false); }}
                  className="block py-2 px-3 text-sm font-bold text-gold-deep hover:bg-blue-muted rounded-xl transition-colors">
                  All Services →
                </Link>
                {SERVICES.map((s) => {
                  const k = SVC_KEY[s.id];
                  const title = k ? (tSvc as (k: string) => string)(`${k}.title`) : s.title;
                  return (
                    <Link key={s.id} href={`/services/${s.slug}`}
                      onClick={() => { setMenuOpen(false); setMobileServicesOpen(false); }}
                      className="block py-2 px-3 text-sm font-medium text-gray-600 hover:bg-blue-muted rounded-xl transition-colors">
                      {title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="/gallery" onClick={() => setMenuOpen(false)}
            className="block py-3 px-3 text-sm font-semibold text-charcoal hover:bg-blue-muted rounded-xl transition-colors">
            {t("gallery")}
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}
            className="block py-3 px-3 text-sm font-semibold text-charcoal hover:bg-blue-muted rounded-xl transition-colors">
            {t("contact")}
          </Link>

          <div className="pt-3 border-t border-gray-100">
            <button onClick={() => { open(); setMenuOpen(false); }}
              className="w-full bg-terra text-ink font-bold rounded-2xl py-3 text-sm">
              {t("getQuote")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

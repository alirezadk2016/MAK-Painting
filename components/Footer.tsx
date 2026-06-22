import Link from "next/link";
import { BRAND, SERVICES, SUBURBS } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-charcoal text-white">
      {/* Top wave */}
      <div className="bg-canvas">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#141821"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-brand flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <span className="font-black text-white text-sm tracking-tight leading-tight">
                MAK<br /><span className="text-blue-brand/80 font-semibold text-xs">Painting Group</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Melbourne&apos;s trusted residential &amp; commercial painting specialists since 2010.
            </p>
            <div className="flex items-center gap-3">
              <a href={BRAND.instagram} aria-label="Instagram" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-brand transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              </a>
              <a href={BRAND.facebook} aria-label="Facebook" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-brand transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Services</h4>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                ["How it works", "#how-it-works"],
                ["Gallery", "#gallery"],
                ["Reviews", "#reviews"],
                ["FAQ", "#faq"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Service Areas</h4>
            <div className="flex flex-wrap gap-1.5">
              {SUBURBS.slice(0, 12).map((s) => (
                <span key={s} className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-default">{s}</span>
              ))}
              <span className="text-xs text-blue-brand/70">+ all Melbourne suburbs</span>
            </div>
            <div className="mt-5 space-y-2">
              <a href={`tel:${BRAND.phone.replace(/\s/g,"")}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4 text-terra" viewBox="0 0 16 16" fill="none"><path d="M4.4 7.2c.93 1.87 2.53 3.4 4.4 4.4l1.47-1.47c.2-.2.47-.27.67-.13.73.27 1.53.4 2.4.4.37 0 .66.3.66.67V13.33c0 .37-.3.67-.67.67A11.33 11.33 0 0 1 2 3.33c0-.36.3-.66.67-.66H5c.37 0 .67.3.67.66 0 .87.13 1.67.4 2.4.13.2.06.47-.14.67L4.4 7.2z" stroke="currentColor" strokeWidth="1.2"/></svg>
                {BRAND.phone}
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4 text-terra" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.2"/></svg>
                {BRAND.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year} MAK Painting Group Pty Ltd. ABN {BRAND.abn} · Vic Builders Lic. {BRAND.license}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <span>All prices in AUD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";
import { useState } from "react";
import { BRAND, SERVICES } from "@/data/site";

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  }

  return (
    <section id="contact" className="relative py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* Info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">Get in touch</p>
            <h2 className="text-3xl lg:text-4xl font-black text-charcoal mb-4">
              Get your free quote today.
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Fill in the form and we&apos;ll contact you within one business day to arrange a free on-site consultation — obligation-free.
            </p>

            <div className="space-y-5">
              {[
                { icon: "phone", label: "Phone", val: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g,"")}` },
                { icon: "whatsapp", label: "WhatsApp", val: "Chat on WhatsApp", href: `https://wa.me/${BRAND.whatsapp}` },
                { icon: "email", label: "Email", val: BRAND.email, href: `mailto:${BRAND.email}` },
                { icon: "pin", label: "Location", val: BRAND.address, href: BRAND.googleMapsUrl },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-blue-muted rounded-xl flex items-center justify-center flex-shrink-0 text-blue-brand">
                    {item.icon === "phone" && (
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M5.5 9c1.16 2.33 3.17 4.26 5.5 5.5l1.83-1.83c.25-.25.58-.33.83-.17.92.33 1.92.5 3 .5.46 0 .84.37.84.83V16.5c0 .46-.38.83-.84.83A14.17 14.17 0 0 1 2.67 3.33c0-.46.37-.83.83-.83h2.67c.46 0 .83.37.83.83 0 1.08.17 2.08.5 3 .17.25.08.58-.17.83L5.5 9z" stroke="currentColor" strokeWidth="1.4"/></svg>
                    )}
                    {item.icon === "whatsapp" && (
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4"/><path d="M13 12.5c-.17.5-.83 1-1.42 1.08-.58.09-1.08.09-2.16-.5C8.33 12.5 7.17 11.17 6.67 10.25c-.42-.75-.42-1.67 0-2.25.42-.58.83-.75 1.25-.75.16 0 .33 0 .41.08.17.08.42.42.67.92.25.5.17.75 0 .92-.17.16-.33.33-.25.5.25.58.75 1.16 1.25 1.5.17.08.42 0 .58-.17.17-.16.33-.33.5-.25.17.08.67.42.92.67.25.25.08.58-.08.83z" stroke="currentColor" strokeWidth="1.2"/></svg>
                    )}
                    {item.icon === "email" && (
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.4"/></svg>
                    )}
                    {item.icon === "pin" && (
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M10 2a6 6 0 0 1 6 6c0 5-6 10-6 10S4 13 4 8a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-semibold text-charcoal hover:text-blue-brand transition-colors">{item.val}</a>
                    ) : (
                      <p className="font-semibold text-charcoal">{item.val}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100 shadow-card text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-600">Speak to {BRAND.contactName}</strong> &nbsp;·&nbsp;
              {BRAND.serviceTypes} &nbsp;·&nbsp;
              Fully insured public liability
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-card-lg border border-gray-100 p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-black text-charcoal mb-2">Enquiry received!</h3>
                <p className="text-gray-500">We&apos;ll be in touch within one business day to arrange your free on-site quote.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-charcoal mb-6">Request a free quote</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First name" id="fname" placeholder="John" required />
                  <Field label="Last name" id="lname" placeholder="Smith" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Email" id="email" type="email" placeholder="john@email.com" required />
                  <Field label="Phone" id="phone" type="tel" placeholder="04xx xxx xxx" required />
                </div>
                <Field label="Suburb / Postcode" id="suburb" placeholder="e.g. Brighton 3186" required />

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500" htmlFor="service">
                    Service required
                  </label>
                  <select
                    id="service"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal focus:outline-none focus:border-blue-brand transition-colors"
                  >
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => <option key={s.id}>{s.title}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500" htmlFor="msg">
                    Tell us about your project
                  </label>
                  <textarea
                    id="msg"
                    rows={4}
                    placeholder="Property type, number of rooms, timeline, any extras…"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal focus:outline-none focus:border-blue-brand transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    Upload photos (optional)
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-brand hover:bg-blue-muted/50 transition-all">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm text-gray-400 font-medium">Click to upload or drag &amp; drop</span>
                    <span className="text-xs text-gray-300">PNG, JPG up to 10MB each</span>
                    <input type="file" accept="image/*" multiple className="hidden" />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-terra hover:bg-terra-dark disabled:opacity-70 text-white font-bold rounded-xl py-4 text-base transition-all hover:shadow-md"
                >
                  {loading ? "Sending…" : "Send my free quote request"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  We respond within one business day. No obligation — ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, id, type = "text", placeholder, required,
}: {
  label: string; id: string; type?: string; placeholder: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-wide text-gray-500" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal focus:outline-none focus:border-blue-brand transition-colors"
      />
    </div>
  );
}

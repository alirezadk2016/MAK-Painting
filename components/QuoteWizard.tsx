"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXTRAS } from "@/data/site";

const STEPS_WIZARD = [
  "Postcode",
  "Property type",
  "Scope",
  "Rooms / m²",
  "Extras",
  "Date",
  "Contact",
];

const PROPERTY_TYPES = ["House", "Apartment", "Townhouse", "Commercial"];
const SCOPE_OPTIONS = ["Interior only", "Exterior only", "Both interior & exterior"];

export function QuoteWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    postcode: "", propertyType: "", scope: "",
    rooms: "", sqm: "", extras: [] as string[],
    date: "", name: "", phone: "", email: "",
  });
  const [sent, setSent] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEPS_WIZARD.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const update = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));
  const toggleExtra = (e: string) =>
    setData((d) => ({
      ...d,
      extras: d.extras.includes(e) ? d.extras.filter((x) => x !== e) : [...d.extras, e],
    }));

  function handleSubmit() {
    setSent(true);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-card-hover overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-charcoal px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-gold-light text-xs font-bold uppercase tracking-widest mb-0.5">Free quote wizard</p>
            <h2 className="text-white font-black text-xl">
              {sent ? "Request received!" : STEPS_WIZARD[step]}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1" aria-label="Close">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {!sent && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-1 bg-terra transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS_WIZARD.length) * 100}%` }}
            />
          </div>
        )}

        {/* Steps */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-black text-xl text-charcoal mb-2">We&apos;ll be in touch soon!</h3>
                <p className="text-gray-500 text-sm mb-6">Our team will call you within one business day to confirm your free on-site quote.</p>
                <div className="bg-canvas rounded-2xl p-4 text-left text-sm space-y-1">
                  <p><strong>Suburb:</strong> {data.postcode}</p>
                  <p><strong>Property:</strong> {data.propertyType}</p>
                  <p><strong>Scope:</strong> {data.scope}</p>
                  {data.extras.length > 0 && <p><strong>Extras:</strong> {data.extras.join(", ")}</p>}
                </div>
                <button onClick={onClose} className="mt-6 bg-gold text-ink font-bold rounded-xl px-6 py-3 text-sm">Close</button>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {step === 0 && (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm">Where is the property to be painted?</p>
                    <input
                      type="text"
                      placeholder="Suburb or postcode"
                      value={data.postcode}
                      onChange={(e) => update("postcode", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-brand"
                    />
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm mb-4">What type of property is it?</p>
                    {PROPERTY_TYPES.map((pt) => (
                      <button
                        key={pt}
                        onClick={() => { update("propertyType", pt); next(); }}
                        className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-bold transition-all ${data.propertyType === pt ? "border-gold bg-gold-soft text-gold-deep" : "border-gray-200 text-charcoal hover:border-gold"}`}
                      >
                        <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${data.propertyType === pt ? "border-gold bg-gold" : "border-gray-300"}`} />
                        {pt}
                      </button>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm mb-4">What would you like painted?</p>
                    {SCOPE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { update("scope", s); next(); }}
                        className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-bold transition-all ${data.scope === s ? "border-gold bg-gold-soft text-gold-deep" : "border-gray-200 text-charcoal hover:border-gold"}`}
                      >
                        <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${data.scope === s ? "border-gold bg-gold" : "border-gray-300"}`} />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm">Approximate size — helps us give an accurate estimate.</p>
                    <input
                      type="number"
                      placeholder="Number of rooms (e.g. 4)"
                      value={data.rooms}
                      onChange={(e) => update("rooms", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-brand"
                    />
                    <input
                      type="number"
                      placeholder="Approx. m² (optional)"
                      value={data.sqm}
                      onChange={(e) => update("sqm", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-brand"
                    />
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm mb-2">Any add-ons? (Select all that apply)</p>
                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {EXTRAS.map((ex) => (
                        <button
                          key={ex}
                          onClick={() => toggleExtra(ex)}
                          className={`text-left text-xs font-semibold rounded-xl border-2 px-3 py-2.5 transition-all ${data.extras.includes(ex) ? "border-gold bg-gold-soft text-gold-deep" : "border-gray-200 text-charcoal hover:border-gold"}`}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm">When would you like the work done?</p>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => update("date", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-brand"
                    />
                    <p className="text-xs text-gray-400">This is a preferred date — we&apos;ll confirm availability when we call.</p>
                  </div>
                )}
                {step === 6 && (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm mb-2">Almost done! Where can we reach you?</p>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={data.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-brand"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number (04xx xxx xxx)"
                      value={data.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-brand"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={data.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-brand"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        {!sent && (
          <div className="px-6 pb-6 flex items-center justify-between gap-3">
            <button
              onClick={back}
              disabled={step === 0}
              className="text-sm font-bold text-gray-400 hover:text-charcoal disabled:opacity-0 transition-colors px-2"
            >
              ← Back
            </button>
            <div className="flex gap-1.5">
              {STEPS_WIZARD.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-gold" : i < step ? "w-3 bg-gold/40" : "w-3 bg-gray-200"}`} />
              ))}
            </div>
            {step < STEPS_WIZARD.length - 1 ? (
              <button
                onClick={next}
                className="bg-gold text-ink font-bold rounded-xl px-5 py-2.5 text-sm hover:bg-gold-dark transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-terra text-ink font-bold rounded-xl px-5 py-2.5 text-sm hover:bg-terra-dark transition-colors"
              >
                Submit request
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { EXTRAS, SUBURBS } from "@/data/site";

// Only accept suburbs in the service list or their known postcodes
const SUBURB_SET = new Set(SUBURBS.map((s: string) => s.toLowerCase()));

// Known postcodes for the service area suburbs
const SERVICE_POSTCODES = new Set([
  "3156","3180","3152","3178","3179","3155","3153","3154",
  "3134","3135","3136","3137","3138","3140","3150","3149",
  "3133","3132","3131","3128","3108","3109","3124","3122",
  "3101","3103","3104","3130","3151","3106","3107",
  "3175","3806","3805","3804","3802","3803","3168","3166",
  "3127","3126","3123","3125","3129","3102","3105",
  "3000","3001","3002","3003","3004","3005","3006","3008",
]);

function isInServiceArea(input: string): boolean {
  const v = input.trim();
  if (!v) return false;
  if (/^\d{4}$/.test(v)) return SERVICE_POSTCODES.has(v);
  const lower = v.toLowerCase();
  for (const suburb of SUBURB_SET) {
    if (lower.includes(suburb)) return true;
  }
  return false;
}

export function QuoteWizard({
  onClose,
  initialPostcode = "",
}: {
  onClose: () => void;
  initialPostcode?: string;
}) {
  const t = useTranslations("QuoteWizard");

  const STEPS_WIZARD = [
    t("step0"), t("step1"), t("step2"), t("step3"),
    t("step4"), t("step5"), t("step6"),
  ];
  const PROPERTY_TYPES = [t("prop0"), t("prop1"), t("prop2"), t("prop3"), t("other")];
  const SCOPE_OPTIONS  = [t("scope0"), t("scope1"), t("scope2"), t("other")];

  const [step, setStep]           = useState(0);
  const [suburbError, setSuburbError] = useState("");
  const [stepError, setStepError]  = useState("");
  const [data, setData] = useState({
    postcode: initialPostcode, propertyType: "", scope: "",
    rooms: "", sqm: "", extras: [] as string[],
    date: "", name: "", phone: "", email: "",
  });
  const [sent, setSent]           = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function tryNext() {
    setStepError("");
    setSuburbError("");

    if (step === 0) {
      if (!data.postcode.trim()) {
        setSuburbError(t("suburbHint"));
        return;
      }
      if (!isInServiceArea(data.postcode)) {
        setSuburbError(t("suburbError"));
        return;
      }
    }
    if (step === 3 && !data.rooms.trim()) {
      setStepError("Please enter the number of rooms.");
      return;
    }
    if (step === 5 && !data.date) {
      setStepError("Please select a preferred date.");
      return;
    }
    if (step === 6) {
      if (!data.name.trim())  { setStepError("Please enter your full name.");  return; }
      if (!data.phone.trim()) { setStepError("Please enter your phone number."); return; }
      if (!data.email.trim()) { setStepError("Please enter your email address."); return; }
    }
    setStep((s) => Math.min(s + 1, STEPS_WIZARD.length - 1));
  }

  const back = () => { setSuburbError(""); setStepError(""); setStep((s) => Math.max(s - 1, 0)); };
  const update = (k: string, v: string) => { setData((d) => ({ ...d, [k]: v })); setStepError(""); };
  const toggleExtra = (e: string) =>
    setData((d) => ({
      ...d,
      extras: d.extras.includes(e) ? d.extras.filter((x) => x !== e) : [...d.extras, e],
    }));

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
            <p className="text-gold-light text-xs font-bold uppercase tracking-widest mb-0.5">{t("eyebrow")}</p>
            <h2 className="text-white font-black text-xl">
              {sent ? t("doneTitle") : STEPS_WIZARD[step]}
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
                <h3 className="font-black text-xl text-charcoal mb-2">{t("doneTitle")}</h3>
                <p className="text-gray-500 text-sm mb-6">{t("doneBody")}</p>
                <div className="bg-canvas rounded-2xl p-4 text-start text-sm space-y-1">
                  <p><strong>{t("labelSuburb")}:</strong> {data.postcode}</p>
                  <p><strong>{t("labelProperty")}:</strong> {data.propertyType}</p>
                  <p><strong>{t("labelScope")}:</strong> {data.scope}</p>
                  {data.extras.length > 0 && <p><strong>{t("labelExtras")}:</strong> {data.extras.join(", ")}</p>}
                </div>
                <button onClick={onClose} className="mt-6 bg-gold text-ink font-bold rounded-xl px-6 py-3 text-sm">{t("close")}</button>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {step === 0 && (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm">{t("q0")}</p>
                    <input
                      type="text"
                      placeholder={t("ph0")}
                      value={data.postcode}
                      onChange={(e) => { update("postcode", e.target.value); setSuburbError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && tryNext()}
                      autoFocus
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-colors ${suburbError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-gold"}`}
                    />
                    <p className="text-xs text-gray-400">{t("suburbHint")}</p>
                    {suburbError && (
                      <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        <p className="text-sm text-red-600 font-medium">{suburbError}</p>
                      </div>
                    )}
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm mb-4">{t("q1")}</p>
                    {PROPERTY_TYPES.map((pt) => (
                      <button
                        key={pt}
                        onClick={() => { update("propertyType", pt); setStep(s => s + 1); }}
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
                    <p className="text-gray-500 text-sm mb-4">{t("q2")}</p>
                    {SCOPE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { update("scope", s); setStep(st => st + 1); }}
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
                    <p className="text-gray-500 text-sm">{t("q3")}</p>
                    <input
                      type="number"
                      placeholder={t("ph3rooms")}
                      value={data.rooms}
                      onChange={(e) => update("rooms", e.target.value)}
                      min="1"
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-gold ${stepError && !data.rooms ? "border-red-400" : "border-gray-200"}`}
                    />
                    <input
                      type="number"
                      placeholder={t("ph3sqm")}
                      value={data.sqm}
                      onChange={(e) => update("sqm", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-gold"
                    />
                    {stepError && (
                      <p className="text-sm text-red-500">{stepError}</p>
                    )}
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm mb-2">{t("q4")}</p>
                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {EXTRAS.map((ex: string) => (
                        <button
                          key={ex}
                          onClick={() => toggleExtra(ex)}
                          className={`text-start text-xs font-semibold rounded-xl border-2 px-3 py-2.5 transition-all ${data.extras.includes(ex) ? "border-gold bg-gold-soft text-gold-deep" : "border-gray-200 text-charcoal hover:border-gold"}`}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm">{t("q5")}</p>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => update("date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-gold ${stepError ? "border-red-400" : "border-gray-200"}`}
                    />
                    <p className="text-xs text-gray-400">{t("note5")}</p>
                    {stepError && <p className="text-sm text-red-500">{stepError}</p>}
                  </div>
                )}
                {step === 6 && (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm mb-2">{t("q6")}</p>
                    <input
                      type="text"
                      placeholder={t("phName")}
                      value={data.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-gold ${stepError && !data.name.trim() ? "border-red-400" : "border-gray-200"}`}
                    />
                    <input
                      type="tel"
                      placeholder={t("phPhone")}
                      value={data.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-gold ${stepError && !data.phone.trim() ? "border-red-400" : "border-gray-200"}`}
                      dir="ltr"
                    />
                    <input
                      type="email"
                      placeholder={t("phEmail")}
                      value={data.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-gold ${stepError && !data.email.trim() ? "border-red-400" : "border-gray-200"}`}
                      dir="ltr"
                    />
                    {stepError && <p className="text-sm text-red-500">{stepError}</p>}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        {!sent && (
          <div className="px-6 pb-6 space-y-3">
            {submitError && <p className="text-sm text-red-500 text-center">{submitError}</p>}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={back}
                disabled={step === 0}
                className="text-sm font-bold text-gray-400 hover:text-charcoal disabled:opacity-0 transition-colors px-2"
              >
                {t("back")}
              </button>
              <div className="flex gap-1.5">
                {STEPS_WIZARD.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-gold" : i < step ? "w-3 bg-gold/40" : "w-3 bg-gray-200"}`} />
                ))}
              </div>
              {step < STEPS_WIZARD.length - 1 ? (
                <button
                  onClick={tryNext}
                  className="bg-gold text-ink font-bold rounded-xl px-5 py-2.5 text-sm hover:bg-gold-dark transition-colors"
                >
                  {t("next")}
                </button>
              ) : (
                <button
                  onClick={async () => {
                    if (!data.name.trim() || !data.phone.trim() || !data.email.trim()) {
                      setStepError(!data.name.trim() ? "Please enter your full name." : !data.phone.trim() ? "Please enter your phone number." : "Please enter your email address.");
                      return;
                    }
                    setSubmitting(true);
                    setSubmitError("");
                    try {
                      const res = await fetch("/api/contact", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                      });
                      if (res.ok) {
                        setSent(true);
                      } else {
                        setSubmitError(t("submitError"));
                      }
                    } catch {
                      setSubmitError(t("submitError"));
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  className="bg-terra disabled:opacity-70 text-ink font-bold rounded-xl px-5 py-2.5 text-sm hover:bg-terra-dark transition-colors"
                >
                  {submitting ? "…" : t("submit")}
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

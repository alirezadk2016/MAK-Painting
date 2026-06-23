"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { BRAND, SERVICES } from "@/data/site";

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("Contact");

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    suburb: "", service: "", message: "",
  });

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => { files.forEach(f => URL.revokeObjectURL(f.url)); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    const newEntries = picked.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
    setFiles(prev => [...prev, ...newEntries]);
    // Reset input so same file can be picked again
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeFile(url: string) {
    URL.revokeObjectURL(url);
    setFiles(prev => prev.filter(f => f.url !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photoCount: files.length }),
      });
      if (res.ok) {
        files.forEach(f => URL.revokeObjectURL(f.url));
        setSent(true);
      } else {
        setError(t("errorGeneric"));
      }
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* Info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">{t("eyebrow")}</p>
            <h2 className="text-3xl lg:text-4xl font-black text-charcoal mb-4">
              {t("title")}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              {t("subtitle")}
            </p>

            <div className="space-y-5">
              {[
                { icon: "phone", label: t("phone"), val: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g, "")}`, ltr: true },
                { icon: "whatsapp", label: t("whatsapp"), val: t("whatsappCta"), href: `https://wa.me/${BRAND.whatsapp}`, ltr: false },
                { icon: "email", label: t("email"), val: BRAND.email, href: `mailto:${BRAND.email}`, ltr: true },
                { icon: "pin", label: t("location"), val: BRAND.address, href: BRAND.googleMapsUrl, ltr: false },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-blue-muted rounded-xl flex items-center justify-center flex-shrink-0 text-gold-deep">
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
                    <a href={item.href} dir={item.ltr ? "ltr" : undefined} className="font-semibold text-charcoal hover:text-gold-deep transition-colors inline-block">{item.val}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100 shadow-card text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-600">{t("speakTo", { name: BRAND.contactName })}</strong> &nbsp;·&nbsp;
              {BRAND.serviceTypes} &nbsp;·&nbsp;
              {t("insured")}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-card-lg border border-gray-100 p-5 sm:p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-black text-charcoal mb-2">{t("successTitle")}</h3>
                <p className="text-gray-500">{t("successBody")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-charcoal mb-6">{t("formTitle")}</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("firstName")} id="fname" placeholder="John" value={form.firstName} onChange={set("firstName")} required />
                  <Field label={t("lastName")} id="lname" placeholder="Smith" value={form.lastName} onChange={set("lastName")} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("emailLabel")} id="email" type="email" placeholder="john@email.com" value={form.email} onChange={set("email")} required />
                  <Field label={t("phoneLabel")} id="phone" type="tel" placeholder="04xx xxx xxx" value={form.phone} onChange={set("phone")} required />
                </div>
                <Field label={t("suburb")} id="suburb" placeholder="e.g. Brighton 3186" value={form.suburb} onChange={set("suburb")} required />

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500" htmlFor="service">
                    {t("serviceRequired")}
                  </label>
                  <select
                    id="service"
                    value={form.service}
                    onChange={set("service")}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="">{t("selectService")}</option>
                    {SERVICES.map((s) => <option key={s.id}>{s.title}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500" htmlFor="msg">
                    {t("projectDetails")}
                  </label>
                  <textarea
                    id="msg"
                    rows={4}
                    placeholder={t("projectPlaceholder")}
                    value={form.message}
                    onChange={set("message")}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>

                {/* Photo upload */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    {t("uploadPhotos")}
                  </label>
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-gold hover:bg-blue-muted/50 transition-all"
                  >
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm text-gray-400 font-medium">{t("uploadCta")}</span>
                    <span className="text-xs text-gray-300">{t("uploadHint")}</span>
                    <input
                      id="file-upload"
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={addFiles}
                    />
                  </label>

                  {files.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {files.map((f) => (
                        <div key={f.url} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.url} alt={f.name} className="w-full h-20 object-cover rounded-xl border border-gray-200" />
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeFile(f.url)}
                            aria-label="Remove photo"
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-100 transition-opacity shadow-sm"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                          </button>
                          <p className="text-xs text-gray-400 truncate mt-1">{f.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-terra hover:bg-terra-dark disabled:opacity-70 text-ink font-bold rounded-xl py-4 text-base transition-all hover:shadow-md"
                >
                  {loading ? t("sending") : t("submit")}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  {t("respondNote")}
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
  label, id, type = "text", placeholder, value, onChange, required,
}: {
  label: string; id: string; type?: string; placeholder: string;
  value: string; onChange: React.ChangeEventHandler<HTMLInputElement>; required?: boolean;
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
        value={value}
        onChange={onChange}
        required={required}
        dir={type === "email" || type === "tel" ? "ltr" : undefined}
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}

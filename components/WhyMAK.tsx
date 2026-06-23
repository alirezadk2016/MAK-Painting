"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { STATS } from "@/data/site";

const MAPS_URL = "https://maps.app.goo.gl/eyYsR4ViUKb8RQrF9";

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        setVal(0);
        const start = performance.now();
        const dur = 1400;
        const step = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setVal(Number((ease * target).toFixed(target % 1 === 0 ? 0 : 1)));
          if (t < 1) requestAnimationFrame(step);
          else setVal(target);
        };
        requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const ICONS = [
  <svg key="h" className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M4 24V12L14 4l10 8v12H17V17h-6v7H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  <svg key="s" className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M14 2l3.6 7.3L26 10.5l-6 5.8 1.4 8.2L14 20.5 6.6 24.5 8 16.3 2 10.5l8.4-1.2L14 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  <svg key="w" className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M14 26s-9-5-9-13A9 9 0 0 1 23 13c0 8-9 13-9 13z" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>,
  <svg key="i" className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M14 26s-9-5-9-13A9 9 0 0 1 23 13c0 8-9 13-9 13z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 13l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
];

export function WhyMAK() {
  const t = useTranslations("WhyMAK");
  return (
    <section id="why-mak" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">{t("eyebrow")}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-charcoal mb-4">{t("title")}</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat, i) => {
            const isRating = i < 2;
            const Wrapper = isRating ? "a" : "div";
            const wrapperProps = isRating ? { href: MAPS_URL, target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Wrapper
                  {...(wrapperProps as Record<string, string>)}
                  className={`bg-canvas rounded-2xl p-8 text-center border border-gray-100 block ${isRating ? "hover:border-blue-brand/30 hover:shadow-card transition-shadow" : ""}`}
                >
                  <div className="w-14 h-14 bg-blue-muted rounded-2xl flex items-center justify-center mx-auto mb-5 text-gold-deep">
                    {ICONS[i]}
                  </div>
                  <p className="text-4xl font-black text-charcoal mb-1">
                    <Counter target={stat.num} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                  {isRating && <p className="text-xs text-gold-deep mt-1">{t("viewOnGoogle")}</p>}
                </Wrapper>
              </motion.div>
            );
          })}
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: t("feature1Title"), desc: t("feature1Body") },
            { title: t("feature2Title"), desc: t("feature2Body") },
            { title: t("feature3Title"), desc: t("feature3Body") },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-white shadow-card">
              <div className="w-8 h-8 bg-terra/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-terra" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-charcoal mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

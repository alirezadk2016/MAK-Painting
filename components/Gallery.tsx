"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GALLERY } from "@/data/site";
import type { GalleryPair } from "@/lib/site-config";

const INITIAL_ROWS = 2;
const COLS = 3;
const INITIAL_VISIBLE = INITIAL_ROWS * COLS; // 6

function BeforeAfterSlider({
  before, after, title, beforeLabel, afterLabel,
}: {
  before: string; after: string; title: string; beforeLabel: string; afterLabel: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl aspect-video cursor-col-resize select-none"
      onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
      onMouseMove={(e) => { if (dragging.current) updatePos(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
      onTouchMove={(e) => { if (dragging.current) updatePos(e.touches[0].clientX); }}
      onTouchEnd={() => { dragging.current = false; }}
    >
      {/* After (full width base) */}
      <div className="absolute inset-0">
        <Image src={after} alt={`${title} after`} fill className="object-cover" sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw" />
      </div>
      {/* Before (clipped to left side) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`${title} before`} fill className="object-cover" sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw" />
      </div>
      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 z-10 flex items-center"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-0.5 h-full bg-white/80 shadow-lg" />
        <div className="absolute w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-none">
          <svg className="w-5 h-5 text-charcoal" viewBox="0 0 20 20" fill="none">
            <path d="M6 10h8M4 7l-3 3 3 3M16 7l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-3 start-3 bg-charcoal/70 text-white text-xs font-bold px-2.5 py-1 rounded-full pointer-events-none">{beforeLabel}</span>
      <span className="absolute top-3 end-3 bg-blue-brand/90 text-ink text-xs font-bold px-2.5 py-1 rounded-full pointer-events-none">{afterLabel}</span>
    </div>
  );
}

interface GalleryItem {
  id: number;
  title: string;
  suburb: string;
  service: string;
  before: string;
  after: string;
}

interface Props {
  hideHeading?: boolean;
  showAll?: boolean; // gallery page passes true
  pairs?: GalleryPair[];
}

export function Gallery({ hideHeading = false, showAll: forceShowAll = false, pairs }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const t = useTranslations("Gallery");
  const beforeLabel = t("before");
  const afterLabel  = t("after");

  const items: GalleryItem[] = pairs?.length
    ? pairs.map(p => ({ id: p.id, title: p.title, suburb: "", service: "", before: p.before, after: p.after }))
    : GALLERY;
  const showMore = forceShowAll || expanded;
  const visible = showMore ? items : items.slice(0, INITIAL_VISIBLE);
  const hasMore = items.length > INITIAL_VISIBLE;

  return (
    <section id="gallery" className="py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {!hideHeading && (
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">{t("eyebrow")}</p>
            <h2 className="text-4xl lg:text-5xl font-black text-charcoal mb-4">{t("title")}</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">{t("subtitle")}</p>
          </div>
        )}

        {/* Grid — NOT columns (columns breaks absolute positioning in sliders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence initial={false}>
            {visible.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 5) * 0.07, duration: 0.4 }}
                className="cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                <div className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                  <BeforeAfterSlider
                    before={item.before} after={item.after}
                    title={item.title} beforeLabel={beforeLabel} afterLabel={afterLabel}
                  />
                  <div className="p-4 bg-white">
                    <p className="font-bold text-charcoal text-sm">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{item.suburb}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs bg-blue-muted text-gold-deep font-semibold px-2 py-0.5 rounded-full">{item.service}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show-more / View all  (homepage only) */}
        {!forceShowAll && (
          <div className="flex flex-col items-center gap-4 mt-10">
            {hasMore && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="group flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white/80 hover:bg-white/80 shadow-card text-charcoal font-bold text-sm rounded-2xl px-7 py-3.5 transition-all hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 text-terra transition-transform group-hover:translate-y-0.5" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Show more transformations
              </button>
            )}
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm font-bold text-gold-deep hover:text-gold transition-colors"
            >
              View full gallery →
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <BeforeAfterSlider
                before={lightbox.before} after={lightbox.after}
                title={lightbox.title} beforeLabel={beforeLabel} afterLabel={afterLabel}
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">{lightbox.title}</p>
                  <p className="text-gray-400 text-sm">{lightbox.suburb} · {lightbox.service}</p>
                </div>
                <button onClick={() => setLightbox(null)} className="text-white/60 hover:text-white p-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

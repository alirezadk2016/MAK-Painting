"use client";

import { useTransition, useOptimistic, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { logoutAction, updateBookingAction, saveSiteConfigAction, uploadImageAction } from "../actions";
import type { Booking, BookingStatus } from "@/lib/db";
import type { SiteConfig, GalleryPair, PricingTier, ServiceCard, HeroPosition } from "@/lib/site-config";

// ─── Static defaults ──────────────────────────────────────────────────────────
const DEFAULT_SERVICES = [
  { id: "interior",         label: "Interior Painting",    defaultImg: "/living-room-after.jpg" },
  { id: "exterior",         label: "Exterior Painting",    defaultImg: "/pool-area.jpg" },
  { id: "roof",             label: "Roof Painting",        defaultImg: "/deck-exterior-after.jpg" },
  { id: "commercial",       label: "Commercial & Strata",  defaultImg: "/interior-timber-ceiling.jpg" },
  { id: "special-finishes", label: "Special Finishes",     defaultImg: "/feature-wall-lilac.jpg" },
  { id: "repaints",         label: "Repaints & Touch-ups", defaultImg: "/kitchen-after.jpg" },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<BookingStatus, string> = {
  pending:   "bg-amber-100 text-amber-800 border-amber-200",
  approved:  "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100  text-red-700   border-red-200",
};
const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending", approved: "Approved", cancelled: "Cancelled",
};

function fmt(d: string, opts?: Intl.DateTimeFormatOptions) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-AU", opts ?? { weekday:"short", day:"numeric", month:"short", year:"numeric" }); }
  catch { return d; }
}
function fmtTime(d: string) {
  try { return new Date(d).toLocaleTimeString("en-AU", { hour:"2-digit", minute:"2-digit" }); }
  catch { return ""; }
}
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }

// ─── Upload button ─────────────────────────────────────────────────────────────
function UploadBtn({ onDone, label = "Upload", small = false }: {
  onDone: (url: string) => void; label?: string; small?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    start(async () => {
      try { onDone((await uploadImageAction(fd)).url); }
      catch (ex) { setErr(ex instanceof Error ? ex.message : "Upload failed"); }
      finally { if (ref.current) ref.current.value = ""; }
    });
  }

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} />
      <button onClick={() => ref.current?.click()} disabled={pending}
        className={`inline-flex items-center gap-1.5 font-bold rounded-xl transition-colors disabled:opacity-60 ${
          small ? "text-xs px-3 py-1.5 bg-[#c9a24b]/10 hover:bg-[#c9a24b]/20 text-[#c9a24b]"
                : "text-sm px-4 py-2.5 bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a]"
        }`}>
        {pending
          ? <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>
          : <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none"><path d="M10 3v10M6 7l4-4 4 4M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }
        {pending ? "Uploading…" : label}
      </button>
      {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
    </div>
  );
}

// ─── Clickable image upload overlay ─────────────────────────────────────────
function UploadableImg({ src, className = "", onDone }: { src: string; className?: string; onDone: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    start(async () => {
      try {
        const { url } = await uploadImageAction(fd);
        setFailed(false);
        onDone(url);
      } catch { /* UploadBtn shows error, this is silent */ }
      finally { if (ref.current) ref.current.value = ""; }
    });
  }

  return (
    <div className={`relative group cursor-pointer overflow-hidden bg-gray-100 rounded-xl ${className}`} onClick={() => ref.current?.click()}>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} />
      {src && !failed ? (
        <Image src={src} alt="" fill className="object-cover" onError={() => setFailed(true)}
          sizes="300px" unoptimized={src.startsWith("http")} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      {/* Hover overlay */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity ${pending ? "opacity-100 bg-black/60" : "opacity-0 group-hover:opacity-100 bg-black/50"}`}>
        {pending
          ? <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>
          : <>
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"><path d="M12 4v12M8 8l4-4 4 4M4 18v1a1 1 0 001 1h14a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="text-white text-xs font-bold">Click to replace</span>
            </>
        }
      </div>
    </div>
  );
}

// ─── Image with fallback ──────────────────────────────────────────────────────
function Img({ src, className = "" }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return (
    <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
      <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <Image src={src} alt="" fill className="object-cover" onError={() => setFailed(true)} sizes="300px" unoptimized={src.startsWith("http")} />
    </div>
  );
}

// ─── Hero Image Editor (drag-on-image focal point) ────────────────────────────
function HeroImageEditor({ src, pos, onPosChange }: {
  src: string;
  pos: HeroPosition;
  onPosChange: (p: HeroPosition) => void;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFocal = useCallback((clientX: number, clientY: number) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)));
    onPosChange({ ...pos, x, y });
  }, [pos, onPosChange]);

  return (
    <div className="space-y-3">
      {/* Image with focal point drag */}
      <div
        ref={imgRef}
        className="relative rounded-xl overflow-hidden cursor-crosshair select-none bg-gray-100"
        style={{ aspectRatio: "4/5" }}
        onMouseDown={e => { dragging.current = true; updateFocal(e.clientX, e.clientY); }}
        onMouseMove={e => { if (dragging.current) updateFocal(e.clientX, e.clientY); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onTouchStart={e => { dragging.current = true; updateFocal(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchMove={e => { e.preventDefault(); if (dragging.current) updateFocal(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchEnd={() => { dragging.current = false; }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ objectFit: "cover", objectPosition: `${pos.x}% ${pos.y}%`,
              transform: pos.scale !== 1 ? `scale(${pos.scale})` : undefined, transformOrigin: "center center" }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        )}
        {/* Focal point crosshair */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: `${pos.x}%` }} />
          <div className="absolute left-0 right-0 h-px bg-white/40" style={{ top: `${pos.y}%` }} />
          <div className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#c9a24b] bg-white/20 backdrop-blur-sm"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, boxShadow: "0 0 0 3px rgba(201,162,75,0.4)" }} />
        </div>
        {/* Hint */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
          <span className="text-[10px] bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm font-medium">
            Drag to set focal point
          </span>
        </div>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
        <span className="text-xs font-bold text-gray-500 w-10 flex-shrink-0">Zoom</span>
        <input type="range" min="100" max="200" step="5"
          value={Math.round(pos.scale * 100)}
          onChange={e => onPosChange({ ...pos, scale: Number(e.target.value) / 100 })}
          className="flex-1 accent-[#c9a24b] h-1.5" />
        <span className="text-xs font-bold text-[#c9a24b] w-8 text-right">{pos.scale.toFixed(2)}×</span>
        {pos.scale !== 1 && (
          <button onClick={() => onPosChange({ ...pos, scale: 1 })}
            className="text-[10px] text-gray-400 hover:text-gray-600 font-bold">↺</button>
        )}
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHead({ letter, title, sub, action }: { letter: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#c9a24b] rounded-lg flex items-center justify-center text-[#1a1a1a] font-black text-sm">{letter}</div>
        <div>
          <p className="text-white font-black text-sm leading-tight">{title}</p>
          {sub && <p className="text-[#6b7280] text-xs">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props { bookings: Booking[]; config: SiteConfig; hasBlobToken: boolean; }

export function DashboardClient({ bookings, config: initialConfig, hasBlobToken }: Props) {
  const [tab, setTab]           = useState<"bookings" | "media" | "pricing">("bookings");
  const [view, setView]         = useState<"calendar" | "list">("calendar");
  const [filter, setFilter]     = useState<"all" | BookingStatus>("all");
  const [calYear, setCalYear]   = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selected, setSelected] = useState<Booking | null>(null);
  const [saved, setSaved]       = useState(false);
  const [isPending, start]      = useTransition();

  // Optimistic booking statuses
  const [optimisticBookings, updateOptimistic] = useOptimistic(
    bookings,
    (state, { id, status }: { id: string; status: BookingStatus }) =>
      state.map(b => b.id === id ? { ...b, status } : b)
  );

  // Site config state
  const [cfg, setCfg] = useState<SiteConfig>(initialConfig);
  const [dirty, setDirty] = useState(false);

  // Service cards derived from config (fall back to DEFAULT_SERVICES)
  const defaultServiceCards: ServiceCard[] = DEFAULT_SERVICES.map(s => ({
    id: s.id, label: s.label, img: cfg.services[s.id] ?? s.defaultImg, slug: s.id,
  }));
  const serviceCards: ServiceCard[] = cfg.serviceCards ?? defaultServiceCards;

  // Service card modal
  const [svcModal, setSvcModal] = useState<{ mode: "add" | "edit"; idx?: number } | null>(null);
  const [svcForm, setSvcForm] = useState<ServiceCard>({ id: "", label: "", img: "", slug: "" });

  function openAddService() {
    setSvcForm({ id: `custom-${Date.now()}`, label: "", img: "", slug: "" });
    setSvcModal({ mode: "add" });
  }
  function openEditService(card: ServiceCard, idx: number) {
    setSvcForm({ ...card });
    setSvcModal({ mode: "edit", idx });
  }
  function deleteService(idx: number) {
    if (!confirm("Remove this service card?")) return;
    const next = serviceCards.filter((_, i) => i !== idx);
    persist({ ...cfg, serviceCards: next });
  }
  function moveService(idx: number, dir: -1 | 1) {
    const arr = [...serviceCards];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    persist({ ...cfg, serviceCards: arr });
  }
  function saveService() {
    if (!svcForm.label || !svcForm.img) return;
    const next = svcModal?.mode === "add"
      ? [...serviceCards, svcForm]
      : serviceCards.map((c, i) => i === svcModal!.idx ? svcForm : c);
    persist({ ...cfg, serviceCards: next });
    setSvcModal(null);
  }

  // Gallery modal
  const [gModal, setGModal] = useState<{ mode: "add" | "edit"; id?: number } | null>(null);
  const [gForm, setGForm]   = useState({ title: "", before: "", after: "" });

  // Pricing modal
  const [pModal, setPModal]         = useState<{ tier: PricingTier; idx: number } | null>(null);
  const [pForm, setPForm]           = useState<PricingTier | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [editingFeatureIdx, setEditingFeatureIdx] = useState<number | null>(null);
  const [editingFeatureVal, setEditingFeatureVal] = useState("");

  function persist(next: SiteConfig) {
    setCfg(next);
    setDirty(true);
  }

  function handleSave() {
    const snapshot = cfg;
    start(async () => {
      await saveSiteConfigAction(snapshot);
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  // ── Booking ──
  function changeStatus(id: string, status: BookingStatus) {
    start(async () => {
      updateOptimistic({ id, status });
      const updated = await updateBookingAction(id, status);
      if (selected?.id === id) setSelected(updated);
    });
  }

  // ── Media ──
  function setHero(url: string) { persist({ ...cfg, hero: url }); }
  function setHeroPosition(pos: HeroPosition) { persist({ ...cfg, heroPosition: pos }); }
  const heroPos: HeroPosition = cfg.heroPosition ?? { x: 50, y: 50, scale: 1 };

  // ── Gallery ──
  function moveGallery(id: number, dir: -1 | 1) {
    const idx = cfg.gallery.findIndex(p => p.id === id);
    if (idx < 0) return;
    const arr = [...cfg.gallery];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    persist({ ...cfg, gallery: arr });
  }
  function deleteGallery(id: number) {
    if (!confirm("Delete this pair?")) return;
    persist({ ...cfg, gallery: cfg.gallery.filter(p => p.id !== id) });
  }
  function openAddGallery() {
    setGForm({ title: "", before: "", after: "" });
    setGModal({ mode: "add" });
  }
  function openEditGallery(pair: GalleryPair) {
    setGForm({ title: pair.title, before: pair.before, after: pair.after });
    setGModal({ mode: "edit", id: pair.id });
  }
  function saveGallery() {
    if (!gForm.title || !gForm.before || !gForm.after) return;
    const next = gModal?.mode === "add"
      ? { ...cfg, gallery: [...cfg.gallery, { id: Math.max(0, ...cfg.gallery.map(p => p.id)) + 1, ...gForm }] }
      : { ...cfg, gallery: cfg.gallery.map(p => p.id === gModal!.id ? { ...p, ...gForm } : p) };
    persist(next);
    setGModal(null);
  }

  // ── Pricing ──
  function openEditPricing(tier: PricingTier, idx: number) {
    setPForm({ ...tier, features: [...tier.features] });
    setPModal({ tier, idx });
  }
  function savePricing() {
    if (!pForm || pModal === null) return;
    const pricing = cfg.pricing.map((t, i) => i === pModal.idx ? pForm : t);
    persist({ ...cfg, pricing });
    setPModal(null);
    setPForm(null);
  }
  function addFeature() {
    if (!pForm || !newFeature.trim()) return;
    setPForm({ ...pForm, features: [...pForm.features, newFeature.trim()] });
    setNewFeature("");
  }
  function removeFeature(fi: number) {
    if (!pForm) return;
    setPForm({ ...pForm, features: pForm.features.filter((_, i) => i !== fi) });
  }
  function moveFeature(fi: number, dir: -1 | 1) {
    if (!pForm) return;
    const arr = [...pForm.features];
    const swap = fi + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[fi], arr[swap]] = [arr[swap], arr[fi]];
    setPForm({ ...pForm, features: arr });
  }
  function startEditFeature(fi: number, val: string) {
    setEditingFeatureIdx(fi);
    setEditingFeatureVal(val);
  }
  function commitEditFeature() {
    if (!pForm || editingFeatureIdx === null) return;
    const trimmed = editingFeatureVal.trim();
    if (trimmed) {
      const arr = [...pForm.features];
      arr[editingFeatureIdx] = trimmed;
      setPForm({ ...pForm, features: arr });
    }
    setEditingFeatureIdx(null);
    setEditingFeatureVal("");
  }

  // ── Calendar ──
  const days  = daysInMonth(calYear, calMonth);
  const first = firstDayOfMonth(calYear, calMonth);
  const monthLabel = new Date(calYear, calMonth, 1).toLocaleDateString("en-AU", { month: "long", year: "numeric" });
  const todayStr   = new Date().toISOString().slice(0, 10);
  const byDay: Record<string, Booking[]> = {};
  for (const b of optimisticBookings) {
    if (b.date) { const d = b.date.slice(0,10); (byDay[d] ??= []).push(b); }
  }
  const filtered = filter === "all" ? optimisticBookings : optimisticBookings.filter(b => b.status === filter);
  const stats = {
    total:     optimisticBookings.length,
    pending:   optimisticBookings.filter(b => b.status === "pending").length,
    approved:  optimisticBookings.filter(b => b.status === "approved").length,
    cancelled: optimisticBookings.filter(b => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Header */}
      <header className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#c9a24b] rounded-xl flex items-center justify-center">
            <span className="text-[#1a1a1a] font-black text-sm">M</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">MAK Painting</p>
            <p className="text-[#6b7280] text-xs">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isPending && <span className="text-[#c9a24b] text-xs flex items-center gap-1.5"><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>Saving…</span>}
          {saved && !isPending && <span className="text-green-400 text-xs flex items-center gap-1.5"><svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Saved</span>}
          {dirty && !isPending && (
            <div className="flex items-center gap-2">
              <button onClick={() => { setCfg(initialConfig); setDirty(false); }}
                className="text-xs font-bold text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
                Discard
              </button>
              <button onClick={handleSave}
                className="flex items-center gap-1.5 bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a] font-black text-xs px-4 py-1.5 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Save Changes
              </button>
            </div>
          )}
          <form action={logoutAction}>
            <button className="text-[#6b7280] hover:text-white text-xs font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">Sign out</button>
          </form>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[#1a1a1a] border-t border-white/5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex gap-0.5">
          {([
            { key: "bookings", label: "Bookings",       icon: "📅" },
            { key: "media",    label: "Media",          icon: "🖼" },
            { key: "pricing",  label: "Pricing",        icon: "💰" },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-colors ${
                tab === t.key ? "text-[#c9a24b] border-[#c9a24b]" : "text-[#6b7280] border-transparent hover:text-white"
              }`}>
              <span className="text-base">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blob warning */}
      {!hasBlobToken && tab === "media" && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3">
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <p className="text-xs text-amber-700 font-medium">
            <strong>Image uploads are in demo mode.</strong> Add <code className="bg-amber-100 px-1 rounded">BLOB_READ_WRITE_TOKEN</code> to Vercel environment variables to enable real uploads. Images won&apos;t be saved until then.
          </p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── BOOKINGS ── */}
        {tab === "bookings" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total",     value: stats.total,     color: "#6b7280" },
                { label: "Pending",   value: stats.pending,   color: "#d97706" },
                { label: "Approved",  value: stats.approved,  color: "#16a34a" },
                { label: "Cancelled", value: stats.cancelled, color: "#dc2626" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{s.label}</p>
                  <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {(["calendar","list"] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    view === v ? "bg-[#1a1a1a] text-[#c9a24b]" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                  }`}>
                  {v === "calendar" ? "📅 Calendar" : "☰ List"}
                </button>
              ))}
              {view === "list" && (
                <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
                  className="ms-auto bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none">
                  <option value="all">All bookings</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
            </div>

            {view === "calendar" && (
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
                {/* Calendar header */}
                <div className="flex items-center justify-between px-6 py-5"
                  style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" }}>
                  <button
                    onClick={() => calMonth === 0 ? (setCalMonth(11), setCalYear(y => y-1)) : setCalMonth(m => m-1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div className="text-center">
                    <h2 className="font-black text-white text-lg tracking-tight">{monthLabel}</h2>
                    <div className="flex items-center justify-center gap-3 mt-1">
                      {[
                        { color: "#d97706", label: `${stats.pending} pending` },
                        { color: "#16a34a", label: `${stats.approved} approved` },
                      ].map(s => (
                        <span key={s.label} className="text-[10px] font-bold flex items-center gap-1" style={{ color: s.color }}>
                          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: s.color }} />
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => calMonth === 11 ? (setCalMonth(0), setCalYear(y => y+1)) : setCalMonth(m => m+1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 bg-[#f9fafb] border-b border-gray-100">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                    <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 bg-white">
                  {Array.from({ length: first }).map((_,i) => (
                    <div key={`e${i}`} className="min-h-[100px] border-b border-r border-gray-50 bg-gray-50/40" />
                  ))}
                  {Array.from({ length: days }).map((_,i) => {
                    const day = i + 1;
                    const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const dayBs = byDay[ds] ?? [];
                    const isToday = ds === todayStr;
                    const hasPending   = dayBs.some(b => b.status === "pending");
                    const hasApproved  = dayBs.some(b => b.status === "approved");
                    return (
                      <div key={day}
                        className={`min-h-[100px] border-b border-r border-gray-50 p-2 transition-colors ${
                          isToday ? "bg-amber-50/70" : dayBs.length > 0 ? "hover:bg-gray-50/80" : ""
                        }`}
                      >
                        {/* Day number */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                            isToday
                              ? "bg-[#c9a24b] text-[#1a1a1a] shadow-sm"
                              : dayBs.length > 0 ? "text-[#1a1a1a]" : "text-gray-300"
                          }`}>{day}</span>
                          {dayBs.length > 1 && (
                            <span className="text-[9px] font-black text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5">{dayBs.length}</span>
                          )}
                        </div>

                        {/* Status dots strip */}
                        {dayBs.length > 0 && (
                          <div className="flex gap-0.5 mb-1.5">
                            {hasPending  && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                            {hasApproved && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                          </div>
                        )}

                        {/* Booking pills */}
                        <div className="space-y-0.5">
                          {dayBs.slice(0, 2).map(b => (
                            <button key={b.id} onClick={() => setSelected(b)}
                              className={`w-full text-start text-[10px] font-bold px-2 py-1 rounded-lg truncate transition-all hover:opacity-80 active:scale-95 ${
                                b.status === "approved"  ? "bg-green-50  text-green-700  border border-green-200" :
                                b.status === "cancelled" ? "bg-red-50    text-red-600    border border-red-100 opacity-60" :
                                                           "bg-amber-50  text-amber-800  border border-amber-200"
                              }`}>
                              {b.name.split(" ")[0]}
                            </button>
                          ))}
                          {dayBs.length > 2 && (
                            <button onClick={() => setSelected(dayBs[2])}
                              className="w-full text-[9px] font-bold text-gray-400 hover:text-gray-600 text-center py-0.5 transition-colors">
                              +{dayBs.length - 2} more
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {view === "list" && (
              <div className="space-y-2">
                {filtered.length === 0
                  ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                      <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <p className="text-sm text-gray-400 font-medium">No bookings found</p>
                    </div>
                  )
                  : filtered.map(b => (
                    <button key={b.id} onClick={() => setSelected(b)}
                      className="w-full bg-white rounded-2xl border text-start transition-all group hover:shadow-md active:scale-[0.995]"
                      style={{ borderColor: b.status === "pending" ? "#fde68a" : b.status === "approved" ? "#bbf7d0" : "#fecaca" }}>
                      <div className="flex items-center gap-4 px-5 py-4">
                        {/* Status indicator strip */}
                        <div className={`w-1 h-10 rounded-full flex-shrink-0 ${
                          b.status === "approved"  ? "bg-green-500" :
                          b.status === "cancelled" ? "bg-red-400" : "bg-amber-400"
                        }`} />
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${
                          b.status === "approved"  ? "bg-green-50 text-green-700" :
                          b.status === "cancelled" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-700"
                        }`}>
                          {b.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#1a1a1a] truncate group-hover:text-[#c9a24b] transition-colors">{b.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{b.postcode} · {b.scope || b.service || "General enquiry"}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[b.status]}`}>{STATUS_LABEL[b.status]}</span>
                          <p className="text-[10px] text-gray-400 mt-1">{fmt(b.date, { day:"numeric", month:"short" })}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-[#c9a24b] transition-colors flex-shrink-0" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </button>
                  ))
                }
              </div>
            )}
          </>
        )}

        {/* ── MEDIA ── */}
        {tab === "media" && (
          <div className="space-y-8">
            {/* Hero */}
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <SectionHead letter="H" title="Hero Image" sub="Main banner at top of homepage"
                action={<UploadBtn label="Replace Image" onDone={setHero} small />} />
              <div className="p-5">
                <div className="flex gap-5 items-start">
                  {/* Drag-on-image editor — same 4/5 ratio as the live site */}
                  <div className="w-44 flex-shrink-0">
                    <HeroImageEditor src={cfg.hero} pos={heroPos} onPosChange={setHeroPosition} />
                  </div>
                  <div className="flex-1 pt-1 space-y-3">
                    <p className="text-xs font-bold text-gray-700">How to adjust</p>
                    <ul className="space-y-1.5 text-xs text-gray-500">
                      <li className="flex items-start gap-2"><span className="text-[#c9a24b] font-bold mt-0.5">→</span>Drag the crosshair on the image to set which part stays visible</li>
                      <li className="flex items-start gap-2"><span className="text-[#c9a24b] font-bold mt-0.5">→</span>Use the Zoom slider to zoom in/out</li>
                      <li className="flex items-start gap-2"><span className="text-[#c9a24b] font-bold mt-0.5">→</span>The preview matches the exact shape shown on your site</li>
                    </ul>
                    <button onClick={() => setHeroPosition({ x: 50, y: 50, scale: 1 })}
                      className="text-xs text-gray-400 hover:text-gray-700 font-bold transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-400">
                      ↺ Reset to default
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <SectionHead
                letter="S" title="Service Images" sub={`${serviceCards.length} service cards on homepage`}
                action={
                  <button onClick={openAddService}
                    className="flex items-center gap-1.5 bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a] text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Add Service
                  </button>
                }
              />
              <div className="divide-y divide-gray-50">
                {serviceCards.length === 0
                  ? <p className="text-center text-gray-400 text-sm py-12">No service cards.</p>
                  : serviceCards.map((card, idx) => (
                    <div key={card.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <UploadableImg src={card.img} className="w-20 h-16 flex-shrink-0"
                          onDone={url => {
                            const next = serviceCards.map((c, i) => i === idx ? { ...c, img: url } : c);
                            persist({ ...cfg, serviceCards: next });
                          }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1a1a1a] truncate">{card.label}</p>
                          <p className="text-xs text-gray-400 truncate">{card.img.split("/").pop()}</p>
                          {card.slug && <p className="text-xs text-[#c9a24b] mt-0.5">/services/{card.slug}</p>}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button onClick={() => moveService(idx, -1)} disabled={idx === 0}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 disabled:opacity-30 transition-colors text-gray-500">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button onClick={() => moveService(idx, 1)} disabled={idx === serviceCards.length - 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 disabled:opacity-30 transition-colors text-gray-500">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button onClick={() => openEditService(card, idx)} className="text-xs font-bold text-[#c9a24b] bg-[#c9a24b]/10 hover:bg-[#c9a24b]/20 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                          <button onClick={() => deleteService(idx)} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </section>

            {/* Gallery */}
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <SectionHead
                letter="G" title="Before & After Gallery"
                sub={`${cfg.gallery.length} pairs`}
                action={
                  <button onClick={openAddGallery}
                    className="flex items-center gap-1.5 bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a] text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Add Pair
                  </button>
                }
              />
              <div className="divide-y divide-gray-50">
                {cfg.gallery.length === 0
                  ? <p className="text-center text-gray-400 text-sm py-12">No pairs yet.</p>
                  : cfg.gallery.map((pair, idx) => (
                    <div key={pair.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-[#1a1a1a] text-[#c9a24b] rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">{idx+1}</span>
                          <p className="font-bold text-sm text-[#1a1a1a]">{pair.title}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => moveGallery(pair.id, -1)} disabled={idx === 0}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 disabled:opacity-30 transition-colors text-gray-500">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button onClick={() => moveGallery(pair.id, 1)} disabled={idx === cfg.gallery.length - 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 disabled:opacity-30 transition-colors text-gray-500">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button onClick={() => openEditGallery(pair)} className="text-xs font-bold text-[#c9a24b] bg-[#c9a24b]/10 hover:bg-[#c9a24b]/20 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                          <button onClick={() => deleteGallery(pair.id)} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(["before","after"] as const).map(k => (
                          <div key={k}>
                            <p className={`text-xs font-bold mb-1.5 uppercase tracking-wide ${k === "before" ? "text-red-400" : "text-green-500"}`}>{k}</p>
                            <UploadableImg src={pair[k]} className="w-full h-36"
                              onDone={url => {
                                const next = cfg.gallery.map(p => p.id === pair.id ? { ...p, [k]: url } : p);
                                persist({ ...cfg, gallery: next });
                              }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                }
              </div>
            </section>
          </div>
        )}

        {/* ── PRICING ── */}
        {tab === "pricing" && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex gap-3 items-start">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 9v5M10 7v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              <p className="text-sm text-blue-700">Click <strong>Edit</strong> on any tier to change the name, price label, description, and features. Changes go live on the site immediately.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {cfg.pricing.map((tier, idx) => (
                <div key={tier.id} className={`rounded-2xl border overflow-hidden shadow-sm ${tier.popular ? "border-[#c9a24b]/50" : "border-gray-100"}`}>
                  {tier.popular && (
                    <div className="bg-[#c9a24b] px-4 py-1.5 text-center">
                      <span className="text-[#1a1a1a] text-xs font-black uppercase tracking-wide">⭐ Most Popular</span>
                    </div>
                  )}
                  <div className={`p-5 ${tier.popular ? "bg-[#1a1a1a]" : "bg-white"}`}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className={`font-black text-base ${tier.popular ? "text-white" : "text-[#1a1a1a]"}`}>{tier.name}</p>
                        <p className={`text-xs mt-0.5 ${tier.popular ? "text-gray-400" : "text-gray-500"}`}>{tier.desc}</p>
                      </div>
                      <button onClick={() => openEditPricing(tier, idx)}
                        className="flex-shrink-0 text-xs font-bold bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a] px-3 py-1.5 rounded-lg transition-colors">
                        Edit
                      </button>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold mb-4 ${
                      tier.popular ? "bg-white/10 text-white" : "bg-blue-50 text-[#1a1a1a] border border-blue-200"
                    }`}>
                      💰 {tier.priceLabel || "Pricing coming soon"}
                    </div>

                    <ul className="space-y-1.5">
                      {tier.features.map(f => (
                        <li key={f} className={`flex items-start gap-2 text-xs ${tier.popular ? "text-gray-300" : "text-gray-600"}`}>
                          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#c9a24b]" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Booking modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a1a1a] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[#c9a24b] text-xs font-bold uppercase tracking-widest mb-0.5">Booking Detail</p>
                <h2 className="text-white font-black text-lg">{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white p-1">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_STYLE[selected.status]}`}>{STATUS_LABEL[selected.status]}</span>
                <span className="text-xs text-gray-400">ID: {selected.id.slice(0,12)}…</span>
              </div>
              {([
                ["Name", selected.name], ["Phone", selected.phone], ["Email", selected.email],
                ["Suburb / Postcode", selected.postcode], ["Property Type", selected.propertyType], ["Scope", selected.scope],
                ["Preferred Date", fmt(selected.date)],
                selected.rooms   ? ["Rooms",   selected.rooms]                   : null,
                selected.sqm     ? ["Area",    `${selected.sqm} m²`]             : null,
                selected.extras?.length ? ["Extras", selected.extras.join(", ")] : null,
                selected.service ? ["Service", selected.service]                 : null,
                selected.message ? ["Notes",   selected.message]                 : null,
                ["Submitted", `${fmt(selected.createdAt)} ${fmtTime(selected.createdAt)}`],
              ] as (string[] | null)[]).filter(Boolean).map(row => (
                <div key={row![0]} className="flex gap-3 text-sm">
                  <span className="w-36 flex-shrink-0 text-gray-400 font-medium">{row![0]}</span>
                  <span className="text-[#1a1a1a] font-semibold break-all">{row![1]}</span>
                </div>
              ))}
            </div>
            {selected.status !== "cancelled" && (
              <div className="px-6 pb-6 flex gap-3">
                {selected.status !== "approved" && (
                  <button onClick={() => changeStatus(selected.id, "approved")} disabled={isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-xl py-3 text-sm transition-colors">
                    ✓ Approve
                  </button>
                )}
                <button onClick={() => { if (confirm(`Cancel booking for ${selected.name}?`)) changeStatus(selected.id, "cancelled"); }}
                  disabled={isPending}
                  className="flex-1 bg-red-100 hover:bg-red-200 disabled:opacity-60 text-red-700 font-bold rounded-xl py-3 text-sm transition-colors">
                  ✕ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Service modal ── */}
      {svcModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSvcModal(null)}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a1a1a] px-6 py-5 flex items-center justify-between">
              <p className="text-white font-black">{svcModal.mode === "add" ? "Add Service Card" : "Edit Service Card"}</p>
              <button onClick={() => setSvcModal(null)} className="text-white/60 hover:text-white"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Label</label>
                <input value={svcForm.label} onChange={e => setSvcForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="e.g. Roof Painting"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a24b]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Service Page Slug (optional)</label>
                <input value={svcForm.slug ?? ""} onChange={e => setSvcForm(f => ({ ...f, slug: e.target.value || undefined }))}
                  placeholder="e.g. roof (links to /services/roof)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a24b]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Image</label>
                {svcForm.img && <Img src={svcForm.img} className="w-full h-36 rounded-xl mb-2" />}
                <UploadBtn small label="Upload Image" onDone={url => setSvcForm(f => ({ ...f, img: url }))} />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setSvcModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-3 text-sm">Cancel</button>
              <button onClick={saveService} disabled={!svcForm.label || !svcForm.img || isPending}
                className="flex-1 bg-[#c9a24b] hover:bg-[#b8913a] disabled:opacity-50 text-[#1a1a1a] font-bold rounded-xl py-3 text-sm transition-colors">
                {svcModal.mode === "add" ? "Add Card" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Gallery modal ── */}
      {gModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setGModal(null)}>
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a1a1a] px-6 py-5 flex items-center justify-between">
              <p className="text-white font-black">{gModal.mode === "add" ? "Add Gallery Pair" : "Edit Gallery Pair"}</p>
              <button onClick={() => setGModal(null)} className="text-white/60 hover:text-white"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Title</label>
                <input value={gForm.title} onChange={e => setGForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Living Room Repaint"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a24b] transition-colors" />
              </div>
              {(["before","after"] as const).map(k => (
                <div key={k}>
                  <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${k === "before" ? "text-red-400" : "text-green-500"}`}>{k} Image</label>
                  {gForm[k] && <Img src={gForm[k]} className="w-full h-36 rounded-xl mb-2" />}
                  <UploadBtn small label={`Upload ${k}`} onDone={url => setGForm(f => ({ ...f, [k]: url }))} />
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setGModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-3 text-sm">Cancel</button>
              <button onClick={saveGallery} disabled={!gForm.title || !gForm.before || !gForm.after || isPending}
                className="flex-1 bg-[#c9a24b] hover:bg-[#b8913a] disabled:opacity-50 text-[#1a1a1a] font-bold rounded-xl py-3 text-sm transition-colors">
                {gModal.mode === "add" ? "Add Pair" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pricing modal ── */}
      {pModal && pForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPModal(null)}>
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a1a1a] px-6 py-5 flex items-center justify-between flex-shrink-0">
              <p className="text-white font-black">Edit Pricing Tier</p>
              <button onClick={() => setPModal(null)} className="text-white/60 hover:text-white"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5 flex-1">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Tier Name</label>
                <input value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a24b] transition-colors" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <input value={pForm.desc} onChange={e => setPForm({ ...pForm, desc: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a24b] transition-colors" />
              </div>

              {/* Price label */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Price Label</label>
                <input value={pForm.priceLabel} onChange={e => setPForm({ ...pForm, priceLabel: e.target.value })}
                  placeholder="e.g. From $3,800 or Pricing coming soon"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a24b] transition-colors" />
                <p className="text-xs text-gray-400 mt-1">This text appears as the price on the site</p>
              </div>

              {/* Popular toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">Most Popular</p>
                  <p className="text-xs text-gray-500">Highlights this tier with a dark background</p>
                </div>
                <button onClick={() => setPForm({ ...pForm, popular: !pForm.popular })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${pForm.popular ? "bg-[#c9a24b]" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${pForm.popular ? "left-6.5 translate-x-0.5" : "left-0.5"}`} />
                </button>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Features ({pForm.features.length})</label>
                <div className="space-y-2 mb-3">
                  {pForm.features.map((f, fi) => (
                    <div key={fi} className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-colors ${
                      editingFeatureIdx === fi ? "bg-white border-[#c9a24b] shadow-sm" : "bg-gray-50 border-gray-100 hover:border-gray-200"
                    }`}>
                      {/* Reorder arrows */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button onClick={() => moveFeature(fi, -1)} disabled={fi === 0} className="disabled:opacity-30 text-gray-400 hover:text-gray-600">
                          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => moveFeature(fi, 1)} disabled={fi === pForm.features.length - 1} className="disabled:opacity-30 text-gray-400 hover:text-gray-600">
                          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>

                      {/* Inline text edit */}
                      {editingFeatureIdx === fi ? (
                        <input
                          autoFocus
                          value={editingFeatureVal}
                          onChange={e => setEditingFeatureVal(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commitEditFeature(); } if (e.key === "Escape") { setEditingFeatureIdx(null); } }}
                          onBlur={commitEditFeature}
                          className="flex-1 text-sm bg-transparent outline-none text-gray-800 font-medium"
                        />
                      ) : (
                        <span
                          className="text-sm text-gray-700 flex-1 cursor-text hover:text-[#1a1a1a] transition-colors"
                          onClick={() => startEditFeature(fi, f)}
                          title="Click to edit"
                        >{f}</span>
                      )}

                      {/* Edit / confirm button */}
                      {editingFeatureIdx === fi ? (
                        <button onClick={commitEditFeature} className="text-[#c9a24b] hover:text-[#b8913a] flex-shrink-0" title="Save">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      ) : (
                        <button onClick={() => startEditFeature(fi, f)} className="text-gray-300 hover:text-[#c9a24b] flex-shrink-0 transition-colors" title="Edit text">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M11 2.5l2.5 2.5L5 13.5H2.5V11L11 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      )}

                      {/* Delete */}
                      <button onClick={() => removeFeature(fi)} className="text-red-300 hover:text-red-500 flex-shrink-0 transition-colors" title="Remove">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newFeature} onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="Add a feature…"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#c9a24b] transition-colors" />
                  <button onClick={addFeature} disabled={!newFeature.trim()}
                    className="bg-[#c9a24b] hover:bg-[#b8913a] disabled:opacity-40 text-[#1a1a1a] font-bold text-sm px-4 py-2 rounded-xl transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
              <button onClick={() => setPModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-3 text-sm">Cancel</button>
              <button onClick={savePricing} disabled={!pForm.name || isPending}
                className="flex-1 bg-[#c9a24b] hover:bg-[#b8913a] disabled:opacity-50 text-[#1a1a1a] font-bold rounded-xl py-3 text-sm transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

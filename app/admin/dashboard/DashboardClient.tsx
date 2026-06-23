"use client";

import { useTransition, useOptimistic, useState, useRef } from "react";
import Image from "next/image";
import { logoutAction, updateBookingAction, saveMediaAction, uploadImageAction } from "../actions";
import type { Booking, BookingStatus } from "@/lib/db";
import type { MediaConfig } from "@/lib/site-config";

// ─── Static defaults ──────────────────────────────────────────────────────────
const DEFAULT_SERVICES = [
  { id: "interior",        label: "Interior Painting",    defaultImg: "/living-room-after.jpg" },
  { id: "exterior",        label: "Exterior Painting",    defaultImg: "/pool-area.jpg" },
  { id: "roof",            label: "Roof Painting",        defaultImg: "/deck-exterior-after.jpg" },
  { id: "commercial",      label: "Commercial & Strata",  defaultImg: "/interior-timber-ceiling.jpg" },
  { id: "special-finishes",label: "Special Finishes",     defaultImg: "/feature-wall-lilac.jpg" },
  { id: "repaints",        label: "Repaints & Touch-ups", defaultImg: "/kitchen-after.jpg" },
] as const;

const DEFAULT_GALLERY = [
  { id: 1, title: "Lounge Room — Timber Ceiling",  before: "/lounge-before.jpg",         after: "/lounge-after.jpg" },
  { id: 2, title: "Exterior Render & Repaint",     before: "/exterior-render.jpg",        after: "/exterior-terrace.jpg" },
  { id: 3, title: "Front Entry Door — Gloss Black",before: "/door-exterior-before.jpg",   after: "/door-exterior-after.jpg" },
  { id: 4, title: "Interior Door Respray",         before: "/door-interior-before.jpg",   after: "/door-interior-after.jpg" },
  { id: 5, title: "Bedroom Feature Wall",          before: "/feature-wall-undercoat.jpg", after: "/feature-wall-lilac.jpg" },
  { id: 6, title: "Water Damage Wall Repair",      before: "/wall-damage-before.jpg",     after: "/wall-repair-after.jpg" },
  { id: 7, title: "Ceiling Repair & Patch",        before: "/ceiling-cut-before.jpg",     after: "/ceiling-patch-after.jpg" },
];

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
function UploadBtn({ onDone, label = "Upload", small = false }: { onDone: (url: string) => void; label?: string; small?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, startUpload] = useTransition();
  const [err, setErr] = useState("");

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    startUpload(async () => {
      try {
        const result = await uploadImageAction(fd);
        onDone(result.url);
      } catch (ex) {
        setErr(ex instanceof Error ? ex.message : "Upload failed");
      } finally {
        if (ref.current) ref.current.value = "";
      }
    });
  }

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} />
      <button
        onClick={() => ref.current?.click()}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 font-bold rounded-xl transition-colors disabled:opacity-60 ${
          small
            ? "text-xs px-3 py-1.5 bg-[#c9a24b]/10 hover:bg-[#c9a24b]/20 text-[#c9a24b]"
            : "text-sm px-4 py-2.5 bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a]"
        }`}
      >
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

// ─── Safe image with fallback ──────────────────────────────────────────────────
function Img({ src, className = "" }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return (
    <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className}`}>No image</div>
  );
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <Image src={src} alt="" fill className="object-cover" onError={() => setFailed(true)} sizes="300px" unoptimized={src.startsWith("http")} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props {
  bookings: Booking[];
  savedMediaConfig: MediaConfig | null;
}

export function DashboardClient({ bookings, savedMediaConfig }: Props) {
  const [tab, setTab]           = useState<"bookings" | "media">("bookings");
  const [view, setView]         = useState<"calendar" | "list">("calendar");
  const [filter, setFilter]     = useState<"all" | BookingStatus>("all");
  const [calYear, setCalYear]   = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selected, setSelected] = useState<Booking | null>(null);
  const [saved, setSaved]       = useState(false);

  const [isPending, startTransition] = useTransition();

  // Optimistic booking statuses
  const [optimisticBookings, updateOptimistic] = useOptimistic(
    bookings,
    (state, { id, status }: { id: string; status: BookingStatus }) =>
      state.map(b => b.id === id ? { ...b, status } : b)
  );

  // Media config state
  const [media, setMedia] = useState<MediaConfig>({
    hero:    savedMediaConfig?.hero    ?? "/1.png",
    services: savedMediaConfig?.services ?? {},
    gallery: savedMediaConfig?.gallery?.length ? savedMediaConfig.gallery : DEFAULT_GALLERY,
  });

  // Gallery modal
  const [gModal, setGModal] = useState<{ mode: "add" | "edit"; id?: number } | null>(null);
  const [gForm, setGForm]   = useState({ title: "", before: "", after: "" });

  // ── Booking actions ──
  function changeStatus(id: string, status: BookingStatus) {
    startTransition(async () => {
      updateOptimistic({ id, status });
      const updated = await updateBookingAction(id, status);
      if (selected?.id === id) setSelected(updated);
    });
  }

  // ── Media actions ──
  function persistMedia(next: MediaConfig) {
    setMedia(next);
    startTransition(async () => {
      await saveMediaAction(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  function setHero(url: string) { persistMedia({ ...media, hero: url }); }
  function setService(id: string, url: string) {
    persistMedia({ ...media, services: { ...media.services, [id]: url } });
  }
  function deleteGallery(id: number) {
    if (!confirm("Delete this pair?")) return;
    persistMedia({ ...media, gallery: media.gallery.filter(p => p.id !== id) });
  }
  function openAdd() {
    setGForm({ title: "", before: "", after: "" });
    setGModal({ mode: "add" });
  }
  function openEdit(p: typeof DEFAULT_GALLERY[number]) {
    setGForm({ title: p.title, before: p.before, after: p.after });
    setGModal({ mode: "edit", id: p.id });
  }
  function saveGallery() {
    if (!gForm.title || !gForm.before || !gForm.after) return;
    const next = gModal?.mode === "add"
      ? { ...media, gallery: [...media.gallery, { id: Math.max(0, ...media.gallery.map(p => p.id)) + 1, ...gForm }] }
      : { ...media, gallery: media.gallery.map(p => p.id === gModal!.id ? { ...p, ...gForm } : p) };
    persistMedia(next);
    setGModal(null);
  }

  // ── Calendar helpers ──
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
      <header className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c9a24b] rounded-lg flex items-center justify-center">
            <span className="text-[#1a1a1a] font-black text-sm">M</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">MAK Painting</p>
            <p className="text-[#6b7280] text-xs">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isPending && <span className="text-[#c9a24b] text-xs flex items-center gap-1"><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>Saving…</span>}
          {saved && !isPending && <span className="text-green-400 text-xs flex items-center gap-1"><svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Saved</span>}
          <form action={logoutAction}>
            <button className="text-[#6b7280] hover:text-white text-xs font-semibold transition-colors">Sign out</button>
          </form>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[#1a1a1a] border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {(["bookings", "media"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors capitalize ${
                tab === t ? "text-[#c9a24b] border-[#c9a24b]" : "text-[#6b7280] border-transparent hover:text-white"
              }`}
            >
              {t === "bookings" ? "📅 Bookings" : "🖼 Media Manager"}
            </button>
          ))}
        </div>
      </div>

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
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
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
                  }`}
                >
                  {v === "calendar" ? "Calendar View" : "List View"}
                </button>
              ))}
              {view === "list" && (
                <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
                  className="ms-auto bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
                >
                  <option value="all">All bookings</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
            </div>

            {view === "calendar" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <button onClick={() => calMonth === 0 ? (setCalMonth(11), setCalYear(y => y-1)) : setCalMonth(m => m-1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-lg">‹</button>
                  <h2 className="font-black text-[#1a1a1a]">{monthLabel}</h2>
                  <button onClick={() => calMonth === 11 ? (setCalMonth(0), setCalYear(y => y+1)) : setCalMonth(m => m+1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-lg">›</button>
                </div>
                <div className="grid grid-cols-7 border-b border-gray-100">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                    <div key={d} className="py-2 text-center text-xs font-bold text-gray-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {Array.from({ length: first }).map((_,i) => (
                    <div key={`e${i}`} className="min-h-[100px] border-b border-r border-gray-100 bg-gray-50/50" />
                  ))}
                  {Array.from({ length: days }).map((_,i) => {
                    const day = i + 1;
                    const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const dayBs = byDay[ds] ?? [];
                    const isToday = ds === todayStr;
                    return (
                      <div key={day} className={`min-h-[100px] border-b border-r border-gray-100 p-2 ${isToday ? "bg-amber-50/50" : ""}`}>
                        <p className={`text-xs font-bold mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-[#c9a24b] text-[#1a1a1a]" : "text-gray-500"}`}>{day}</p>
                        <div className="space-y-1">
                          {dayBs.map(b => (
                            <button key={b.id} onClick={() => setSelected(b)}
                              className={`w-full text-start text-xs font-semibold px-2 py-1 rounded-lg border truncate hover:opacity-80 transition-opacity ${STATUS_STYLE[b.status]}`}>
                              {b.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {view === "list" && (
              <div className="space-y-3">
                {filtered.length === 0
                  ? <div className="text-center py-16 text-gray-400">No bookings found.</div>
                  : filtered.map(b => (
                    <button key={b.id} onClick={() => setSelected(b)}
                      className="w-full bg-white rounded-2xl border border-gray-100 p-5 text-start hover:border-[#c9a24b] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-[#1a1a1a]">{b.name}</p>
                          <p className="text-sm text-gray-500">{b.postcode} · {b.scope || b.service || "—"}</p>
                          <p className="text-xs text-gray-400 mt-1">{fmt(b.date)} · Received {fmt(b.createdAt)} {fmtTime(b.createdAt)}</p>
                        </div>
                        <span className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_STYLE[b.status]}`}>{STATUS_LABEL[b.status]}</span>
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
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-[#1a1a1a] px-6 py-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-[#c9a24b] rounded-lg flex items-center justify-center text-[#1a1a1a] text-xs font-black">H</div>
                <div>
                  <p className="text-white font-black text-sm">Hero Image</p>
                  <p className="text-[#6b7280] text-xs">Main banner at top of homepage</p>
                </div>
              </div>
              <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
                <Img src={media.hero} className="w-full sm:w-64 h-44 rounded-xl flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Current: <code className="bg-gray-100 px-1 py-0.5 rounded">{media.hero}</code></p>
                  <UploadBtn label="Replace Hero Image" onDone={setHero} />
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-[#1a1a1a] px-6 py-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-[#c9a24b] rounded-lg flex items-center justify-center text-[#1a1a1a] text-xs font-black">S</div>
                <div>
                  <p className="text-white font-black text-sm">Service Images</p>
                  <p className="text-[#6b7280] text-xs">One image per service card</p>
                </div>
              </div>
              <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {DEFAULT_SERVICES.map(svc => {
                  const cur = media.services[svc.id] ?? svc.defaultImg;
                  return (
                    <div key={svc.id} className="border border-gray-100 rounded-xl overflow-hidden">
                      <Img src={cur} className="w-full h-36" />
                      <div className="p-3">
                        <p className="text-xs font-bold text-[#1a1a1a] mb-0.5">{svc.label}</p>
                        <p className="text-xs text-gray-400 truncate mb-2">{cur}</p>
                        <UploadBtn small label="Replace" onDone={url => setService(svc.id, url)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Gallery */}
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-[#c9a24b] rounded-lg flex items-center justify-center text-[#1a1a1a] text-xs font-black">G</div>
                  <div>
                    <p className="text-white font-black text-sm">Before & After Gallery</p>
                    <p className="text-[#6b7280] text-xs">{media.gallery.length} pairs</p>
                  </div>
                </div>
                <button onClick={openAdd}
                  className="flex items-center gap-1.5 bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a] text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  Add Pair
                </button>
              </div>
              <div className="p-6 space-y-4">
                {media.gallery.length === 0
                  ? <p className="text-center text-gray-400 text-sm py-8">No pairs yet. Click "Add Pair".</p>
                  : media.gallery.map(pair => (
                    <div key={pair.id} className="border border-gray-100 rounded-xl p-4 hover:border-[#c9a24b]/30 transition-colors">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="font-bold text-sm text-[#1a1a1a]">{pair.title}</p>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(pair)} className="text-xs font-bold text-[#c9a24b] bg-[#c9a24b]/10 hover:bg-[#c9a24b]/20 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                          <button onClick={() => deleteGallery(pair.id)} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(["before","after"] as const).map(k => (
                          <div key={k}>
                            <p className="text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">{k}</p>
                            <Img src={pair[k]} className="w-full h-28 rounded-lg" />
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
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_STYLE[selected.status]}`}>{STATUS_LABEL[selected.status]}</span>
                <span className="text-xs text-gray-400">ID: {selected.id.slice(0,12)}…</span>
              </div>
              {([
                ["Name", selected.name],
                ["Phone", selected.phone],
                ["Email", selected.email],
                ["Suburb / Postcode", selected.postcode],
                ["Property Type", selected.propertyType],
                ["Scope", selected.scope],
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
                <button
                  onClick={() => { if (confirm(`Cancel booking for ${selected.name}?`)) changeStatus(selected.id, "cancelled"); }}
                  disabled={isPending}
                  className="flex-1 bg-red-100 hover:bg-red-200 disabled:opacity-60 text-red-700 font-bold rounded-xl py-3 text-sm transition-colors">
                  ✕ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Gallery modal ── */}
      {gModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setGModal(null)}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a1a1a] px-6 py-5 flex items-center justify-between">
              <p className="text-white font-black">{gModal.mode === "add" ? "Add Gallery Pair" : "Edit Gallery Pair"}</p>
              <button onClick={() => setGModal(null)} className="text-white/60 hover:text-white p-1">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
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
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{k} Image</label>
                  {gForm[k] && <Img src={gForm[k]} className="w-full h-32 rounded-xl mb-2" />}
                  <UploadBtn small label={`Upload ${k}`} onDone={url => setGForm(f => ({ ...f, [k]: url }))} />
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setGModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-3 text-sm">Cancel</button>
              <button onClick={saveGallery} disabled={!gForm.title || !gForm.before || !gForm.after || isPending}
                className="flex-1 bg-[#c9a24b] hover:bg-[#b8913a] disabled:opacity-50 text-[#1a1a1a] font-bold rounded-xl py-3 text-sm transition-colors">
                {isPending ? "Saving…" : gModal.mode === "add" ? "Add Pair" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

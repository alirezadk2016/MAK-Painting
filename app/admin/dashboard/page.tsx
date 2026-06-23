"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
type BookingStatus = "pending" | "approved" | "cancelled";
interface Booking {
  id: string;
  createdAt: string;
  status: BookingStatus;
  postcode: string;
  propertyType: string;
  scope: string;
  rooms: string;
  sqm: string;
  extras: string[];
  date: string;
  name: string;
  phone: string;
  email: string;
  service?: string;
  message?: string;
}

interface GalleryPair {
  id: number;
  title: string;
  before: string;
  after: string;
}

interface MediaConfig {
  hero: string;
  services: Record<string, string>;
  gallery: GalleryPair[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_SERVICES: { id: string; label: string; defaultImg: string }[] = [
  { id: "interior", label: "Interior Painting", defaultImg: "/living-room-after.jpg" },
  { id: "exterior", label: "Exterior Painting", defaultImg: "/pool-area.jpg" },
  { id: "roof", label: "Roof Painting", defaultImg: "/deck-exterior-after.jpg" },
  { id: "commercial", label: "Commercial & Strata", defaultImg: "/interior-timber-ceiling.jpg" },
  { id: "special-finishes", label: "Special Finishes", defaultImg: "/feature-wall-lilac.jpg" },
  { id: "repaints", label: "Repaints & Touch-ups", defaultImg: "/kitchen-after.jpg" },
];

const DEFAULT_GALLERY: GalleryPair[] = [
  { id: 1, title: "Lounge Room — Timber Ceiling", before: "/lounge-before.jpg", after: "/lounge-after.jpg" },
  { id: 2, title: "Exterior Render & Repaint", before: "/exterior-render.jpg", after: "/exterior-terrace.jpg" },
  { id: 3, title: "Front Entry Door — Gloss Black", before: "/door-exterior-before.jpg", after: "/door-exterior-after.jpg" },
  { id: 4, title: "Interior Door Respray", before: "/door-interior-before.jpg", after: "/door-interior-after.jpg" },
  { id: 5, title: "Bedroom Feature Wall", before: "/feature-wall-undercoat.jpg", after: "/feature-wall-lilac.jpg" },
  { id: 6, title: "Water Damage Wall Repair", before: "/wall-damage-before.jpg", after: "/wall-repair-after.jpg" },
  { id: 7, title: "Ceiling Repair & Patch", before: "/ceiling-cut-before.jpg", after: "/ceiling-patch-after.jpg" },
];

// ─── Booking helpers ───────────────────────────────────────────────────────────
const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};
const STATUS_LABELS: Record<BookingStatus, string> = { pending: "Pending", approved: "Approved", cancelled: "Cancelled" };

function fmtDate(d: string) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
}
function fmtTime(d: string) {
  try { return new Date(d).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
}
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }

// ─── UploadButton ─────────────────────────────────────────────────────────────
function UploadButton({ onUploaded, label = "Upload Image", small = false }: { onUploaded: (url: string) => void; label?: string; small?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUploaded(data.url);
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className={`flex items-center gap-2 font-bold rounded-xl transition-colors disabled:opacity-60 ${
          small
            ? "text-xs bg-[#c9a24b]/10 hover:bg-[#c9a24b]/20 text-[#c9a24b] px-3 py-1.5"
            : "text-sm bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a] px-4 py-2.5"
        }`}
      >
        {uploading ? (
          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none"><path d="M10 3v10M6 7l4-4 4 4M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
        {uploading ? "Uploading…" : label}
      </button>
      {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
    </div>
  );
}

// ─── ImagePreview ─────────────────────────────────────────────────────────────
function ImagePreview({ src, className = "" }: { src: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className}`}>No image</div>;
  }
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <Image src={src} alt="" fill className="object-cover" onError={() => setErr(true)} sizes="200px" />
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"bookings" | "media">("bookings");

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");

  // Media state
  const [mediaConfig, setMediaConfig] = useState<MediaConfig>({
    hero: "/1.png",
    services: {},
    gallery: DEFAULT_GALLERY,
  });
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [savingMedia, setSavingMedia] = useState(false);
  const [mediaSaved, setMediaSaved] = useState(false);
  const [galleryModal, setGalleryModal] = useState<{ mode: "add" | "edit"; pair?: GalleryPair } | null>(null);
  const [galleryForm, setGalleryForm] = useState({ title: "", before: "", after: "" });

  // Load bookings
  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch { /* silent */ } finally { setLoadingBookings(false); }
  }, [router]);

  // Load media config
  const loadMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (data.config) {
        setMediaConfig({
          hero: data.config.hero || "/1.png",
          services: data.config.services || {},
          gallery: data.config.gallery?.length ? data.config.gallery : DEFAULT_GALLERY,
        });
      }
    } catch { /* use defaults */ } finally { setLoadingMedia(false); }
  }, [router]);

  useEffect(() => { loadBookings(); loadMedia(); }, [loadBookings, loadMedia]);

  async function saveMedia(config: MediaConfig) {
    setSavingMedia(true);
    try {
      await fetch("/api/admin/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setMediaSaved(true);
      setTimeout(() => setMediaSaved(false), 2500);
    } finally { setSavingMedia(false); }
  }

  function updateHero(url: string) {
    const next = { ...mediaConfig, hero: url };
    setMediaConfig(next);
    saveMedia(next);
  }

  function updateService(id: string, url: string) {
    const next = { ...mediaConfig, services: { ...mediaConfig.services, [id]: url } };
    setMediaConfig(next);
    saveMedia(next);
  }

  function deleteGalleryPair(id: number) {
    if (!confirm("Delete this gallery pair?")) return;
    const next = { ...mediaConfig, gallery: mediaConfig.gallery.filter(p => p.id !== id) };
    setMediaConfig(next);
    saveMedia(next);
  }

  function openAddGallery() {
    setGalleryForm({ title: "", before: "", after: "" });
    setGalleryModal({ mode: "add" });
  }

  function openEditGallery(pair: GalleryPair) {
    setGalleryForm({ title: pair.title, before: pair.before, after: pair.after });
    setGalleryModal({ mode: "edit", pair });
  }

  function saveGalleryPair() {
    if (!galleryForm.title || !galleryForm.before || !galleryForm.after) return;
    let next: MediaConfig;
    if (galleryModal?.mode === "add") {
      const newId = Math.max(0, ...mediaConfig.gallery.map(p => p.id)) + 1;
      next = { ...mediaConfig, gallery: [...mediaConfig.gallery, { id: newId, ...galleryForm }] };
    } else {
      next = {
        ...mediaConfig,
        gallery: mediaConfig.gallery.map(p =>
          p.id === galleryModal!.pair!.id ? { ...p, ...galleryForm } : p
        ),
      };
    }
    setMediaConfig(next);
    saveMedia(next);
    setGalleryModal(null);
  }

  // Bookings helpers
  async function updateStatus(id: string, status: BookingStatus) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const { booking } = await res.json();
        setBookings(bs => bs.map(b => b.id === id ? booking : b));
        setSelected(booking);
      }
    } finally { setActionLoading(false); }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  const bookingsByDay: Record<string, Booking[]> = {};
  for (const b of bookings) {
    if (b.date) {
      const d = b.date.slice(0, 10);
      if (!bookingsByDay[d]) bookingsByDay[d] = [];
      bookingsByDay[d].push(b);
    }
  }
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const monthName = new Date(calYear, calMonth, 1).toLocaleDateString("en-AU", { month: "long", year: "numeric" });
  const todayStr = new Date().toISOString().slice(0, 10);
  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    approved: bookings.filter(b => b.status === "approved").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Top bar */}
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
          {mediaSaved && (
            <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Saved
            </span>
          )}
          <button onClick={logout} className="text-[#6b7280] hover:text-white text-xs font-semibold transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="bg-[#1a1a1a] border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { key: "bookings", icon: "📅", label: "Bookings" },
            { key: "media", icon: "🖼", label: "Media Manager" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
                tab === t.key
                  ? "text-[#c9a24b] border-[#c9a24b]"
                  : "text-[#6b7280] border-transparent hover:text-white"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total", value: stats.total, color: "#6b7280" },
                { label: "Pending", value: stats.pending, color: "#d97706" },
                { label: "Approved", value: stats.approved, color: "#16a34a" },
                { label: "Cancelled", value: stats.cancelled, color: "#dc2626" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{s.label}</p>
                  <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-3 mb-6">
              {(["calendar", "list"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors capitalize ${
                    view === v ? "bg-[#1a1a1a] text-[#c9a24b]" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {v === "calendar" ? "Calendar View" : "List View"}
                </button>
              ))}
              {view === "list" && (
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as typeof filter)}
                  className="ms-auto bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
                >
                  <option value="all">All bookings</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
            </div>

            {loadingBookings ? (
              <div className="text-center py-20 text-gray-400">Loading bookings…</div>
            ) : (
              <>
                {view === "calendar" && (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else { setCalMonth(m => m - 1); } }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-lg">‹</button>
                      <h2 className="font-black text-[#1a1a1a]">{monthName}</h2>
                      <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else { setCalMonth(m => m + 1); } }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-lg">›</button>
                    </div>
                    <div className="grid grid-cols-7 border-b border-gray-100">
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                        <div key={d} className="py-2 text-center text-xs font-bold text-gray-400">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`e-${i}`} className="min-h-[100px] border-b border-r border-gray-100 bg-gray-50/50" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                        const dayBookings = bookingsByDay[dateStr] ?? [];
                        const isToday = dateStr === todayStr;
                        return (
                          <div key={day} className={`min-h-[100px] border-b border-r border-gray-100 p-2 ${isToday ? "bg-amber-50/50" : ""}`}>
                            <p className={`text-xs font-bold mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-[#c9a24b] text-[#1a1a1a]" : "text-gray-500"}`}>{day}</p>
                            <div className="space-y-1">
                              {dayBookings.map(b => (
                                <button key={b.id} onClick={() => setSelected(b)} className={`w-full text-start text-xs font-semibold px-2 py-1 rounded-lg border truncate transition-colors hover:opacity-80 ${STATUS_COLORS[b.status]}`}>
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
                    {filtered.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">No bookings found.</div>
                    ) : filtered.map(b => (
                      <button key={b.id} onClick={() => setSelected(b)} className="w-full bg-white rounded-2xl border border-gray-100 p-5 text-start hover:border-[#c9a24b] transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-black text-[#1a1a1a]">{b.name}</p>
                            <p className="text-sm text-gray-500">{b.postcode} · {b.scope || b.service || "—"}</p>
                            <p className="text-xs text-gray-400 mt-1">{fmtDate(b.date)} · Received {fmtDate(b.createdAt)} {fmtTime(b.createdAt)}</p>
                          </div>
                          <span className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── MEDIA TAB ── */}
        {tab === "media" && (
          <div className="space-y-8">
            {loadingMedia ? (
              <div className="text-center py-20 text-gray-400">Loading media config…</div>
            ) : (
              <>
                {/* Hero Section */}
                <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-[#1a1a1a] px-6 py-4 flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#c9a24b] rounded-lg flex items-center justify-center text-[#1a1a1a] text-xs font-black">H</div>
                    <div>
                      <p className="text-white font-black text-sm">Hero Image</p>
                      <p className="text-[#6b7280] text-xs">Main banner image at top of homepage</p>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
                    <ImagePreview src={mediaConfig.hero} className="w-full sm:w-64 h-40 rounded-xl flex-shrink-0" />
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-gray-500 font-medium">Current: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{mediaConfig.hero}</code></p>
                      <UploadButton label="Replace Hero Image" onUploaded={url => updateHero(url)} />
                    </div>
                  </div>
                </section>

                {/* Services Section */}
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
                      const current = mediaConfig.services[svc.id] || svc.defaultImg;
                      return (
                        <div key={svc.id} className="border border-gray-100 rounded-xl overflow-hidden group">
                          <ImagePreview src={current} className="w-full h-36" />
                          <div className="p-3">
                            <p className="text-xs font-bold text-[#1a1a1a] mb-0.5">{svc.label}</p>
                            <p className="text-xs text-gray-400 truncate mb-2">{current}</p>
                            <UploadButton small label="Replace" onUploaded={url => updateService(svc.id, url)} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Gallery Section */}
                <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#c9a24b] rounded-lg flex items-center justify-center text-[#1a1a1a] text-xs font-black">G</div>
                      <div>
                        <p className="text-white font-black text-sm">Before & After Gallery</p>
                        <p className="text-[#6b7280] text-xs">{mediaConfig.gallery.length} pairs</p>
                      </div>
                    </div>
                    <button
                      onClick={openAddGallery}
                      className="flex items-center gap-2 bg-[#c9a24b] hover:bg-[#b8913a] text-[#1a1a1a] text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Add Pair
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {mediaConfig.gallery.map(pair => (
                      <div key={pair.id} className="border border-gray-100 rounded-xl p-4 hover:border-[#c9a24b]/30 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <p className="font-bold text-sm text-[#1a1a1a]">{pair.title}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => openEditGallery(pair)} className="text-xs font-bold text-[#c9a24b] hover:text-[#b8913a] bg-[#c9a24b]/10 hover:bg-[#c9a24b]/20 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                            <button onClick={() => deleteGalleryPair(pair.id)} className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">Before</p>
                            <ImagePreview src={pair.before} className="w-full h-28 rounded-lg" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">After</p>
                            <ImagePreview src={pair.after} className="w-full h-28 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {mediaConfig.gallery.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-8">No gallery pairs yet. Click "Add Pair" to add the first one.</p>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </main>

      {/* Booking detail modal */}
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
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLORS[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
                <span className="text-xs text-gray-400">ID: {selected.id.slice(0,12)}…</span>
              </div>
              {[
                ["Name", selected.name],
                ["Phone", selected.phone],
                ["Email", selected.email],
                ["Suburb / Postcode", selected.postcode],
                ["Property Type", selected.propertyType],
                ["Scope", selected.scope],
                ["Preferred Date", fmtDate(selected.date)],
                selected.rooms ? ["Rooms", selected.rooms] : null,
                selected.sqm ? ["Area", `${selected.sqm} m²`] : null,
                selected.extras?.length ? ["Extras", selected.extras.join(", ")] : null,
                selected.service ? ["Service", selected.service] : null,
                selected.message ? ["Notes", selected.message] : null,
                ["Submitted", `${fmtDate(selected.createdAt)} ${fmtTime(selected.createdAt)}`],
              ].filter(Boolean).map(row => (
                <div key={row![0]} className="flex gap-3 text-sm">
                  <span className="w-36 flex-shrink-0 text-gray-400 font-medium">{row![0]}</span>
                  <span className="text-[#1a1a1a] font-semibold break-all">{row![1]}</span>
                </div>
              ))}
            </div>
            {selected.status !== "cancelled" && (
              <div className="px-6 pb-6 flex gap-3">
                {selected.status !== "approved" && (
                  <button onClick={() => updateStatus(selected.id, "approved")} disabled={actionLoading} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold rounded-xl py-3 text-sm transition-colors">✓ Approve</button>
                )}
                <button
                  onClick={() => { if (confirm(`Cancel booking for ${selected.name}?`)) updateStatus(selected.id, "cancelled"); }}
                  disabled={actionLoading}
                  className="flex-1 bg-red-100 hover:bg-red-200 disabled:opacity-70 text-red-700 font-bold rounded-xl py-3 text-sm transition-colors"
                >
                  ✕ Cancel Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery pair modal */}
      {galleryModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setGalleryModal(null)}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a1a1a] px-6 py-5 flex items-center justify-between">
              <p className="text-white font-black text-base">{galleryModal.mode === "add" ? "Add Gallery Pair" : "Edit Gallery Pair"}</p>
              <button onClick={() => setGalleryModal(null)} className="text-white/60 hover:text-white p-1">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Title</label>
                <input
                  value={galleryForm.title}
                  onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Living Room Repaint"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a24b] transition-colors"
                />
              </div>

              {/* Before */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Before Image</label>
                {galleryForm.before && (
                  <ImagePreview src={galleryForm.before} className="w-full h-32 rounded-xl mb-2" />
                )}
                <div className="flex gap-2 items-center">
                  <UploadButton small label="Upload Before" onUploaded={url => setGalleryForm(f => ({ ...f, before: url }))} />
                  {galleryForm.before && <p className="text-xs text-gray-400 truncate flex-1">{galleryForm.before.split("/").pop()}</p>}
                </div>
              </div>

              {/* After */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">After Image</label>
                {galleryForm.after && (
                  <ImagePreview src={galleryForm.after} className="w-full h-32 rounded-xl mb-2" />
                )}
                <div className="flex gap-2 items-center">
                  <UploadButton small label="Upload After" onUploaded={url => setGalleryForm(f => ({ ...f, after: url }))} />
                  {galleryForm.after && <p className="text-xs text-gray-400 truncate flex-1">{galleryForm.after.split("/").pop()}</p>}
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setGalleryModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-3 text-sm transition-colors">Cancel</button>
              <button
                onClick={saveGalleryPair}
                disabled={!galleryForm.title || !galleryForm.before || !galleryForm.after || savingMedia}
                className="flex-1 bg-[#c9a24b] hover:bg-[#b8913a] disabled:opacity-50 text-[#1a1a1a] font-bold rounded-xl py-3 text-sm transition-colors"
              >
                {savingMedia ? "Saving…" : galleryModal.mode === "add" ? "Add Pair" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

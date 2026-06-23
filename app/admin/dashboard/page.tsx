"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

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

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  cancelled: "Cancelled",
};

function fmtDate(d: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  } catch { return d; }
}

function fmtTime(d: string) {
  try {
    return new Date(d).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");

  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      // silently fail — will show empty state
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

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
        setBookings((bs) => bs.map((b) => b.id === id ? booking : b));
        setSelected(booking);
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  // Build calendar day → bookings map
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

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
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
        <button onClick={logout} className="text-[#6b7280] hover:text-white text-xs font-semibold transition-colors">
          Sign out
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "#6b7280" },
            { label: "Pending", value: stats.pending, color: "#d97706" },
            { label: "Approved", value: stats.approved, color: "#16a34a" },
            { label: "Cancelled", value: stats.cancelled, color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{s.label}</p>
              <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${view === "calendar" ? "bg-[#1a1a1a] text-[#c9a24b]" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"}`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${view === "list" ? "bg-[#1a1a1a] text-[#c9a24b]" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"}`}
          >
            List View
          </button>
          {view === "list" && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="ms-auto bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
            >
              <option value="all">All bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading bookings…</div>
        ) : (
          <>
            {view === "calendar" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Calendar header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <button
                    onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else { setCalMonth(m => m - 1); } }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    ‹
                  </button>
                  <h2 className="font-black text-[#1a1a1a]">{monthName}</h2>
                  <button
                    onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else { setCalMonth(m => m + 1); } }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    ›
                  </button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 border-b border-gray-100">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-2 text-center text-xs font-bold text-gray-400">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-gray-100 bg-gray-50/50" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const dayBookings = bookingsByDay[dateStr] ?? [];
                    const isToday = dateStr === todayStr;

                    return (
                      <div
                        key={day}
                        className={`min-h-[100px] border-b border-r border-gray-100 p-2 ${isToday ? "bg-amber-50/50" : ""}`}
                      >
                        <p className={`text-xs font-bold mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-[#c9a24b] text-[#1a1a1a]" : "text-gray-500"}`}>
                          {day}
                        </p>
                        <div className="space-y-1">
                          {dayBookings.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setSelected(b)}
                              className={`w-full text-start text-xs font-semibold px-2 py-1 rounded-lg border truncate transition-colors hover:opacity-80 ${STATUS_COLORS[b.status]}`}
                            >
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
                ) : (
                  filtered.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className="w-full bg-white rounded-2xl border border-gray-100 p-5 text-start hover:border-[#c9a24b] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-[#1a1a1a]">{b.name}</p>
                          <p className="text-sm text-gray-500">{b.postcode} · {b.scope || b.service || "—"}</p>
                          <p className="text-xs text-gray-400 mt-1">{fmtDate(b.date)} · Received {fmtDate(b.createdAt)} {fmtTime(b.createdAt)}</p>
                        </div>
                        <span className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLORS[b.status]}`}>
                          {STATUS_LABELS[b.status]}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Booking detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
                <span className="text-xs text-gray-400">ID: {selected.id.slice(0, 12)}…</span>
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
              ].filter(Boolean).map((row) => (
                <div key={row![0]} className="flex gap-3 text-sm">
                  <span className="w-36 flex-shrink-0 text-gray-400 font-medium">{row![0]}</span>
                  <span className="text-[#1a1a1a] font-semibold break-all">{row![1]}</span>
                </div>
              ))}
            </div>

            {selected.status !== "cancelled" && (
              <div className="px-6 pb-6 flex gap-3">
                {selected.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(selected.id, "approved")}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold rounded-xl py-3 text-sm transition-colors"
                  >
                    ✓ Approve
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm(`Cancel booking for ${selected.name}? A cancellation email will be sent.`)) {
                      updateStatus(selected.id, "cancelled");
                    }
                  }}
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
    </div>
  );
}

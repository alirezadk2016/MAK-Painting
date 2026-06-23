"use client";
import { useState, useEffect } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("mak_cookie_ok")) {
      setTimeout(() => setVisible(true), 2000);
    }
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-4 inset-x-0 mx-auto max-w-xl px-4 z-50">
      <div className="bg-charcoal text-white rounded-2xl shadow-card-hover p-4 flex items-center gap-4">
        <p className="text-xs text-gray-300 flex-1">
          We use cookies to improve your experience and analyse site traffic.
          See our <a href="/privacy" className="text-gold-deep underline">Privacy Policy</a>.
        </p>
        <button
          onClick={() => { localStorage.setItem("mak_cookie_ok","1"); setVisible(false); }}
          className="bg-white text-charcoal text-xs font-bold rounded-xl px-4 py-2 flex-shrink-0 hover:bg-gray-100"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

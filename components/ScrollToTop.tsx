"use client";
import { useState, useEffect } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed right-5 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
        bottom-24 lg:bottom-8
        bg-[#1a1a1a] border border-[#c9a24b]/40 shadow-[0_4px_20px_rgba(0,0,0,0.35)]
        hover:scale-110 hover:border-[#c9a24b]/80 hover:shadow-[0_6px_28px_rgba(201,162,75,0.25)]
        active:scale-95
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      {/* Subtle inner ring */}
      <span className="absolute inset-1.5 rounded-full border border-[#c9a24b]/15 pointer-events-none" />
      {/* Arrow */}
      <svg className="w-5 h-5 text-[#c9a24b] relative" viewBox="0 0 20 20" fill="none">
        <path d="M10 15V5M4 11l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

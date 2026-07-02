"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center p-4" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div className="w-full max-w-sm">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center mb-6">
          <p className="text-[#c9a24b] text-xs font-bold tracking-widest uppercase mb-2">MAK PAINTING GROUP</p>
          <h1 className="text-white text-2xl font-black">Admin Panel</h1>
        </div>
        <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2" htmlFor="pw">
            Password
          </label>
          <input
            id="pw"
            name="password"
            type="password"
            placeholder="Enter admin password"
            required
            autoFocus
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#c9a24b] transition-colors mb-4"
          />
          {state?.error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1a1a1a] hover:bg-[#2d2d2d] disabled:opacity-70 text-[#c9a24b] font-bold rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isPending && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
              </svg>
            )}
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

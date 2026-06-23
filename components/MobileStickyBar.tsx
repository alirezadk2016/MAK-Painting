"use client";
import { useTranslations } from "next-intl";
import { useQuoteWizard } from "./QuoteWizardProvider";
import { BRAND } from "@/data/site";

export function MobileStickyBar() {
  const { open } = useQuoteWizard();
  const t = useTranslations("Nav");
  const tc = useTranslations("Common");
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-4 py-3 safe-area-inset-bottom">
      <div className="flex gap-3">
        <a
          href={`tel:${BRAND.phone.replace(/\s/g,"")}`}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-brand text-gold-deep font-bold rounded-xl py-3 text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M4.4 7.2c.93 1.87 2.53 3.4 4.4 4.4l1.47-1.47c.2-.2.47-.27.67-.13.73.27 1.53.4 2.4.4.37 0 .66.3.66.67V13.33c0 .37-.3.67-.67.67A11.33 11.33 0 0 1 2 3.33c0-.36.3-.66.67-.66H5c.37 0 .67.3.67.66 0 .87.13 1.67.4 2.4.13.2.06.47-.14.67L4.4 7.2z" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
          {t("callUs")}
        </a>
        <button
          onClick={open}
          className="flex-[2] bg-terra text-ink font-bold rounded-xl py-3 text-sm shadow-md"
        >
          {tc("getQuote")}
        </button>
      </div>
    </div>
  );
}

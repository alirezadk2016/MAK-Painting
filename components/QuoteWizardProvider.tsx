"use client";
import { createContext, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { QuoteWizard } from "./QuoteWizard";

interface WizardCtx {
  open: (initialPostcode?: string) => void;
  close: () => void;
}
const Ctx = createContext<WizardCtx>({ open: () => {}, close: () => {} });
export const useQuoteWizard = () => useContext(Ctx);

export function QuoteWizardProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [initPostcode, setInitPostcode] = useState("");

  function open(initialPostcode = "") {
    setInitPostcode(initialPostcode);
    setVisible(true);
  }

  return (
    <Ctx.Provider value={{ open, close: () => setVisible(false) }}>
      {children}
      <AnimatePresence>
        {visible && (
          <QuoteWizard
            key={initPostcode}
            initialPostcode={initPostcode}
            onClose={() => setVisible(false)}
          />
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

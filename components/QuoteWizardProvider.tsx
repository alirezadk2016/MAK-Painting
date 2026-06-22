"use client";
import { createContext, useContext, useState } from "react";
import { QuoteWizard } from "./QuoteWizard";

interface WizardCtx {
  open: () => void;
  close: () => void;
}
const Ctx = createContext<WizardCtx>({ open: () => {}, close: () => {} });
export const useQuoteWizard = () => useContext(Ctx);

export function QuoteWizardProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <Ctx.Provider value={{ open: () => setVisible(true), close: () => setVisible(false) }}>
      {children}
      {visible && <QuoteWizard onClose={() => setVisible(false)} />}
    </Ctx.Provider>
  );
}

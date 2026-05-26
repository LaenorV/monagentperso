"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalCtx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<ModalCtx | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setIsOpen(true);
    document.body.classList.add("modal-open");
  };
  const close = () => {
    setIsOpen(false);
    document.body.classList.remove("modal-open");
  };
  return <Ctx.Provider value={{ isOpen, open, close }}>{children}</Ctx.Provider>;
}

export function useModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
}

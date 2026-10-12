"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, type ReactNode } from "react";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
};

/**
 * Bottom sheet below 768px, centred dialog from 768px.
 * Focus is moved inside, trapped, and returned to the trigger by Radix.
 */
export function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  const openerRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (open) return;
    const remember = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) openerRef.current = event.target;
    };
    document.addEventListener("focusin", remember);
    return () => document.removeEventListener("focusin", remember);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    scrollYRef.current = scrollY;
    html.classList.add("sheet-open");
    body.style.setProperty("top", `-${scrollY}px`, "important");
    return () => {
      html.classList.remove("sheet-open");
      body.style.removeProperty("top");
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content
          className="sheet-content"
          aria-modal="true"
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            const opener = openerRef.current;
            if (!opener) return;
            event.preventDefault();
            opener.focus();
          }}
        >
          <div className="sheet-header">
            <Dialog.Title className="sheet-title">{title}</Dialog.Title>
            <Dialog.Close className="sheet-close">Close</Dialog.Close>
          </div>
          <div className="sheet-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

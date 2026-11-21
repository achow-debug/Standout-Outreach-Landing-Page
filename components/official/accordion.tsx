"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type AccordionEntry = {
  id: string;
  title: ReactNode;
  children: ReactNode;
};

type AccordionProps = {
  items: readonly AccordionEntry[];
  className?: string;
  /** Fires with the open item id, or "" when every item is closed. */
  onValueChange?: (value: string) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Chevron() {
  return (
    <svg
      className="size-5 shrink-0 text-ink-muted transition-transform duration-(--dur-micro) ease-(--ease-out) group-data-[state=open]:rotate-180"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * One item open at a time. The open item can be closed again.
 * A matching URL hash opens that item and scrolls it into view.
 */
export function Accordion({ items, className, onValueChange }: AccordionProps) {
  const [value, setValue] = useState("");
  const ids = items.map((item) => item.id).join("|");
  const onChangeRef = useRef(onValueChange);
  onChangeRef.current = onValueChange;

  const select = (next: string) => {
    setValue(next);
    onChangeRef.current?.(next);
  };

  useEffect(() => {
    const known = new Set(ids.split("|").filter(Boolean));

    const openFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!known.has(id)) return;
      setValue(id);
      onChangeRef.current?.(id);
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [ids]);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!value || value !== id) return;
    const scroll = () => {
      document.getElementById(id)?.scrollIntoView({
        block: "start",
        behavior: "auto",
      });
    };
    scroll();
    window.addEventListener("load", scroll);
    return () => window.removeEventListener("load", scroll);
  }, [value]);

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      value={value}
      onValueChange={select}
      className={cx("m-0 flex list-none flex-col border-t border-line p-0", className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          id={item.id}
          className="border-b border-line"
        >
          <AccordionPrimitive.Header className="m-0">
            <AccordionPrimitive.Trigger
              className="group flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              aria-controls={`${item.id}-panel`}
            >
              <span className="font-display text-h3 text-ink">{item.title}</span>
              <Chevron />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content
            forceMount
            className="overflow-hidden data-[state=closed]:hidden"
          >
            <div
              className="max-w-prose pb-6 text-body text-ink-muted"
              id={`${item.id}-panel`}
            >
              {item.children}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

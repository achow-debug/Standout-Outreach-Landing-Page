"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useEffect, useState, type ReactNode } from "react";

export type AccordionEntry = {
  id: string;
  title: ReactNode;
  children: ReactNode;
};

type AccordionProps = {
  items: readonly AccordionEntry[];
};

function Chevron() {
  return (
    <svg
      className="accordion-chevron"
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
export function Accordion({ items }: AccordionProps) {
  const [value, setValue] = useState("");
  const ids = items.map((item) => item.id).join("|");

  useEffect(() => {
    const known = new Set(ids.split("|").filter(Boolean));

    const openFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!known.has(id)) return;
      setValue(id);
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
      onValueChange={setValue}
      className="accordion"
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          id={item.id}
          className="accordion-item"
        >
          <AccordionPrimitive.Header className="accordion-header">
            <AccordionPrimitive.Trigger
              className="accordion-trigger"
              aria-controls={`${item.id}-panel`}
            >
              <span>{item.title}</span>
              <Chevron />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content forceMount className="accordion-content">
            <div className="accordion-panel" id={`${item.id}-panel`}>
              {item.children}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

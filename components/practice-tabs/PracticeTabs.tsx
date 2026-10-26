"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useBooking } from "@/components/official/booking-provider";
import { keepTogether } from "@/components/official/no-break";
import { usePracticeArea } from "@/components/official/practice-area";
import {
  practiceAreas,
  type PracticeAreaEntry,
  type PracticeAreaId,
} from "@/components/practice-tabs/practiceAreas";
import { trackEvent } from "@/lib/analytics";
import { officialCopy } from "@/lib/official-copy";

const TAB_CLASS =
  "relative flex h-full w-full min-w-0 items-start gap-2 px-2 py-3 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:px-3 lg:py-4";

export function PracticeTabs() {
  const { openBooking } = useBooking();
  const { setPracticeArea } = usePracticeArea();
  const tracked = useRef<Set<PracticeAreaId>>(new Set());
  const [activeId, setActiveId] = useState<PracticeAreaId>("family-law");

  const active = practiceAreas.find((area) => area.id === activeId) ?? practiceAreas[0];

  function selectArea(id: PracticeAreaId, method: "click" | "keyboard") {
    const area = practiceAreas.find((item) => item.id === id);
    if (!area) return;
    setActiveId(id);
    setPracticeArea(area.bookingArea);
    if (method !== "click" || tracked.current.has(id)) return;
    tracked.current.add(id);
    trackEvent("practice_area_selected", { area: id });
  }

  function onTabListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = practiceAreas.findIndex((area) => area.id === activeId);
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % practiceAreas.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + practiceAreas.length) % practiceAreas.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = practiceAreas.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const id = practiceAreas[nextIndex].id;
    selectArea(id, "keyboard");
    const tab = document.getElementById(`practice-tab-${id}`);
    if (tab instanceof HTMLElement) {
      tab.focus({
        preventScroll: true,
        focusVisible: true,
      } as FocusOptions & { focusVisible?: boolean });
    }
  }

  return (
    <section
      aria-label="Practice areas"
      className="relative z-10 -mt-10 scroll-mt-24 rounded-t-[2rem] bg-surface py-12 shadow-[0_-12px_40px_-16px_rgba(17,12,46,0.12)] md:-mt-16 md:rounded-t-[3rem] md:py-16"
    >
      <div className="page-shell">
        <div className="lg:hidden">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
            {practiceAreas.map((area) => {
              const selected = area.id === active.id;
              const panelId = `practice-accordion-${area.id}`;
              const triggerId = `practice-accordion-trigger-${area.id}`;
              const Icon = area.icon;
              return (
                <div key={area.id} className="scroll-mt-24 border-b border-line last:border-b-0">
                  <button
                    type="button"
                    id={triggerId}
                    className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
                    aria-expanded={selected}
                    aria-controls={panelId}
                    onClick={() => selectArea(area.id, "click")}
                  >
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className={`h-5 w-5 shrink-0 ${selected ? "text-ink" : "text-muted"}`}
                    />
                    <span className="min-w-0 flex-1 text-base font-semibold leading-snug text-ink">
                      {area.label}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className={`h-5 w-5 shrink-0 ${selected ? "rotate-180 text-ink" : "text-muted"}`}
                    />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!selected}
                    className="border-t border-line px-4 py-4"
                  >
                    <PracticeAreaBody
                      area={area}
                      onApply={() => openBooking("practice-card")}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:block">
          <div
            role="tablist"
            aria-label="Practice areas"
            className="grid grid-cols-5 border-b border-line"
            onKeyDown={onTabListKeyDown}
          >
            {practiceAreas.map((area) => {
              const selected = area.id === active.id;
              const Icon = area.icon;
              return (
                <button
                  key={area.id}
                  type="button"
                  role="tab"
                  id={`practice-tab-${area.id}`}
                  aria-selected={selected}
                  aria-controls="practice-panel"
                  tabIndex={selected ? 0 : -1}
                  className={`${TAB_CLASS} ${
                    selected ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                  onClick={() => selectArea(area.id, "click")}
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className={`mt-0.5 h-5 w-5 shrink-0 ${selected ? "text-ink" : "text-muted"}`}
                  />
                  <span className="min-w-0 text-base font-semibold leading-snug">
                    {area.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-px h-0.5 ${selected ? "bg-brand" : "bg-transparent"}`}
                  />
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="practice-panel"
            aria-labelledby={`practice-tab-${active.id}`}
            tabIndex={0}
            className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:p-8"
          >
            <PracticeAreaBody area={active} onApply={() => openBooking("practice-card")} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PracticeAreaBody({
  area,
  onApply,
}: {
  area: PracticeAreaEntry;
  onApply: () => void;
}) {
  const card = area.card;

  return (
    <div className="flex flex-col items-start gap-3">
      {card ? (
        <>
          <p className="m-0 text-base leading-relaxed text-ink md:text-lg">{card.summary}</p>
          {card.excerpt ? (
            <p className="m-0 text-base leading-relaxed text-muted">{card.excerpt}</p>
          ) : null}
          <a
            href={card.linkHref}
            className="inline-flex min-h-11 items-center text-small text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {card.linkLabel}
          </a>
        </>
      ) : null}
      <button
        type="button"
        className="btn btn-primary btn-cta"
        data-booking-cta=""
        onClick={onApply}
      >
        {keepTogether(officialCopy.header.applyLabel)}
      </button>
    </div>
  );
}

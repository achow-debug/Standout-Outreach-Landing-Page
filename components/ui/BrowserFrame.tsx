import type { ReactNode } from "react";

type BrowserFrameProps = {
  children: ReactNode;
  className?: string;
  /** When true, wraps the body in `.theme-demo` (§6.8). */
  demoTheme?: boolean;
  /**
   * Fill a fixed parent height (feature-flow cards). Chrome stays fixed;
   * body flexes and clips instead of growing the card.
   */
  fill?: boolean;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Browser chrome around a demo slide (§6.8).
 * Traffic-light dots are warm line-strong (not red/amber/green). Address pill is empty.
 */
export function BrowserFrame({
  children,
  className,
  demoTheme = true,
  fill = false,
}: BrowserFrameProps) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-lg border border-line bg-surface shadow-lg",
        fill && "flex h-full flex-col",
        className,
      )}
    >
      <div className="relative flex h-10 shrink-0 items-center border-b border-line bg-surface px-4">
        <div className="relative z-10 flex items-center gap-2" aria-hidden="true">
          {/* 10px dots — size documented in §6.8 */}
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </div>
        <span
          className="pointer-events-none absolute left-1/2 h-6 w-2/5 -translate-x-1/2 rounded-full bg-surface-alt"
          aria-hidden="true"
        />
      </div>
      <div
        className={cx(
          demoTheme && "theme-demo",
          fill && "flex min-h-0 flex-1 flex-col overflow-hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
}

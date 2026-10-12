import { Fragment, type ReactNode } from "react";

const PHRASES = ["14 hrs → 5 min", "30-day", "30-Day"] as const;

/** Keeps a short phrase on one line. */
export function NoBreak({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

/** Wraps `30-day`, `30-Day` and `14 hrs → 5 min` so they never split. */
export function keepTogether(text: string): ReactNode {
  const pattern = /(14 hrs → 5 min|30-day|30-Day)/g;
  const parts = text.split(pattern);
  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    PHRASES.includes(part as (typeof PHRASES)[number]) ? (
      <NoBreak key={`${part}-${index}`}>{part}</NoBreak>
    ) : (
      <Fragment key={`${index}-${part.slice(0, 12)}`}>{part}</Fragment>
    ),
  );
}

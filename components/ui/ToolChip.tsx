import type { ReactNode } from "react";

type ToolChipProps = {
  label: string;
  /** Optional logo src. Renders directly beside the label. */
  src?: string;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Single tool chip (§6.5).
 */
export function ToolChip({ label, src, className }: ToolChipProps) {
  return (
    <span
      className={cx(
        "flex h-16 items-center gap-3 rounded-md border border-line bg-surface px-4 transition-[border-color] duration-(--dur-micro) ease-(--ease-out) hover:border-line-strong",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- tool logos are static brand assets
        <img
          src={src}
          alt=""
          className="size-10 shrink-0 object-contain"
        />
      ) : null}
      <span className="text-small font-semibold text-ink text-left">{label}</span>
    </span>
  );
}

type ToolChipGridProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Equal-width chip grid (§6.5). Centred; no ragged rows.
 */
export function ToolChipGrid({ children, className }: ToolChipGridProps) {
  return (
    <ul
      className={cx(
        "m-0 grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
        className,
      )}
    >
      {children}
    </ul>
  );
}

type ToolChipItemProps = {
  children: ReactNode;
};

export function ToolChipItem({ children }: ToolChipItemProps) {
  return <li className="min-w-0">{children}</li>;
}

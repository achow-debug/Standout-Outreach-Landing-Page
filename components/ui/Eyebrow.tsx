import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  /**
   * Path node for left-aligned sections on lg+ (§6.4, §7.3).
   * Pass `<PathNode />` or `<PathNode terminal />` from the path system.
   * Hidden automatically below lg inside PathNode itself.
   */
  node?: ReactNode;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Section eyebrow (§6.4). Same words; only the case transform changes.
 * `relative` so a PathNode can sit on the path line, centred on this text.
 */
export function Eyebrow({ children, node, className }: EyebrowProps) {
  return (
    <p
      className={cx(
        "relative font-sans text-eyebrow uppercase text-ink-muted",
        className,
      )}
    >
      {node}
      {children}
    </p>
  );
}

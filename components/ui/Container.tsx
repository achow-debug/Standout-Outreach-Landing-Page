import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Extra classes on the outer element (defaults to `div`). */
  as?: ElementType;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Site-width content wrapper (§4.1).
 * 1200px content + fluid gutter on each side.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return <Tag className={cx("container-site", className)}>{children}</Tag>;
}

type SectionShellProps = {
  id?: string;
  children: ReactNode;
  /** Section background. Only `paper` and `surface-alt` for light sections (§2). */
  tone?: "paper" | "surface-alt" | "night";
  /**
   * Left-aligned sections indent to the content line on lg+ (§4.1, §6.3).
   * Centred sections (hero, tools, mobile final CTA) pass `false`.
   */
  pathAlign?: boolean;
  className?: string;
  /** Classes on the inner container-site wrapper. */
  containerClassName?: string;
  /** Classes on the path-gutter content wrapper (when pathAlign). */
  contentClassName?: string;
  "aria-labelledby"?: string;
};

const tones = {
  paper: "bg-paper",
  "surface-alt": "bg-surface-alt",
  night: "bg-night text-night-text theme-night",
} as const;

/**
 * Standard section shell (§6.3).
 * Full-bleed background, `section-y` padding, `container-site`, optional path gutter.
 */
export function SectionShell({
  id,
  children,
  tone = "paper",
  pathAlign = true,
  className,
  containerClassName,
  contentClassName,
  "aria-labelledby": ariaLabelledBy,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cx("section-y", tones[tone], className)}
    >
      <Container className={containerClassName}>
        {pathAlign ? (
          <div className={cx("lg:pl-(--path-gutter)", contentClassName)}>
            {children}
          </div>
        ) : (
          children
        )}
      </Container>
    </section>
  );
}

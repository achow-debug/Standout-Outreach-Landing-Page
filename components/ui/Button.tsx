import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "inverse" | "link";
type ButtonSize = "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Trailing arrow for `link` variant (§6.1). */
  arrow?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans text-button transition-[background-color,box-shadow,transform,color,text-decoration-color] duration-(--dur-micro) ease-(--ease-out) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover hover:shadow-sm hover:-translate-y-px active:translate-y-0 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none",
  secondary:
    "border border-ink bg-surface text-ink hover:bg-surface-alt focus-visible:outline-brand",
  inverse:
    "bg-night-text text-ink hover:bg-white focus-visible:outline-night-accent",
  link: "bg-transparent text-brand underline-offset-4 hover:underline focus-visible:outline-brand",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-5",
  lg: "h-14 px-7",
};

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Shared CTA control (§6.1). Use everywhere: nav, hero, sections, footer.
 * Renders `<Link>` when `href` is set, otherwise `<button>`.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  arrow = false,
  ...rest
}: ButtonProps) {
  const showArrow = variant === "link" && arrow;
  const classes = cx(
    base,
    variants[variant],
    variant === "link" ? null : sizes[size],
    variant === "link" && showArrow
      ? "[&>svg]:transition-transform [&>svg]:duration-(--dur-micro) [&>svg]:ease-(--ease-out) hover:[&>svg]:translate-x-0.5"
      : null,
    /* Nav primary below 400px: tighter px so the label fits (§6.2) */
    variant !== "link" && size === "md"
      ? "max-[399px]:px-4"
      : null,
    className,
  );

  const content = (
    <>
      {children}
      {showArrow ? <Arrow /> : null}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as ButtonAsButton;
  return (
    <button type={buttonRest.type ?? "button"} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

type SectionLabelProps = {
  children: string;
  /** Light sections use purple on the lavender tint. Dark sections use lavender on a translucent white pill. */
  tone?: "light" | "dark";
};

const tones = {
  light: "bg-brand-lavender-tint text-brand-purple",
  dark: "bg-white/10 text-brand-lavender",
} as const;

/**
 * Section eyebrow. The heading under it stays the loudest element.
 * Parent stacks should keep a 12–16px gap before the heading.
 */
export function SectionLabel({ children, tone = "light" }: SectionLabelProps) {
  return (
    <p
      className={`section-label m-0 inline-flex items-center rounded-full px-3 py-1.5 font-sans text-[15px] leading-none font-semibold tracking-normal normal-case ${tones[tone]}`}
    >
      {children}
    </p>
  );
}

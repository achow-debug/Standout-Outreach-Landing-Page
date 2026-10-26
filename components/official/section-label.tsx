type SectionLabelProps = {
  children: string;
  id?: string;
};

/**
 * Section eyebrow. The heading under it stays the loudest element.
 * Parent stacks should keep a 12–16px gap before the heading.
 */
export function SectionLabel({ children, id }: SectionLabelProps) {
  return (
    <p
      id={id}
      className="section-label m-0 inline-flex items-center text-eyebrow text-ink-muted"
    >
      {children}
    </p>
  );
}

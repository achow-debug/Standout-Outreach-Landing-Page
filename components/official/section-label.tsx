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
      className="section-label m-0 inline-flex items-center px-0 py-1.5 font-sans text-[15px] leading-none font-semibold tracking-normal normal-case text-muted"
    >
      {children}
    </p>
  );
}

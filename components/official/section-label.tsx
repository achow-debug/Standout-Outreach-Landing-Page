import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type SectionLabelProps = {
  children: string;
  id?: string;
  /** Optional PathNode for left-aligned sections on How it works. */
  node?: ReactNode;
};

/**
 * Section eyebrow. Delegates to the shared Eyebrow (§6.4).
 */
export function SectionLabel({ children, id, node }: SectionLabelProps) {
  return (
    <Eyebrow node={node}>{id ? <span id={id}>{children}</span> : children}</Eyebrow>
  );
}

import {
  ToolChip,
  ToolChipGrid,
  ToolChipItem,
} from "@/components/ui/ToolChip";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.noDisruption;

/**
 * Tools section (§10.5). Centred heading; equal-width chip grid.
 * Placeholder icon tiles kept (§0.2, §6.5).
 */
export function NoDisruption() {
  return (
    <section
      id="no-disruption"
      className="section-y bg-paper"
      aria-labelledby="no-disruption-heading"
    >
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <h2
            id="no-disruption-heading"
            className="font-display text-h2 text-ink"
          >
            {copy.heading}
          </h2>
        </Reveal>
        <ToolChipGrid className="mt-12 w-full lg:mt-16">
          {copy.tools.map((tool, index) => {
            const src =
              "src" in tool && typeof tool.src === "string"
                ? tool.src
                : undefined;
            return (
              <ToolChipItem key={tool.id}>
                <Reveal index={index} className="h-full">
                  <ToolChip label={tool.name} src={src} className="w-full" />
                </Reveal>
              </ToolChipItem>
            );
          })}
        </ToolChipGrid>
      </Container>
    </section>
  );
}

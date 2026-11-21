import Image from "next/image";
import type { ReactNode } from "react";

type PlaceholderProps = {
  /** Reserved slot id for later embeds/images. */
  slot?: string;
  /**
   * Aspect ratio utility. Default `aspect-4/3` (§6.7).
   * Pass an existing ratio class when the layout already defines one.
   */
  aspectClassName?: string;
  className?: string;
  /** When set, renders next/image inside the same box (§6.7). */
  src?: string;
  alt?: string;
  sizes?: string;
  /** Applied to the image; default `object-cover`. Use `object-contain` for logos. */
  imageClassName?: string;
  children?: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Image / embed placeholder (§6.7, §0.2).
 * Keep position and size; only the fill token and aspect ratio are standardised.
 */
export function Placeholder({
  slot,
  aspectClassName = "aspect-4/3",
  className,
  src,
  alt = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  imageClassName = "object-cover",
  children,
}: PlaceholderProps) {
  return (
    <div
      className={cx(
        "relative w-full overflow-hidden rounded-lg",
        !src && "bg-line",
        aspectClassName,
        className,
      )}
      aria-hidden={src || children ? undefined : true}
      data-embed-slot={slot}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={imageClassName}
        />
      ) : (
        children
      )}
    </div>
  );
}

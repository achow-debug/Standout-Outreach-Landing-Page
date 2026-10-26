"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PhoneFrameProps = {
  src: string;
  alt: string;
  label: string;
};

/**
 * Narrow device outline for a product image in public/.
 * A missing file stays a labelled well. Dropping the file in later
 * fills the same frame without a code change.
 */
export function PhoneFrame({ src, alt, label }: PhoneFrameProps) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      if (!cancelled) setAvailable(true);
    };
    probe.onerror = () => {
      if (!cancelled) setAvailable(false);
    };
    probe.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <figure className="m-0 mx-auto w-full max-w-60">
      <div className="rounded-xl border border-line bg-surface p-2">
        <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-canvas">
          {available ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="240px"
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center">
              <p className="m-0 text-small text-ink-muted">
                {label}
              </p>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}

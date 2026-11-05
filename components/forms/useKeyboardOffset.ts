"use client";

import { useEffect, useState } from "react";

/**
 * iOS Safari ignores interactive-widget=resizes-content and lays the keyboard
 * over the page. This hook returns the overlap so a fixed ActionBar can move up.
 * On Android Chrome the offset stays near 0.
 */
export function useKeyboardOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () =>
      setOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return offset;
}

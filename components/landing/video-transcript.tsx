"use client";

import { useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

type VideoTranscriptProps = {
  label: string;
  transcript: string;
};

export function VideoTranscript({ label, transcript }: VideoTranscriptProps) {
  const openedRef = useRef(false);

  return (
    <details
      className="disclosure"
      onToggle={(event) => {
        const el = event.currentTarget;
        if (!el.open || openedRef.current) return;
        openedRef.current = true;
        trackEvent("transcript_open", {
          video_id: siteConfig.video.id,
          video_version: siteConfig.video.version,
        });
      }}
    >
      <summary>{label}</summary>
      <div className="disclosure-body">
        <p className="m-0 whitespace-pre-wrap">{transcript}</p>
      </div>
    </details>
  );
}

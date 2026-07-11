"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  hasSessionFlag,
  setSessionFlag,
  trackEvent,
} from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

const PROGRESS_MILESTONES = [25, 50, 75, 90] as const;

type EnquiryVideoPlayerProps = {
  mp4Path: string;
  captionsPath: string;
  posterPath: string | null;
  hasCaptions: boolean;
  hasPoster: boolean;
  fallbackMessage: string;
  directLinkLabel: string;
};

export function EnquiryVideoPlayer({
  mp4Path,
  captionsPath,
  posterPath,
  hasCaptions,
  hasPoster,
  fallbackMessage,
  directLinkLabel,
}: EnquiryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const durationRef = useRef<number | null>(null);

  const videoMeta = useCallback(() => {
    const duration =
      durationRef.current ??
      (videoRef.current && Number.isFinite(videoRef.current.duration)
        ? videoRef.current.duration
        : null);

    return {
      video_id: siteConfig.video.id,
      video_version: siteConfig.video.version,
      duration_seconds:
        duration !== null && Number.isFinite(duration)
          ? Math.round(duration)
          : null,
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      if (Number.isFinite(video.duration)) {
        durationRef.current = video.duration;
      }
    };

    const onPlay = () => {
      const flag = `video_play:${siteConfig.video.id}:${siteConfig.video.version}`;
      if (hasSessionFlag(flag)) return;
      setSessionFlag(flag);
      trackEvent("video_play", videoMeta());
    };

    const onTimeUpdate = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      const percent = (video.currentTime / video.duration) * 100;

      for (const milestone of PROGRESS_MILESTONES) {
        if (percent < milestone) continue;
        const flag = `video_progress:${siteConfig.video.id}:${siteConfig.video.version}:${milestone}`;
        if (hasSessionFlag(flag)) continue;
        setSessionFlag(flag);
        trackEvent("video_progress", {
          ...videoMeta(),
          milestone,
        });
      }
    };

    const onEnded = () => {
      trackEvent("video_complete", videoMeta());
    };

    const onError = () => {
      setPlaybackFailed(true);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, [videoMeta]);

  if (playbackFailed) {
    return (
      <div
        className="video-poster video-poster--error"
        style={{ aspectRatio: "16 / 9" }}
        role="alert"
      >
        <div className="video-poster-content">
          <p className="video-poster-subtitle">{fallbackMessage}</p>
          <p className="m-0">
            <a className="text-[var(--color-accent-soft)] underline" href={mp4Path}>
              {directLinkLabel}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-ink)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        controls
        playsInline
        preload="metadata"
        poster={hasPoster && posterPath ? posterPath : undefined}
      >
        <source src={mp4Path} type="video/mp4" />
        {hasCaptions ? (
          <track
            kind="captions"
            src={captionsPath}
            srcLang="en-GB"
            label="English"
            default
          />
        ) : null}
        {fallbackMessage}{" "}
        <a href={mp4Path}>{directLinkLabel}</a>
      </video>
    </div>
  );
}

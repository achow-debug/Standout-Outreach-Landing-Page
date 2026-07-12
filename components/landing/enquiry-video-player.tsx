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
  playLabel?: string;
};

/**
 * Focal breakdown player: custom play control until playback starts,
 * then native controls. No autoplay.
 */
export function EnquiryVideoPlayer({
  mp4Path,
  captionsPath,
  posterPath,
  hasCaptions,
  hasPoster,
  fallbackMessage,
  directLinkLabel,
  playLabel = "Play the full breakdown",
}: EnquiryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
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
      setHasStarted(true);
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

  async function startPlayback() {
    const video = videoRef.current;
    if (!video || playbackFailed) return;

    try {
      await video.play();
      setHasStarted(true);
    } catch {
      setPlaybackFailed(true);
    }
  }

  if (playbackFailed) {
    return (
      <div className="video-player" role="alert">
        <div className="video-player-frame video-player-frame--error">
          <div className="video-player-error">
            <p className="video-player-error-message">{fallbackMessage}</p>
            <p className="m-0">
              <a href={mp4Path}>{directLinkLabel}</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player">
      <div className="video-player-frame">
        <video
          ref={videoRef}
          className="video-player-media"
          controls={hasStarted}
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
          {fallbackMessage} <a href={mp4Path}>{directLinkLabel}</a>
        </video>

        {!hasStarted ? (
          <button
            type="button"
            className="video-player-play"
            aria-label={playLabel}
            onClick={startPlayback}
          >
            <span className="video-player-play-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M9 5.5v17l14-8.5L9 5.5z" fill="currentColor" />
              </svg>
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

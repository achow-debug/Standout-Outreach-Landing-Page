"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  hasSessionFlag,
  setSessionFlag,
  trackEvent,
} from "@/lib/analytics";
import { VIDEO_COMPLETE_EVENT } from "@/lib/landing-events";
import { siteConfig } from "@/lib/site-config";

const PROGRESS_MILESTONES = [25, 50, 75, 90] as const;
const DEFAULT_VIDEO_SRC = "/video/breakdown.mp4";
const DEFAULT_POSTER_SRC = "/video/poster.jpg";

type EnquiryVideoPlayerProps = {
  /** MP4 path. Defaults to `/video/breakdown.mp4`. */
  src?: string;
  captionsPath?: string;
  posterPath?: string | null;
  hasCaptions?: boolean;
  fallbackMessage: string;
  directLinkLabel: string;
  playLabel?: string;
};

/**
 * Focal breakdown player: poster facade until the visitor clicks play.
 * The MP4 is not requested until that click.
 */
export function EnquiryVideoPlayer({
  src = DEFAULT_VIDEO_SRC,
  captionsPath,
  posterPath = DEFAULT_POSTER_SRC,
  hasCaptions = false,
  fallbackMessage,
  directLinkLabel,
  playLabel = "Play the full breakdown",
}: EnquiryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const durationRef = useRef<number | null>(null);

  const showPoster = Boolean(posterPath) && !posterFailed;

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
    if (!hasActivated || playbackFailed) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.error) {
      setPlaybackFailed(true);
      return;
    }

    const disableCaptions = () => {
      for (const textTrack of video.textTracks) {
        textTrack.mode = "disabled";
      }
    };

    const onLoadedMetadata = () => {
      if (Number.isFinite(video.duration)) {
        durationRef.current = video.duration;
      }
      disableCaptions();
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
      window.dispatchEvent(new CustomEvent(VIDEO_COMPLETE_EVENT));
    };

    const onError = () => {
      setPlaybackFailed(true);
    };

    disableCaptions();
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", disableCaptions);
    video.addEventListener("play", onPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    void video.play().catch(() => {
      // Autoplay may be blocked; native controls remain available.
    });

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", disableCaptions);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, [videoMeta, hasActivated, playbackFailed]);

  function startPlayback() {
    if (playbackFailed || hasActivated) return;
    setHasActivated(true);
  }

  if (playbackFailed) {
    return (
      <div className="video-player" role="alert">
        <div className="video-player-frame video-player-frame--error">
          <div className="video-player-error">
            <p className="video-player-error-message">{fallbackMessage}</p>
            <p className="m-0">
              <a href={src}>{directLinkLabel}</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player">
      <div className="video-player-frame">
        {hasActivated ? (
          <video
            ref={videoRef}
            className="video-player-media"
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={showPoster ? posterPath! : undefined}
          >
            <source
              src={src}
              type="video/mp4"
              onError={() => setPlaybackFailed(true)}
            />
            {hasCaptions && captionsPath ? (
              <track
                kind="captions"
                src={captionsPath}
                srcLang="en-GB"
                label="English"
              />
            ) : null}
            {fallbackMessage}{" "}
            <a href={src}>{directLinkLabel}</a>
          </video>
        ) : (
          <>
            {showPoster ? (
              <img
                className="video-player-media"
                src={posterPath!}
                alt=""
                decoding="async"
                fetchPriority="high"
                onError={() => setPosterFailed(true)}
              />
            ) : null}
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
          </>
        )}
      </div>
    </div>
  );
}

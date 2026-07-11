import { EnquiryVideoPlayer } from "@/components/landing/enquiry-video-player";
import { HeroVideoCta } from "@/components/landing/hero-video-cta";
import { VideoPosterPlaceholder } from "@/components/landing/video-poster-placeholder";
import { VideoTranscript } from "@/components/landing/video-transcript";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";
import { getVideoAssetStatus } from "@/lib/video-assets";

/**
 * Focused hero/video surface: compact promise + video in the first viewport.
 * Desktop places copy beside the player; mobile stacks a short hero above it.
 */
export function Hero() {
  const { hero, video } = landingCopy;
  const assets = siteConfig.video;
  const status = getVideoAssetStatus();

  return (
    <header className="hero-surface">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="brand-mark">
            <span className="brand-mark-name">{siteConfig.businessName}</span>
            <span className="brand-mark-line" aria-hidden="true" />
          </p>
          <p className="hero-eyebrow">{hero.eyebrow}</p>
          <h1 className="hero-title">{hero.h1}</h1>
          <p className="hero-supporting">{hero.supporting}</p>
          <p className="hero-cta">
            <HeroVideoCta label={hero.primaryCta} targetId="video" />
          </p>
          <p className="hero-identity">{siteConfig.proofLine}</p>
        </div>

        <div className="hero-media">
          <h2 id="video-heading" className="sr-only">
            {video.heading}
          </h2>
          <div id="video" className="hero-video-frame scroll-mt-6" tabIndex={-1}>
            <span className="handoff-line handoff-line--video" aria-hidden="true" />
            {status.ready ? (
              <EnquiryVideoPlayer
                mp4Path={assets.mp4Path}
                captionsPath={assets.captionsPath}
                posterPath={status.poster ? assets.posterPath : null}
                hasCaptions={status.captions}
                hasPoster={status.poster}
                fallbackMessage={video.fallbackMessage}
                directLinkLabel={video.directLinkLabel}
              />
            ) : (
              <VideoPosterPlaceholder
                title={video.posterTitle}
                subtitle={video.posterSubtitle}
                durationLabel={siteConfig.video.durationLabel}
              />
            )}
          </div>
          <p className="hero-video-label">{video.heading}</p>
          <VideoTranscript
            label={video.transcriptLabel}
            transcript={video.transcript}
          />
        </div>
      </div>
    </header>
  );
}

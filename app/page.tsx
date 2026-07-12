import { AnalyticsBootstrap } from "@/components/landing/analytics-bootstrap";
import { EnquiryVideoPlayer } from "@/components/landing/enquiry-video-player";
import { Hero } from "@/components/landing/hero";
import { MinimalFooter } from "@/components/landing/minimal-footer";
import { ReassuranceBlock } from "@/components/landing/reassurance-block";
import { ReviewRequestCta } from "@/components/landing/review-request-cta";
import { VideoPosterPlaceholder } from "@/components/landing/video-poster-placeholder";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";
import { getVideoAssetStatus } from "@/lib/video-assets";

/**
 * Redesign page shell. Phase 8 — responsive, accessibility and QA.
 */
export default function HomePage() {
  const { video } = landingCopy;
  const assets = siteConfig.video;
  const status = getVideoAssetStatus();

  return (
    <>
      <AnalyticsBootstrap />
      <main id="main-content" tabIndex={-1}>
        <div className="page-shell">
          <Hero />

          <section
            id="video"
            className="video-section"
            aria-label={video.sectionLabel}
          >
            {status.ready ? (
              <EnquiryVideoPlayer
                mp4Path={assets.mp4Path}
                captionsPath={assets.captionsPath}
                posterPath={status.poster ? assets.posterPath : null}
                hasCaptions={status.captions}
                hasPoster={status.poster}
                fallbackMessage={video.fallbackMessage}
                directLinkLabel={video.directLinkLabel}
                playLabel={video.playLabel}
              />
            ) : (
              <VideoPosterPlaceholder
                title={video.posterTitle}
                subtitle={video.posterSubtitle}
              />
            )}
          </section>

          <ReassuranceBlock />

          <ReviewRequestCta />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}

import { AnalyticsBootstrap } from "@/components/landing/analytics-bootstrap";
import { EnquiryVideoPlayer } from "@/components/landing/enquiry-video-player";
import { Hero } from "@/components/landing/hero";
import { MinimalFooter } from "@/components/landing/minimal-footer";
import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { ReassuranceBlock } from "@/components/landing/reassurance-block";
import {
  MobileStickyCta,
  ReviewRequestCta,
  ReviewRequestShell,
} from "@/components/landing/review-request-cta";
import { VideoBridgeLink } from "@/components/landing/video-bridge-link";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";
import { getVideoAssetStatus } from "@/lib/video-assets";

/**
 * Landing page: hero → bridge → video → trust → CTA → footer.
 */
export default function HomePage() {
  const { video } = landingCopy;
  const assets = siteConfig.video;
  const status = getVideoAssetStatus();

  return (
    <>
      <AnalyticsBootstrap />
      <MotionBootstrap />
      <main id="main-content" tabIndex={-1}>
        <ReviewRequestShell>
          <div className="page-shell flex flex-col items-center gap-5 pb-12 md:gap-8 md:pb-8">
            <Hero />

            <div data-reveal>
              <VideoBridgeLink />
            </div>

            <section
              id="video"
              className="video-section w-full"
              aria-label={video.sectionLabel}
              data-reveal
            >
              <EnquiryVideoPlayer
                src={assets.mp4Path}
                captionsPath={assets.captionsPath}
                posterPath={status.poster ? assets.posterPath : null}
                hasCaptions={status.captions}
                fallbackMessage={video.fallbackMessage}
                directLinkLabel={video.directLinkLabel}
                playLabel={video.playLabel}
              />
            </section>

            <ReassuranceBlock />

            <ReviewRequestCta />
          </div>
          <MobileStickyCta />
        </ReviewRequestShell>
      </main>
      <MinimalFooter />
    </>
  );
}

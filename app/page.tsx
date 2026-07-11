import { AnalyticsBootstrap } from "@/components/landing/analytics-bootstrap";
import { Hero } from "@/components/landing/hero";
import { JourneyMechanism } from "@/components/landing/journey-mechanism";
import { MinimalFooter } from "@/components/landing/minimal-footer";
import { ReviewRequestForm } from "@/components/landing/review-request-form";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : {};
  const requestStatus = typeof params.request === "string" ? params.request : null;

  return (
    <>
      <AnalyticsBootstrap />
      <main id="main-content" tabIndex={-1}>
        <div className="page-shell">
          <Hero />
        </div>
        <JourneyMechanism />
        <div className="page-shell">
          <ReviewRequestForm
            initialStatus={
              requestStatus === "received"
                ? "received"
                : requestStatus === "error"
                  ? "error"
                  : null
            }
          />
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}

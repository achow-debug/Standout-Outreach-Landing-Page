type VideoPosterPlaceholderProps = {
  title: string;
  subtitle: string;
};

/**
 * Development / missing-asset stand-in only.
 * Must not look like a finished product thumbnail.
 */
export function VideoPosterPlaceholder({
  title,
  subtitle,
}: VideoPosterPlaceholderProps) {
  return (
    <div
      className="video-player w-full"
      role="status"
      aria-label={`${title}. ${subtitle}`}
    >
      <div className="video-player-frame video-player-frame--missing aspect-video w-full rounded-2xl border border-ink bg-ink p-6 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
        <div className="video-player-error flex flex-col items-center justify-center gap-2 text-center">
          <p className="video-player-error-title text-xs font-medium tracking-wide text-[color:var(--official-muted-on-dark)]">
            {title}
          </p>
          <p className="video-player-error-message text-xs font-medium tracking-wide text-[color:var(--official-muted-on-dark)]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

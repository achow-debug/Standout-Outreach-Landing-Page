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
      <div className="video-player-frame video-player-frame--missing aspect-video w-full rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
        <div className="video-player-error flex flex-col items-center justify-center gap-2 text-center">
          <p className="video-player-error-title text-xs font-medium tracking-wide text-slate-300">
            {title}
          </p>
          <p className="video-player-error-message text-xs font-medium tracking-wide text-slate-300">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

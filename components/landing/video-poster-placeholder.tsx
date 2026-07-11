type VideoPosterPlaceholderProps = {
  title: string;
  subtitle: string;
  durationLabel: string;
};

/**
 * Prospect-facing poster stand-in until the real MP4/poster ship.
 * Communicates value without exposing file paths or build instructions.
 */
export function VideoPosterPlaceholder({
  title,
  subtitle,
  durationLabel,
}: VideoPosterPlaceholderProps) {
  return (
    <div
      className="video-poster"
      style={{ aspectRatio: "16 / 9" }}
      role="img"
      aria-label={`${title}. ${subtitle}. ${durationLabel}.`}
    >
      <div className="video-poster-atmosphere" aria-hidden="true" />
      <div className="video-poster-content">
        <p className="video-poster-duration">{durationLabel}</p>
        <p className="video-poster-title">{title}</p>
        <p className="video-poster-subtitle">{subtitle}</p>
        <span className="video-poster-play" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4.5v11l9-5.5-9-5.5z" fill="currentColor" />
          </svg>
        </span>
      </div>
    </div>
  );
}

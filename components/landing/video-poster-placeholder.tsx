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
      className="video-player"
      role="status"
      aria-label={`${title}. ${subtitle}`}
    >
      <div className="video-player-frame video-player-frame--missing">
        <div className="video-player-error">
          <p className="video-player-error-title">{title}</p>
          <p className="video-player-error-message">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

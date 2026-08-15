/**
 * Image slot with a branded fallback.
 *
 * The catalogue has an `image` column but no photography yet, so anything
 * without a file renders a tinted placeholder in the category accent colour.
 * Drop files into /public and set `services.image` to start using real photos.
 */
export default function Media({ src, alt = '', accent = 'cream', label, variant = '', className = '' }) {
  const classes = ['media', variant && `media--${variant}`, `accent-${accent}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="media__placeholder" role="presentation">
          <span className="media__initial">{(label || alt || 'E').trim().charAt(0)}</span>
        </div>
      )}
    </div>
  );
}

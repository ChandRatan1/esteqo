import { useEffect, useRef, useState } from 'react';

/**
 * A circular photo that swaps as the page is scrolled: scrolling down shows
 * the first image, scrolling back up shows the second. Both are rendered and
 * cross-faded, so the swap never flashes an empty frame.
 *
 * Honours prefers-reduced-motion by simply holding the first image.
 */
export default function ScrollSwapImage({ images, alt = '' }) {
  const [index, setIndex] = useState(0);
  const lastY = useRef(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    lastY.current = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY.current;
        // Ignore sub-pixel jitter so the image does not flicker mid-scroll.
        if (Math.abs(delta) < 6) return;
        setIndex(delta > 0 ? 0 : 1);
        lastY.current = y;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [images.length]);

  return (
    <div className="scroll-swap" aria-label={alt} role="img">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`scroll-swap__img${i === index ? ' scroll-swap__img--on' : ''}`}
          loading="lazy"
        />
      ))}
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Arrow-driven horizontal slider.
 *
 * Scrolling stays native (a real overflow container plus scroll-snap), so the
 * row still swipes on touch and remains keyboard reachable — the arrows just
 * drive the same container instead of reimplementing it with transforms.
 *
 * @param {string} itemSelector class of one slide, used to measure the step
 */
export function useSlider(itemSelector) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  const slide = useCallback(
    (direction) => {
      const el = trackRef.current;
      if (!el) return;
      const item = el.querySelector(itemSelector);
      // One card plus its gap, so a click always lands cleanly on the next one.
      const step = item ? item.offsetWidth + 24 : el.clientWidth * 0.8;
      el.scrollBy({ left: direction * step, behavior: 'smooth' });
    },
    [itemSelector]
  );

  return { trackRef, atStart, atEnd, sync, slide };
}

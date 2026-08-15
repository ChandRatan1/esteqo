import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an API call on mount and whenever `deps` change.
 * Aborts the in-flight request when deps change or the component unmounts.
 *
 *   const { data, loading, error, reload } = useApi(
 *     (opts) => api.getService(slug, opts),
 *     [slug]
 *   );
 */
export function useApi(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    Promise.resolve(fetcherRef.current({ signal: controller.signal }))
      .then((payload) => {
        if (active) setState({ data: payload?.data ?? payload, loading: false, error: null });
      })
      .catch((error) => {
        if (!active || error.name === 'AbortError') return;
        setState({ data: null, loading: false, error });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { ...state, reload };
}

/** Scrolls to the top on every route change. */
export function useScrollToTop(pathname) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
}

/** Sets document.title and the meta description for a page. */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = `${title} | ESTEQO`;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}

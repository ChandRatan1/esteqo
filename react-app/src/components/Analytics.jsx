import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics 4, switched on by VITE_GA_ID in react-app/.env
 * (a measurement id such as G-XXXXXXXXXX). With it blank nothing loads and
 * no request leaves the page. Because this is a single-page app, a page_view
 * is sent by hand on every route change — GA's automatic one only fires on
 * the first load.
 */
const GA_ID = import.meta.env.VITE_GA_ID || '';

let loaded = false;

function load() {
  if (loaded || !GA_ID) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
  };
  window.gtag('js', new Date());
  // send_page_view false: route changes below report every view, including the first.
  window.gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

export default function Analytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!GA_ID) return;
    load();
    window.gtag('event', 'page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}

import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useContactLinks } from '../context/SiteContext';
import { useScrollToTop } from '../hooks/useApi';

function StickyBar() {
  const links = useContactLinks();
  return (
    <div className="sticky-bar">
      <a href={links.tel}>Call</a>
      <a href={links.whatsapp} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
      <Link to="/appointment">Book</Link>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useScrollToTop(pathname);

  return (
    <>
      <a href="#main" className="sr-only">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}

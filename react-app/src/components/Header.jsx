import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useContactLinks, useSite } from '../context/SiteContext';

const NAV = [
  { label: 'Services', to: '/services', mega: true },
  { label: 'About', to: '/about' },
  { label: 'Values', to: '/values' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

function Caret() {
  return (
    <svg className="nav__caret" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default function Header() {
  const { brand, contact, categories } = useSite();
  const links = useContactLinks();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerServices, setDrawerServices] = useState(false);
  const megaTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route changes close every overlay.
  useEffect(() => {
    setMegaOpen(false);
    setDrawerOpen(false);
    setDrawerServices(false);
  }, [location.pathname]);

  // Lock body scroll behind the drawer.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setMegaOpen(false);
      setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Small delay stops the panel flickering as the pointer crosses the gap.
  const openMega = () => {
    clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  const Brand = (
    <Link to="/" className="brand" aria-label={`${brand.site_name} home`}>
      <span className="brand__mark">{brand.site_name}</span>
      <span className="brand__tag">Brows · Lasers · Skin</span>
    </Link>
  );

  return (
    <>
      <div className="announce">
        <div className="container announce__inner">
          <span className="announce__hide-sm">{brand.site_tagline}</span>
          <a href={links.tel}>Call {contact.phone}</a>
        </div>
      </div>

      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <div className="container header__inner">
          {Brand}

          <nav className="nav" aria-label="Primary">
            {NAV.map((item) =>
              item.mega ? (
                <div
                  key={item.to}
                  className={`nav__item${megaOpen ? ' nav__item--open' : ''}`}
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <NavLink
                    to={item.to}
                    className="nav__link"
                    aria-expanded={megaOpen}
                    onClick={() => setMegaOpen(false)}
                  >
                    {item.label}
                    <Caret />
                  </NavLink>

                  {megaOpen && categories.length > 0 && (
                    <div className="mega">
                      <div className="mega__grid">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            to={`/services/${category.slug}`}
                            className="mega__link"
                          >
                            <span className="mega__name">{category.name}</span>
                            <span className="mega__meta">
                              {category.serviceCount}{' '}
                              {category.serviceCount === 1 ? 'treatment' : 'treatments'}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="mega__footer">
                        <Link to="/services" className="link-underline">
                          View the full treatment menu
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="nav__item" key={item.to}>
                  <NavLink to={item.to} className="nav__link">
                    {item.label}
                  </NavLink>
                </div>
              )
            )}
          </nav>

          <div className="header__actions">
            <a className="header__phone" href={links.tel}>
              {contact.phone}
            </a>
            <Link to="/appointment" className="btn btn--primary header__cta">
              Book Now
            </Link>
            <button
              type="button"
              className="burger"
              aria-label="Toggle menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="container drawer__head">
            {Brand}
            <button
              type="button"
              className="burger"
              aria-label="Close menu"
              aria-expanded="true"
              onClick={() => setDrawerOpen(false)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <div className="container drawer__body">
            <button
              type="button"
              className="drawer__link"
              style={{ width: '100%', textAlign: 'left' }}
              aria-expanded={drawerServices}
              onClick={() => setDrawerServices((open) => !open)}
            >
              Services
            </button>
            {drawerServices && (
              <div className="drawer__sub">
                <Link to="/services" className="drawer__sublink">
                  All treatments
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/services/${category.slug}`}
                    className="drawer__sublink"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {NAV.filter((item) => !item.mega).map((item) => (
              <Link key={item.to} to={item.to} className="drawer__link">
                {item.label}
              </Link>
            ))}

            <div className="drawer__foot">
              <Link to="/appointment" className="btn btn--primary btn--block">
                Book an appointment
              </Link>
              <a href={links.whatsapp} className="btn btn--secondary btn--block" target="_blank" rel="noreferrer">
                WhatsApp us
              </a>
              <a href={links.tel} className="btn btn--secondary btn--block">
                Call {contact.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

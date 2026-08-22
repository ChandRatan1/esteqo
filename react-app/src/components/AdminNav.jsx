import { NavLink } from 'react-router-dom';

/**
 * Shared tab bar across every /admin/* screen, so moving between blog,
 * services, enquiries and the SEO tools feels like one admin area rather than
 * five separate pages. All of it sits behind the same admin password.
 */

const TABS = [
  { label: 'Blogs', to: '/admin/blog' },
  { label: 'Services', to: '/admin/services' },
  { label: 'Enquiries', to: '/admin/contacts' },
  { label: 'Page SEO', to: '/admin/seo' },
  { label: 'robots.txt', to: '/admin/robots' },
];

export default function AdminNav() {
  return (
    <div className="admin-nav">
      <div className="admin-nav__brand">ESTEQO Admin</div>
      <nav className="admin-nav__tabs" aria-label="Admin sections">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `admin-nav__tab${isActive ? ' admin-nav__tab--active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

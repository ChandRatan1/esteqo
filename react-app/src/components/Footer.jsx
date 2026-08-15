import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useContactLinks, useSite } from '../context/SiteContext';

function SocialIcon({ name }) {
  const paths = {
    facebook: 'M13 22v-8h2.7l.4-3H13V9.1c0-.9.2-1.5 1.5-1.5H16V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9V11H7.5v3H10v8h3z',
    instagram:
      'M12 7.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm5.8-7.8a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM21 8.1c-.1-1.5-.4-2.8-1.5-3.8-1-1-2.3-1.4-3.8-1.5C14.3 2.7 9.7 2.7 8.3 2.8c-1.5.1-2.8.4-3.8 1.5-1 1-1.4 2.3-1.5 3.8-.1 1.4-.1 6 0 7.4.1 1.5.4 2.8 1.5 3.8 1 1 2.3 1.4 3.8 1.5 1.4.1 6 .1 7.4 0 1.5-.1 2.8-.4 3.8-1.5 1-1 1.4-2.3 1.5-3.8.1-1.4.1-6 0-7.4zm-1.9 8.9c-.3.8-.9 1.4-1.7 1.7-1.2.5-4 .4-5.4.4s-4.2.1-5.4-.4c-.8-.3-1.4-.9-1.7-1.7-.5-1.2-.4-4-.4-5.4s-.1-4.2.4-5.4c.3-.8.9-1.4 1.7-1.7 1.2-.5 4-.4 5.4-.4s4.2-.1 5.4.4c.8.3 1.4.9 1.7 1.7.5 1.2.4 4 .4 5.4s.1 4.2-.4 5.4z',
    youtube:
      'M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C15.9 4 12 4 12 4s-3.9 0-6.8.3c-.4 0-1.3 0-2 .9-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.2 6.6.3 6.6.3s3.9 0 6.8-.3c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.6c0-1.7-.2-3.3-.2-3.3zM10.1 14V8.9l5 2.6-5 2.5z',
  };

  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: 'sending', message: '' });
    try {
      const response = await api.subscribe({ email, source: 'footer' });
      setStatus({ state: 'done', message: response.data.message });
      setEmail('');
    } catch (error) {
      setStatus({ state: 'error', message: error.message });
    }
  };

  return (
    <form className="footer__newsletter" onSubmit={submit} noValidate>
      <p className="footer__blurb" style={{ marginTop: 0 }}>
        Treatment guides and clinic news. No spam, unsubscribe any time.
      </p>
      <div className="field" style={{ marginTop: 18 }}>
        <label htmlFor="footer-email">Email address</label>
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          placeholder="you@example.com"
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn--light"
        style={{ marginTop: 14 }}
        disabled={status.state === 'sending'}
      >
        {status.state === 'sending' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status.message && (
        <p
          className="footer__blurb"
          style={{ marginTop: 14, color: status.state === 'error' ? '#ffb4a4' : 'inherit' }}
          role="status"
        >
          {status.message}
        </p>
      )}
    </form>
  );
}

export default function Footer() {
  const { brand, contact, social, categories } = useSite();
  const links = useContactLinks();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="brand__mark">{brand.site_name}</span>
            <p className="footer__blurb">
              {brand.site_tagline} Clinically planned skin, brow and laser treatments led by{' '}
              {brand.founder_name} in Sector 25, Noida.
            </p>
            <div className="footer__social">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <SocialIcon name="facebook" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <SocialIcon name="instagram" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                  <SocialIcon name="youtube" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className="footer__title">Treatments</h2>
            <ul className="footer__list">
              {categories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link to={`/services/${category.slug}`}>{category.name}</Link>
                </li>
              ))}
              <li>
                <Link to="/services">All treatments</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer__title">Clinic</h2>
            <ul className="footer__list">
              <li>
                <Link to="/about">About ESTEQO</Link>
              </li>
              <li>
                <Link to="/values">Our values &amp; FAQ</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/appointment">Book an appointment</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer__title">Visit &amp; contact</h2>
            <ul className="footer__contact">
              <li>
                <a href={links.maps} target="_blank" rel="noreferrer">
                  <strong>{contact.address_line1}</strong>
                  {contact.address_line2}
                </a>
              </li>
              <li>
                <a href={links.tel}>
                  <strong>Call</strong>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={links.mail}>
                  <strong>Email</strong>
                  {contact.email}
                </a>
              </li>
              <li>
                <strong>Opening hours</strong>
                {contact.hours_weekday}
                <br />
                {contact.hours_sunday}
              </li>
            </ul>
            <div style={{ marginTop: 28 }}>
              <h2 className="footer__title">Newsletter</h2>
              <Newsletter />
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            Copyright © {new Date().getFullYear()} By{' '}
            <a href="https://esteqo.com/" target="_blank" rel="noreferrer">
              {brand.site_name}
            </a>
            , created By{' '}
            <a href="https://ndminfotech.com/" target="_blank" rel="noreferrer">
              NDM Infotech
            </a>
          </span>
          <div className="footer__legal">
            <Link to="/values">Values</Link>
            <Link to="/contact">Contact</Link>
            <a href={links.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

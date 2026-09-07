import { useContactLinks, useSite } from '../context/SiteContext';

/**
 * Fixed call and WhatsApp buttons in the bottom-right corner — the pattern
 * most service sites use so a visitor can reach the clinic from any page
 * without scrolling back to the header or footer.
 *
 * Both links come from the same contact config as the rest of the site (see
 * useContactLinks), so the number only ever has to be changed in one place.
 * On phones these sit above the sticky action bar rather than on top of it.
 */
export default function FloatingContact() {
  const links = useContactLinks();
  const { contact } = useSite();

  return (
    <div className="float-contact">
      <a
        className="float-contact__btn float-contact__btn--whatsapp"
        href={links.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label={`Message ESTEQO on WhatsApp at ${contact.whatsapp || contact.phone}`}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.7 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 01-2.4-1.5 9 9 0 01-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.6v-.5l-.9-2.2c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
          <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.4A10 10 0 1012 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2z" />
        </svg>
      </a>

      <a
        className="float-contact__btn float-contact__btn--call"
        href={links.tel}
        aria-label={`Call ESTEQO on ${contact.phone}`}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M6.6 3h2.5l1.6 4-2 1.3a12 12 0 005 5l1.3-2 4 1.6v2.5a2 2 0 01-2.2 2A16.8 16.8 0 014.6 5.2 2 2 0 016.6 3z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

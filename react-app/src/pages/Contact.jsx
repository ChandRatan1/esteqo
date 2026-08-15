import { usePageMeta } from '../hooks/useApi';
import { useContactLinks, useSite } from '../context/SiteContext';
import EnquiryForm from '../components/EnquiryForm';
import { PageHero } from '../components/Sections';

export default function Contact() {
  const { contact, social } = useSite();
  const links = useContactLinks();

  usePageMeta(
    'Contact',
    'ESTEQO, Shop No. 209, First Floor, Modi Mall, Sector 25, Noida. Call +91 8010135135 or send us a message.'
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Come and see us"
        text="Sector 25, Noida — easy to reach from across Noida, Greater Noida, Ghaziabad and Delhi NCR."
        accent="light-blue"
      />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h2>Clinic details</h2>
              <hr className="rule" />
              <dl className="contact-list">
                <div>
                  <dt>Address</dt>
                  <dd>
                    <a href={links.maps} target="_blank" rel="noreferrer">
                      {contact.address_line1}
                      <br />
                      {contact.address_line2}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={links.tel}>{contact.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={links.mail}>{contact.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Opening hours</dt>
                  <dd>
                    {contact.hours_weekday}
                    <br />
                    {contact.hours_sunday}
                  </dd>
                </div>
                {social.instagram && (
                  <div>
                    <dt>Instagram</dt>
                    <dd>
                      <a href={social.instagram} target="_blank" rel="noreferrer">
                        @esteqo_care
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="btn-row" style={{ marginTop: 36 }}>
                <a href={links.whatsapp} className="btn btn--primary" target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>
                <a href={links.tel} className="btn btn--secondary">
                  Call now
                </a>
              </div>
            </div>

            <EnquiryForm variant="contact" />
          </div>
        </div>
      </section>

      <section aria-label="Clinic location map">
        <iframe
          className="map"
          title="ESTEQO clinic location"
          src={links.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}

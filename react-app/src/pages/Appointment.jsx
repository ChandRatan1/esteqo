import { useSearchParams } from 'react-router-dom';
import { useContactLinks, useSite } from '../context/SiteContext';
import EnquiryForm from '../components/EnquiryForm';
import { PageHero } from '../components/Sections';
import Seo from '../seo/Seo';

export default function Appointment() {
  const [searchParams] = useSearchParams();
  const { contact } = useSite();
  const links = useContactLinks();


  return (
    <>
      <Seo
        title="Book an Appointment"
        description="Request an appointment at ESTEQO, Sector 25 Noida. Every service begins with a detailed skin consultation."
        breadcrumbs={[{ name: 'Appointment', path: '/appointment' }]}
      />

      <PageHero
        eyebrow="Appointments"
        title="Book your consultation"
        text="Tell us what you would like to work on and when suits you. We will confirm your slot by your preferred contact method."
        accent="cream"
      />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h2>Before you book</h2>
              <hr className="rule" />
              <p className="lede">
                Every service begins with a detailed skin consultation, which is how we decide the
                right protocol rather than the most popular one.
              </p>

              <dl className="contact-list" style={{ marginTop: 36 }}>
                <div>
                  <dt>Call or WhatsApp</dt>
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
                    {contact.hours}
                  </dd>
                </div>
                <div>
                  <dt>Clinic</dt>
                  <dd>
                    {contact.address_line1}
                    <br />
                    {contact.address_line2}
                  </dd>
                </div>
              </dl>
            </div>

            <EnquiryForm variant="appointment" presetService={searchParams.get('service') || ''} />
          </div>
        </div>
      </section>
    </>
  );
}

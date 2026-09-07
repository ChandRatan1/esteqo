import { useContactLinks, useSite } from '../context/SiteContext';
import { CtaBand, PageHero } from '../components/Sections';
import Seo from '../seo/Seo';

const STEPS = [
  {
    num: '01',
    title: 'Refer a friend',
    text: 'Share ESTEQO with a friend, family member or colleague — by WhatsApp, a call or in person.',
  },
  {
    num: '02',
    title: 'They book their first visit',
    text: 'They mention your name when booking their first appointment with us.',
  },
  {
    num: '03',
    title: 'You both get rewarded',
    text: "Once their appointment is complete, we'll get in touch with you both about your referral reward.",
  },
];

export default function ReferralProgram() {
  const { brand } = useSite();
  const links = useContactLinks();

  return (
    <>
      <Seo
        title="Referral Program"
        description={`Refer a friend to ${brand.site_name} and you both get rewarded once they complete their first visit.`}
        breadcrumbs={[{ name: 'Referral Program', path: '/referral-program' }]}
      />

      <PageHero
        eyebrow="Share the glow"
        title="Referral Program"
        text="Know someone who'd love ESTEQO? Refer them and you both get rewarded."
      />

      <section className="section">
        <div className="container container--narrow">
          <div className="values">
            {STEPS.map((step) => (
              <div className="value" key={step.num}>
                <span className="value__num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>

          <p className="lede" style={{ marginTop: 'var(--module-spacing-small)' }}>
            Reward details are confirmed when your friend books — message us on WhatsApp or call the
            clinic and we'll walk you through how it works.
          </p>

          <div className="btn-row" style={{ marginTop: 24 }}>
            <a href={links.whatsapp} className="btn btn--primary" target="_blank" rel="noreferrer">
              Ask about the referral programme
            </a>
          </div>
        </div>
      </section>

      <CtaBand title="Ready to refer a friend?" text="Message us on WhatsApp and we'll take it from there." />
    </>
  );
}

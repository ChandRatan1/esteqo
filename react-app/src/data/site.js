/**
 * Site-wide content: brand and contact details, enquiry form options, blog
 * posts, FAQs, team and testimonials. Bundled with the app so the front end
 * runs without a backend.
 */

export const settings = {
  brand: {
    site_name: 'ESTEQO',
    site_tagline: 'Brows | Lasers | Skin',
    hero_subtitle:
      'Clinically planned treatments for visible results and long-term skin confidence.',
    founder_name: 'Seema Nanda',
    founder_title: 'Founder & Lead Cosmetologist',
  },
  contact: {
    phone: '+91 8010135135',
    phone_link: '+918010135135',
    whatsapp: '+918010135135',
    email: 'Info.esteqo@gmail.com',
    address_line1: 'ESTEQO, Shop No. 209, First Floor, Modi Mall',
    address_line2: 'Sector 25, Noida, Uttar Pradesh – 201301',
    map_query: 'Modi Mall, Sector 25, Noida, Uttar Pradesh 201301',
    hours_weekday: 'Mon – Sat: 9:00 am – 8:00 pm',
    hours_sunday: 'Sunday: 10:00 am – 3:00 pm',
    website: 'www.esteqo.co.in',
  },
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/esteqo_care/',
    youtube: 'https://www.youtube.com/@cosmetologistseemanandaest4431',
  },
};

/**
 * Enquiry delivery.
 *
 * `enquirySender` is the account the form service sends through — the address
 * the FormSubmit endpoint is registered to. `enquiryCc` is copied on every
 * submission. Both inboxes receive every enquiry.
 *
 * Submissions are posted directly from the browser; the visitor's mail app is
 * never opened. See src/api/forms.js.
 */
/** The "to" address — the inbox the FormSubmit endpoint is registered to. */
export const enquirySender = 'ratanchandbind4056@gmail.com';

/** Copied on every enquiry. Add more addresses here and they are all CC'd. */
export const enquiryCc = ['neetukumarseo00@gmail.com','provadoindia@gmail.com'];

/** Every inbox that receives enquiries. */
export const enquiryRecipients = [enquirySender, ...enquiryCc];

/** Location dropdown for the enquiry forms — Noida sectors first, then nearby. */
export const locationGroups = [
  {
    label: 'Noida',
    options: [
      'Noida – Sector 15',
      'Noida – Sector 16',
      'Noida – Sector 18',
      'Noida – Sector 19',
      'Noida – Sector 22',
      'Noida – Sector 25 (clinic)',
      'Noida – Sector 26',
      'Noida – Sector 27',
      'Noida – Sector 28',
      'Noida – Sector 29',
      'Noida – Sector 30',
      'Noida – Sector 31',
      'Noida – Sector 34',
      'Noida – Sector 37',
      'Noida – Sector 44',
      'Noida – Sector 45',
      'Noida – Sector 46',
      'Noida – Sector 47',
      'Noida – Sector 50',
      'Noida – Sector 51',
      'Noida – Sector 52',
      'Noida – Sector 61',
      'Noida – Sector 62',
      'Noida – Sector 63',
      'Noida – Sector 70',
      'Noida – Sector 71',
      'Noida – Sector 72',
      'Noida – Sector 74',
      'Noida – Sector 75',
      'Noida – Sector 76',
      'Noida – Sector 77',
      'Noida – Sector 78',
      'Noida – Sector 93',
      'Noida – Sector 100',
      'Noida – Sector 104',
      'Noida – Sector 107',
      'Noida – Sector 110',
      'Noida – Sector 117',
      'Noida – Sector 118',
      'Noida – Sector 120',
      'Noida – Sector 121',
      'Noida – Sector 122',
      'Noida – Sector 128',
      'Noida – Sector 137',
      'Noida – Sector 143',
      'Noida – Sector 150',
      'Noida – Other sector',
    ],
  },
  {
    label: 'Greater Noida',
    options: [
      'Greater Noida – Alpha',
      'Greater Noida – Beta',
      'Greater Noida – Gamma',
      'Greater Noida – Delta',
      'Greater Noida West (Noida Extension)',
      'Pari Chowk',
      'Knowledge Park',
      'Greater Noida – Other',
    ],
  },
  {
    label: 'Ghaziabad',
    options: [
      'Indirapuram',
      'Vaishali',
      'Vasundhara',
      'Kaushambi',
      'Crossings Republik',
      'Raj Nagar Extension',
      'Ghaziabad – Other',
    ],
  },
  {
    label: 'New Delhi',
    options: [
      'East Delhi (Preet Vihar, Mayur Vihar)',
      'South Delhi (Saket, GK, Nehru Place)',
      'Central Delhi (CP, Karol Bagh)',
      'West Delhi (Rajouri, Janakpuri)',
      'North Delhi (Model Town, Rohini)',
      'Dwarka',
      'New Delhi – Other',
    ],
  },
  {
    label: 'Nearby',
    options: ['Faridabad', 'Gurugram', 'Sahibabad', 'Dadri', 'Other / not listed'],
  },
];

/** Preferred-time options. The forms also accept a manually typed time. */
export const timeSlots = [
  '09:00 am',
  '10:00 am',
  '11:00 am',
  '12:00 pm',
  '01:00 pm',
  '02:00 pm',
  '03:00 pm',
  '04:00 pm',
  '05:00 pm',
  '06:00 pm',
  '07:00 pm',
];

export const blogCategories = [
  { slug: 'skin-science', name: 'Skin Science', description: 'How treatments actually work, explained without the marketing.' },
  { slug: 'treatment-guides', name: 'Treatment Guides', description: 'What to expect, how to prepare, and how to care for skin afterwards.' },
  { slug: 'brows-pmu', name: 'Brows & PMU', description: 'Brow design and aftercare from Seema Nanda.' },
  { slug: 'wellness', name: 'Wellness', description: 'Massage, body care and the slower side of looking after yourself.' },
];

export const blogPosts = [
  {
    slug: 'cleanup-vs-facial-which-one-does-your-skin-need',
    title: 'Cleanup vs Facial: Which One Does Your Skin Actually Need?',
    categorySlug: 'skin-science',
    excerpt:
      "They are not the same treatment, and booking the wrong one is the most common reason people feel a session 'didn't do much'.",
    author: 'Seema Nanda',
    readMinutes: 5,
    isFeatured: true,
    publishedAt: '2026-07-28',
    tags: ['cleanup', 'facial', 'skin basics'],
    content: `## The short answer

A cleanup focuses on removing dirt and impurities. A facial does that too, but goes further — it hydrates, nourishes and rejuvenates the skin.

If your skin feels congested, if you can see blackheads around the nose, if you have had a long gap between appointments — a cleanup is the reset. If your concern is dullness, dehydration, pigmentation or early fine lines, a cleanup will not touch it. You need a facial built around that concern.

## What a cleanup does

A cleanup is short and focused: cleanse, gentle exfoliation, steam, extraction, a soothing pack. Our **Lotus Cleanup** (30 mins, ₹800) purifies pores and restores brightness. The **O3+ Whitening Clean Up** (30 mins, ₹2,000) adds an oxygen-infused brightening step.

Booked once a month, a cleanup is maintenance. It keeps pores clear between the bigger treatments.

## What a facial does

A facial adds the treatment layer — actives, masks, serum infusion, and in the advanced protocols, technology. **Hydra Facial** (80 mins, ₹3,000) cleanses, exfoliates and infuses serums in one multi-step session. **Casmara Prestige** (70 mins, ₹3,500) uses a signature peel-off mask for instant luminosity. **Upendice Anti Ageing** (90 mins, ₹4,500) works with peptides to firm and reduce fine lines.

This is where visible change happens, and it is why we analyse skin before recommending one.

## How to decide

Ask yourself what you want to be different when you leave. Cleaner? Book a cleanup. Brighter, firmer, more even, more hydrated? Book a facial, and let the consultation decide which one.

## How often

For healthy, glowing skin, once every 3–4 weeks is the rhythm — for either service. Skin turns over on roughly that cycle, so treating in step with it is what compounds results.`,
  },
  {
    slug: 'what-actually-happens-during-a-hydra-facial',
    title: 'What Actually Happens During a Hydra Facial',
    categorySlug: 'treatment-guides',
    excerpt:
      'A step-by-step walkthrough of our most requested facial — and an honest answer to whether the glow lasts.',
    author: 'ESTEQO',
    readMinutes: 6,
    isFeatured: true,
    publishedAt: '2026-07-14',
    tags: ['hydra facial', 'what to expect'],
    content: `## Why it is the one people ask for

The **Hydra Facial** (80 mins, ₹3,000) does several jobs in one session: it deeply cleanses, exfoliates, and infuses serums for instant radiance. It uses Hydra dermabrasion rather than harsh scrubbing, which is why it suits skin that reacts badly to traditional exfoliation.

## Step by step

**1. Analysis.** Nothing starts until your skin is assessed. Serum selection depends on it.

**2. Hydra dermabrasion.** A gentle vacuum-based tip lifts dead cells and removes comedones.

**3. Serum infusion.** Hydrating and brightening actives are pushed in while pores are open.

**4. Cryo cold therapy.** Calms and tightens.

**5. Ultrasound.** Enhances absorption of the actives.

**6. LED light.** Brightening and repair to finish.

For sensitive or acne-prone skin we often start with the **Hydra Clean Up** (30 mins, ₹2,000) instead.

## Where it goes from there

The Hydra Facial is the base for a family of treatments:

- **Hydra + Glow Peel** — 90 mins, ₹3,800. A glow-boosting peel added to the Hydra steps.
- **Hydra + Carbon Laser Facial** — 60 mins, ₹5,500. Brightening carbon laser paired with hydrating Hydra therapy.
- **Advanced Hydra Facial** — 90 mins, ₹6,500. Lymphatic drainage plus BB Glow meso micro-needling.

## Does the glow last?

Honestly: a single session gives you a few days of visible glow. The change that lasts comes from a course, spaced roughly 3–4 weeks apart, so each session builds on the last.

## Aftercare

No makeup for 6–8 hours. Sunscreen, without exception. Skip active acids at home for 48 hours.`,
  },
  {
    slug: 'peels-explained-glow-spot-meline-biorepeel',
    title: 'Peels Explained: Glow, Spot, Meline and BioRepeel',
    categorySlug: 'skin-science',
    excerpt:
      'Four peels on our menu, four different jobs. Here is which one matches which concern — and what each actually costs.',
    author: 'Seema Nanda',
    readMinutes: 5,
    isFeatured: false,
    publishedAt: '2026-06-30',
    tags: ['peels', 'pigmentation'],
    content: `## Peels are not interchangeable

The word "peel" covers everything from a 20-minute pre-event refresh to a medical-grade depigmenting protocol. Booking the wrong one wastes both money and skin.

## Glow Peel — the pre-event one

**20 mins, ₹1,200** (or ₹800 added to a Hydra Facial). A mild exfoliating peel for dull, tired skin. Perfect before an event, or whenever your complexion needs a fresh, luminous boost. It does not treat pigmentation — it treats dullness.

## Spot Peel — the targeted one

**₹3,000–5,000, priced per area.** A targeted chemical peel for dark spots, pigmentation and acne marks, customised to the area being treated. If your concern is a handful of specific marks rather than overall tone, this is the efficient choice.

## Meline Pigmentation Peel — the clinical one

**45 mins, ₹7,500 per session.** A medical-grade depigmenting peel designed for melasma, tanning and uneven skin tone, with minimal downtime. This is the one we reach for when pigmentation is stubborn and has not responded to gentler work.

## BioRepeel — the no-downtime one

**₹6,000 per session, add-on.** A biphasic TCA peel that exfoliates, brightens and stimulates collagen — without visible peeling or downtime. Useful when you want real exfoliation but cannot afford to look like you have had something done.

## And the herbal option

**Green Sea Peel** (45 mins, ₹6,000) is a Korean algae-based herbal peel for acne, scars and pigmentation. It offers deep exfoliation without harsh chemicals, which makes it a good fit if you prefer to avoid acids.

## How to choose

Bring the concern, not the treatment name. We will match it during the consultation, and we will tell you if the cheaper option is the right one.`,
  },
  {
    slug: 'brow-mapping-why-shape-comes-first',
    title: 'Brow Mapping: Why Shape Comes Before Hair Removal',
    categorySlug: 'brows-pmu',
    excerpt:
      'Most brow regret starts with someone removing hair before deciding on the shape. Mapping reverses that order.',
    author: 'Seema Nanda',
    readMinutes: 4,
    isFeatured: false,
    publishedAt: '2026-06-16',
    tags: ['brows', 'brow mapping'],
    content: `## Your brows frame your entire face

At ESTEQO the brow work focuses on enhancing your natural shape, filling sparse areas, correcting asymmetry and creating long-lasting definition.

All of that starts with mapping.

## What mapping actually is

**Eyebrow Mapping with Wax** (₹500) measures and marks your ideal brow structure against your facial proportions — before any hair is removed. We set the start point, the arch and the tail against your bone structure and eye placement, then shape.

It is the step that creates symmetry rather than hoping for it.

## Why it matters more than the technique

Every brow technique is applied *to a shape*. If the shape is wrong, the technique cannot save it. And a brow that has been over-shaped takes months to grow back into a position where it can be corrected.

## The simpler options

If you are not ready for shaping, **Eyebrows Threading** (₹100) is the maintenance option — chemical-free, precise, and gentle enough for sensitive or acne-prone skin. Results typically last 3–4 weeks.

## Before you book anything semi-permanent

Ask to be mapped first. See the shape drawn on before committing. Any brow artist confident in their work will be happy to do this.`,
  },
  {
    slug: 'body-polish-vs-body-bleach',
    title: 'Body Polish vs Body Bleach: What Each One Actually Does',
    categorySlug: 'wellness',
    excerpt:
      'One exfoliates and hydrates. The other lifts tan. People book them expecting the same result and get surprised.',
    author: 'ESTEQO',
    readMinutes: 4,
    isFeatured: false,
    publishedAt: '2026-05-26',
    tags: ['body', 'detan', 'polish'],
    content: `## Two different jobs

**Body bleach / detan** lightens tan and removes surface dullness. It does not permanently change your skin colour, and it does not exfoliate deeply.

**Body polish** exfoliates, hydrates and nourishes, revealing smoother skin. It improves texture rather than tone.

If your skin is rough and dry, polish. If you have tan lines from a holiday, detan. If both — many clients combine them, and that combination is why the results look dramatic.

## The bleach and detan menu

Priced by area: **Face** ₹500 · **Half Hands** ₹600 · **Full Hands** ₹800 · **Half Legs** ₹600 · **Full Legs** ₹900 · **Half Back** ₹600 · **Full Back** ₹800 · **Half Front** ₹400 · **Full Front** ₹800 · **Full Body** ₹3,000.

All products are dermatologically approved and patch tested before every session.

## The polish menu

**Full Body Polish** (180 mins, ₹4,000) is the classic ritual. **Full Body Polish with Hydra** (220 mins, ₹5,500) uses Hydra dermabrasion for deeper hydration and brightening. Smaller areas: **Hand Polish** ₹1,000, **Full Leg Polish** ₹2,000, **Back Polish** ₹1,000.

**Back Facial with Hydra** (45 mins, ₹2,500) is worth knowing about if you get breakouts on your back — it is a proper facial protocol, not a scrub.

## How often

Once every 3–4 weeks for long-lasting brightness and smoothness.`,
  },
  {
    slug: 'how-to-prepare-for-your-first-appointment',
    title: 'How to Prepare for Your First Appointment at ESTEQO',
    categorySlug: 'treatment-guides',
    excerpt:
      'Every service begins with a detailed skin consultation. A little preparation makes that consultation much more useful.',
    author: 'ESTEQO',
    readMinutes: 3,
    isFeatured: false,
    publishedAt: '2026-05-12',
    tags: ['consultation', 'first visit'],
    content: `## We plan after analysis, not around trends

Every service at ESTEQO begins with a detailed skin consultation. The more accurate the picture you give us, the better the recommendation.

## Bring this with you

**Your current routine.** Photograph the actual products — the labels tell us about actives, not just brands.

**Any recent treatments.** Peels, laser, threading, injectables. Timing matters; some treatments cannot be layered within a few weeks of each other.

**Medication and skin history.** Isotretinoin, blood thinners, a history of keloids or cold sores all change what is safe.

**Your actual goal.** "Even tone for a wedding in eight weeks" gives us a plan. "Good skin" does not.

## On the day

Come without makeup if you can. Avoid sun exposure and strong exfoliating actives for 48 hours beforehand. Allow a little more time than the service length for the consultation itself.

## After

You will leave with a protocol, not just a treatment. Aftercare and the spacing of your next appointment are part of the result.

Call or WhatsApp **+91 8010135135** if anything changes before your slot.`,
  },
];

export const faqs = {
  general: [
    { id: 'g1', question: 'Where is ESTEQO located?', answer: 'ESTEQO, Shop No. 209, First Floor, Modi Mall, Sector 25, Noida – 201301. Open Monday to Saturday, 9 am to 8 pm, and Sunday 10 am to 3 pm.' },
    { id: 'g2', question: 'Do I need an appointment, or can I walk in?', answer: 'Walk-ins are welcome when a slot is free, but we strongly recommend booking. Every service begins with a detailed skin consultation, and a booked slot guarantees your specialist has time to plan the treatment properly.' },
    { id: 'g3', question: 'What happens during the first consultation?', answer: 'Your specialist analyses your skin type, concerns and history before recommending anything. We plan treatments after analysis, not around trends.' },
    { id: 'g4', question: 'Do you serve areas outside Noida?', answer: 'Clients travel to us from across Noida, Greater Noida, Ghaziabad and Delhi NCR. Tell us your area when you enquire and we will suggest the easiest time to reach Sector 25.' },
    { id: 'g5', question: 'How do I reschedule?', answer: 'Call or WhatsApp +91 8010135135, or email Info.esteqo@gmail.com. Please give us at least 24 hours notice so we can offer the slot to someone else.' },
  ],
  'medi-facials': [
    { id: 'm1', question: 'What is the difference between Hydra Clean Up and Hydra Facial?', answer: 'The Hydra Clean Up (30 mins, ₹2,000) is a focused cleansing treatment for sensitive or acne-prone skin. The Hydra Facial (80 mins, ₹3,000) adds serum infusion, cryo therapy, ultrasound and LED for a full multi-step result.' },
    { id: 'm2', question: 'How often should I book a Hydra Facial?', answer: 'Once every 3–4 weeks. Skin turns over on roughly that cycle, so treating in step with it is what compounds results.' },
    { id: 'm3', question: 'Is there any downtime?', answer: 'None. You might notice mild redness that fades within a few hours. Avoid makeup for 6–8 hours and use sunscreen.' },
  ],
  'advanced-facials': [
    { id: 'a1', question: 'Which advanced facial is right for pigmentation?', answer: 'Carbon Laser Facial, Meso Glow Therapy and BB Glow all address pigmentation from different angles. Your specialist will choose after assessing the type and depth of the pigmentation.' },
    { id: 'a2', question: 'Is micro-needling painful?', answer: 'Topical numbing is applied first, so most clients describe it as pressure rather than pain.' },
    { id: 'a3', question: 'Do men book these treatments?', answer: 'Yes — Just For Men (80 mins, ₹4,000) is designed specifically around the facial hair area, and the rest of the menu is open to everyone.' },
  ],
  facials: [
    { id: 'f1', question: 'Are there facials suitable for sensitive skin?', answer: 'Yes. Lotus Puravital and the Japanese Seed Mask Organic Facial are created for sensitive or reactive skin types.' },
    { id: 'f2', question: 'How often should I get a facial?', answer: "For healthy, glowing skin, it's ideal to schedule a facial once every 3–4 weeks." },
    { id: 'f3', question: 'Can I combine a facial with an add-on?', answer: 'Absolutely. Glow Peel, BioRepeel and Esthemax Masks are designed to enhance facial results when combined in the same session.' },
  ],
  'add-on-treatments': [
    { id: 'ad1', question: 'Are add-on treatments safe?', answer: 'Yes. Each treatment is customised to your skin condition, and patch tests are performed when necessary.' },
    { id: 'ad2', question: 'Is there any downtime?', answer: "Most have zero downtime. You might notice mild redness that fades within a few hours — it's just your skin renewing itself." },
    { id: 'ad3', question: 'How soon will I see results?', answer: 'Most add-ons deliver an immediate visible glow and smoother texture, with results improving over a few days.' },
  ],
  'body-bleach-detan': [
    { id: 'b1', question: 'Are the products safe for sensitive skin?', answer: 'Yes. All our products are dermatologically approved and tested for sensitive skin. Patch tests are performed before every session.' },
    { id: 'b2', question: 'Is bleaching the same as skin lightening?', answer: 'No. Bleaching lightens tan and removes surface dullness; it does not permanently change your skin colour.' },
    { id: 'b3', question: 'How often should I book?', answer: 'Once every 3–4 weeks is recommended for long-lasting brightness.' },
  ],
  'body-polish': [
    { id: 'bp1', question: 'What is the difference between polish and bleach?', answer: 'Polish exfoliates and hydrates, improving texture. Bleach or detan lifts tan, improving tone. Many clients combine both.' },
    { id: 'bp2', question: 'Does Back Facial with Hydra help with back acne?', answer: 'Yes — it is a proper facial protocol for the back rather than a scrub, using Hydra dermabrasion and extraction.' },
  ],
  threading: [
    { id: 't1', question: 'Is threading safe for sensitive skin?', answer: 'Yes. Threading uses no chemicals, which makes it ideal for sensitive or acne-prone skin.' },
    { id: 't2', question: 'How long do the results last?', answer: 'Typically 3–4 weeks, depending on hair growth and skin type.' },
  ],
  'face-waxing': [
    { id: 'w1', question: 'Which is better — threading or waxing?', answer: 'Both are effective. Threading offers precise control for small areas, while waxing gives a smoother finish on larger areas.' },
    { id: 'w2', question: 'Can I wear makeup right after?', answer: 'Avoid makeup for 6–8 hours post-treatment to allow pores to close naturally.' },
  ],
  'body-waxing': [
    { id: 'bw1', question: 'What is the difference between hot wax, Rica and peel-off?', answer: 'Hot wax grips short, coarse hair and suits precise areas. Rica is a gentler resin-based wax for sensitive skin and larger areas. Peel-off is the most comfortable option for the underarm and bikini areas.' },
    { id: 'bw2', question: 'Does the Full Body price include bikini and bums?', answer: 'No — bikini and bums are priced separately.' },
  ],
  massages: [
    { id: 'ms1', question: 'How long are the massages?', answer: 'Focused massages are booked in 20 or 30 minute slots. Swedish, deep tissue and hot candle aroma oil massages are 60 minutes.' },
    { id: 'ms2', question: 'Is there any downtime?', answer: 'None. You can return to your day immediately.' },
  ],
  manicure: [
    { id: 'mn1', question: 'What is the difference between Algae and Drupe?', answer: 'Algae is a marine treatment focused on deep hydration and firming. Drupe is a premium ritual focused on softness and shine, with an optional peel-off mask.' },
  ],
  pedicure: [
    { id: 'pd1', question: 'Can I add paraffin wax?', answer: 'Yes — the Paraffin Wax Add On (15 mins, ₹300) can be added to any manicure or pedicure.' },
  ],
};

export const team = [
  {
    slug: 'seema-nanda',
    name: 'Seema Nanda',
    role: 'Founder & Lead Cosmetologist',
    bio: 'With over a decade of hands-on experience, Seema founded ESTEQO to blend advanced dermatological science with the artistry of beauty. She leads the brow department personally.',
  },
  {
    slug: 'skin-laser-specialist',
    name: 'Skin & Laser Specialist',
    role: 'Medi-Facials, Hydra & Laser Protocols',
    bio: 'Plans and delivers our medical-grade facial and laser protocols, from Hydra Facial and carbon laser through to PDRN and meso needling — always after a full skin analysis.',
  },
  {
    slug: 'senior-aesthetician',
    name: 'Senior Aesthetician',
    role: 'Facials, Peels & Add-On Treatments',
    bio: 'Runs our cleanup, facial and peel menu, and advises on which add-on boosters will actually move the needle for your skin.',
  },
  {
    slug: 'wellness-therapist',
    name: 'Wellness Therapist',
    role: 'Massages, Body Polish & Nail Care',
    bio: 'Delivers our massage, reflexology and body polish menu — the slower half of ESTEQO, built around release rather than results.',
  },
];

/**
 * SAMPLE testimonials with initials only. Replace with genuine client reviews
 * before the site goes live.
 */
export const testimonials = [
  { id: 1, author: 'A. Sharma', location: 'Sector 25, Noida', treatment: 'Hydra Facial', quote: 'The consultation before the facial was longer than the facial I used to get elsewhere. They actually explained why my skin was reacting the way it was.', rating: 5 },
  { id: 2, author: 'R. Kapoor', location: 'Indirapuram', treatment: 'Eyebrow Mapping with Wax', quote: 'Seema mapped the shape and showed me before touching anything. First time my brows have looked even in photos.', rating: 5 },
  { id: 3, author: 'M. Verma', location: 'Greater Noida West', treatment: 'Carbon Laser Facial', quote: 'No pressure to buy a package on day one. They set out how many sessions I would realistically need and why.', rating: 5 },
  { id: 4, author: 'P. Singh', location: 'Sector 62, Noida', treatment: 'Hot Candle Aroma Oil Massage', quote: 'Booked it on a whim after work. Easily the most relaxed hour of my month.', rating: 5 },
  { id: 5, author: 'N. Gupta', location: 'Vaishali', treatment: 'Meline Pigmentation Peel', quote: 'Pigmentation I had given up on has genuinely faded over the course. Slow, but real.', rating: 5 },
];

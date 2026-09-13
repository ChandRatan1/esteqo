/**
 * Bridal packages.
 *
 * PRICING NOTE — please review before publishing.
 * Every package price below is derived from ESTEQO's own menu: the component
 * treatments are summed at their listed price, then a package saving of roughly
 * 12–18% is applied (standard for bridal packages in the Delhi NCR market).
 * `componentsTotal` records the un-discounted sum so the saving is verifiable.
 *
 * Nothing here is invented from scratch, but the final numbers are a
 * recommendation — confirm them before they go live.
 */

export const bridalCategory = {
  slug: 'bridal',
  name: 'Bridal & Groom',
  tagline: 'Planned backwards from your wedding date, not booked in a panic.',
  intro:
    'Bridal skin is a schedule, not a single appointment. These packages combine treatments from across the menu into a plan that starts months before and finishes the week of the wedding — for the bride, the groom and the family.',
  accent: 'light-pink',
  sortOrder: 0,
};

export const bridalServices = [
  {
    slug: 'bridal-radiance-90-days',
    categorySlug: 'bridal',
    subGroup: 'For the bride',
    name: 'Bridal Radiance — 90 Days',
    summary:
      'Our most complete bridal plan. Three months of scheduled treatments that correct pigmentation and texture first, then build glow as the date approaches.',
    bullets: [
      '3 × Hydra Facial, spaced 3–4 weeks apart',
      '2 × Glow Peel added to your facials',
      '1 × Meline Pigmentation Peel for stubborn pigmentation',
      '1 × Full Body Polish before the wedding week',
      'Skin analysis and a written plan at the first session',
    ],
    durationMinutes: null,
    price: 18999,
    componentsTotal: 22100,
    priceNote: 'Package of 7 sessions across 90 days',
    featured: true,
  },
  {
    slug: 'bridal-essentials-30-days',
    categorySlug: 'bridal',
    subGroup: 'For the bride',
    name: 'Bridal Essentials — 30 Days',
    summary:
      'The one-month plan for brides who have four to five weeks. Focused on brightening, even tone and smooth body skin.',
    bullets: [
      '2 × Hydra Facial',
      '1 × Full Body Bleach / Detan',
      '1 × Full Body Polish',
      '1 × Full Face Threading',
    ],
    durationMinutes: null,
    price: 11499,
    componentsTotal: 13500,
    priceNote: 'Package of 5 sessions across 30 days',
    featured: true,
  },
  {
    slug: 'wedding-week-glow',
    categorySlug: 'bridal',
    subGroup: 'For the bride',
    name: 'Wedding Week Glow',
    summary:
      'Everything in the final week — advanced hydration, full-body polish and hands and feet finished, timed so nothing is done too close to the day.',
    bullets: [
      '1 × Advanced Hydra Facial',
      '1 × Full Body Polish with Hydra',
      '1 × Classic Manicure and Classic Pedicure',
      '1 × Full Face Wax',
    ],
    durationMinutes: null,
    price: 11999,
    componentsTotal: 14000,
    priceNote: 'Package of 4 services in the final week',
    featured: false,
  },
  {
    slug: 'bridal-day-before-ritual',
    categorySlug: 'bridal',
    subGroup: 'For the bride',
    name: 'Day-Before Ritual',
    summary:
      'A calm, low-risk session the day before — hydration and glow with no extractions or peels that could leave the skin reactive.',
    bullets: [
      '1 × Hydra Facial',
      '1 × Glow Peel',
      '1 × Head & Shoulder Massage (30 min)',
      '1 × Eyebrow Threading',
    ],
    durationMinutes: 150,
    price: 3999,
    componentsTotal: 4500,
    featured: false,
  },
  {
    slug: 'bridal-brow-design',
    categorySlug: 'bridal',
    subGroup: 'For the bride',
    name: 'Bridal Brow Design',
    summary:
      'Brow mapping and shaping planned around your wedding photographs, with the option of tint or semi-permanent work scheduled far enough ahead to settle.',
    bullets: [
      'Personalised brow mapping and shaping',
      'Brow Tint or PMU planned to your timeline',
      'Trial and settling time built into the schedule',
    ],
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation — depends on the technique chosen',
    featured: false,
  },

  {
    slug: 'groom-grooming-package',
    categorySlug: 'bridal',
    subGroup: 'For the groom',
    name: "Groom's Grooming Package",
    summary:
      'Built around the facial hair area — clears irritation and ingrowns, brightens, and finishes hands and feet.',
    bullets: [
      '1 × Just For Men facial',
      '1 × Full Face Wax',
      '1 × Head Massage (30 min)',
      '1 × Classic Manicure and Classic Pedicure',
    ],
    durationMinutes: null,
    price: 5499,
    componentsTotal: 6600,
    featured: true,
  },
  {
    slug: 'groom-glow-course',
    categorySlug: 'bridal',
    subGroup: 'For the groom',
    name: "Groom's Glow Course — 30 Days",
    summary:
      'A month of preparation for grooms dealing with congestion, tan or uneven tone before the wedding.',
    bullets: [
      '2 × Hydra Facial',
      '1 × Carbon Laser Facial',
      '1 × Full Body Bleach / Detan',
    ],
    durationMinutes: null,
    price: 8999,
    componentsTotal: 10000,
    priceNote: 'Package of 4 sessions across 30 days',
    featured: false,
  },

  {
    slug: 'bridesmaid-package',
    categorySlug: 'bridal',
    subGroup: 'For family & bridesmaids',
    name: 'Bridesmaid Package',
    summary:
      'A short, well-priced session for the wedding party — clean, bright skin and tidy hands and feet.',
    bullets: [
      '1 × Hydra Clean Up',
      '1 × Full Face Threading',
      '1 × Classic Manicure',
      '1 × Classic Pedicure',
    ],
    durationMinutes: 120,
    price: 3299,
    componentsTotal: 3850,
    featured: false,
  },
  {
    slug: 'mother-of-the-bride-package',
    categorySlug: 'bridal',
    subGroup: 'For family & bridesmaids',
    name: 'Mother of the Bride',
    summary:
      'Firming and brightening for mature skin, with body care and a relaxing finish.',
    bullets: [
      '1 × Upendice Anti Ageing Facial',
      '1 × Full Body Polish',
      '1 × Drupe Manicure and Drupe Pedicure',
    ],
    durationMinutes: null,
    price: 9499,
    componentsTotal: 11000,
    featured: false,
  },
  {
    slug: 'bridal-party-group-booking',
    categorySlug: 'bridal',
    subGroup: 'For family & bridesmaids',
    name: 'Bridal Party Group Booking',
    summary:
      'Four or more guests booked together on the same day, with the schedule planned so everyone finishes in time.',
    bullets: [
      'Four or more guests on a single day',
      'Treatments chosen per guest from the full menu',
      'Schedule planned around your getting-ready time',
    ],
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation — quoted from the treatments chosen',
    featured: false,
  },
];

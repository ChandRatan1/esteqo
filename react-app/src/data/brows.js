/**
 * Brows department — content supplied in "ESTEQO WEBSITE CONTENT.pdf".
 *
 * Brow Shape and Brow Tint are documented in full there (duration, who it
 * suits, the step-by-step treatment process and aftercare). The remaining five
 * treatments are named in that document but not yet written up; each carries a
 * short summary and `needsContent: true` so they are easy to find and finish.
 *
 * `process` drives the numbered "Treatment process" section on the service page.
 */

export const browsCategory = {
  slug: 'brows',
  name: 'Brows',
  tagline: 'Precision brows, designed around your face — not a template.',
  intro:
    'Beautiful brows begin with the right structure. Every brow service starts with personalised brow mapping, so the shape suits your facial proportions, eye shape and natural growth pattern rather than a standard template.',
  accent: 'light-brown',
  sortOrder: 0,
};

export const browServices = [
  {
    slug: 'brow-shape',
    categorySlug: 'brows',
    name: 'Brow Shape',
    summary:
      'Personalised brow mapping combined with precision grooming to create a shape that complements your facial proportions, eye shape and natural brow growth.',
    bullets: [
      'Customised brow design, not a standard template',
      'Natural brow preservation — density is protected wherever possible',
      'Threading, waxing, tweezing and trimming combined as your brows need',
      'No downtime — return to your routine immediately',
    ],
    idealFor: [
      'Want cleaner, more defined eyebrows',
      'Feel their brows lack structure or symmetry',
      'Have thick, unruly or uneven brow hair',
      'Want to refine their natural arch',
      'Need regular professional brow maintenance',
      'Have previously over-plucked their eyebrows',
      'Want a professionally mapped shape before a PMU treatment',
    ],
    process: [
      {
        title: 'Consultation',
        text: 'We assess your preferred brow style alongside your existing shape, density, hair-growth pattern and facial proportions. Any skin sensitivities or contraindications are discussed before we begin.',
      },
      {
        title: 'Brow Mapping',
        text: 'Your artist creates a customised brow map setting the ideal start, arch, peak, tail and thickness for your features — a clear framework for proportion and symmetry that still respects your natural brow structure.',
      },
      {
        title: 'Precision Hair Removal',
        text: 'Once the shape is mapped, unwanted hair is removed using whichever combination of waxing, threading, tweezing and trimming suits your brows. The emphasis is controlled removal rather than excessive thinning.',
      },
      {
        title: 'Finishing',
        text: 'A detailed refinement pass checks symmetry, arch definition, tail placement and overall balance. The brows are then styled and finished with brow makeup where appropriate.',
      },
      {
        title: 'Post-Treatment Care',
        text: 'You leave with guidance on maintaining the shape between appointments. Where brows show over-plucking or sparse growth, we may recommend a personalised brow regrowth programme.',
      },
    ],
    resultsLast: 'Up to 4 weeks, depending on your hair-growth cycle and maintenance routine.',
    durationMinutes: 20,
    price: null,
    priceNote: 'On consultation',
    featured: true,
  },
  {
    slug: 'brow-tint',
    categorySlug: 'brows',
    name: 'Brow Tint',
    summary:
      'A temporary colour treatment that deepens your natural brow hair for a more defined, fuller-looking finish — without committing to permanent makeup.',
    bullets: [
      'Shade selected around your natural colouring, not simply darkened',
      'Controlled application that respects the existing brow shape',
      'Professional formulations — vegan, cruelty-free, paraben-free and PPD-free options may be available',
      'Minimal aftercare and no downtime',
    ],
    idealFor: [
      'Want their brows to appear darker and more defined',
      'Have naturally light or unevenly coloured brow hair',
      'Want to create a fuller-looking appearance',
      'Would like their brows to complement a new hair colour',
      'Prefer a low-maintenance alternative to daily brow makeup',
      'Want temporary enhancement without permanent makeup',
    ],
    process: [
      {
        title: 'Colour Consultation',
        text: 'We discuss your preferred colour and assess your natural brow shade, hair colour, density and desired definition. The aim is a shade that complements your features rather than the darkest possible result.',
      },
      {
        title: 'Brow Preparation',
        text: 'The brow area is prepared and the desired shape established before any tint is applied.',
      },
      {
        title: 'Precision Tint Application',
        text: 'The selected tint is applied to the brow hair with controlled, even coverage that maintains the intended brow design.',
      },
      {
        title: 'Colour Development',
        text: 'The tint develops for a controlled period, set by the formulation chosen and the intensity you want.',
      },
      {
        title: 'Removal & Finishing',
        text: 'Colour is gently removed and the brows assessed for evenness, depth and balance, with minor grooming or styling where appropriate.',
      },
    ],
    resultsLast:
      'Around 1 week on the surrounding skin and up to 2 weeks on the brow hair. Most clients refresh every 2–3 weeks.',
    aftercare: [
      'Avoid rubbing the brow area immediately after treatment',
      'Be gentle when cleansing around the brows',
      'Avoid harsh products around the tinted area',
      'Follow the personalised aftercare your artist provides',
    ],
    note: 'If you have a known allergy, sensitive skin or a previous reaction to hair or brow tint, tell us beforehand — a patch test may be recommended.',
    durationMinutes: 20,
    price: null,
    priceNote: 'On consultation',
    featured: true,
  },
  {
    slug: 'hd-brows',
    categorySlug: 'brows',
    name: 'HD Brows',
    summary:
      'A multi-step brow treatment combining mapping, tinting and precision shaping to build a fuller, high-definition brow.',
    bullets: [],
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation',
    needsContent: true,
    featured: false,
  },
  {
    slug: 'brow-lamination',
    categorySlug: 'brows',
    name: 'Brow Lamination',
    summary:
      'A restructuring treatment that lifts and sets brow hairs upward for a fuller, groomed look that lasts for weeks.',
    bullets: [],
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation',
    needsContent: true,
    featured: false,
  },
  {
    slug: 'microblading',
    categorySlug: 'brows',
    name: 'Microblading',
    summary:
      'Hair-stroke semi-permanent pigment applied by hand to fill sparse areas and rebuild a natural, defined brow.',
    bullets: [],
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation',
    needsContent: true,
    featured: false,
  },
  {
    slug: 'ombre-brow',
    categorySlug: 'brows',
    name: 'Ombre Brow',
    summary:
      'A soft, machine-shaded permanent makeup technique creating a powdered finish with a light-to-dark gradient.',
    bullets: [],
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation',
    needsContent: true,
    featured: false,
  },
  {
    slug: 'hybrid-brow',
    categorySlug: 'brows',
    name: 'Hybrid Brow',
    summary:
      'Microblading hair strokes combined with soft shading — definition at the tail with a natural gradient at the front.',
    bullets: [],
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation',
    needsContent: true,
    featured: false,
  },
  {
    slug: 'brow-tattoo-removal',
    categorySlug: 'brows',
    name: 'Tattoo Removal',
    summary:
      'Corrective work that lightens or neutralises unwanted brow pigment from previous permanent makeup, before the brow is rebuilt.',
    bullets: [],
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation',
    needsContent: true,
    featured: false,
  },
];

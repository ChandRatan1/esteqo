import { categoryImages, serviceImages } from './service-images.js';
import { browsCategory, browServices } from './brows.js';
import { bridalCategory, bridalServices } from './bridal.js';

/**
 * ESTEQO treatment menu — transcribed from "Esteqo revised menu 2.pdf".
 *
 * This is the single source of truth for the site's services. The app reads it
 * directly (no backend required). Prices are in INR; `priceNote` carries the
 * cases the menu prices per-area or per-session, and `variants` carries the
 * rows that quote more than one price (wax type, massage duration).
 */

export const categories = [
  browsCategory,
  bridalCategory,
  {
    slug: 'medi-facials',
    name: 'Medi-Facials',
    tagline: 'Advanced skin treatments planned after analysis, not trends.',
    intro:
      'Rejuvenation that goes beyond the surface. Our Medi-Facials combine medical technology with therapeutic relaxation to purify, hydrate and renew your skin from within.',
    accent: 'light-blue',
    sortOrder: 1,
  },
  {
    slug: 'advanced-facials',
    name: 'Advanced Facials',
    tagline: 'Clinical technology for pigmentation, ageing and texture.',
    intro:
      'Laser, micro-needling and infusion protocols for concerns that a standard facial cannot reach — each planned around your skin assessment.',
    accent: 'cream',
    sortOrder: 2,
  },
  {
    slug: 'facials',
    name: 'Facials',
    tagline: 'Target your concerns with facials that heal, balance and brighten.',
    intro:
      'Our classic facial menu — from gentle organic masks to anti-ageing protocols, each chosen for your skin type after consultation. Men are welcome across the whole menu, and Just for Men Facial is designed specifically for male skin.',
    accent: 'light-pink',
    sortOrder: 3,
  },
  {
    slug: 'face-clean-up',
    name: 'Face Clean Up',
    tagline: 'The monthly reset that keeps pores clear between facials.',
    intro:
      'A cleanup focuses on removing dirt and impurities. Booked once a month, it is maintenance — it keeps congestion from building up between your bigger treatments.',
    accent: 'off-white',
    sortOrder: 4,
  },
  {
    slug: 'add-on-treatments',
    name: 'Add-On Treatments',
    tagline: 'Targeted boosters that amplify the results of any service.',
    intro:
      'Specialised boosters for pigmentation, dullness, scars and uneven texture. Most are designed to be added to a facial in the same session.',
    accent: 'light-green',
    sortOrder: 5,
  },
  {
    slug: 'body-bleach-detan',
    name: 'Body Bleach & Detan',
    tagline: 'Lift tan and surface dullness, area by area.',
    intro:
      'Dermatologically approved formulas that lighten tan and remove surface dullness. Patch tests are performed before every session.',
    accent: 'light-yellow',
    sortOrder: 6,
  },
  {
    slug: 'body-polish',
    name: 'Body Polish',
    tagline: 'Full-body care that leaves skin soft, even-toned and luminous.',
    intro:
      'Exfoliation, hydration and nourishment from head to toe — including our Hydra dermabrasion body protocols.',
    accent: 'light-brown',
    sortOrder: 7,
  },
  {
    slug: 'manicure',
    name: 'Manicure',
    tagline: 'Nourishing hand treatments for lasting smoothness and shine.',
    intro: 'From a classic tidy-up to algae and Drupe rituals with peel-off masks.',
    accent: 'light-purple',
    sortOrder: 8,
  },
  {
    slug: 'pedicure',
    name: 'Pedicure',
    tagline: 'Foot care that goes further than a polish change.',
    intro: 'Classic through to algae and Drupe pedicures, with peel-off mask options.',
    accent: 'light-purple',
    sortOrder: 9,
  },
  {
    slug: 'threading',
    name: 'Threading',
    tagline: 'Precise, chemical-free shaping for every part of the face.',
    intro:
      'Threading uses no chemicals, which makes it ideal for sensitive or acne-prone skin, and gives precise control on small areas.',
    accent: 'cream',
    sortOrder: 10,
  },
  {
    slug: 'face-waxing',
    name: 'Face Waxing',
    tagline: 'Low-temperature wax for a silky, glowing finish.',
    intro:
      'Hypoallergenic wax formulated for facial skin, with a patch test beforehand where your skin needs one.',
    accent: 'light-pink',
    sortOrder: 11,
  },
  {
    slug: 'body-waxing',
    name: 'Body Waxing',
    tagline: 'Hot wax, Rica wax and peel-off options for every area.',
    intro:
      'Choose the wax that suits your skin: hot wax for precision, Rica for sensitive areas, peel-off where comfort matters most.',
    accent: 'light-blue',
    sortOrder: 12,
  },
  {
    slug: 'nails',
    name: 'Nails',
    tagline: 'Quick nail care, on its own or as an add-on.',
    intro: 'Nail shaping and polish, with a paraffin wax add-on for extra softness.',
    accent: 'off-white',
    sortOrder: 13,
  },
  {
    slug: 'massages',
    name: 'Relaxing Massages',
    tagline: 'Unwind and rejuvenate with therapies built to restore balance.',
    intro:
      'Short focused massages by the 20 or 30 minute slot, plus full 60-minute body therapies. No downtime — you can return to your day immediately.',
    accent: 'light-green',
    sortOrder: 14,
  },
  {
    slug: 'lasers',
    name: 'Laser Hair Reduction',
    tagline: 'Medical-grade laser technology for safe, long-term hair reduction.',
    intro:
      'Each session is calibrated to your skin tone and hair type. Most areas need six to eight sessions, spaced a few weeks apart, for up to 90% reduction in regrowth.',
    accent: 'light-blue',
    sortOrder: 15,
  },
  {
    slug: 'chemical-peels',
    name: 'Chemical Peels',
    tagline: 'Controlled resurfacing for pigmentation, texture and dull skin.',
    intro:
      'Professional-strength peels that work beneath the surface to lift pigmentation, smooth texture and restore clarity. Strength is matched to your skin at consultation, and a patch test is done wherever your skin needs one.',
    accent: 'light-green',
    sortOrder: 16,
  },
];

/**
 * `price` is the headline price used for sorting and the booking dropdown.
 * `variants` lists the alternative prices exactly as the menu quotes them.
 */
export const services = [
  ...browServices,
  ...bridalServices,

  // ---------------------------------------------------------------- Medi-Facials
  {
    slug: 'hydra-clean-up',
    categorySlug: 'medi-facials',
    name: 'Hydra Clean Up',
    summary:
      'A gentle cleansing facial ideal for sensitive or acne-prone skin — pore-cleansing with Hydra dermabrasion, a hydrating pack and finishing serums.',
    bullets: [
      'Ideal for sensitive or acne-prone skin',
      'Customized cleansing',
      'Pore-cleansing with Hydra dermabrasion',
      'Hydrating pack',
      'Serums and moisturizers',
    ],
    durationMinutes: 30,
    price: 2000,
    featured: false,
  },
  {
    slug: 'hydra-facial',
    categorySlug: 'medi-facials',
    name: 'Hydra Facial',
    summary:
      'Our most loved multi-step facial: Hydra dermabrasion, serum infusion, cryo therapy, ultrasound and LED for instant radiance.',
    bullets: [
      'Hydra dermabrasion for exfoliation and comedone removal',
      'Serum infusion for deep hydration and glow',
      'Cryo cold therapy to calm and tighten',
      'Ultrasound for enhanced absorption',
      'LED light for brightening and repair',
    ],
    durationMinutes: 80,
    price: 3000,
    featured: true,
  },
  {
    slug: 'hydra-glow-peel',
    categorySlug: 'medi-facials',
    name: 'Hydra + Glow Peel',
    summary:
      'Deep exfoliation meets hydration, with a glow-boosting peel added to your Hydra Facial.',
    bullets: [
      'Glow-boosting peel added to the Hydra Facial',
      'Hydra dermabrasion and serum infusion',
      'Cryo therapy, ultrasound and LED therapy',
    ],
    durationMinutes: 90,
    price: 3800,
    featured: false,
  },
  {
    slug: 'hydra-carbon-laser-facial',
    categorySlug: 'medi-facials',
    name: 'Hydra + Carbon Laser Facial',
    summary: 'Dual action — brightening carbon laser paired with hydrating Hydra therapy.',
    bullets: ['Brightening carbon laser', 'Hydrating Hydra therapy'],
    durationMinutes: 60,
    price: 5500,
    featured: false,
  },
  {
    slug: 'advanced-hydra-facial',
    categorySlug: 'medi-facials',
    name: 'Advanced Hydra Facial',
    summary:
      'Multi-step rejuvenation with lymphatic drainage and deep nourishment — Hydra Facial and Glow Peel with BB Glow meso micro-needling.',
    bullets: [
      'Multi-step rejuvenation with lymphatic drainage and deep nourishment',
      'Hydra Facial + Glow Peel with BB Glow meso micro-needling',
    ],
    durationMinutes: 90,
    price: 6500,
    featured: true,
  },

  // ----------------------------------------------------------- Advanced Facials
  {
    slug: 'carbon-laser-facial',
    categorySlug: 'advanced-facials',
    name: 'Carbon Laser Facial',
    summary:
      'Q-Switched Nd:YAG laser with a carbon-based lotion to deep-clean, exfoliate and brighten.',
    bullets: ['Q-Switched Nd:YAG laser with carbon-based lotion', 'Deep-cleans, exfoliates and brightens'],
    durationMinutes: 45,
    price: 4000,
    featured: true,
  },
  {
    slug: 'meso-glow-therapy',
    categorySlug: 'advanced-facials',
    name: 'Meso Glow Therapy',
    summary:
      'Micro-needling with customised meso-cocktails rich in vitamins, peptides and antioxidants to target dullness, pigmentation and fine lines.',
    bullets: ['Micro-needling with customised meso-cocktails', 'Targets dullness, pigmentation and fine lines'],
    durationMinutes: 60,
    price: 4000,
    featured: false,
  },
  {
    slug: 'bb-glow',
    categorySlug: 'advanced-facials',
    name: 'BB Glow — Semi-Permanent Tinted Glow',
    summary:
      'Nano-needling with tinted serums to even out skin tone, boost radiance and reduce pigmentation.',
    bullets: ['Nano-needling with tinted serums', 'Evens skin tone and boosts radiance', 'Reduces pigmentation'],
    durationMinutes: 80,
    price: 5000,
    featured: false,
  },
  {
    slug: 'oxygeneo-facial',
    categorySlug: 'advanced-facials',
    name: 'OxyGeneo Facial',
    summary:
      'Triple-action technology — exfoliation, CO₂ oxygenation and active serum infusion for intense rejuvenation.',
    bullets: ['Exfoliation', 'CO₂ oxygenation', 'Active serum infusion'],
    durationMinutes: 70,
    price: 5000,
    featured: false,
  },
  {
    slug: 'vampire-facial',
    categorySlug: 'advanced-facials',
    name: 'Vampire Facial',
    summary:
      'Micro-needling with PRP (Platelet-Rich Plasma) to boost collagen, heal scars and rejuvenate skin.',
    bullets: ['Micro-needling with Platelet-Rich Plasma', 'Boosts collagen and heals scars'],
    durationMinutes: 60,
    price: 5500,
    featured: false,
  },
  {
    slug: 'korean-pdrn-glowlift',
    categorySlug: 'advanced-facials',
    name: 'Korean PDRN Glowlift',
    summary:
      'Advanced skin repair and hydration with Salmon DNA (PDRN), delivered by micro- or nano-needling.',
    bullets: [
      'Advanced repair and hydration with Salmon DNA (PDRN)',
      'Smoother texture and reduced fine lines',
      'Firm, plump skin with deep, dewy hydration',
      'Boosted collagen and product absorption',
    ],
    durationMinutes: 45,
    price: 6000,
    featured: true,
  },
  {
    slug: 'pumpkin-enzyme-facial',
    categorySlug: 'advanced-facials',
    name: 'Pumpkin Enzyme Facial',
    summary:
      'Power-packed with natural enzymes and AHA to exfoliate, detox and brighten dull, pigmented skin.',
    bullets: ['Natural enzymes and AHA', 'Exfoliates, detoxes and brightens dull, pigmented skin'],
    durationMinutes: 90,
    price: 7000,
    featured: false,
  },
  {
    slug: 'luxe-skin-booster-glow',
    categorySlug: 'advanced-facials',
    name: 'Luxe Skin Booster Glow',
    summary:
      'Micro-needling infusion of high-performance skin boosters to deeply hydrate, brighten and smooth the skin.',
    bullets: ['Micro-needling infusion of high-performance skin boosters', 'Deeply hydrates, brightens and smooths'],
    durationMinutes: 75,
    price: 8000,
    featured: false,
  },
  {
    slug: 'just-for-men',
    categorySlug: 'advanced-facials',
    name: 'Just For Men',
    summary:
      'Built for the facial hair area — reduces irritation, with Hydra dermabrasion, cryo cold therapy, ultrasound and LED.',
    bullets: [
      'Reduces irritation in the facial hair area',
      'LED light for brightening and repair',
      'Hydra dermabrasion, cryo cold therapy and ultrasound for enhanced absorption',
    ],
    durationMinutes: 80,
    price: 4000,
    featured: true,
  },

  // -------------------------------------------------------------------- Facials
  {
    slug: 'signature-facial',
    categorySlug: 'facials',
    name: 'Signature Facial',
    summary: "A maintenance facial built around cleansing, exfoliation and a treatment mask suited to your skin's current needs.",
    description:
      'A well-rounded maintenance facial for anyone building a skincare routine or just keeping up with one. In half an hour you get a full cleanse, gentle exfoliation and a finishing treatment chosen for what your skin needs that month.',
    bullets: ['Exfoliating and hydrating', 'Smooths texture', 'Finishes with an oxygen infusion'],
    idealFor: 'Dullness • Normal skin • Mild congestion',
    durationMinutes: 30,
    image: '/uploads/facial/signature_facial.jpg',
    featured: false,
  },
  {
    slug: 'lymphatic-facial',
    categorySlug: 'facials',
    name: 'Lymphatic Facial',
    summary: 'A sculpting facial that pairs manual lymphatic drainage technique with modern contouring to reduce puffiness and refresh tired skin.',
    description:
      'A sculpting facial that pairs manual lymphatic-drainage technique with modern tools to reduce puffiness and lift tired skin. After cleansing and light exfoliation, the treatment focuses entirely on sculpting — extractions are not part of this one.',
    bullets: ['Visibly sculpting', 'Compression therapy for circulation', 'Gua sha massage'],
    idealFor: 'Puffiness • Redness and irritation • Uneven tone',
    durationMinutes: 30,
    image: '/uploads/facial/lymphatic_facial.jpg',
    featured: false,
  },
  {
    slug: 'party-prep-facial',
    categorySlug: 'facials',
    name: 'Party-Prep Facial',
    summary: 'A pre-event facial using targeted lifting and contouring technology for an immediate, photo-ready glow.',
    description:
      "Built for the hours before an event. Lifting and contouring technology tightens and smooths the skin for an instant, camera-ready look — with no extractions, so there's no redness to work around.",
    bullets: ['Camera-ready toning', 'Lifting and sculpting technology', 'Extraction-free cleanse'],
    idealFor: 'Fine lines and wrinkles • Texture • Uneven tone',
    durationMinutes: 30,
    image: '/uploads/facial/party_prep_facial.jpg',
    featured: false,
  },
  {
    slug: 'just-for-men-facial',
    categorySlug: 'facials',
    name: 'Just for Men Facial',
    summary: 'Addresses ingrown hairs, shaving irritation and congestion in the skin beneath facial hair.',
    description:
      'Aimed squarely at the skin under and around facial hair — ingrown hairs, shaving irritation and clogged pores from daily grooming. A clarifying mask works on the neck while a deep-clean step targets bacteria beneath the beard line.',
    bullets: ['Pore-clarifying treatment', 'Deep-cleansing technology', 'Gentle acid exfoliation'],
    idealFor: 'Shaving irritation • Dryness or flaking • Rough texture',
    durationMinutes: 30,
    image: '/uploads/facial/just_for_men_facial.jpg',
    featured: false,
  },
  {
    slug: 'estheticians-choice',
    categorySlug: 'facials',
    name: "Esthetician's Choice",
    summary: 'Your therapist examines your skin first, then builds the facial around what it needs that day.',
    description:
      "Can't decide? Your esthetician examines your skin first and builds the facial around what it actually needs that day, rather than a fixed menu item.",
    bullets: [],
    durationMinutes: 50,
    image: '/uploads/facial/esthetician_choice.jpg',
    featured: false,
  },
  {
    slug: 'anti-aging-facial',
    categorySlug: 'facials',
    name: 'Anti-Aging Facial',
    summary: 'Firming and lifting technology combined with red LED light therapy to stimulate collagen and soften fine lines.',
    description:
      'A firming, restorative facial that tones facial muscles and pairs it with red light therapy to support collagen, soften fine lines and calm inflammation, finished with hydrating actives.',
    bullets: ['Supports collagen production', 'Firming muscle-toning technique', 'Cooling finish to reduce puffiness'],
    idealFor: 'Loss of elasticity • Dark circles • Early age spots',
    durationMinutes: 50,
    image: '/uploads/facial/anti_aging_facial.jpg',
    featured: true,
  },
  {
    slug: 'acne-fighting-facial',
    categorySlug: 'facials',
    name: 'Acne-Fighting Facial',
    summary: 'A double cleanse with extractions and blue LED light therapy to calm breakouts and target acne-causing bacteria.',
    description:
      'A double cleanse and double exfoliation clear the way for extractions, then targeted light therapy works on acne-causing bacteria while vitamins and oxygen calm the skin afterwards.',
    bullets: ['Deep-cleaning technology', 'Thorough pore clearing', 'Light therapy to target bacteria'],
    idealFor: 'Acne-prone skin • Excess oiliness • Uneven texture',
    durationMinutes: 50,
    image: '/uploads/facial/acne_fighting_facial.jpg',
    featured: true,
  },
  {
    slug: 'seasonal-hydrating-facial',
    categorySlug: 'facials',
    name: 'Seasonal Hydrating Facial',
    summary: 'A climate-adapted mask treatment that protects and repairs the skin barrier as the seasons change.',
    description:
      'A hydrating facial that changes with the seasons, protecting and repairing your skin barrier against whatever the current weather is doing to it. Gentle exfoliation, a custom mask and an oxygen finish leave skin dewy, not dry.',
    bullets: ['Gentle antioxidant exfoliation', 'Warming circulation therapy', 'Mask formulated for the current season'],
    idealFor: 'Dehydration • Environmental skin stress • Redness',
    durationMinutes: 50,
    image: '/uploads/facial/seasonal_hydrating_facial.jpg',
    featured: false,
  },
  {
    slug: 'hyperpigmentation-facial',
    categorySlug: 'facials',
    name: 'Hyperpigmentation Facial',
    summary: 'Green LED light therapy paired with clinical-grade exfoliation to even out tone and fade dark spots.',
    description:
      'Targets dullness and sun damage with light therapy paired with clinical-grade exfoliation, evening out tone and refining texture for a brighter finish.',
    bullets: ['Double exfoliation with fruit acids', 'Healing light therapy', 'Brightening vitamin C infusion'],
    idealFor: 'Sun and age spots • Dryness • Dullness',
    durationMinutes: 50,
    image: '/uploads/facial/hyperpigmentation_facial.jpg',
    featured: false,
  },
  {
    slug: 'sensitive-skin-facial',
    categorySlug: 'facials',
    name: 'Sensitive Skin Facial',
    summary: 'A calming, low-irritation facial using gentle enzyme exfoliation for reactive or easily-flushed skin.',
    description:
      'Built specifically for reactive skin. An ultra-gentle double cleanse and a nutrient-rich jelly mask calm and restore balance, while light therapy reduces redness with a soothing, low-contact approach.',
    bullets: ['Calming and soothing formulas', 'Enzyme-only exfoliation, no scrubbing', 'Custom jelly mask'],
    idealFor: 'Redness and irritation • Rosacea • Eczema-prone skin',
    durationMinutes: 50,
    image: '/uploads/facial/sensitive_skin_facial.jpg',
    featured: false,
  },
  {
    slug: 'premier-contour-facial',
    categorySlug: 'facials',
    name: 'Premier Contour Facial',
    summary: 'A multi-step facial combining dermaplaning, lifting technology, gua sha and LED therapy for the most complete result on the menu.',
    description:
      'The most complete facial on the menu — 90 minutes combining dermaplaning, sculpting technology, gua sha, light therapy, oxygen and cold therapy to refine texture, lift contours and calm puffiness in a single session.',
    bullets: ['Dermaplaning with a signature mask for deep exfoliation', 'Gua sha and sculpting technology for contouring', 'Cold therapy finish to reduce puffiness'],
    idealFor: 'Congestion • Dullness • Inflammation',
    durationMinutes: 90,
    image: '/uploads/facial/premier_contour_facial.jpg',
    featured: false,
  },
  {
    slug: 'microneedling',
    categorySlug: 'facials',
    name: 'Microneedling',
    summary: 'Fine sterile needles create controlled micro-channels in the skin to trigger natural collagen production, smoothing texture and softening scars over a course of sessions.',
    description:
      "Hundreds of fine, sterile needles create tiny, controlled micro-channels in the skin's surface, triggering your body's own collagen and elastin production. Over a short course of sessions, this smooths texture, softens acne scarring and fine lines, and tightens visibly loose skin.",
    bullets: ['Stimulates natural collagen production', 'Improves texture and fine scarring', 'A course of sessions builds visible results'],
    idealFor: 'Acne scarring • Fine lines and texture • Enlarged pores',
    durationMinutes: 45,
    featured: false,
  },

  // -------------------------------------------------------------- Face Clean Up
  {
    slug: 'lotus-cleanup',
    categorySlug: 'face-clean-up',
    name: 'Lotus Cleanup',
    summary: 'A refreshing cleanup that purifies pores, removes oil and restores brightness to your complexion.',
    bullets: [],
    durationMinutes: 30,
    price: 800,
    featured: true,
  },
  {
    slug: 'o3-plus-whitening-clean-up',
    categorySlug: 'face-clean-up',
    name: 'O3+ Whitening Clean Up',
    summary: 'A quick, effective brightening cleanup that removes impurities and evens your skin tone.',
    bullets: [],
    durationMinutes: 30,
    price: 2000,
    featured: false,
  },

  // ------------------------------------------------------------------- Add-Ons
  {
    slug: 'dermaplaning',
    categorySlug: 'add-on-treatments',
    name: 'Dermaplaning',
    summary: 'Gentle exfoliation using a surgical blade to remove dead skin and peach fuzz for instant smoothness and glow.',
    description:
      'A medical-grade blade gently removes dead skin cells and fine facial hair from the surface of your skin — safe, precise, and effective even for sensitive skin.',
    bullets: [],
    durationMinutes: 30,
    price: 1000,
    image: '/uploads/facial/dermaplaning.jpg',
    featured: false,
  },
  {
    slug: 'hydradermabrasion',
    categorySlug: 'add-on-treatments',
    name: 'Hydradermabrasion',
    summary: 'A diamond-tipped wand resurfaces the skin while infusing hydrating serum — added on to any facial.',
    description:
      'A diamond-tipped wand resurfaces the skin, clears pores and infuses hydrating serum in one pass — gentle enough for dry skin, without any harsh scrubbing.',
    bullets: [],
    durationMinutes: 15,
    image: '/uploads/facial/hydradermabrasion.jpg',
    featured: false,
  },
  {
    slug: 'extra-extractions',
    categorySlug: 'add-on-treatments',
    name: 'Extra Extractions',
    summary: 'Additional time spent clearing blackheads and congestion from the areas that need it most.',
    description:
      'Extra time focused on stubborn blackheads, whiteheads and clogged pores in the areas that need it most.',
    bullets: [],
    durationMinutes: 15,
    image: '/uploads/facial/extra_extractions.jpg',
    featured: false,
  },
  {
    slug: 'gua-sha-massage',
    categorySlug: 'add-on-treatments',
    name: 'Gua Sha Massage',
    summary: 'A 30-minute sculpting massage blending traditional gua sha technique with modern tools.',
    description:
      'Thirty minutes of traditional gua sha technique blended with modern sculpting tools — a neck-and-face massage that eases tension, boosts circulation and supports lymphatic flow. A shorter version is also available on request.',
    bullets: [],
    durationMinutes: 30,
    image: '/uploads/facial/gua_sha_massage.jpg',
    featured: false,
  },
  {
    slug: 'custom-jelly-mask',
    categorySlug: 'add-on-treatments',
    name: 'Custom Jelly Mask',
    summary: 'A hydrating peel-off mask finished with hyaluronic acid or collagen.',
    description:
      'A hydrating peel-off jelly mask, customised with hyaluronic acid, collagen or skin-boosting peptides depending on what your skin needs that day.',
    bullets: [],
    durationMinutes: 15,
    image: '/uploads/facial/custom_jelly_mask.jpg',
    featured: false,
  },
  {
    slug: 'lip-plump-and-scrub',
    categorySlug: 'add-on-treatments',
    name: 'Lip Plump and Scrub',
    summary: 'Buffing and red LED light therapy to smooth and plump the lips.',
    description:
      'A gentle lip buffing followed by red light therapy to smooth fine lines and support collagen — leaves lips softer and visibly fuller.',
    bullets: [],
    durationMinutes: null,
    image: '/uploads/facial/lip_plump_and_scrub.jpg',
    featured: false,
  },
  {
    slug: 'microcurrent',
    categorySlug: 'add-on-treatments',
    name: 'Microcurrent',
    summary: 'Gentle electrical micro-currents that tone and firm the facial muscles.',
    description:
      'Targeted electrical micro-currents tone and firm the facial muscles for a visibly contoured look — already built into the Party-Prep and Anti-Aging facials.',
    bullets: [],
    durationMinutes: 15,
    image: '/uploads/facial/microcurrent.jpg',
    featured: false,
  },
  {
    slug: 'eye-puff-minimizer',
    categorySlug: 'add-on-treatments',
    name: 'Eye Puff Minimizer',
    summary: 'A brightening mask and gua sha technique targeting puffiness and dark circles.',
    description:
      'A cooling, vitamin-rich mask paired with gua sha technique to target puffiness, dark circles and under-eye congestion for a brighter look.',
    bullets: [],
    durationMinutes: null,
    image: '/uploads/facial/eye_puff_minimizer.jpg',
    featured: false,
  },
  {
    slug: 'neck-firming',
    categorySlug: 'add-on-treatments',
    name: 'Neck Firming',
    summary: 'Electrical stimulation that lifts and tones the neck and décolletage.',
    description:
      "Targeted electrical stimulation that lifts and tones the neck and décolletage, extending your facial's results further down.",
    bullets: [],
    durationMinutes: null,
    image: '/uploads/facial/neck_firming.jpg',
    featured: false,
  },

  // ------------------------------------------------------------------- Lasers
  {
    slug: 'upper-lip-chin-laser',
    categorySlug: 'lasers',
    name: 'Upper Lip & Chin',
    summary: 'Fast, precise laser hair reduction for fine upper-lip and chin hair.',
    description:
      'Medical-grade laser technology targets hair follicles at the root, calibrated to your skin tone and hair type. The upper lip and chin are quick to treat and among the most requested areas — most clients see up to 90% reduction over a course of six to eight sessions.',
    bullets: ['Long-term hair reduction, not just removal', 'Calibrated to your skin tone and hair type', 'Quick sessions, minimal discomfort'],
    idealFor: 'Frequent threading or waxing • Fine, persistent regrowth • Want a long-term solution',
    durationMinutes: 15,
    featured: false,
  },
  {
    slug: 'full-face-laser',
    categorySlug: 'lasers',
    name: 'Full Face',
    summary: 'Comprehensive laser hair reduction across the full face for consistently smoother skin.',
    description:
      'Covers the full face in one session rather than treating individual areas separately, targeting hair follicles at the root for long-term reduction. Calibrated to your skin tone and hair type, with results building over a course of six to eight sessions.',
    bullets: ['Whole-face coverage in a single session', 'Long-term hair reduction, not just removal', 'Calibrated to your skin tone and hair type'],
    idealFor: 'Frequent facial hair removal • Sensitive skin irritated by waxing • Want a long-term solution',
    durationMinutes: 30,
    featured: false,
  },
  {
    slug: 'underarms-laser',
    categorySlug: 'lasers',
    name: 'Underarms',
    summary: 'Laser hair reduction for the underarms — one of the fastest areas to treat, and to see results in.',
    description:
      'The underarms respond quickly to laser hair reduction, with visibly finer, sparser regrowth after just a few sessions. Calibrated to your skin tone and hair type, this targets follicles at the root for results that last well beyond a wax or shave.',
    bullets: ['Long-term hair reduction, not just removal', 'Fast sessions with minimal discomfort', 'No more razor bumps or ingrown hairs'],
    idealFor: 'Frequent shaving or waxing • Razor bumps or irritation • Want a long-term solution',
    durationMinutes: 15,
    featured: true,
  },
  {
    slug: 'half-arms-laser',
    categorySlug: 'lasers',
    name: 'Half Arms',
    summary: 'Laser hair reduction from elbow to wrist.',
    description:
      'Targets hair follicles from elbow to wrist, calibrated to your skin tone and hair type. Regrowth becomes visibly finer and sparser over a course of six to eight sessions.',
    bullets: ['Long-term hair reduction, not just removal', 'Calibrated to your skin tone and hair type', 'No downtime — return to your day immediately'],
    idealFor: 'Frequent waxing or shaving • Ingrown hairs • Want a long-term solution',
    durationMinutes: 30,
    featured: false,
  },
  {
    slug: 'full-arms-laser',
    categorySlug: 'lasers',
    name: 'Full Arms',
    summary: 'Laser hair reduction across the full arm, shoulder to wrist.',
    description:
      'Covers the full arm, shoulder to wrist, targeting hair follicles at the root. Calibrated to your skin tone and hair type, with visible reduction building over a course of sessions.',
    bullets: ['Long-term hair reduction, not just removal', 'Whole-arm coverage in one session', 'Calibrated to your skin tone and hair type'],
    idealFor: 'Frequent waxing or shaving • Ingrown hairs • Want a long-term solution',
    durationMinutes: 45,
    featured: false,
  },
  {
    slug: 'half-legs-laser',
    categorySlug: 'lasers',
    name: 'Half Legs',
    summary: 'Laser hair reduction from knee to ankle.',
    description:
      'Targets hair follicles from knee to ankle, calibrated to your skin tone and hair type. Most clients see up to 90% reduction in regrowth over a course of six to eight sessions.',
    bullets: ['Long-term hair reduction, not just removal', 'Calibrated to your skin tone and hair type', 'No downtime — return to your day immediately'],
    idealFor: 'Frequent waxing or shaving • Ingrown hairs • Want a long-term solution',
    durationMinutes: 45,
    featured: false,
  },
  {
    slug: 'full-legs-laser',
    categorySlug: 'lasers',
    name: 'Full Legs',
    summary: 'Laser hair reduction across the full leg, thigh to ankle.',
    description:
      'Covers the full leg, thigh to ankle, in one session — targeting hair follicles at the root for reduction that outlasts a wax or shave. Calibrated to your skin tone and hair type, with results building over a course of sessions.',
    bullets: ['Long-term hair reduction, not just removal', 'Whole-leg coverage in one session', 'Calibrated to your skin tone and hair type'],
    idealFor: 'Frequent waxing or shaving • Ingrown hairs • Want a long-term solution',
    durationMinutes: 60,
    featured: true,
  },
  {
    slug: 'bikini-line-laser',
    categorySlug: 'lasers',
    name: 'Bikini Line',
    summary: 'Precise laser hair reduction along the bikini line.',
    description:
      'A precise, controlled treatment along the bikini line, calibrated to your skin tone and hair type. Regrowth becomes visibly finer and sparser over a course of six to eight sessions, with none of the irritation that comes with regular waxing.',
    bullets: ['Long-term hair reduction, not just removal', 'Reduces ingrown hairs from regular waxing', 'Calibrated to your skin tone and hair type'],
    idealFor: 'Frequent waxing • Ingrown hairs or irritation • Want a long-term solution',
    durationMinutes: 20,
    featured: false,
  },
  {
    slug: 'full-body-laser',
    categorySlug: 'lasers',
    name: 'Full Body',
    summary: 'A comprehensive full-body laser hair reduction session covering every treated area in one visit.',
    description:
      'Combines every treated area — face, arms, legs, underarms and bikini line — into a single, comprehensive session. Calibrated to your skin tone and hair type, with up to 90% reduction in regrowth over a course of six to eight sessions.',
    bullets: ['Every area in a single visit', 'Long-term hair reduction, not just removal', 'Calibrated to your skin tone and hair type'],
    idealFor: 'Want everything done in one visit • Frequent waxing or shaving across the body • Want a long-term solution',
    durationMinutes: 90,
    featured: false,
  },

  // ----------------------------------------------------------- Chemical Peels
  {
    slug: 'biorepeel',
    categorySlug: 'chemical-peels',
    name: 'BioRePeel',
    summary:
      'A biphasic TCA peel that exfoliates, brightens and stimulates collagen — without the visible peeling or downtime a peel usually means.',
    description:
      'A two-phase formula that resurfaces the skin while feeding it: the oily phase carries actives in without stripping the barrier, the water phase gets to work on pigmentation, texture and fine lines. Most people walk out with an immediate glow and no flaking to hide.',
    bullets: ['Brightens and evens skin tone', 'Stimulates collagen', 'No visible peeling, no downtime'],
    idealFor: 'Dullness • Uneven tone • Fine lines and wrinkles',
    durationMinutes: 30,
    image: '/uploads/facial/biorepeel.jpg',
    featured: true,
  },
  {
    slug: 'antioxidant-peel',
    categorySlug: 'chemical-peels',
    name: 'Antioxidant Peel',
    summary:
      'A gentle fruit-acid peel packed with antioxidants, for skin that needs brightening without a strong resurfacing step.',
    description:
      'The lightest peel on the menu. Fruit acids lift dead surface cells while antioxidants defend against the pollution and sun exposure that dull city skin. Comfortable enough for a first peel, and easy to add before an event.',
    bullets: ['Gentle enough for a first peel', 'Antioxidant protection', 'Immediate brightness, no downtime'],
    idealFor: 'Dullness • Environmental skin stress • Congestion',
    durationMinutes: 30,
    image: '/uploads/facial/antioxidant_peel.jpg',
    featured: false,
  },

  // -------------------------------------------------------- Body Bleach & Detan
  { slug: 'face-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Face Bleach / Detan', summary: 'A quick facial bleach that lifts tan and softens your complexion — ideal for regular maintenance.', bullets: [], durationMinutes: null, price: 500, featured: false },
  { slug: 'half-hands-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Half Hands Bleach / Detan', summary: 'Brightens the arms from shoulders to elbows by reducing sun tan and evening out tone.', bullets: [], durationMinutes: null, price: 600, featured: false },
  { slug: 'full-hands-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Full Hands Bleach / Detan', summary: 'A complete arm lightening service for visibly smoother, more even skin.', bullets: [], durationMinutes: null, price: 800, featured: false },
  { slug: 'half-legs-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Half Legs Bleach / Detan', summary: 'Brightens the lower legs by removing tan and buildup caused by sun exposure.', bullets: [], durationMinutes: null, price: 600, featured: false },
  { slug: 'full-legs-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Full Legs Bleach / Detan', summary: 'A comprehensive tan-removal treatment for smooth, glowing legs.', bullets: [], durationMinutes: null, price: 900, featured: false },
  { slug: 'half-back-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Half Back Bleach / Detan', summary: 'Evens tone across the upper back — a common request before an event.', bullets: [], durationMinutes: null, price: 600, featured: false },
  { slug: 'full-back-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Full Back Bleach / Detan', summary: 'Full back tan removal for an even tone from shoulders to waist.', bullets: [], durationMinutes: null, price: 800, featured: false },
  { slug: 'half-front-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Half Front Bleach / Detan', summary: 'Targets the neck and décolleté, where tan lines show most.', bullets: [], durationMinutes: null, price: 400, featured: false },
  { slug: 'full-front-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Full Front Bleach / Detan', summary: 'Complete front-of-body detan for an even, brighter tone.', bullets: [], durationMinutes: null, price: 800, featured: false },
  { slug: 'full-body-bleach-detan', categorySlug: 'body-bleach-detan', name: 'Full Body Bleach / Detan', summary: 'Brighten and refresh your entire body with this tan-removal treatment, performed with dermatologist-approved bleach.', bullets: [], durationMinutes: null, price: 3000, featured: true },

  // --------------------------------------------------------------- Body Polish
  { slug: 'full-body-polish', categorySlug: 'body-polish', name: 'Full Body Polish', summary: 'A rejuvenating treatment that exfoliates, hydrates and nourishes — revealing silky smoothness head to toe.', bullets: [], durationMinutes: 180, price: 4000, featured: true },
  { slug: 'full-body-polish-with-hydra', categorySlug: 'body-polish', name: 'Full Body Polish with Hydra', summary: 'Medical-grade body polishing using Hydra dermabrasion for deep hydration and brightening.', bullets: [], durationMinutes: 220, price: 5500, featured: false },
  { slug: 'hand-polish', categorySlug: 'body-polish', name: 'Hand Polish', summary: 'A focused polish that renews the hands, removing tan and dry patches.', bullets: [], durationMinutes: 30, price: 1000, featured: false },
  { slug: 'full-leg-polish', categorySlug: 'body-polish', name: 'Full Leg Polish', summary: 'Exfoliation and hydration for the full leg, leaving skin smooth and even.', bullets: [], durationMinutes: 30, price: 2000, featured: false },
  { slug: 'back-polish', categorySlug: 'body-polish', name: 'Back Polish', summary: 'Clears congestion and roughness across the back with gentle exfoliation.', bullets: [], durationMinutes: 30, price: 1000, featured: false },
  { slug: 'back-facial-with-hydra', categorySlug: 'body-polish', name: 'Back Facial with Hydra', summary: 'A proper facial for the back — Hydra dermabrasion, extraction and a soothing finish for back acne and texture.', bullets: [], durationMinutes: 45, price: 2500, featured: false },

  // ------------------------------------------------------------------ Manicure
  { slug: 'classic-manicure', categorySlug: 'manicure', name: 'Classic Manicure', summary: 'Shaping, cuticle care and a polish finish.', bullets: [], durationMinutes: 30, price: 550, featured: false },
  { slug: 'oil-manicure', categorySlug: 'manicure', name: 'Oil Manicure', summary: 'A nourishing warm-oil treatment for dry hands and brittle nails.', bullets: [], durationMinutes: 30, price: 800, featured: false },
  { slug: 'pedipie-manicure', categorySlug: 'manicure', name: 'Pedipie Manicure', summary: 'The Pedipie ritual adapted for hands — cleansing, scrub and mask.', bullets: [], durationMinutes: 30, price: 900, featured: false },
  { slug: 'algae-manicure', categorySlug: 'manicure', name: 'Algae Manicure', summary: 'A marine algae treatment that deeply hydrates and firms the skin on the hands.', bullets: [], durationMinutes: 45, price: 2000, featured: false },
  { slug: 'drupe-manicure', categorySlug: 'manicure', name: 'Drupe Manicure', summary: 'A premium Drupe ritual for softness, shine and lasting hydration.', bullets: [], durationMinutes: 45, price: 1500, featured: true },
  { slug: 'drupe-manicure-peel-off-mask', categorySlug: 'manicure', name: 'Drupe Manicure with Peel Off Mask', summary: 'The Drupe manicure finished with a peel-off mask for extra brightness.', bullets: [], durationMinutes: 60, price: 2000, featured: false },

  // ------------------------------------------------------------------ Pedicure
  { slug: 'classic-pedicure', categorySlug: 'pedicure', name: 'Classic Pedicure', summary: 'Soak, shaping, cuticle care, scrub and polish.', bullets: [], durationMinutes: 45, price: 800, featured: false },
  { slug: 'oil-pedicure', categorySlug: 'pedicure', name: 'Oil Pedicure', summary: 'A warm-oil pedicure for dry, cracked heels and tired feet.', bullets: [], durationMinutes: 45, price: 1000, featured: false },
  { slug: 'pedipie-pedicure', categorySlug: 'pedicure', name: 'Pedipie Pedicure', summary: 'The Pedipie ritual — cleansing, scrub and a nourishing mask.', bullets: [], durationMinutes: 45, price: 1200, featured: false },
  { slug: 'algae-pedicure', categorySlug: 'pedicure', name: 'Algae Pedicure', summary: 'A marine algae pedicure that hydrates deeply and calms tired feet.', bullets: [], durationMinutes: 80, price: 2500, featured: false },
  { slug: 'drupe-pedicure', categorySlug: 'pedicure', name: 'Drupe Pedicure', summary: 'A premium Drupe pedicure for softness and lasting hydration.', bullets: [], durationMinutes: 60, price: 2000, featured: true },
  { slug: 'drupe-pedicure-peel-off-mask', categorySlug: 'pedicure', name: 'Drupe Pedicure with Peel Off Mask', summary: 'The Drupe pedicure finished with a peel-off mask.', bullets: [], durationMinutes: 80, price: 2500, featured: false },

  // ----------------------------------------------------------------- Threading
  { slug: 'lowerlips-threading', categorySlug: 'threading', name: 'Lowerlips Threading', summary: 'Removes fine hair around the lower lip for a clean, even finish.', bullets: [], durationMinutes: null, price: 50, featured: false },
  { slug: 'upperlips-threading', categorySlug: 'threading', name: 'Upperlips Threading', summary: 'Quick, clean and gentle removal of unwanted upper-lip hair.', bullets: [], durationMinutes: null, price: 50, featured: false },
  { slug: 'chin-threading', categorySlug: 'threading', name: 'Chin Threading', summary: 'Precise hair removal for the chin and jawline.', bullets: [], durationMinutes: null, price: 60, featured: false },
  { slug: 'forehead-threading', categorySlug: 'threading', name: 'Forehead Threading', summary: 'Clears baby hair and uneven patches around the forehead.', bullets: [], durationMinutes: null, price: 60, featured: false },
  { slug: 'eyebrows-threading', categorySlug: 'threading', name: 'Eyebrows Threading', summary: 'Perfectly shaped brows that define and lift your entire face.', bullets: [], durationMinutes: null, price: 100, featured: true },
  { slug: 'full-face-threading', categorySlug: 'threading', name: 'Full Face Threading', summary: 'Complete hair removal from the face for a soft, velvety finish.', bullets: [], durationMinutes: null, price: 500, featured: false },

  // --------------------------------------------------------------- Face Waxing
  { slug: 'chin-wax', categorySlug: 'face-waxing', name: 'Chin Wax', summary: 'Quick, smooth removal of coarse chin hair.', bullets: [], durationMinutes: null, price: 100, featured: false },
  { slug: 'forehead-wax', categorySlug: 'face-waxing', name: 'Forehead Wax', summary: 'Removes fine baby hair and dull buildup for a polished finish.', bullets: [], durationMinutes: null, price: 100, featured: false },
  { slug: 'upperlips-wax', categorySlug: 'face-waxing', name: 'Upperlips Wax', summary: 'Gentle hair removal for a clean, soft upper-lip area.', bullets: [], durationMinutes: null, price: 100, featured: false },
  { slug: 'lower-neck-wax', categorySlug: 'face-waxing', name: 'Lower Neck Wax', summary: 'Removes hair around the lower neck for a neat, polished neckline.', bullets: [], durationMinutes: null, price: 300, featured: false },
  { slug: 'sidelock-wax', categorySlug: 'face-waxing', name: 'Sidelock Wax', summary: 'Targets the sideburn area for a clean, defined jawline.', bullets: [], durationMinutes: null, price: 300, featured: false },
  { slug: 'eyebrow-mapping-with-wax', categorySlug: 'face-waxing', name: 'Eyebrow Mapping with Wax', summary: 'A precise brow-shaping session that maps your ideal brow structure to your facial proportions, then shapes with wax.', bullets: [], durationMinutes: null, price: 500, featured: true },
  { slug: 'full-face-wax', categorySlug: 'face-waxing', name: 'Full Face Wax', summary: 'Low-temperature wax across the face for a silky, glowing finish.', bullets: [], durationMinutes: null, price: 650, featured: false },

  // --------------------------------------------------------------- Body Waxing
  {
    slug: 'underarms-wax',
    categorySlug: 'body-waxing',
    name: 'Underarms',
    summary: 'Choose hot wax, Rica or peel-off for the underarm area.',
    bullets: [],
    durationMinutes: null,
    price: 100,
    priceNote: 'Hot wax ₹100 · Rica ₹150 · Peel off ₹250',
    variants: [
      { label: 'Hot wax', price: 100 },
      { label: 'Rica wax', price: 150 },
      { label: 'Peel off', price: 250 },
    ],
    featured: false,
  },
  { slug: 'full-arms-wax', categorySlug: 'body-waxing', name: 'Full Arms', summary: 'Full arm waxing in hot wax or Rica.', bullets: [], durationMinutes: null, price: 300, priceNote: 'Hot wax ₹300 · Rica ₹600', variants: [{ label: 'Hot wax', price: 300 }, { label: 'Rica wax', price: 600 }], featured: false },
  { slug: 'half-legs-wax', categorySlug: 'body-waxing', name: 'Half Legs', summary: 'Knee-down waxing in hot wax or Rica.', bullets: [], durationMinutes: null, price: 300, priceNote: 'Hot wax ₹300 · Rica ₹550', variants: [{ label: 'Hot wax', price: 300 }, { label: 'Rica wax', price: 550 }], featured: false },
  { slug: 'full-legs-wax', categorySlug: 'body-waxing', name: 'Full Legs', summary: 'Full leg waxing in hot wax or Rica.', bullets: [], durationMinutes: null, price: 550, priceNote: 'Hot wax ₹550 · Rica ₹800', variants: [{ label: 'Hot wax', price: 550 }, { label: 'Rica wax', price: 800 }], featured: true },
  { slug: 'stomach-wax', categorySlug: 'body-waxing', name: 'Stomach', summary: 'Stomach waxing in hot wax or Rica.', bullets: [], durationMinutes: null, price: 350, priceNote: 'Hot wax ₹350 · Rica ₹600', variants: [{ label: 'Hot wax', price: 350 }, { label: 'Rica wax', price: 600 }], featured: false },
  { slug: 'bums-wax', categorySlug: 'body-waxing', name: 'Bums Wax', summary: 'Waxing for the bum area in hot wax or Rica.', bullets: [], durationMinutes: null, price: 400, priceNote: 'Hot wax ₹400 · Rica ₹600', variants: [{ label: 'Hot wax', price: 400 }, { label: 'Rica wax', price: 600 }], featured: false },
  { slug: 'full-back-wax', categorySlug: 'body-waxing', name: 'Full Back', summary: 'Full back waxing in hot wax or Rica.', bullets: [], durationMinutes: null, price: 550, priceNote: 'Hot wax ₹550 · Rica ₹650', variants: [{ label: 'Hot wax', price: 550 }, { label: 'Rica wax', price: 650 }], featured: false },
  { slug: 'bikini-wax', categorySlug: 'body-waxing', name: 'Bikini', summary: 'Bikini waxing with hot wax, Rica or peel-off for maximum comfort.', bullets: [], durationMinutes: null, price: 1000, priceNote: 'Hot wax ₹1,000 · Rica ₹1,500 · Peel off ₹2,000', variants: [{ label: 'Hot wax', price: 1000 }, { label: 'Rica wax', price: 1500 }, { label: 'Peel off', price: 2000 }], featured: false },
  { slug: 'full-body-wax', categorySlug: 'body-waxing', name: 'Full Body', summary: 'Full body waxing. Bikini and bums are not included.', bullets: [], durationMinutes: null, price: 1800, priceNote: 'Hot wax ₹1,800 · Rica ₹3,000 — bikini and bums not included', variants: [{ label: 'Hot wax', price: 1800 }, { label: 'Rica wax', price: 3000 }], featured: false },
  { slug: 'full-face-wax-rica', categorySlug: 'body-waxing', name: 'Full Face Wax (Rica)', summary: 'Full face waxing in Rica wax.', bullets: [], durationMinutes: null, price: 650, priceNote: 'Rica wax', featured: false },

  // --------------------------------------------------------------------- Nails
  { slug: 'nailcut-filing-polish', categorySlug: 'nails', name: 'Nailcut, Filing and Polish', summary: 'Nail shaping, filing and a polish finish.', bullets: [], durationMinutes: 15, price: 250, featured: false },
  { slug: 'paraffin-wax-add-on', categorySlug: 'nails', name: 'Paraffin Wax Add On', summary: 'A warm paraffin wrap that softens hands or feet — added to any manicure or pedicure.', bullets: [], durationMinutes: 15, price: 300, featured: false },

  // ------------------------------------------------------------------ Massages
  {
    slug: 'foot-massage',
    categorySlug: 'massages',
    name: 'Foot Massage',
    summary: 'A deeply soothing therapy focusing on the pressure points of the feet to release fatigue and improve circulation.',
    bullets: ['Reduces swelling and soreness', 'Improves energy flow', 'Relieves stress and tension'],
    durationMinutes: 20,
    price: 400,
    priceNote: '20 mins ₹400 · 30 mins ₹600',
    variants: [{ label: '20 mins', price: 400 }, { label: '30 mins', price: 600 }],
    featured: false,
  },
  { slug: 'hand-massage', categorySlug: 'massages', name: 'Hand Massage', summary: 'A gentle treatment that eases stiffness and strain from the hands.', bullets: ['Improved mobility', 'Relief from muscle fatigue', 'Enhanced blood circulation'], durationMinutes: 20, price: 400, priceNote: '20 mins ₹400 · 30 mins ₹600', variants: [{ label: '20 mins', price: 400 }, { label: '30 mins', price: 600 }], featured: false },
  { slug: 'head-massage', categorySlug: 'massages', name: 'Head Massage', summary: 'A calming, stress-relieving treatment focused on scalp pressure points.', bullets: ['Reduces headaches and migraines', 'Improves sleep quality', 'Promotes relaxation and better blood flow'], durationMinutes: 20, price: 400, priceNote: '20 mins ₹400 · 30 mins ₹600', variants: [{ label: '20 mins', price: 400 }, { label: '30 mins', price: 600 }], featured: true },
  { slug: 'head-shoulder-massage', categorySlug: 'massages', name: 'Head & Shoulder', summary: 'Releases tightness caused by long working hours, poor posture or stress.', bullets: ['Relief from neck stiffness', 'Reduced shoulder tension', 'Instant relaxation'], durationMinutes: 20, price: 400, priceNote: '20 mins ₹400 · 30 mins ₹600', variants: [{ label: '20 mins', price: 400 }, { label: '30 mins', price: 600 }], featured: false },
  { slug: 'back-massage', categorySlug: 'massages', name: 'Back Massage', summary: 'Targets deep-seated tension along the spine and lower back.', bullets: ['Releases knots', 'Reduces muscle tightness', 'Improves flexibility'], durationMinutes: 20, price: 600, priceNote: '20 mins ₹600 · 30 mins ₹900', variants: [{ label: '20 mins', price: 600 }, { label: '30 mins', price: 900 }], featured: false },
  { slug: 'face-massage', categorySlug: 'massages', name: 'Face Massage', summary: 'A gentle, rejuvenating therapy that boosts glow and relaxation.', bullets: ['Enhanced blood flow', 'Reduced puffiness', 'Improved skin texture'], durationMinutes: 20, price: 600, priceNote: '20 mins ₹600 · 30 mins ₹800', variants: [{ label: '20 mins', price: 600 }, { label: '30 mins', price: 800 }], featured: false },
  { slug: 'foot-reflexology', categorySlug: 'massages', name: 'Foot Reflexology', summary: 'A targeted treatment based on pressure points connected to various organs.', bullets: ['Improves internal balance', 'Reduces stress', 'Supports overall wellbeing'], durationMinutes: 20, price: 600, priceNote: '20 mins ₹600 · 30 mins ₹800', variants: [{ label: '20 mins', price: 600 }, { label: '30 mins', price: 800 }], featured: false },
  { slug: 'hand-reflexology', categorySlug: 'massages', name: 'Hand Reflexology', summary: 'A therapeutic experience stimulating the reflex zones in the hands.', bullets: ['Better energy flow', 'Reduced fatigue', 'Relaxation of hand muscles'], durationMinutes: 20, price: 600, priceNote: '20 mins ₹600 · 30 mins ₹800', variants: [{ label: '20 mins', price: 600 }, { label: '30 mins', price: 800 }], featured: false },
  { slug: 'swedish-massage', categorySlug: 'massages', name: 'Swedish Massage', summary: 'A classic full-body relaxation massage using long, flowing strokes. Perfect for first-time massage clients.', bullets: ['Stress relief', 'Improved blood circulation', 'Deep relaxation'], durationMinutes: 60, price: 1800, featured: true },
  { slug: 'deep-tissue-massage', categorySlug: 'massages', name: 'Deep Tissue Massage', summary: 'Firm, focused pressure that works into chronic tension and knots.', bullets: [], durationMinutes: 60, price: 2000, featured: false },
  { slug: 'hot-candle-aroma-oil-massage', categorySlug: 'massages', name: 'Hot Candle Aroma Oil Massage', summary: 'Warm aromatic candle oil poured and massaged in — our most indulgent full-body therapy.', bullets: [], durationMinutes: 60, price: 2500, featured: true },
];

/** Category lookup used across the app, with its hero photo attached. */
export const categoryBySlug = Object.fromEntries(
  categories.map((c) => [c.slug, { ...c, heroImage: c.heroImage || categoryImages[c.slug] || null }])
);

/** Services with their category joined in, in menu order. */
export const servicesWithCategory = services.map((service, index) => ({
  ...service,
  id: index + 1,
  // Photography from the live site; anything without one falls back to the
  // tinted placeholder.
  image: service.image || serviceImages[service.slug] || null,
  category: {
    slug: service.categorySlug,
    name: categoryBySlug[service.categorySlug].name,
    accent: categoryBySlug[service.categorySlug].accent,
  },
}));

/**
 * The four top-level entries in the services menu. Each groups one or more
 * departments, which become the sub-headings on the services page.
 */
export const menuGroups = [
  {
    slug: 'facials',
    name: 'Facials',
    tagline: 'The full facial menu, from a 30-minute reset to a 90-minute deep treatment.',
    intro:
      'Every facial gives your skin real results without taking over your day — from a focused 30-minute treatment to a full 90-minute deep-contouring session, plus add-ons to enhance any visit.',
    departments: ['facials', 'add-on-treatments', 'lasers', 'chemical-peels'],
  },
  {
    slug: 'brows',
    name: 'Brows',
    tagline: 'Precision brows, designed around your face.',
    intro:
      'Every brow service starts with personalised brow mapping, so the shape suits your facial proportions, eye shape and natural growth pattern rather than a standard template.',
    departments: ['brows'],
  },
  {
    slug: 'bridal',
    name: 'Bridal & Groom',
    tagline: 'Planned backwards from your wedding date.',
    intro:
      'Bridal skin is a schedule, not a single appointment. These packages combine treatments from across the menu into a plan for the bride, the groom and the family — with a package saving against booking each treatment separately.',
    departments: ['bridal'],
  },
];

/**
 * Departments not shown in the Services menu/nav grouping above — deliberately
 * left out of the top nav, per the site owner's choice. Every one of them is
 * still fully live: a real page at /services/<slug>, in the sitemap, and
 * shown on the homepage's full department grid — just not grouped under a
 * top-level tab.
 *
 * medi-facials, advanced-facials and face-clean-up were removed from the
 * Facials group specifically so that group matches the Silver Mirror facial
 * menu exactly (just "facials" + "add-on-treatments") without the older
 * Hydra-series content mixed in.
 */
export const UNGROUPED_DEPARTMENTS = [
  'medi-facials',
  'advanced-facials',
  'face-clean-up',
  'body-bleach-detan',
  'body-polish',
  'threading',
  'face-waxing',
  'body-waxing',
  'manicure',
  'pedicure',
  'nails',
  'massages',
];

/**
 * URL for a menu group's filtered view of /services.
 *
 * `/services/menu/<slug>` rather than `/services/<slug>` — three of the four
 * group slugs (facials, brows, bridal) are identical to real department
 * slugs (e.g. /services/facials is the Facials department page, a totally
 * different page from "every facial-related department shown together").
 * The distinct /menu/ segment keeps the two from colliding.
 *
 * The default group (menuGroups[0], "facials") has no query string or extra
 * segment — plain /services already means that — so there is exactly one
 * canonical URL per group, never two for the same content.
 */
export const groupPath = (slug) => (slug === menuGroups[0].slug ? '/services' : `/services/menu/${slug}`);

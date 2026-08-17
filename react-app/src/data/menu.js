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
      'Our classic facial menu — from gentle organic masks to anti-ageing protocols, each chosen for your skin type after consultation.',
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
    slug: 'lotus-puravital',
    categorySlug: 'facials',
    name: 'Lotus Puravital',
    summary: 'A detoxifying facial with Lotus extracts and Puravital serum to deeply cleanse and balance the skin.',
    bullets: [],
    durationMinutes: 45,
    price: 1500,
    featured: false,
  },
  {
    slug: 'lotus-puravital-tightening-mask',
    categorySlug: 'facials',
    name: 'Lotus Puravital with Tightening Mask',
    summary: 'The Puravital facial finished with a tightening mask for extra firmness and definition.',
    bullets: [],
    durationMinutes: 60,
    price: 2000,
    featured: false,
  },
  {
    slug: 'o3-whitening-facial',
    categorySlug: 'facials',
    name: 'O3 Whitening Facial (1 pack = 1 mask)',
    summary:
      'An advanced brightening facial using O3+ technology to lighten tan, hydrate and restore even skin tone.',
    bullets: [],
    durationMinutes: 70,
    price: 3500,
    featured: false,
  },
  {
    slug: 'casmara-prestige',
    categorySlug: 'facials',
    name: 'Casmara Prestige',
    summary:
      "A premium facial delivering instant luminosity through Casmara's signature peel-off mask and antioxidants.",
    bullets: [],
    durationMinutes: 70,
    price: 3500,
    featured: false,
  },
  {
    slug: 'japanese-seed-mask-organic-facial',
    categorySlug: 'facials',
    name: 'Japanese Seed Mask Organic Facial',
    summary:
      'A luxurious organic facial enriched with Japanese seed extracts that boost collagen and even out skin tone.',
    bullets: [],
    durationMinutes: 90,
    price: 3500,
    featured: true,
  },
  {
    slug: 'blanch-skin-whitening',
    categorySlug: 'facials',
    name: 'Blanch Skin Whitening',
    summary:
      'An advanced whitening therapy designed to reduce pigmentation and brighten dull skin from within.',
    bullets: [],
    durationMinutes: 90,
    price: 4500,
    featured: false,
  },
  {
    slug: 'casmara-goji-treatment-facial',
    categorySlug: 'facials',
    name: 'Casmara Goji Treatment Facial',
    summary:
      'Powered by Goji berry extracts, this facial protects skin from free radicals and deeply revitalises it.',
    bullets: [],
    durationMinutes: 80,
    price: 4500,
    featured: false,
  },
  {
    slug: 'upendice-anti-ageing',
    categorySlug: 'facials',
    name: 'Upendice Anti Ageing',
    summary:
      'A rejuvenating treatment that minimises fine lines, firms skin and restores elasticity using anti-ageing peptides.',
    bullets: [],
    durationMinutes: 90,
    price: 4500,
    featured: false,
  },
  {
    slug: 'depuffing-ritual',
    categorySlug: 'facials',
    name: 'Depuffing Ritual',
    summary:
      'A lymphatic-focused ritual that drains puffiness and re-sculpts a tired face. New on the ESTEQO menu.',
    bullets: [],
    durationMinutes: 45,
    price: 2500,
    isNew: true,
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
    slug: 'glow-peel',
    categorySlug: 'add-on-treatments',
    name: 'Glow Peel',
    summary:
      'A mild exfoliating peel for dull, tired skin — perfect for that pre-event glow-up. Add it to your Hydra Facial for enhanced radiance at ₹800.',
    bullets: ['Mild exfoliating peel for dull, tired skin', 'Add to a Hydra Facial for ₹800'],
    durationMinutes: 20,
    price: 1200,
    priceNote: '₹800 when added to a Hydra Facial',
    featured: true,
  },
  {
    slug: 'spot-peel',
    categorySlug: 'add-on-treatments',
    name: 'Spot Peel',
    summary:
      'A targeted chemical peel that treats dark spots, pigmentation and acne marks — customised per area.',
    bullets: [],
    durationMinutes: null,
    price: 3000,
    priceNote: '₹3,000 – ₹5,000 depending on the area',
    featured: false,
  },
  {
    slug: 'butt-glow-facial',
    categorySlug: 'add-on-treatments',
    name: 'Butt Glow Facial',
    summary:
      'A clarifying and brightening treatment for the buttocks — cleansing, exfoliation, a targeted mask and an optional peel for acne, pigmentation and rough texture.',
    bullets: [],
    durationMinutes: 40,
    price: 4500,
    priceNote: '30–40 minutes',
    featured: false,
  },
  {
    slug: 'green-sea-peel',
    categorySlug: 'add-on-treatments',
    name: 'Green Sea Peel',
    summary:
      'A Korean algae-based herbal peel for acne, scars and pigmentation, offering deep exfoliation without harsh chemicals.',
    bullets: ['Korean algae-based herbal peel', 'Deep exfoliation without harsh chemicals'],
    durationMinutes: 45,
    price: 6000,
    featured: false,
  },
  {
    slug: 'signature-hydra-glow-body-polish',
    categorySlug: 'add-on-treatments',
    name: 'Signature Hydra Glow Body Polish',
    summary:
      'Cleanses, exfoliates, detoxifies, hydrates and nourishes with a revitalising pack, using Hydra dermabrasion.',
    bullets: [],
    durationMinutes: 120,
    price: 5500,
    featured: false,
  },
  {
    slug: 'intimate-peel',
    categorySlug: 'add-on-treatments',
    name: 'Intimate Peel',
    summary:
      'Targets pigmentation on the bikini area, underarms, inner thighs or any intimate area using Meline or BioRepeel — with zero downtime. Two to three sessions may be needed for optimal results.',
    bullets: [],
    durationMinutes: 20,
    price: 6000,
    priceNote: 'Per session',
    featured: false,
  },
  {
    slug: 'meline-pigmentation-peel',
    categorySlug: 'add-on-treatments',
    name: 'Meline Pigmentation Peel',
    summary:
      'A medical-grade depigmenting peel designed to treat melasma, tanning and uneven skin tone with minimal downtime.',
    bullets: [],
    durationMinutes: 45,
    price: 7500,
    priceNote: 'Per session',
    featured: false,
  },
  {
    slug: 'dermaplaning',
    categorySlug: 'add-on-treatments',
    name: 'Dermaplaning',
    summary:
      'Gentle exfoliation using a surgical blade to remove dead skin and peach fuzz for instant smoothness and glow.',
    bullets: [],
    durationMinutes: null,
    price: 1000,
    priceNote: '₹1,000 face / ₹500 neck — add-on',
    variants: [
      { label: 'Face', price: 1000 },
      { label: 'Neck', price: 500 },
    ],
    featured: false,
  },
  {
    slug: 'esthemax-masks',
    categorySlug: 'add-on-treatments',
    name: 'Esthemax Masks',
    summary:
      'Hydro-jelly masks — Egyptian Rose, Youthful Elixir, Spot Diminishing, ALA, Radiance Biotin and Brightening Complex — to boost hydration, glow and targeted results.',
    bullets: [
      'Egyptian Rose | Youthful Elixir | Spot Diminishing',
      'ALA | Radiance Biotin | Brightening Complex',
      'Boosts hydration, glow and targeted results',
    ],
    durationMinutes: null,
    price: 1500,
    priceNote: '₹1,500 – ₹2,000 — add-on',
    featured: false,
  },
  {
    slug: 'biorepeel',
    categorySlug: 'add-on-treatments',
    name: 'BioRepeel',
    summary:
      'A biphasic TCA peel that exfoliates, brightens and stimulates collagen — without visible peeling or downtime.',
    bullets: [],
    durationMinutes: null,
    price: 6000,
    priceNote: 'Per session — add-on',
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
    tagline: 'Every facial and skin treatment on the menu.',
    intro:
      'From a 30-minute cleanup to advanced laser and micro-needling protocols. Every facial begins with a skin analysis, so the treatment is chosen for your skin rather than picked off a list.',
    departments: [
      'medi-facials',
      'advanced-facials',
      'facials',
      'face-clean-up',
      'add-on-treatments',
    ],
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
    name: 'Bridal Services',
    tagline: 'Planned backwards from your wedding date.',
    intro:
      'Bridal skin is a schedule, not a single appointment. These packages combine treatments from across the menu into a plan for the bride, the groom and the family — with a package saving against booking each treatment separately.',
    departments: ['bridal'],
  },
  {
    slug: 'other',
    name: 'Other Services',
    tagline: 'Body, hands, feet, hair removal and massage.',
    intro:
      'Everything beyond the face — body brightening and polishing, threading and waxing, manicure and pedicure, nails, and our full massage menu.',
    departments: [
      'body-bleach-detan',
      'body-polish',
      'threading',
      'face-waxing',
      'body-waxing',
      'manicure',
      'pedicure',
      'nails',
      'massages',
    ],
  },
];

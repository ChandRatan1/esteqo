/**
 * Brows department — content transcribed from "ESTEQO WEBSITE CONTENT (1).docx".
 *
 * That document lists ten brow and PMU treatments, each written up with a
 * headline, an intro, the session stats, a "How It Works" breakdown, a "Who
 * Gets This" list and a "What You Get" summary. The mapping used here:
 *
 *   intro paragraph  -> summary      (shown on cards and the department page)
 *   "What You Get"   -> bullets      (shown as "Includes")
 *   "Who Gets This"  -> idealFor     (shown as "Ideal for")
 *   "How It Works"   -> process
 *   session stats    -> durationMinutes / resultsLast / priceNote
 *
 * Prices are quoted on consultation, so `price` stays null throughout.
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
    name: 'Brow Shape & Brow Mapping',
    summary:
      'Your eyebrows are either an asset or a liability. We map your face, remove only what needs to go, and leave you looking sharper.',
    bullets: [
      'Crisp, defined brows tailored to your face',
      'No pain, no swelling, no downtime',
      'Results last 3–4 weeks',
    ],
    idealFor: [
      'Brows look undefined or messy',
      'One brow higher than the other',
      'Over-plucked and sparse',
      'Preparing for permanent makeup',
    ],
    process: [
      { title: 'Assess', text: 'We assess your face — proportions, eye shape, existing density and growth pattern.' },
      { title: 'Map', text: 'We map your ideal brow shape based on your facial structure, not on trends.' },
      { title: 'Remove', text: 'We remove hair by threading, waxing or tweezing, depending on your skin.' },
    ],
    resultsLast: '3–4 weeks. Maintain every 3–4 weeks to keep them sharp.',
    durationMinutes: 20,
    price: null,
    priceNote: 'On consultation',
    featured: true,
  },
  {
    slug: 'hd-brows',
    categorySlug: 'brows',
    name: 'HD Brows Tint',
    summary:
      'Faded, sparse or undefined brows make you look tired. Custom tinting, precision mapping and professional shaping give your brows colour, definition and balance.',
    bullets: [
      'Sculpted, tinted brows that look thick and defined',
      'Colour stays 2–3 weeks, shape holds 4 weeks',
      'Same-day results, zero downtime',
    ],
    idealFor: [
      'Brows look faded or washed out',
      'Over-plucked or sparse areas',
      'Uneven density or asymmetrical',
      'Want defined, coloured brows without daily makeup',
    ],
    process: [
      { title: 'Map', text: 'We map your ideal brow shape based on your face and growth pattern.' },
      { title: 'Tint', text: 'Custom-blended tint enhances colour and creates depth.' },
      { title: 'Shape', text: 'Precision shaping — threading, waxing, tweezing, trimming — removes unwanted hair and refines the edges.' },
    ],
    resultsLast: 'Shape holds 4 weeks; colour 2–3 weeks. Maintain every 3–4 weeks.',
    durationMinutes: 30,
    price: null,
    priceNote: 'On consultation',
    featured: true,
  },
  {
    slug: 'brow-lamination',
    categorySlug: 'brows',
    name: 'Brow Lamination',
    summary:
      'Messy, downward-growing brows make you look tired and sparse brows disappear entirely. Lamination fixes both — we smooth, lift and set your brows in place for fuller definition without daily brushing.',
    bullets: [
      'Lifted, smooth, fuller-looking brows that stay set',
      'No daily brushing needed',
      'Shape holds 4–6 weeks, zero downtime',
    ],
    idealFor: [
      'Brows grow downward or look unruly',
      'Want a fuller appearance without daily grooming',
      'Sparse, thin, or directionally challenging hair',
      'Need a polished, lifted brow look',
    ],
    process: [
      { title: 'Map & shape', text: 'We map and shape your brows for balance.' },
      { title: 'Lift', text: 'A lifting solution softens and redirects the hairs upward.' },
      { title: 'Tint & set', text: 'Custom tint enhances colour, then a neutraliser sets everything in place.' },
    ],
    resultsLast: '4–6 weeks. Maintain with a nourishing serum between appointments.',
    durationMinutes: 40,
    price: null,
    priceNote: 'On consultation',
    featured: false,
  },
  {
    slug: 'microblading',
    categorySlug: 'brows',
    name: 'Microblading / Nanoblading',
    summary:
      'Over-plucked, sparse or thin brows mean you draw them on every morning. Nanoblading creates hair-like strokes that look completely natural — you wake up with brows already done.',
    bullets: [
      'Full, defined, natural-looking brows for 6 months',
      'Two visits: the session plus a refinement at 4–12 weeks',
      'Healing takes 3–4 weeks, with light flaking normal',
    ],
    idealFor: [
      'Over-plucked or sparse brows',
      'Tired of drawing brows daily',
      'Want natural-looking enhancement',
      'Seeking a 6-month commitment, not permanent',
    ],
    process: [
      { title: 'Session 1', text: 'We map your ideal shape, select a custom pigment colour, and create delicate hair-like strokes with a fine microblade.' },
      { title: 'Session 2', text: 'At 4–12 weeks we refine and perfect the brows as they heal.' },
    ],
    resultsLast: '6 months, then fades gradually. Return for a refresh at 12–18 months.',
    aftercare: [
      'Sun protection is required to preserve the colour',
      'Light flaking during the 3–4 week healing period is normal',
    ],
    durationMinutes: 60,
    price: null,
    priceNote: 'Per session, on consultation',
    featured: true,
  },
  {
    slug: 'ombre-brow',
    categorySlug: 'brows',
    name: 'Ombre Brow',
    summary:
      "Filling in your brows every morning wastes time you don't have. Ombre Brows end that for up to 18 months with soft, powder-shaded colour that never smudges or wipes off.",
    bullets: [
      'Defined brows that hold colour for up to 18 months',
      'Free perfecting session at 4–12 weeks',
      'No daily routine, no downtime',
    ],
    idealFor: [
      'Oily or combination skin where regular brow tattoos fade fast',
      'Sparse, uneven, or over-plucked brows needing real density',
      'Anyone done with pencil and powder every morning',
      'Old PMU or faded pigment that needs correcting',
      'People who want polished brows with zero upkeep',
    ],
    process: [
      { title: 'Consultation and mapping', text: 'We design your exact shape and pigment shade.' },
      { title: 'Pigment application', text: 'One 90-minute session using a digital PMU machine, shaded light to dark.' },
      { title: 'Perfecting session', text: 'Free touch-up at 4 to 12 weeks.' },
    ],
    resultsLast: 'Up to 18 months. Refresh every 12 to 18 months.',
    durationMinutes: 90,
    price: null,
    priceNote: 'Per session, on consultation',
    featured: false,
  },
  {
    slug: 'hybrid-brow',
    categorySlug: 'brows',
    name: 'Hybrid / Combination Brow',
    summary:
      'Microblading alone fades fast and ombre alone can look flat. Hybrid Brows combine both — hair strokes up front and soft shading through the tail, without the trade-offs.',
    bullets: [
      'Natural, dense brows that hold for up to 18 months',
      'Retouch session at 4–12 weeks',
      'No sketchy edges, no flat shading',
    ],
    idealFor: [
      'Oily skin or leftover pigment from old brow work',
      'Sparse or uneven brows needing more density',
      'Anyone wanting strokes plus soft definition',
      'People who want fuller brows without daily filling in',
      'Clients ready to commit to one shape, one colour',
    ],
    process: [
      { title: 'Consultation and mapping', text: 'We shape the brows to match your face and select the pigment.' },
      { title: 'Microblading and shading', text: 'One 90-minute session — strokes at the front, shading at the tail.' },
      { title: 'Retouch session', text: 'Follow-up at 4 to 12 weeks.' },
    ],
    resultsLast: 'Up to 18 months. Refresh every 12 to 18 months.',
    durationMinutes: 90,
    price: null,
    priceNote: 'Per session, on consultation',
    featured: false,
  },
  {
    slug: 'brow-tattoo-removal',
    categorySlug: 'brows',
    name: 'Eyebrow Tattoo & PMU Removal',
    summary:
      "Old microblading or PMU doesn't just disappear on its own. Saline removal draws unwanted pigment out gradually, so a bad brow can be corrected without waiting years for it to fade.",
    bullets: [
      'Pigment fades progressively, session by session',
      'Sessions spaced 4 weeks apart',
      'No laser required',
    ],
    idealFor: [
      'Outdated or poorly healed eyebrow tattoos',
      'Uneven or mismatched previous microblading',
      'Brows with unwanted colour shifts or heavy pigment saturation',
      'Anyone wanting a pigment reset before new PMU',
      'Correction cases needing shape or tone fixed',
    ],
    process: [
      { title: 'Consultation and assessment', text: 'We check pigment colour, depth and saturation first.' },
      { title: 'Saline application', text: 'One 60-minute session using a controlled PMU technique.' },
      { title: 'Progressive sessions', text: 'Spaced 4 weeks apart until the pigment is sufficiently faded.' },
    ],
    resultsLast: 'Session count varies by case and pigment depth.',
    note: 'This is a progressive treatment — there is no instant erasure.',
    durationMinutes: 60,
    price: null,
    priceNote: 'Per session, on consultation',
    featured: false,
  },
  {
    slug: 'mole-creation',
    categorySlug: 'brows',
    name: 'Mole Creation',
    summary:
      'Drawing on a fake mole every morning never looks natural. PMU mole creation deposits pigment in one precise spot, so you get a permanent mark that reads as real.',
    bullets: [
      'A single, natural-looking mole placed exactly where you want it',
      'One quick session',
      'Touch up only if needed',
    ],
    idealFor: [
      'Anyone drawing on a fake beauty mark for years',
      'People wanting a signature facial feature added',
      'Clients missing a mole from a past scar or removal',
      'Those who want subtle, natural-looking placement',
      'Anyone tired of makeup that smudges by noon',
    ],
    process: [
      { title: 'Consultation and placement', text: 'We map the exact spot, size and shade for your face.' },
      { title: 'Pigment deposit', text: 'One quick session using a fine PMU technique for a natural dot.' },
      { title: 'Healing check', text: 'Follow-up if the pigment needs refining.' },
    ],
    resultsLast: 'Long-lasting, with an optional touch-up as needed.',
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation',
    featured: false,
  },
  {
    slug: 'scalp-micropigmentation',
    categorySlug: 'brows',
    name: 'Scalp Micropigmentation',
    summary:
      "A thinning patch on your scalp doesn't fix itself, and hats can only hide so much. Scalp micropigmentation deposits pigment dots that mimic real hair follicles, filling in patches for a fuller, denser look.",
    bullets: [
      'A full, natural-looking scalp with density restored',
      'Results last years with upkeep',
      'No surgery, no downtime',
    ],
    idealFor: [
      'Thinning patches from alopecia, stress, or genetics',
      'Scars from past hair transplants or injuries',
      'Anyone tired of concealer powder that washes out',
      'People wanting denser hair without a transplant',
      'Those who shave their head and want a defined hairline',
    ],
    process: [
      { title: 'Consultation and mapping', text: 'We match your hair colour and design your density pattern.' },
      { title: 'Pigment deposit', text: 'Multiple sessions, spaced apart, layering dots for depth and density.' },
      { title: 'Final review', text: 'We check density and refine any patchy areas.' },
    ],
    resultsLast: 'Years, with upkeep.',
    note: 'Delivered over multiple sessions, spaced apart.',
    durationMinutes: null,
    price: null,
    priceNote: 'Per session, on consultation',
    featured: false,
  },
  {
    slug: 'lip-blush',
    categorySlug: 'brows',
    name: 'Lip Blush',
    summary:
      'Lipstick smudges, fades and needs reapplying all day. Lip Blush deposits soft pigment into your lips, adding natural colour and definition that stays put from morning to night.',
    bullets: [
      'Natural-looking colour and definition for one to three years',
      'Perfecting session at 4–8 weeks',
      'No daily lipstick, no smudging',
    ],
    idealFor: [
      'Pale or uneven lip tone needing natural colour',
      'Thin lips wanting a more defined shape',
      'Anyone tired of reapplying lipstick throughout the day',
      'People wanting a soft, your-lips-but-better tint',
      'Clients correcting faded or patchy past lip tattoos',
    ],
    process: [
      { title: 'Consultation and mapping', text: 'We pick your shade and define your natural lip line and shape.' },
      { title: 'Pigment application', text: 'One session using a fine PMU technique, built up in soft layers.' },
      { title: 'Perfecting session', text: 'Follow-up at 4 to 8 weeks.' },
    ],
    resultsLast: 'One to three years. Refresh the tint once it fades.',
    durationMinutes: null,
    price: null,
    priceNote: 'On consultation',
    featured: false,
  },
];

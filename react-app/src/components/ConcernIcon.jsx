/**
 * Circular line-art icon shown beside each skin concern, following the
 * pattern the services page uses: a thin ring with a simple monochrome glyph
 * inside, then the concern in uppercase next to it.
 *
 * The glyphs are drawn here rather than imported as artwork, so the set is
 * ours and scales to any size without extra files. Concerns are matched on
 * keywords rather than exact strings, because the same idea is worded
 * differently across departments ("Redness and irritation", "Rosacea",
 * "Sensitive skin irritated by waxing" all mean the same thing to a visitor).
 * Anything unmatched falls back to a neutral glyph rather than no icon.
 */

/* Each glyph is drawn inside a 24x24 box, sitting within the ring. */
const GLYPHS = {
  // Dull, tired-looking skin — light rays that stop short.
  dullness: <path d="M12 7.5v-2M12 18.5v2M7.5 12h-2M18.5 12h2M8.8 8.8L7.4 7.4M15.2 15.2l1.4 1.4M15.2 8.8l1.4-1.4M8.8 15.2l-1.4 1.4M12 9.6a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8" />,
  // Balanced skin — three even, calm lines.
  normal: <path d="M6.5 9.5h11M6.5 12h11M6.5 14.5h11" />,
  // Congestion — clustered pores.
  congestion: (
    <>
      <circle cx="9.5" cy="9.5" r="1.2" />
      <circle cx="14.5" cy="10.5" r="1.2" />
      <circle cx="10.5" cy="14.5" r="1.2" />
      <circle cx="15" cy="15" r="1.2" />
    </>
  ),
  // Puffiness — a swollen curve with pressure lines above it.
  puffiness: <path d="M6.5 14.5c2.2 2.6 8.8 2.6 11 0M8 10.2c1.6-1.4 6.4-1.4 8 0M10 7.2c1-.7 3-.7 4 0" />,
  // Redness and irritation — a flushed patch.
  redness: (
    <>
      <path d="M7.5 13.5c1.6-3.4 7.4-3.4 9 0" />
      <circle cx="10" cy="10" r=".9" />
      <circle cx="14" cy="10.4" r=".9" />
      <circle cx="12" cy="15.4" r=".9" />
    </>
  ),
  // Uneven tone — two shades meeting.
  tone: <path d="M12 6.5v11M7 9h3M7 12h3M7 15h3M14 8.2h3.2M14 11h3.2M14 13.8h3.2M14 16.6h3.2" />,
  // Dryness and dehydration — a droplet with a crack.
  dryness: <path d="M12 6.6c2.6 3 4 5 4 6.6a4 4 0 11-8 0c0-1.6 1.4-3.6 4-6.6zM12 11.4v4" />,
  // Acne and breakouts — raised spots.
  acne: (
    <>
      <circle cx="10" cy="10" r="1.9" />
      <circle cx="15" cy="14.4" r="1.4" />
      <circle cx="14.8" cy="9.2" r=".9" />
      <circle cx="9.4" cy="15" r=".9" />
    </>
  ),
  // Fine lines and wrinkles — creases.
  lines: <path d="M6.6 9.4c2-1.2 3.4 1.2 5.4 0s3.4 1.2 5.4 0M6.6 12.6c2-1.2 3.4 1.2 5.4 0s3.4 1.2 5.4 0M6.6 15.8c2-1.2 3.4 1.2 5.4 0s3.4 1.2 5.4 0" />,
  // Rough, bumpy texture.
  texture: <path d="M6.5 15.2c1.2-2.2 2.4-2.2 3.6 0 1.2-3.4 2.4-3.4 3.6 0 1.2-2.2 2.4-2.2 3.6 0M6.5 10.4c1.2-2.2 2.4-2.2 3.6 0 1.2-3.4 2.4-3.4 3.6 0 1.2-2.2 2.4-2.2 3.6 0" />,
  // Scarring — an indented mark.
  scarring: <path d="M9 16.5L15 7.5M10.6 10.4l-2 1.4M13.4 13.6l2-1.4M12 8.8l-1.8 1M12.6 15.4l1.8-1" />,
  // Dark circles — shading under the eye.
  darkCircles: <path d="M6.6 10.6c2.4-2.6 8.4-2.6 10.8 0-2.4 2.6-8.4 2.6-10.8 0zM12 9.4a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6M8.4 14.6c2-1.4 5.2-1.4 7.2 0" />,
  // Unwanted hair / shaving and waxing.
  hair: <path d="M7.6 6.8h8.8v4.6H7.6zM9.4 11.4v5.8M12 11.4v5.8M14.6 11.4v5.8M7.6 9.1h8.8" />,
  // Brow shape and definition.
  brow: <path d="M6.4 13.4c2.4-4 8.8-4 11.2 0M8.2 11.2l.6-1.8M11 10.1l.3-1.9M13.8 10.4l-.2-1.9M16.2 11.6l-.8-1.7" />,
  // Lip colour and shape.
  lip: <path d="M5.8 12c2.4-2.8 4-2.8 6.2-1 2.2-1.8 3.8-1.8 6.2 1-2.4 3.4-9.8 3.4-12.4 0z" />,
  // Scalp density and thinning.
  scalp: <path d="M6.6 15.4c0-3.6 2.4-6.4 5.4-6.4s5.4 2.8 5.4 6.4M9 15.4v-2.2M12 15.4v-3M15 15.4v-2.2M7 18h10" />,
  // Pigment correction and PMU removal.
  pigment: <path d="M16.6 7.4l-7.8 7.8-2.4.6.6-2.4 7.8-7.8zM8.8 15.2l-2-2M6.2 18.4h11.6" />,
  // Neutral fallback.
  general: <path d="M12 7.6v5.2M12 16.2h.01" />,
};

/**
 * Keyword rules, most specific first — the first match wins, so "lip tone"
 * resolves to the lip glyph rather than the tone one.
 */
const RULES = [
  [['lip', 'lipstick'], 'lip'],
  [
    ['brow', 'microblading', 'pmu', 'permanent makeup', 'sparse', 'density', 'plucked',
     'strokes', 'pencil', 'grooming', 'natural-looking enhancement'],
    'brow',
  ],
  [['scalp', 'alopecia', 'thinning', 'transplant', 'hairline', 'denser hair'], 'scalp'],
  [['pigment reset', 'pigment saturation', 'colour shift', 'color shift', 'tattoo', 'mole', 'beauty mark', 'facial feature'], 'pigment'],
  [
    ['shaving', 'shave', 'waxing', 'wax', 'threading', 'ingrown', 'razor', 'regrowth',
     'facial hair', 'long-term solution', 'one visit'],
    'hair',
  ],
  [['dark circle'], 'darkCircles'],
  [['scar'], 'scarring'],
  [['acne', 'breakout', 'oiliness', 'oily', 'blackhead', 'whitehead'], 'acne'],
  [['congestion', 'congested', 'clogged', 'pore'], 'congestion'],
  [['puffiness', 'puffy', 'swelling'], 'puffiness'],
  [['redness', 'irritation', 'rosacea', 'sensitive', 'eczema', 'inflammation', 'reactive'], 'redness'],
  [['dehydration', 'dryness', 'dry', 'flaking', 'flaky'], 'dryness'],
  [['fine lines', 'wrinkle', 'elasticity', 'ageing', 'aging', 'age spot'], 'lines'],
  [['texture', 'rough', 'bumpy'], 'texture'],
  [['tone', 'pigmentation', 'sun spot', 'spots', 'hyperpigmentation'], 'tone'],
  [['dullness', 'dull', 'tired', 'glow'], 'dullness'],
  [['normal skin', 'maintenance', 'environmental'], 'normal'],
];

export function glyphFor(concern) {
  const text = String(concern).toLowerCase();
  for (const [keywords, glyph] of RULES) {
    if (keywords.some((word) => text.includes(word))) return glyph;
  }
  return 'general';
}

export default function ConcernIcon({ concern }) {
  const glyph = glyphFor(concern);

  return (
    <span className="concern__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10.4" />
        {GLYPHS[glyph]}
      </svg>
    </span>
  );
}

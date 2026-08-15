/**
 * Treatment photography, taken from the live esteqo.com site.
 *
 * Files live in public/services/. Each key is a service slug from menu.js;
 * where the live site sells one treatment that the printed menu splits in two
 * (for example "Hand / Leg Polish"), both slugs point at the same photo.
 *
 * To replace a photo: drop a new file into public/services/ and change the
 * path here. To add one for a treatment that has none, add its slug below —
 * anything missing falls back to the tinted placeholder.
 */

export const serviceImages = {
  'advanced-hydra-facial': '/services/21332.jpg',
  'back-facial-with-hydra': '/services/21392.jpg',
  'back-massage': '/services/21655.png',
  'back-polish': '/services/21392.jpg',
  'biorepeel': '/services/21351.jpg',
  'blanch-skin-whitening': '/services/21339.jpg',
  'butt-glow-facial': '/services/21353.jpg',
  'casmara-goji-treatment-facial': '/services/21339.jpg',
  'casmara-prestige': '/services/21333.jpg',
  'chin-threading': '/services/21420.jpg',
  'chin-wax': '/services/21357.jpg',
  'deep-tissue-massage': '/services/21655.png',
  'depuffing-ritual': '/services/21357.jpg',
  'dermaplaning': '/services/21357.jpg',
  'esthemax-masks': '/services/21339.jpg',
  'eyebrow-mapping-with-wax': '/services/21687.png',
  'eyebrows-threading': '/services/21416.jpg',
  'face-bleach-detan': '/services/21385.jpg',
  'foot-massage': '/services/21652.png',
  'foot-reflexology': '/services/21657.png',
  'forehead-threading': '/services/21420.jpg',
  'forehead-wax': '/services/21357.jpg',
  'full-back-bleach-detan': '/services/21390.jpg',
  'full-body-bleach-detan': '/services/21390.jpg',
  'full-body-polish': '/services/21392.jpg',
  'full-body-polish-with-hydra': '/services/21392.jpg',
  'full-face-threading': '/services/21420.jpg',
  'full-face-wax': '/services/21339.jpg',
  'full-face-wax-rica': '/services/21339.jpg',
  'full-front-bleach-detan': '/services/21385.jpg',
  'full-hands-bleach-detan': '/services/21388.jpg',
  'full-leg-polish': '/services/21395.jpg',
  'full-legs-bleach-detan': '/services/21390.jpg',
  'glow-peel': '/services/21351.jpg',
  'green-sea-peel': '/services/21351.jpg',
  'half-back-bleach-detan': '/services/21390.jpg',
  'half-front-bleach-detan': '/services/21385.jpg',
  'half-hands-bleach-detan': '/services/21388.jpg',
  'half-legs-bleach-detan': '/services/21390.jpg',
  'hand-polish': '/services/21395.jpg',
  'hand-reflexology': '/services/21657.png',
  'head-massage': '/services/21653.png',
  'head-shoulder-massage': '/services/21653.png',
  'hot-candle-aroma-oil-massage': '/services/21655.png',
  'hydra-carbon-laser-facial': '/services/21329.jpg',
  'hydra-clean-up': '/services/21324.jpg',
  'hydra-facial': '/services/21329.jpg',
  'hydra-glow-peel': '/services/21329.jpg',
  'intimate-peel': '/services/21353.jpg',
  'japanese-seed-mask-organic-facial': '/services/21357.jpg',
  'lotus-cleanup': '/services/21375.jpg',
  'lotus-puravital': '/services/21377.jpeg',
  'lotus-puravital-tightening-mask': '/services/21377.jpeg',
  'lower-neck-wax': '/services/21339.jpg',
  'lowerlips-threading': '/services/21418.jpg',
  'meline-pigmentation-peel': '/services/21357.jpg',
  'o3-plus-whitening-clean-up': '/services/21375.jpg',
  'o3-whitening-facial': '/services/21339.jpg',
  'sidelock-wax': '/services/21339.jpg',
  'signature-hydra-glow-body-polish': '/services/21355.jpg',
  'spot-peel': '/services/21351.jpg',
  'swedish-massage': '/services/21655.png',
  'upendice-anti-ageing': '/services/21339.jpg',
  'upperlips-threading': '/services/21418.jpg',
  'upperlips-wax': '/services/21339.jpg',
};

/** Department hero images, keyed by category slug. */
export const categoryImages = {
  'medi-facials': '/services/21324.jpg',
  'advanced-facials': '/services/21329.jpg',
  'facials': '/services/21375.jpg',
  'face-clean-up': '/services/21377.jpg',
  'add-on-treatments': '/services/21351.jpg',
  'body-bleach-detan': '/services/21385.jpg',
  'body-polish': '/services/21392.jpg',
  'threading': '/services/21416.jpg',
  'face-waxing': '/services/21357.jpg',
  'body-waxing': '/services/21339.jpg',
  'massages': '/services/21652.jpg',
};

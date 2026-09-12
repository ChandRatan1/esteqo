-- ESTEQO - starting content (migration)
--
-- The one data file: everything install.sql's tables start with. Generated
-- from react-app/src/data, which is what the website renders before any
-- content is added or edited through /admin. Import AFTER install.sql.
--
-- SAFE TO RUN ANY NUMBER OF TIMES. Every statement is INSERT IGNORE and
-- there is no DELETE, so:
--   * on an empty database it loads the full starting content
--   * on a database that already has content it changes NOTHING - your
--     blog posts, services, edits and enquiries are left exactly as they are
--
-- Services and departments no longer need a re-seed after a menu edit: once
-- install.sql + this file have run once, /admin/services is the source of
-- truth and edits are live immediately (see backend-php/routes/services*.php).

SET FOREIGN_KEY_CHECKS = 0;

INSERT IGNORE INTO `service_categories`
  (`id`, `slug`, `name`, `tagline`, `intro`, `accent`, `hero_image`, `sort_order`, `is_featured`, `is_active`)
VALUES
  (1, 'brows', 'Brows', 'Precision brows, designed around your face — not a template.', 'Beautiful brows begin with the right structure. Every brow service starts with personalised brow mapping, so the shape suits your facial proportions, eye shape and natural growth pattern rather than a standard template.', 'light-brown', '/uploads/brows/brow_shape.jpg', 0, 1, 1),
  (2, 'bridal', 'Bridal Services', 'Planned backwards from your wedding date, not booked in a panic.', 'Bridal skin is a schedule, not a single appointment. These packages combine treatments from across the menu into a plan that starts months before and finishes the week of the wedding — for the bride, the groom and the family.', 'light-pink', '/uploads/bridal/bridal-radiance-90-days.jpg', 0, 1, 1),
  (3, 'medi-facials', 'Medi-Facials', 'Advanced skin treatments planned after analysis, not trends.', 'Rejuvenation that goes beyond the surface. Our Medi-Facials combine medical technology with therapeutic relaxation to purify, hydrate and renew your skin from within.', 'light-blue', '/uploads/facial/hyperpigmentation_facial.jpg', 1, 1, 1),
  (4, 'advanced-facials', 'Advanced Facials', 'Clinical technology for pigmentation, ageing and texture.', 'Laser, micro-needling and infusion protocols for concerns that a standard facial cannot reach — each planned around your skin assessment.', 'cream', '/uploads/advanced-facials/carbon-laser-facial.jpg', 2, 1, 1),
  (5, 'facials', 'Facials', 'Target your concerns with facials that heal, balance and brighten.', 'Our classic facial menu — from gentle organic masks to anti-ageing protocols, each chosen for your skin type after consultation.', 'light-pink', '/uploads/facial/premier_contour_facial.jpg', 3, 0, 1),
  (6, 'face-clean-up', 'Face Clean Up', 'The monthly reset that keeps pores clear between facials.', 'A cleanup focuses on removing dirt and impurities. Booked once a month, it is maintenance — it keeps congestion from building up between your bigger treatments.', 'off-white', '/uploads/facial/signature_facial.jpg', 4, 0, 1),
  (7, 'add-on-treatments', 'Add-On Treatments', 'Targeted boosters that amplify the results of any service.', 'Specialised boosters for pigmentation, dullness, scars and uneven texture. Most are designed to be added to a facial in the same session.', 'light-green', '/uploads/facial/hydradermabrasion.jpg', 5, 0, 1),
  (8, 'body-bleach-detan', 'Body Bleach & Detan', 'Lift tan and surface dullness, area by area.', 'Dermatologically approved formulas that lighten tan and remove surface dullness. Patch tests are performed before every session.', 'light-yellow', '/services/21390.jpg', 6, 0, 1),
  (9, 'body-polish', 'Body Polish', 'Full-body care that leaves skin soft, even-toned and luminous.', 'Exfoliation, hydration and nourishment from head to toe — including our Hydra dermabrasion body protocols.', 'light-brown', '/services/21392.jpg', 7, 0, 1),
  (10, 'manicure', 'Manicure', 'Nourishing hand treatments for lasting smoothness and shine.', 'From a classic tidy-up to algae and Drupe rituals with peel-off masks.', 'light-purple', '/uploads/manicure/drupe.jpg', 8, 0, 1),
  (11, 'pedicure', 'Pedicure', 'Foot care that goes further than a polish change.', 'Classic through to algae and Drupe pedicures, with peel-off mask options.', 'light-purple', '/uploads/pedicure/drupe.jpg', 9, 0, 1),
  (12, 'threading', 'Threading', 'Precise, chemical-free shaping for every part of the face.', 'Threading uses no chemicals, which makes it ideal for sensitive or acne-prone skin, and gives precise control on small areas.', 'cream', '/services/21416.jpg', 10, 0, 1),
  (13, 'face-waxing', 'Face Waxing', 'Low-temperature wax for a silky, glowing finish.', 'Hypoallergenic wax formulated for facial skin, with a patch test beforehand where your skin needs one.', 'light-pink', '/services/21687.png', 11, 0, 1),
  (14, 'body-waxing', 'Body Waxing', 'Hot wax, Rica wax and peel-off options for every area.', 'Choose the wax that suits your skin: hot wax for precision, Rica for sensitive areas, peel-off where comfort matters most.', 'light-blue', '/uploads/body-waxing/full-legs.jpg', 12, 0, 1),
  (15, 'nails', 'Nails', 'Quick nail care, on its own or as an add-on.', 'Nail shaping and polish, with a paraffin wax add-on for extra softness.', 'off-white', '/uploads/nails/nailcut-filing-polish.jpg', 13, 0, 1),
  (16, 'massages', 'Relaxing Massages', 'Unwind and rejuvenate with therapies built to restore balance.', 'Short focused massages by the 20 or 30 minute slot, plus full 60-minute body therapies. No downtime — you can return to your day immediately.', 'light-green', '/services/21653.png', 14, 0, 1),
  (17, 'lasers', 'Laser Hair Reduction', 'Medical-grade laser technology for safe, long-term hair reduction.', 'Each session is calibrated to your skin tone and hair type. Most areas need six to eight sessions, spaced a few weeks apart, for up to 90% reduction in regrowth.', 'light-blue', '/uploads/advanced-facials/carbon-laser-facial.jpg', 15, 0, 1),
  (18, 'chemical-peels', 'Chemical Peels', 'Controlled resurfacing for pigmentation, texture and dull skin.', 'Professional-strength peels that work beneath the surface to lift pigmentation, smooth texture and restore clarity. Strength is matched to your skin at consultation, and a patch test is done wherever your skin needs one.', 'light-green', '/uploads/facial/biorepeel.jpg', 16, 0, 1);

INSERT IGNORE INTO `services`
  (`id`, `category_id`, `slug`, `name`, `summary`, `bullets`, `what_to_expect`, `ideal_for`, `duration_minutes`, `price`, `image`, `sort_order`, `is_featured`, `is_active`, `description`)
VALUES
  (1, 1, 'brow-shape', 'Brow Shape & Brow Mapping', 'Your eyebrows are either an asset or a liability. We map your face, remove only what needs to go, and leave you looking sharper.', '["Crisp, defined brows tailored to your face", "No pain, no swelling, no downtime", "Results last 3–4 weeks"]', '[]', 'Brows look undefined or messy • One brow higher than the other • Over-plucked and sparse • Preparing for permanent makeup', 20, NULL, '/uploads/brows/brow_shape.jpg', 1, 1, 1, NULL),
  (3, 1, 'hd-brows', 'HD Brows Tint', 'Faded, sparse or undefined brows make you look tired. Custom tinting, precision mapping and professional shaping give your brows colour, definition and balance.', '["Sculpted, tinted brows that look thick and defined", "Colour stays 2–3 weeks, shape holds 4 weeks", "Same-day results, zero downtime"]', '[]', 'Brows look faded or washed out • Over-plucked or sparse areas • Uneven density or asymmetrical • Want defined, coloured brows without daily makeup', 30, NULL, '/uploads/brows/hd_brows.jpg', 2, 1, 1, NULL),
  (4, 1, 'brow-lamination', 'Brow Lamination', 'Messy, downward-growing brows make you look tired and sparse brows disappear entirely. Lamination fixes both — we smooth, lift and set your brows in place for fuller definition without daily brushing.', '["Lifted, smooth, fuller-looking brows that stay set", "No daily brushing needed", "Shape holds 4–6 weeks, zero downtime"]', '[]', 'Brows grow downward or look unruly • Want a fuller appearance without daily grooming • Sparse, thin, or directionally challenging hair • Need a polished, lifted brow look', 40, NULL, '/uploads/brows/brow_lamination.jpg', 3, 0, 1, NULL),
  (5, 1, 'microblading', 'Microblading / Nanoblading', 'Over-plucked, sparse or thin brows mean you draw them on every morning. Nanoblading creates hair-like strokes that look completely natural — you wake up with brows already done.', '["Full, defined, natural-looking brows for 6 months", "Two visits: the session plus a refinement at 4–12 weeks", "Healing takes 3–4 weeks, with light flaking normal"]', '[]', 'Over-plucked or sparse brows • Tired of drawing brows daily • Want natural-looking enhancement • Seeking a 6-month commitment, not permanent', 60, NULL, '/uploads/brows/microblading.jpg', 4, 1, 1, NULL),
  (6, 1, 'ombre-brow', 'Ombre Brow', 'Filling in your brows every morning wastes time you don''t have. Ombre Brows end that for up to 18 months with soft, powder-shaded colour that never smudges or wipes off.', '["Defined brows that hold colour for up to 18 months", "Free perfecting session at 4–12 weeks", "No daily routine, no downtime"]', '[]', 'Oily or combination skin where regular brow tattoos fade fast • Sparse, uneven, or over-plucked brows needing real density • Anyone done with pencil and powder every morning • Old PMU or faded pigment that needs correcting • People who want polished brows with zero upkeep', 90, NULL, '/uploads/brows/ombre_brow.jpg', 5, 0, 1, NULL),
  (7, 1, 'hybrid-brow', 'Hybrid / Combination Brow', 'Microblading alone fades fast and ombre alone can look flat. Hybrid Brows combine both — hair strokes up front and soft shading through the tail, without the trade-offs.', '["Natural, dense brows that hold for up to 18 months", "Retouch session at 4–12 weeks", "No sketchy edges, no flat shading"]', '[]', 'Oily skin or leftover pigment from old brow work • Sparse or uneven brows needing more density • Anyone wanting strokes plus soft definition • People who want fuller brows without daily filling in • Clients ready to commit to one shape, one colour', 90, NULL, '/uploads/brows/hybrid_brow.jpg', 6, 0, 1, NULL),
  (8, 1, 'brow-tattoo-removal', 'Eyebrow Tattoo & PMU Removal', 'Old microblading or PMU doesn''t just disappear on its own. Saline removal draws unwanted pigment out gradually, so a bad brow can be corrected without waiting years for it to fade.', '["Pigment fades progressively, session by session", "Sessions spaced 4 weeks apart", "No laser required"]', '[]', 'Outdated or poorly healed eyebrow tattoos • Uneven or mismatched previous microblading • Brows with unwanted colour shifts or heavy pigment saturation • Anyone wanting a pigment reset before new PMU • Correction cases needing shape or tone fixed', 60, NULL, '/uploads/brows/tattoo-removal.jpg', 7, 0, 1, NULL),
  (231, 1, 'mole-creation', 'Mole Creation', 'Drawing on a fake mole every morning never looks natural. PMU mole creation deposits pigment in one precise spot, so you get a permanent mark that reads as real.', '["A single, natural-looking mole placed exactly where you want it", "One quick session", "Touch up only if needed"]', '[]', 'Anyone drawing on a fake beauty mark for years • People wanting a signature facial feature added • Clients missing a mole from a past scar or removal • Those who want subtle, natural-looking placement • Anyone tired of makeup that smudges by noon', NULL, NULL, NULL, 8, 0, 1, NULL),
  (232, 1, 'scalp-micropigmentation', 'Scalp Micropigmentation', 'A thinning patch on your scalp doesn''t fix itself, and hats can only hide so much. Scalp micropigmentation deposits pigment dots that mimic real hair follicles, filling in patches for a fuller, denser look.', '["A full, natural-looking scalp with density restored", "Results last years with upkeep", "No surgery, no downtime"]', '[]', 'Thinning patches from alopecia, stress, or genetics • Scars from past hair transplants or injuries • Anyone tired of concealer powder that washes out • People wanting denser hair without a transplant • Those who shave their head and want a defined hairline', NULL, NULL, NULL, 9, 0, 1, NULL),
  (233, 1, 'lip-blush', 'Lip Blush', 'Lipstick smudges, fades and needs reapplying all day. Lip Blush deposits soft pigment into your lips, adding natural colour and definition that stays put from morning to night.', '["Natural-looking colour and definition for one to three years", "Perfecting session at 4–8 weeks", "No daily lipstick, no smudging"]', '[]', 'Pale or uneven lip tone needing natural colour • Thin lips wanting a more defined shape • Anyone tired of reapplying lipstick throughout the day • People wanting a soft, your-lips-but-better tint • Clients correcting faded or patchy past lip tattoos', NULL, NULL, NULL, 10, 0, 1, NULL),
  (9, 2, 'bridal-radiance-90-days', 'Bridal Radiance — 90 Days', 'Our most complete bridal plan. Three months of scheduled treatments that correct pigmentation and texture first, then build glow as the date approaches.', '["3 × Hydra Facial, spaced 3–4 weeks apart","2 × Glow Peel added to your facials","1 × Meline Pigmentation Peel for stubborn pigmentation","1 × Full Body Polish before the wedding week","Skin analysis and a written plan at the first session"]', '[]', NULL, NULL, 18999, '/uploads/bridal/bridal-radiance-90-days.jpg', 9, 1, 1, NULL),
  (10, 2, 'bridal-essentials-30-days', 'Bridal Essentials — 30 Days', 'The one-month plan for brides who have four to five weeks. Focused on brightening, even tone and smooth body skin.', '["2 × Hydra Facial","1 × Full Body Bleach / Detan","1 × Full Body Polish","1 × Full Face Threading"]', '[]', NULL, NULL, 11499, '/uploads/bridal/bridal-essentials-30-days.jpg', 10, 1, 1, NULL),
  (11, 2, 'wedding-week-glow', 'Wedding Week Glow', 'Everything in the final week — advanced hydration, full-body polish and hands and feet finished, timed so nothing is done too close to the day.', '["1 × Advanced Hydra Facial","1 × Full Body Polish with Hydra","1 × Classic Manicure and Classic Pedicure","1 × Full Face Wax"]', '[]', NULL, NULL, 11999, '/uploads/bridal/wedding-week-glow.jpg', 11, 0, 1, NULL),
  (12, 2, 'bridal-day-before-ritual', 'Day-Before Ritual', 'A calm, low-risk session the day before — hydration and glow with no extractions or peels that could leave the skin reactive.', '["1 × Hydra Facial","1 × Glow Peel","1 × Head & Shoulder Massage (30 min)","1 × Eyebrow Threading"]', '[]', NULL, 150, 3999, '/uploads/bridal/day-before-ritual.jpg', 12, 0, 1, NULL),
  (13, 2, 'bridal-brow-design', 'Bridal Brow Design', 'Brow mapping and shaping planned around your wedding photographs, with the option of tint or semi-permanent work scheduled far enough ahead to settle.', '["Personalised brow mapping and shaping","Brow Tint or PMU planned to your timeline","Trial and settling time built into the schedule"]', '[]', NULL, NULL, NULL, '/uploads/bridal/bridal-brow-design.jpg', 13, 0, 1, NULL),
  (14, 2, 'groom-grooming-package', 'Groom''s Grooming Package', 'Built around the facial hair area — clears irritation and ingrowns, brightens, and finishes hands and feet.', '["1 × Just For Men facial","1 × Full Face Wax","1 × Head Massage (30 min)","1 × Classic Manicure and Classic Pedicure"]', '[]', NULL, NULL, 5499, '/uploads/bridal/grooms-grooming-package.jpg', 14, 1, 1, NULL),
  (15, 2, 'groom-glow-course', 'Groom''s Glow Course — 30 Days', 'A month of preparation for grooms dealing with congestion, tan or uneven tone before the wedding.', '["2 × Hydra Facial","1 × Carbon Laser Facial","1 × Full Body Bleach / Detan"]', '[]', NULL, NULL, 8999, '/uploads/bridal/grooms-glow-course-30-days.jpg', 15, 0, 1, NULL),
  (16, 2, 'bridesmaid-package', 'Bridesmaid Package', 'A short, well-priced session for the wedding party — clean, bright skin and tidy hands and feet.', '["1 × Hydra Clean Up","1 × Full Face Threading","1 × Classic Manicure","1 × Classic Pedicure"]', '[]', NULL, 120, 3299, '/uploads/bridal/bridesmaid-package.jpg', 16, 0, 1, NULL),
  (17, 2, 'mother-of-the-bride-package', 'Mother of the Bride', 'Firming and brightening for mature skin, with body care and a relaxing finish.', '["1 × Upendice Anti Ageing Facial","1 × Full Body Polish","1 × Drupe Manicure and Drupe Pedicure"]', '[]', NULL, NULL, 9499, '/uploads/bridal/mother-of-the-bride.jpg', 17, 0, 1, NULL),
  (18, 2, 'bridal-party-group-booking', 'Bridal Party Group Booking', 'Four or more guests booked together on the same day, with the schedule planned so everyone finishes in time.', '["Four or more guests on a single day","Treatments chosen per guest from the full menu","Schedule planned around your getting-ready time"]', '[]', NULL, NULL, NULL, '/uploads/bridal/bridal-party-group-booking.jpg', 18, 0, 1, NULL),
  (19, 3, 'hydra-clean-up', 'Hydra Clean Up', 'A gentle cleansing facial ideal for sensitive or acne-prone skin — pore-cleansing with Hydra dermabrasion, a hydrating pack and finishing serums.', '["Ideal for sensitive or acne-prone skin","Customized cleansing","Pore-cleansing with Hydra dermabrasion","Hydrating pack","Serums and moisturizers"]', '[]', NULL, 30, 2000, '/services/21324.jpg', 19, 0, 1, NULL),
  (20, 3, 'hydra-facial', 'Hydra Facial', 'Our most loved multi-step facial: Hydra dermabrasion, serum infusion, cryo therapy, ultrasound and LED for instant radiance.', '["Hydra dermabrasion for exfoliation and comedone removal","Serum infusion for deep hydration and glow","Cryo cold therapy to calm and tighten","Ultrasound for enhanced absorption","LED light for brightening and repair"]', '[]', NULL, 80, 3000, '/services/21329.jpg', 20, 1, 1, NULL),
  (21, 3, 'hydra-glow-peel', 'Hydra + Glow Peel', 'Deep exfoliation meets hydration, with a glow-boosting peel added to your Hydra Facial.', '["Glow-boosting peel added to the Hydra Facial","Hydra dermabrasion and serum infusion","Cryo therapy, ultrasound and LED therapy"]', '[]', NULL, 90, 3800, '/services/21329.jpg', 21, 0, 1, NULL),
  (22, 3, 'hydra-carbon-laser-facial', 'Hydra + Carbon Laser Facial', 'Dual action — brightening carbon laser paired with hydrating Hydra therapy.', '["Brightening carbon laser","Hydrating Hydra therapy"]', '[]', NULL, 60, 5500, '/services/21329.jpg', 22, 0, 1, NULL),
  (23, 3, 'advanced-hydra-facial', 'Advanced Hydra Facial', 'Multi-step rejuvenation with lymphatic drainage and deep nourishment — Hydra Facial and Glow Peel with BB Glow meso micro-needling.', '["Multi-step rejuvenation with lymphatic drainage and deep nourishment","Hydra Facial + Glow Peel with BB Glow meso micro-needling"]', '[]', NULL, 90, 6500, '/services/21332.jpg', 23, 1, 1, NULL),
  (24, 4, 'carbon-laser-facial', 'Carbon Laser Facial', 'Q-Switched Nd:YAG laser with a carbon-based lotion to deep-clean, exfoliate and brighten.', '["Q-Switched Nd:YAG laser with carbon-based lotion","Deep-cleans, exfoliates and brightens"]', '[]', NULL, 45, 4000, '/uploads/advanced-facials/carbon-laser-facial.jpg', 24, 1, 1, NULL),
  (25, 4, 'meso-glow-therapy', 'Meso Glow Therapy', 'Micro-needling with customised meso-cocktails rich in vitamins, peptides and antioxidants to target dullness, pigmentation and fine lines.', '["Micro-needling with customised meso-cocktails","Targets dullness, pigmentation and fine lines"]', '[]', NULL, 60, 4000, '/uploads/advanced-facials/meso-glow-therapy.jpg', 25, 0, 1, NULL),
  (26, 4, 'bb-glow', 'BB Glow — Semi-Permanent Tinted Glow', 'Nano-needling with tinted serums to even out skin tone, boost radiance and reduce pigmentation.', '["Nano-needling with tinted serums","Evens skin tone and boosts radiance","Reduces pigmentation"]', '[]', NULL, 80, 5000, '/uploads/advanced-facials/bb-glow.jpg', 26, 0, 1, NULL),
  (27, 4, 'oxygeneo-facial', 'OxyGeneo Facial', 'Triple-action technology — exfoliation, CO₂ oxygenation and active serum infusion for intense rejuvenation.', '["Exfoliation","CO₂ oxygenation","Active serum infusion"]', '[]', NULL, 70, 5000, '/uploads/advanced-facials/oxygeneo-facial.jpg', 27, 0, 1, NULL),
  (28, 4, 'vampire-facial', 'Vampire Facial', 'Micro-needling with PRP (Platelet-Rich Plasma) to boost collagen, heal scars and rejuvenate skin.', '["Micro-needling with Platelet-Rich Plasma","Boosts collagen and heals scars"]', '[]', NULL, 60, 5500, '/uploads/advanced-facials/vampire-facial.jpg', 28, 0, 1, NULL),
  (29, 4, 'korean-pdrn-glowlift', 'Korean PDRN Glowlift', 'Advanced skin repair and hydration with Salmon DNA (PDRN), delivered by micro- or nano-needling.', '["Advanced repair and hydration with Salmon DNA (PDRN)","Smoother texture and reduced fine lines","Firm, plump skin with deep, dewy hydration","Boosted collagen and product absorption"]', '[]', NULL, 45, 6000, '/uploads/advanced-facials/korean-pdrn-glowlift.jpg', 29, 1, 1, NULL),
  (30, 4, 'pumpkin-enzyme-facial', 'Pumpkin Enzyme Facial', 'Power-packed with natural enzymes and AHA to exfoliate, detox and brighten dull, pigmented skin.', '["Natural enzymes and AHA","Exfoliates, detoxes and brightens dull, pigmented skin"]', '[]', NULL, 90, 7000, '/uploads/advanced-facials/pumpkin-enzyme-facial.jpg', 30, 0, 1, NULL),
  (31, 4, 'luxe-skin-booster-glow', 'Luxe Skin Booster Glow', 'Micro-needling infusion of high-performance skin boosters to deeply hydrate, brighten and smooth the skin.', '["Micro-needling infusion of high-performance skin boosters","Deeply hydrates, brightens and smooths"]', '[]', NULL, 75, 8000, '/uploads/advanced-facials/luxe-skin-booster-glow.jpg', 31, 0, 1, NULL),
  (32, 4, 'just-for-men', 'Just For Men', 'Built for the facial hair area — reduces irritation, with Hydra dermabrasion, cryo cold therapy, ultrasound and LED.', '["Reduces irritation in the facial hair area","LED light for brightening and repair","Hydra dermabrasion, cryo cold therapy and ultrasound for enhanced absorption"]', '[]', NULL, 80, 4000, NULL, 32, 1, 1, NULL),
  (200, 5, 'signature-facial', 'Signature Facial', 'A maintenance facial built around cleansing, exfoliation and a treatment mask suited to your skin''s current needs.', '["Exfoliating and hydrating","Smooths texture","Finishes with an oxygen infusion"]', '[]', 'Dullness • Normal skin • Mild congestion', 30, NULL, '/uploads/facial/signature_facial.jpg', 1, 0, 1, 'A well-rounded maintenance facial for anyone building a skincare routine or just keeping up with one. In half an hour you get a full cleanse, gentle exfoliation and a finishing treatment chosen for what your skin needs that month.'),
  (201, 5, 'lymphatic-facial', 'Lymphatic Facial', 'A sculpting facial that pairs manual lymphatic drainage technique with modern contouring to reduce puffiness and refresh tired skin.', '["Visibly sculpting","Compression therapy for circulation","Gua sha massage"]', '[]', 'Puffiness • Redness and irritation • Uneven tone', 30, NULL, '/uploads/facial/lymphatic_facial.jpg', 2, 0, 1, 'A sculpting facial that pairs manual lymphatic-drainage technique with modern tools to reduce puffiness and lift tired skin. After cleansing and light exfoliation, the treatment focuses entirely on sculpting — extractions are not part of this one.'),
  (202, 5, 'party-prep-facial', 'Party-Prep Facial', 'A pre-event facial using targeted lifting and contouring technology for an immediate, photo-ready glow.', '["Camera-ready toning","Lifting and sculpting technology","Extraction-free cleanse"]', '[]', 'Fine lines and wrinkles • Texture • Uneven tone', 30, NULL, '/uploads/facial/party_prep_facial.jpg', 3, 0, 1, 'Built for the hours before an event. Lifting and contouring technology tightens and smooths the skin for an instant, camera-ready look — with no extractions, so there''s no redness to work around.'),
  (203, 5, 'just-for-men-facial', 'Just for Men Facial', 'Addresses ingrown hairs, shaving irritation and congestion in the skin beneath facial hair.', '["Pore-clarifying treatment","Deep-cleansing technology","Gentle acid exfoliation"]', '[]', 'Shaving irritation • Dryness or flaking • Rough texture', 30, NULL, '/uploads/facial/just_for_men_facial.jpg', 4, 0, 1, 'Aimed squarely at the skin under and around facial hair — ingrown hairs, shaving irritation and clogged pores from daily grooming. A clarifying mask works on the neck while a deep-clean step targets bacteria beneath the beard line.'),
  (204, 5, 'estheticians-choice', 'Esthetician''s Choice', 'Your therapist examines your skin first, then builds the facial around what it needs that day.', '[]', '[]', NULL, 50, NULL, '/uploads/facial/esthetician_choice.jpg', 5, 0, 1, 'Can''t decide? Your esthetician examines your skin first and builds the facial around what it actually needs that day, rather than a fixed menu item.'),
  (205, 5, 'anti-aging-facial', 'Anti-Aging Facial', 'Firming and lifting technology combined with red LED light therapy to stimulate collagen and soften fine lines.', '["Supports collagen production","Firming muscle-toning technique","Cooling finish to reduce puffiness"]', '[]', 'Loss of elasticity • Dark circles • Early age spots', 50, NULL, '/uploads/facial/anti_aging_facial.jpg', 6, 0, 1, 'A firming, restorative facial that tones facial muscles and pairs it with red light therapy to support collagen, soften fine lines and calm inflammation, finished with hydrating actives.'),
  (206, 5, 'acne-fighting-facial', 'Acne-Fighting Facial', 'A double cleanse with extractions and blue LED light therapy to calm breakouts and target acne-causing bacteria.', '["Deep-cleaning technology","Thorough pore clearing","Light therapy to target bacteria"]', '[]', 'Acne-prone skin • Excess oiliness • Uneven texture', 50, NULL, '/uploads/facial/acne_fighting_facial.jpg', 7, 0, 1, 'A double cleanse and double exfoliation clear the way for extractions, then targeted light therapy works on acne-causing bacteria while vitamins and oxygen calm the skin afterwards.'),
  (207, 5, 'seasonal-hydrating-facial', 'Seasonal Hydrating Facial', 'A climate-adapted mask treatment that protects and repairs the skin barrier as the seasons change.', '["Gentle antioxidant exfoliation","Warming circulation therapy","Mask formulated for the current season"]', '[]', 'Dehydration • Environmental skin stress • Redness', 50, NULL, '/uploads/facial/seasonal_hydrating_facial.jpg', 8, 0, 1, 'A hydrating facial that changes with the seasons, protecting and repairing your skin barrier against whatever the current weather is doing to it. Gentle exfoliation, a custom mask and an oxygen finish leave skin dewy, not dry.'),
  (208, 5, 'hyperpigmentation-facial', 'Hyperpigmentation Facial', 'Green LED light therapy paired with clinical-grade exfoliation to even out tone and fade dark spots.', '["Double exfoliation with fruit acids","Healing light therapy","Brightening vitamin C infusion"]', '[]', 'Sun and age spots • Dryness • Dullness', 50, NULL, '/uploads/facial/hyperpigmentation_facial.jpg', 9, 0, 1, 'Targets dullness and sun damage with light therapy paired with clinical-grade exfoliation, evening out tone and refining texture for a brighter finish.'),
  (209, 5, 'sensitive-skin-facial', 'Sensitive Skin Facial', 'A calming, low-irritation facial using gentle enzyme exfoliation for reactive or easily-flushed skin.', '["Calming and soothing formulas","Enzyme-only exfoliation, no scrubbing","Custom jelly mask"]', '[]', 'Redness and irritation • Rosacea • Eczema-prone skin', 50, NULL, '/uploads/facial/sensitive_skin_facial.jpg', 10, 0, 1, 'Built specifically for reactive skin. An ultra-gentle double cleanse and a nutrient-rich jelly mask calm and restore balance, while light therapy reduces redness with a soothing, low-contact approach.'),
  (210, 5, 'premier-contour-facial', 'Premier Contour Facial', 'A multi-step facial combining dermaplaning, lifting technology, gua sha and LED therapy for the most complete result on the menu.', '["Dermaplaning with a signature mask for deep exfoliation","Gua sha and sculpting technology for contouring","Cold therapy finish to reduce puffiness"]', '[]', 'Congestion • Dullness • Inflammation', 90, NULL, '/uploads/facial/premier_contour_facial.jpg', 11, 0, 1, 'The most complete facial on the menu — 90 minutes combining dermaplaning, sculpting technology, gua sha, light therapy, oxygen and cold therapy to refine texture, lift contours and calm puffiness in a single session.'),
  (221, 5, 'microneedling', 'Microneedling', 'Fine sterile needles create controlled micro-channels in the skin to trigger natural collagen production, smoothing texture and softening scars over a course of sessions.', '["Stimulates natural collagen production","Improves texture and fine scarring","A course of sessions builds visible results"]', '[]', 'Acne scarring • Fine lines and texture • Enlarged pores', 45, NULL, NULL, 12, 0, 1, 'Hundreds of fine, sterile needles create tiny, controlled micro-channels in the skin''s surface, triggering your body''s own collagen and elastin production. Over a short course of sessions, this smooths texture, softens acne scarring and fine lines, and tightens visibly loose skin.'),
  (42, 6, 'lotus-cleanup', 'Lotus Cleanup', 'A refreshing cleanup that purifies pores, removes oil and restores brightness to your complexion.', '[]', '[]', NULL, 30, 800, '/services/21375.jpg', 42, 1, 1, NULL),
  (43, 6, 'o3-plus-whitening-clean-up', 'O3+ Whitening Clean Up', 'A quick, effective brightening cleanup that removes impurities and evens your skin tone.', '[]', '[]', NULL, 30, 2000, '/services/21375.jpg', 43, 0, 1, NULL),
  (51, 7, 'dermaplaning', 'Dermaplaning', 'Gentle exfoliation using a surgical blade to remove dead skin and peach fuzz for instant smoothness and glow.', '[]', '[]', NULL, 30, 1000, '/uploads/facial/dermaplaning.jpg', 51, 0, 1, 'A medical-grade blade gently removes dead skin cells and fine facial hair from the surface of your skin — safe, precise, and effective even for sensitive skin.'),
  (211, 7, 'hydradermabrasion', 'Hydradermabrasion', 'A diamond-tipped wand resurfaces the skin while infusing hydrating serum — added on to any facial.', '[]', '[]', NULL, 15, NULL, '/uploads/facial/hydradermabrasion.jpg', 211, 0, 1, 'A diamond-tipped wand resurfaces the skin, clears pores and infuses hydrating serum in one pass — gentle enough for dry skin, without any harsh scrubbing.'),
  (212, 7, 'extra-extractions', 'Extra Extractions', 'Additional time spent clearing blackheads and congestion from the areas that need it most.', '[]', '[]', NULL, 15, NULL, '/uploads/facial/extra_extractions.jpg', 212, 0, 1, 'Extra time focused on stubborn blackheads, whiteheads and clogged pores in the areas that need it most.'),
  (213, 7, 'gua-sha-massage', 'Gua Sha Massage', 'A 30-minute sculpting massage blending traditional gua sha technique with modern tools.', '[]', '[]', NULL, 30, NULL, '/uploads/facial/gua_sha_massage.jpg', 213, 0, 1, 'Thirty minutes of traditional gua sha technique blended with modern sculpting tools — a neck-and-face massage that eases tension, boosts circulation and supports lymphatic flow. A shorter version is also available on request.'),
  (215, 7, 'custom-jelly-mask', 'Custom Jelly Mask', 'A hydrating peel-off mask finished with hyaluronic acid or collagen.', '[]', '[]', NULL, 15, NULL, '/uploads/facial/custom_jelly_mask.jpg', 215, 0, 1, 'A hydrating peel-off jelly mask, customised with hyaluronic acid, collagen or skin-boosting peptides depending on what your skin needs that day.'),
  (216, 7, 'lip-plump-and-scrub', 'Lip Plump and Scrub', 'Buffing and red LED light therapy to smooth and plump the lips.', '[]', '[]', NULL, NULL, NULL, '/uploads/facial/lip_plump_and_scrub.jpg', 216, 0, 1, 'A gentle lip buffing followed by red light therapy to smooth fine lines and support collagen — leaves lips softer and visibly fuller.'),
  (217, 7, 'microcurrent', 'Microcurrent', 'Gentle electrical micro-currents that tone and firm the facial muscles.', '[]', '[]', NULL, 15, NULL, '/uploads/facial/microcurrent.jpg', 217, 0, 1, 'Targeted electrical micro-currents tone and firm the facial muscles for a visibly contoured look — already built into the Party-Prep and Anti-Aging facials.'),
  (218, 7, 'eye-puff-minimizer', 'Eye Puff Minimizer', 'A brightening mask and gua sha technique targeting puffiness and dark circles.', '[]', '[]', NULL, NULL, NULL, '/uploads/facial/eye_puff_minimizer.jpg', 218, 0, 1, 'A cooling, vitamin-rich mask paired with gua sha technique to target puffiness, dark circles and under-eye congestion for a brighter look.'),
  (219, 7, 'neck-firming', 'Neck Firming', 'Electrical stimulation that lifts and tones the neck and décolletage.', '[]', '[]', NULL, NULL, NULL, '/uploads/facial/neck_firming.jpg', 219, 0, 1, 'Targeted electrical stimulation that lifts and tones the neck and décolletage, extending your facial''s results further down.'),
  (54, 8, 'face-bleach-detan', 'Face Bleach / Detan', 'A quick facial bleach that lifts tan and softens your complexion — ideal for regular maintenance.', '[]', '[]', NULL, NULL, 500, '/services/21385.jpg', 54, 0, 1, NULL),
  (55, 8, 'half-hands-bleach-detan', 'Half Hands Bleach / Detan', 'Brightens the arms from shoulders to elbows by reducing sun tan and evening out tone.', '[]', '[]', NULL, NULL, 600, '/services/21388.jpg', 55, 0, 1, NULL),
  (56, 8, 'full-hands-bleach-detan', 'Full Hands Bleach / Detan', 'A complete arm lightening service for visibly smoother, more even skin.', '[]', '[]', NULL, NULL, 800, '/services/21388.jpg', 56, 0, 1, NULL),
  (57, 8, 'half-legs-bleach-detan', 'Half Legs Bleach / Detan', 'Brightens the lower legs by removing tan and buildup caused by sun exposure.', '[]', '[]', NULL, NULL, 600, '/services/21390.jpg', 57, 0, 1, NULL),
  (58, 8, 'full-legs-bleach-detan', 'Full Legs Bleach / Detan', 'A comprehensive tan-removal treatment for smooth, glowing legs.', '[]', '[]', NULL, NULL, 900, '/services/21390.jpg', 58, 0, 1, NULL),
  (59, 8, 'half-back-bleach-detan', 'Half Back Bleach / Detan', 'Evens tone across the upper back — a common request before an event.', '[]', '[]', NULL, NULL, 600, '/services/21390.jpg', 59, 0, 1, NULL),
  (60, 8, 'full-back-bleach-detan', 'Full Back Bleach / Detan', 'Full back tan removal for an even tone from shoulders to waist.', '[]', '[]', NULL, NULL, 800, '/services/21390.jpg', 60, 0, 1, NULL),
  (61, 8, 'half-front-bleach-detan', 'Half Front Bleach / Detan', 'Targets the neck and décolleté, where tan lines show most.', '[]', '[]', NULL, NULL, 400, '/services/21385.jpg', 61, 0, 1, NULL),
  (62, 8, 'full-front-bleach-detan', 'Full Front Bleach / Detan', 'Complete front-of-body detan for an even, brighter tone.', '[]', '[]', NULL, NULL, 800, '/services/21385.jpg', 62, 0, 1, NULL),
  (63, 8, 'full-body-bleach-detan', 'Full Body Bleach / Detan', 'Brighten and refresh your entire body with this tan-removal treatment, performed with dermatologist-approved bleach.', '[]', '[]', NULL, NULL, 3000, '/services/21390.jpg', 63, 1, 1, NULL),
  (64, 9, 'full-body-polish', 'Full Body Polish', 'A rejuvenating treatment that exfoliates, hydrates and nourishes — revealing silky smoothness head to toe.', '[]', '[]', NULL, 180, 4000, '/services/21392.jpg', 64, 1, 1, NULL),
  (65, 9, 'full-body-polish-with-hydra', 'Full Body Polish with Hydra', 'Medical-grade body polishing using Hydra dermabrasion for deep hydration and brightening.', '[]', '[]', NULL, 220, 5500, '/services/21392.jpg', 65, 0, 1, NULL),
  (66, 9, 'hand-polish', 'Hand Polish', 'A focused polish that renews the hands, removing tan and dry patches.', '[]', '[]', NULL, 30, 1000, '/services/21395.jpg', 66, 0, 1, NULL),
  (67, 9, 'full-leg-polish', 'Full Leg Polish', 'Exfoliation and hydration for the full leg, leaving skin smooth and even.', '[]', '[]', NULL, 30, 2000, '/services/21395.jpg', 67, 0, 1, NULL),
  (68, 9, 'back-polish', 'Back Polish', 'Clears congestion and roughness across the back with gentle exfoliation.', '[]', '[]', NULL, 30, 1000, '/services/21392.jpg', 68, 0, 1, NULL),
  (69, 9, 'back-facial-with-hydra', 'Back Facial with Hydra', 'A proper facial for the back — Hydra dermabrasion, extraction and a soothing finish for back acne and texture.', '[]', '[]', NULL, 45, 2500, '/services/21392.jpg', 69, 0, 1, NULL),
  (70, 10, 'classic-manicure', 'Classic Manicure', 'Shaping, cuticle care and a polish finish.', '[]', '[]', NULL, 30, 550, '/uploads/manicure/classic.jpg', 70, 0, 1, NULL),
  (71, 10, 'oil-manicure', 'Oil Manicure', 'A nourishing warm-oil treatment for dry hands and brittle nails.', '[]', '[]', NULL, 30, 800, '/uploads/manicure/oil.jpg', 71, 0, 1, NULL),
  (72, 10, 'pedipie-manicure', 'Pedipie Manicure', 'The Pedipie ritual adapted for hands — cleansing, scrub and mask.', '[]', '[]', NULL, 30, 900, '/uploads/manicure/pedipie.jpg', 72, 0, 1, NULL),
  (73, 10, 'algae-manicure', 'Algae Manicure', 'A marine algae treatment that deeply hydrates and firms the skin on the hands.', '[]', '[]', NULL, 45, 2000, '/uploads/manicure/algae.jpg', 73, 0, 1, NULL),
  (74, 10, 'drupe-manicure', 'Drupe Manicure', 'A premium Drupe ritual for softness, shine and lasting hydration.', '[]', '[]', NULL, 45, 1500, '/uploads/manicure/drupe.jpg', 74, 1, 1, NULL),
  (75, 10, 'drupe-manicure-peel-off-mask', 'Drupe Manicure with Peel Off Mask', 'The Drupe manicure finished with a peel-off mask for extra brightness.', '[]', '[]', NULL, 60, 2000, '/uploads/manicure/drupe-peel-off-mask.jpg', 75, 0, 1, NULL),
  (76, 11, 'classic-pedicure', 'Classic Pedicure', 'Soak, shaping, cuticle care, scrub and polish.', '[]', '[]', NULL, 45, 800, '/uploads/pedicure/classic.jpg', 76, 0, 1, NULL),
  (77, 11, 'oil-pedicure', 'Oil Pedicure', 'A warm-oil pedicure for dry, cracked heels and tired feet.', '[]', '[]', NULL, 45, 1000, '/uploads/pedicure/oil.jpg', 77, 0, 1, NULL),
  (78, 11, 'pedipie-pedicure', 'Pedipie Pedicure', 'The Pedipie ritual — cleansing, scrub and a nourishing mask.', '[]', '[]', NULL, 45, 1200, '/uploads/pedicure/pedipie.jpg', 78, 0, 1, NULL),
  (79, 11, 'algae-pedicure', 'Algae Pedicure', 'A marine algae pedicure that hydrates deeply and calms tired feet.', '[]', '[]', NULL, 80, 2500, '/uploads/pedicure/algae.jpg', 79, 0, 1, NULL),
  (80, 11, 'drupe-pedicure', 'Drupe Pedicure', 'A premium Drupe pedicure for softness and lasting hydration.', '[]', '[]', NULL, 60, 2000, '/uploads/pedicure/drupe.jpg', 80, 1, 1, NULL),
  (81, 11, 'drupe-pedicure-peel-off-mask', 'Drupe Pedicure with Peel Off Mask', 'The Drupe pedicure finished with a peel-off mask.', '[]', '[]', NULL, 80, 2500, '/uploads/pedicure/drupe-peel-off-mask.jpg', 81, 0, 1, NULL),
  (82, 12, 'lowerlips-threading', 'Lowerlips Threading', 'Removes fine hair around the lower lip for a clean, even finish.', '[]', '[]', NULL, NULL, 50, '/services/21418.jpg', 82, 0, 1, NULL),
  (83, 12, 'upperlips-threading', 'Upperlips Threading', 'Quick, clean and gentle removal of unwanted upper-lip hair.', '[]', '[]', NULL, NULL, 50, '/services/21418.jpg', 83, 0, 1, NULL),
  (84, 12, 'chin-threading', 'Chin Threading', 'Precise hair removal for the chin and jawline.', '[]', '[]', NULL, NULL, 60, '/services/21420.jpg', 84, 0, 1, NULL),
  (85, 12, 'forehead-threading', 'Forehead Threading', 'Clears baby hair and uneven patches around the forehead.', '[]', '[]', NULL, NULL, 60, '/services/21420.jpg', 85, 0, 1, NULL),
  (86, 12, 'eyebrows-threading', 'Eyebrows Threading', 'Perfectly shaped brows that define and lift your entire face.', '[]', '[]', NULL, NULL, 100, '/services/21416.jpg', 86, 1, 1, NULL),
  (87, 12, 'full-face-threading', 'Full Face Threading', 'Complete hair removal from the face for a soft, velvety finish.', '[]', '[]', NULL, NULL, 500, '/services/21420.jpg', 87, 0, 1, NULL),
  (88, 13, 'chin-wax', 'Chin Wax', 'Quick, smooth removal of coarse chin hair.', '[]', '[]', NULL, NULL, 100, '/services/21357.jpg', 88, 0, 1, NULL),
  (89, 13, 'forehead-wax', 'Forehead Wax', 'Removes fine baby hair and dull buildup for a polished finish.', '[]', '[]', NULL, NULL, 100, '/services/21357.jpg', 89, 0, 1, NULL),
  (90, 13, 'upperlips-wax', 'Upperlips Wax', 'Gentle hair removal for a clean, soft upper-lip area.', '[]', '[]', NULL, NULL, 100, '/services/21339.jpg', 90, 0, 1, NULL),
  (91, 13, 'lower-neck-wax', 'Lower Neck Wax', 'Removes hair around the lower neck for a neat, polished neckline.', '[]', '[]', NULL, NULL, 300, '/services/21339.jpg', 91, 0, 1, NULL),
  (92, 13, 'sidelock-wax', 'Sidelock Wax', 'Targets the sideburn area for a clean, defined jawline.', '[]', '[]', NULL, NULL, 300, '/services/21339.jpg', 92, 0, 1, NULL),
  (93, 13, 'eyebrow-mapping-with-wax', 'Eyebrow Mapping with Wax', 'A precise brow-shaping session that maps your ideal brow structure to your facial proportions, then shapes with wax.', '[]', '[]', NULL, NULL, 500, '/services/21687.png', 93, 1, 1, NULL),
  (94, 13, 'full-face-wax', 'Full Face Wax', 'Low-temperature wax across the face for a silky, glowing finish.', '[]', '[]', NULL, NULL, 650, '/services/21339.jpg', 94, 0, 1, NULL),
  (95, 14, 'underarms-wax', 'Underarms', 'Choose hot wax, Rica or peel-off for the underarm area.', '[]', '[]', NULL, NULL, 100, '/uploads/body-waxing/underarms.jpg', 95, 0, 1, NULL),
  (96, 14, 'full-arms-wax', 'Full Arms', 'Full arm waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 300, '/uploads/body-waxing/full-arms.jpg', 96, 0, 1, NULL),
  (97, 14, 'half-legs-wax', 'Half Legs', 'Knee-down waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 300, '/uploads/body-waxing/half-legs.jpg', 97, 0, 1, NULL),
  (98, 14, 'full-legs-wax', 'Full Legs', 'Full leg waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 550, '/uploads/body-waxing/full-legs.jpg', 98, 1, 1, NULL),
  (99, 14, 'stomach-wax', 'Stomach', 'Stomach waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 350, '/uploads/body-waxing/stomach.jpg', 99, 0, 1, NULL),
  (100, 14, 'bums-wax', 'Bums Wax', 'Waxing for the bum area in hot wax or Rica.', '[]', '[]', NULL, NULL, 400, '/uploads/body-waxing/bums.jpg', 100, 0, 1, NULL),
  (101, 14, 'full-back-wax', 'Full Back', 'Full back waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 550, '/uploads/body-waxing/full-back.jpg', 101, 0, 1, NULL),
  (102, 14, 'bikini-wax', 'Bikini', 'Bikini waxing with hot wax, Rica or peel-off for maximum comfort.', '[]', '[]', NULL, NULL, 1000, '/uploads/body-waxing/bikini.jpg', 102, 0, 1, NULL),
  (103, 14, 'full-body-wax', 'Full Body', 'Full body waxing. Bikini and bums are not included.', '[]', '[]', NULL, NULL, 1800, '/uploads/body-waxing/full-body.jpg', 103, 0, 1, NULL),
  (104, 14, 'full-face-wax-rica', 'Full Face Wax (Rica)', 'Full face waxing in Rica wax.', '[]', '[]', NULL, NULL, 650, '/services/21339.jpg', 104, 0, 1, NULL),
  (105, 15, 'nailcut-filing-polish', 'Nailcut, Filing and Polish', 'Nail shaping, filing and a polish finish.', '[]', '[]', NULL, 15, 250, '/uploads/nails/nailcut-filing-polish.jpg', 105, 0, 1, NULL),
  (106, 15, 'paraffin-wax-add-on', 'Paraffin Wax Add On', 'A warm paraffin wrap that softens hands or feet — added to any manicure or pedicure.', '[]', '[]', NULL, 15, 300, '/uploads/nails/paraffin-wax-add-on.jpg', 106, 0, 1, NULL),
  (107, 16, 'foot-massage', 'Foot Massage', 'A deeply soothing therapy focusing on the pressure points of the feet to release fatigue and improve circulation.', '["Reduces swelling and soreness","Improves energy flow","Relieves stress and tension"]', '[]', NULL, 20, 400, '/services/21652.png', 107, 0, 1, NULL),
  (108, 16, 'hand-massage', 'Hand Massage', 'A gentle treatment that eases stiffness and strain from the hands.', '["Improved mobility","Relief from muscle fatigue","Enhanced blood circulation"]', '[]', NULL, 20, 400, '/uploads/massages/hand-massage.jpg', 108, 0, 1, NULL),
  (109, 16, 'head-massage', 'Head Massage', 'A calming, stress-relieving treatment focused on scalp pressure points.', '["Reduces headaches and migraines","Improves sleep quality","Promotes relaxation and better blood flow"]', '[]', NULL, 20, 400, '/services/21653.png', 109, 1, 1, NULL),
  (110, 16, 'head-shoulder-massage', 'Head & Shoulder', 'Releases tightness caused by long working hours, poor posture or stress.', '["Relief from neck stiffness","Reduced shoulder tension","Instant relaxation"]', '[]', NULL, 20, 400, '/services/21653.png', 110, 0, 1, NULL),
  (111, 16, 'back-massage', 'Back Massage', 'Targets deep-seated tension along the spine and lower back.', '["Releases knots","Reduces muscle tightness","Improves flexibility"]', '[]', NULL, 20, 600, '/services/21655.png', 111, 0, 1, NULL),
  (112, 16, 'face-massage', 'Face Massage', 'A gentle, rejuvenating therapy that boosts glow and relaxation.', '["Enhanced blood flow","Reduced puffiness","Improved skin texture"]', '[]', NULL, 20, 600, '/uploads/massages/face-massage.jpg', 112, 0, 1, NULL),
  (113, 16, 'foot-reflexology', 'Foot Reflexology', 'A targeted treatment based on pressure points connected to various organs.', '["Improves internal balance","Reduces stress","Supports overall wellbeing"]', '[]', NULL, 20, 600, '/services/21657.png', 113, 0, 1, NULL),
  (114, 16, 'hand-reflexology', 'Hand Reflexology', 'A therapeutic experience stimulating the reflex zones in the hands.', '["Better energy flow","Reduced fatigue","Relaxation of hand muscles"]', '[]', NULL, 20, 600, '/services/21657.png', 114, 0, 1, NULL),
  (115, 16, 'swedish-massage', 'Swedish Massage', 'A classic full-body relaxation massage using long, flowing strokes. Perfect for first-time massage clients.', '["Stress relief","Improved blood circulation","Deep relaxation"]', '[]', NULL, 60, 1800, '/services/21655.png', 115, 1, 1, NULL),
  (116, 16, 'deep-tissue-massage', 'Deep Tissue Massage', 'Firm, focused pressure that works into chronic tension and knots.', '[]', '[]', NULL, 60, 2000, '/services/21655.png', 116, 0, 1, NULL),
  (117, 16, 'hot-candle-aroma-oil-massage', 'Hot Candle Aroma Oil Massage', 'Warm aromatic candle oil poured and massaged in — our most indulgent full-body therapy.', '[]', '[]', NULL, 60, 2500, '/services/21655.png', 117, 1, 1, NULL),
  (222, 17, 'upper-lip-chin-laser', 'Upper Lip & Chin', 'Fast, precise laser hair reduction for fine upper-lip and chin hair.', '["Long-term hair reduction, not just removal","Calibrated to your skin tone and hair type","Quick sessions, minimal discomfort"]', '[]', 'Frequent threading or waxing • Fine, persistent regrowth • Want a long-term solution', 15, NULL, NULL, 1, 0, 1, 'Medical-grade laser technology targets hair follicles at the root, calibrated to your skin tone and hair type. The upper lip and chin are quick to treat and among the most requested areas — most clients see up to 90% reduction over a course of six to eight sessions.'),
  (223, 17, 'full-face-laser', 'Full Face', 'Comprehensive laser hair reduction across the full face for consistently smoother skin.', '["Whole-face coverage in a single session","Long-term hair reduction, not just removal","Calibrated to your skin tone and hair type"]', '[]', 'Frequent facial hair removal • Sensitive skin irritated by waxing • Want a long-term solution', 30, NULL, NULL, 2, 0, 1, 'Covers the full face in one session rather than treating individual areas separately, targeting hair follicles at the root for long-term reduction. Calibrated to your skin tone and hair type, with results building over a course of six to eight sessions.'),
  (224, 17, 'underarms-laser', 'Underarms', 'Laser hair reduction for the underarms — one of the fastest areas to treat, and to see results in.', '["Long-term hair reduction, not just removal","Fast sessions with minimal discomfort","No more razor bumps or ingrown hairs"]', '[]', 'Frequent shaving or waxing • Razor bumps or irritation • Want a long-term solution', 15, NULL, NULL, 3, 1, 1, 'The underarms respond quickly to laser hair reduction, with visibly finer, sparser regrowth after just a few sessions. Calibrated to your skin tone and hair type, this targets follicles at the root for results that last well beyond a wax or shave.'),
  (225, 17, 'half-arms-laser', 'Half Arms', 'Laser hair reduction from elbow to wrist.', '["Long-term hair reduction, not just removal","Calibrated to your skin tone and hair type","No downtime — return to your day immediately"]', '[]', 'Frequent waxing or shaving • Ingrown hairs • Want a long-term solution', 30, NULL, NULL, 4, 0, 1, 'Targets hair follicles from elbow to wrist, calibrated to your skin tone and hair type. Regrowth becomes visibly finer and sparser over a course of six to eight sessions.'),
  (226, 17, 'full-arms-laser', 'Full Arms', 'Laser hair reduction across the full arm, shoulder to wrist.', '["Long-term hair reduction, not just removal","Whole-arm coverage in one session","Calibrated to your skin tone and hair type"]', '[]', 'Frequent waxing or shaving • Ingrown hairs • Want a long-term solution', 45, NULL, NULL, 5, 0, 1, 'Covers the full arm, shoulder to wrist, targeting hair follicles at the root. Calibrated to your skin tone and hair type, with visible reduction building over a course of sessions.'),
  (227, 17, 'half-legs-laser', 'Half Legs', 'Laser hair reduction from knee to ankle.', '["Long-term hair reduction, not just removal","Calibrated to your skin tone and hair type","No downtime — return to your day immediately"]', '[]', 'Frequent waxing or shaving • Ingrown hairs • Want a long-term solution', 45, NULL, NULL, 6, 0, 1, 'Targets hair follicles from knee to ankle, calibrated to your skin tone and hair type. Most clients see up to 90% reduction in regrowth over a course of six to eight sessions.'),
  (228, 17, 'full-legs-laser', 'Full Legs', 'Laser hair reduction across the full leg, thigh to ankle.', '["Long-term hair reduction, not just removal","Whole-leg coverage in one session","Calibrated to your skin tone and hair type"]', '[]', 'Frequent waxing or shaving • Ingrown hairs • Want a long-term solution', 60, NULL, NULL, 7, 1, 1, 'Covers the full leg, thigh to ankle, in one session — targeting hair follicles at the root for reduction that outlasts a wax or shave. Calibrated to your skin tone and hair type, with results building over a course of sessions.'),
  (229, 17, 'bikini-line-laser', 'Bikini Line', 'Precise laser hair reduction along the bikini line.', '["Long-term hair reduction, not just removal","Reduces ingrown hairs from regular waxing","Calibrated to your skin tone and hair type"]', '[]', 'Frequent waxing • Ingrown hairs or irritation • Want a long-term solution', 20, NULL, NULL, 8, 0, 1, 'A precise, controlled treatment along the bikini line, calibrated to your skin tone and hair type. Regrowth becomes visibly finer and sparser over a course of six to eight sessions, with none of the irritation that comes with regular waxing.'),
  (230, 17, 'full-body-laser', 'Full Body', 'A comprehensive full-body laser hair reduction session covering every treated area in one visit.', '["Every area in a single visit","Long-term hair reduction, not just removal","Calibrated to your skin tone and hair type"]', '[]', 'Want everything done in one visit • Frequent waxing or shaving across the body • Want a long-term solution', 90, NULL, NULL, 9, 0, 1, 'Combines every treated area — face, arms, legs, underarms and bikini line — into a single, comprehensive session. Calibrated to your skin tone and hair type, with up to 90% reduction in regrowth over a course of six to eight sessions.'),
  (234, 18, 'biorepeel', 'BioRePeel', 'A biphasic TCA peel that exfoliates, brightens and stimulates collagen — without the visible peeling or downtime a peel usually means.', '["Brightens and evens skin tone","Stimulates collagen","No visible peeling, no downtime"]', '[]', 'Dullness • Uneven tone • Fine lines and wrinkles', 30, NULL, '/uploads/facial/biorepeel.jpg', 1, 1, 1, 'A two-phase formula that resurfaces the skin while feeding it: the oily phase carries actives in without stripping the barrier, the water phase gets to work on pigmentation, texture and fine lines. Most people walk out with an immediate glow and no flaking to hide.'),
  (235, 18, 'antioxidant-peel', 'Antioxidant Peel', 'A gentle fruit-acid peel packed with antioxidants, for skin that needs brightening without a strong resurfacing step.', '["Gentle enough for a first peel","Antioxidant protection","Immediate brightness, no downtime"]', '[]', 'Dullness • Environmental skin stress • Congestion', 30, NULL, '/uploads/facial/antioxidant_peel.jpg', 2, 0, 1, 'The lightest peel on the menu. Fruit acids lift dead surface cells while antioxidants defend against the pollution and sun exposure that dull city skin. Comfortable enough for a first peel, and easy to add before an event.');

INSERT IGNORE INTO `blog_categories` (`id`, `slug`, `name`, `description`) VALUES
  (1, 'skin-science', 'Skin Science', 'How treatments actually work, explained without the marketing.'),
  (2, 'treatment-guides', 'Treatment Guides', 'What to expect, how to prepare, and how to care for skin afterwards.'),
  (3, 'brows-pmu', 'Brows & PMU', 'Brow design and aftercare from Seema Nanda.'),
  (4, 'wellness', 'Wellness', 'Massage, body care and the slower side of looking after yourself.');

INSERT IGNORE INTO `blog_posts`
  (`category_id`, `slug`, `title`, `excerpt`, `content`, `image_url`, `cover_image`, `author`, `read_minutes`, `tags`, `is_featured`, `status`, `published_at`)
VALUES
  (1, 'cleanup-vs-facial-which-one-does-your-skin-need', 'Cleanup vs Facial: Which One Does Your Skin Actually Need?', 'They are not the same treatment, and booking the wrong one is the most common reason people feel a session ''didn''t do much''.', '## The short answer

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

For healthy, glowing skin, once every 3–4 weeks is the rhythm — for either service. Skin turns over on roughly that cycle, so treating in step with it is what compounds results.', NULL, NULL, 'Seema Nanda', 5, '["cleanup","facial","skin basics"]', 1, 'published', '2026-07-28 10:00:00'),
  (2, 'what-actually-happens-during-a-hydra-facial', 'What Actually Happens During a Hydra Facial', 'A step-by-step walkthrough of our most requested facial — and an honest answer to whether the glow lasts.', '## Why it is the one people ask for

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

No makeup for 6–8 hours. Sunscreen, without exception. Skip active acids at home for 48 hours.', NULL, NULL, 'ESTEQO', 6, '["hydra facial","what to expect"]', 1, 'published', '2026-07-14 10:00:00'),
  (1, 'peels-explained-glow-spot-meline-biorepeel', 'Peels Explained: Glow, Spot, Meline and BioRepeel', 'Four peels on our menu, four different jobs. Here is which one matches which concern — and what each actually costs.', '## Peels are not interchangeable

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

Bring the concern, not the treatment name. We will match it during the consultation, and we will tell you if the cheaper option is the right one.', NULL, NULL, 'Seema Nanda', 5, '["peels","pigmentation"]', 0, 'published', '2026-06-30 10:00:00'),
  (3, 'brow-mapping-why-shape-comes-first', 'Brow Mapping: Why Shape Comes Before Hair Removal', 'Most brow regret starts with someone removing hair before deciding on the shape. Mapping reverses that order.', '## Your brows frame your entire face

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

Ask to be mapped first. See the shape drawn on before committing. Any brow artist confident in their work will be happy to do this.', NULL, NULL, 'Seema Nanda', 4, '["brows","brow mapping"]', 0, 'published', '2026-06-16 10:00:00'),
  (4, 'body-polish-vs-body-bleach', 'Body Polish vs Body Bleach: What Each One Actually Does', 'One exfoliates and hydrates. The other lifts tan. People book them expecting the same result and get surprised.', '## Two different jobs

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

Once every 3–4 weeks for long-lasting brightness and smoothness.', NULL, NULL, 'ESTEQO', 4, '["body","detan","polish"]', 0, 'published', '2026-05-26 10:00:00'),
  (2, 'how-to-prepare-for-your-first-appointment', 'How to Prepare for Your First Appointment at ESTEQO', 'Every service begins with a detailed skin consultation. A little preparation makes that consultation much more useful.', '## We plan after analysis, not around trends

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

Call or WhatsApp **+91 8010135135** if anything changes before your slot.', NULL, NULL, 'ESTEQO', 3, '["consultation","first visit"]', 0, 'published', '2026-05-12 10:00:00');

INSERT IGNORE INTO `faqs` (`id`, `faq_group`, `question`, `answer`, `sort_order`, `is_active`) VALUES
  (1, 'general', 'Where is ESTEQO located?', 'ESTEQO, Shop No. 209, First Floor, Modi Mall, Sector 25, Noida – 201301. Open every day, 10 am to 8:30 pm.', 1, 1),
  (2, 'general', 'Do I need an appointment, or can I walk in?', 'Walk-ins are welcome when a slot is free, but we strongly recommend booking. Every service begins with a detailed skin consultation, and a booked slot guarantees your specialist has time to plan the treatment properly.', 2, 1),
  (3, 'general', 'What happens during the first consultation?', 'Your specialist analyses your skin type, concerns and history before recommending anything. We plan treatments after analysis, not around trends.', 3, 1),
  (4, 'general', 'Do you serve areas outside Noida?', 'Clients travel to us from across Noida, Greater Noida, Ghaziabad and Delhi NCR. Tell us your area when you enquire and we will suggest the easiest time to reach Sector 25.', 4, 1),
  (5, 'general', 'How do I reschedule?', 'Call or WhatsApp +91 8010135135, or email Info.esteqo@gmail.com. Please give us at least 24 hours notice so we can offer the slot to someone else.', 5, 1),
  (6, 'medi-facials', 'What is the difference between Hydra Clean Up and Hydra Facial?', 'The Hydra Clean Up (30 mins, ₹2,000) is a focused cleansing treatment for sensitive or acne-prone skin. The Hydra Facial (80 mins, ₹3,000) adds serum infusion, cryo therapy, ultrasound and LED for a full multi-step result.', 1, 1),
  (7, 'medi-facials', 'How often should I book a Hydra Facial?', 'Once every 3–4 weeks. Skin turns over on roughly that cycle, so treating in step with it is what compounds results.', 2, 1),
  (8, 'medi-facials', 'Is there any downtime?', 'None. You might notice mild redness that fades within a few hours. Avoid makeup for 6–8 hours and use sunscreen.', 3, 1),
  (9, 'advanced-facials', 'Which advanced facial is right for pigmentation?', 'Carbon Laser Facial, Meso Glow Therapy and BB Glow all address pigmentation from different angles. Your specialist will choose after assessing the type and depth of the pigmentation.', 1, 1),
  (10, 'advanced-facials', 'Is micro-needling painful?', 'Topical numbing is applied first, so most clients describe it as pressure rather than pain.', 2, 1),
  (11, 'advanced-facials', 'Do men book these treatments?', 'Yes — Just For Men (80 mins, ₹4,000) is designed specifically around the facial hair area, and the rest of the menu is open to everyone.', 3, 1),
  (12, 'facials', 'Are there facials suitable for sensitive skin?', 'Yes. Lotus Puravital and the Japanese Seed Mask Organic Facial are created for sensitive or reactive skin types.', 1, 1),
  (13, 'facials', 'How often should I get a facial?', 'For healthy, glowing skin, it''s ideal to schedule a facial once every 3–4 weeks.', 2, 1),
  (14, 'facials', 'Can I combine a facial with an add-on?', 'Absolutely. Glow Peel, BioRepeel and Esthemax Masks are designed to enhance facial results when combined in the same session.', 3, 1),
  (15, 'add-on-treatments', 'Are add-on treatments safe?', 'Yes. Each treatment is customised to your skin condition, and patch tests are performed when necessary.', 1, 1),
  (16, 'add-on-treatments', 'Is there any downtime?', 'Most have zero downtime. You might notice mild redness that fades within a few hours — it''s just your skin renewing itself.', 2, 1),
  (17, 'add-on-treatments', 'How soon will I see results?', 'Most add-ons deliver an immediate visible glow and smoother texture, with results improving over a few days.', 3, 1),
  (18, 'body-bleach-detan', 'Are the products safe for sensitive skin?', 'Yes. All our products are dermatologically approved and tested for sensitive skin. Patch tests are performed before every session.', 1, 1),
  (19, 'body-bleach-detan', 'Is bleaching the same as skin lightening?', 'No. Bleaching lightens tan and removes surface dullness; it does not permanently change your skin colour.', 2, 1),
  (20, 'body-bleach-detan', 'How often should I book?', 'Once every 3–4 weeks is recommended for long-lasting brightness.', 3, 1),
  (21, 'body-polish', 'What is the difference between polish and bleach?', 'Polish exfoliates and hydrates, improving texture. Bleach or detan lifts tan, improving tone. Many clients combine both.', 1, 1),
  (22, 'body-polish', 'Does Back Facial with Hydra help with back acne?', 'Yes — it is a proper facial protocol for the back rather than a scrub, using Hydra dermabrasion and extraction.', 2, 1),
  (23, 'threading', 'Is threading safe for sensitive skin?', 'Yes. Threading uses no chemicals, which makes it ideal for sensitive or acne-prone skin.', 1, 1),
  (24, 'threading', 'How long do the results last?', 'Typically 3–4 weeks, depending on hair growth and skin type.', 2, 1),
  (25, 'face-waxing', 'Which is better — threading or waxing?', 'Both are effective. Threading offers precise control for small areas, while waxing gives a smoother finish on larger areas.', 1, 1),
  (26, 'face-waxing', 'Can I wear makeup right after?', 'Avoid makeup for 6–8 hours post-treatment to allow pores to close naturally.', 2, 1),
  (27, 'body-waxing', 'What is the difference between hot wax, Rica and peel-off?', 'Hot wax grips short, coarse hair and suits precise areas. Rica is a gentler resin-based wax for sensitive skin and larger areas. Peel-off is the most comfortable option for the underarm and bikini areas.', 1, 1),
  (28, 'body-waxing', 'Does the Full Body price include bikini and bums?', 'No — bikini and bums are priced separately.', 2, 1),
  (29, 'massages', 'How long are the massages?', 'Focused massages are booked in 20 or 30 minute slots. Swedish, deep tissue and hot candle aroma oil massages are 60 minutes.', 1, 1),
  (30, 'massages', 'Is there any downtime?', 'None. You can return to your day immediately.', 2, 1),
  (31, 'manicure', 'What is the difference between Algae and Drupe?', 'Algae is a marine treatment focused on deep hydration and firming. Drupe is a premium ritual focused on softness and shine, with an optional peel-off mask.', 1, 1),
  (32, 'pedicure', 'Can I add paraffin wax?', 'Yes — the Paraffin Wax Add On (15 mins, ₹300) can be added to any manicure or pedicure.', 1, 1);

INSERT IGNORE INTO `team_members` (`id`, `slug`, `name`, `role`, `bio`, `sort_order`, `is_active`) VALUES
  (1, 'seema-nanda', 'Seema Nanda', 'Founder & Lead Cosmetologist', 'With over a decade of hands-on experience, Seema founded ESTEQO to blend advanced dermatological science with the artistry of beauty. She leads the brow department personally.', 1, 1),
  (2, 'skin-laser-specialist', 'Skin & Laser Specialist', 'Medi-Facials, Hydra & Laser Protocols', 'Plans and delivers our medical-grade facial and laser protocols, from Hydra Facial and carbon laser through to PDRN and meso needling — always after a full skin analysis.', 2, 1),
  (3, 'senior-aesthetician', 'Senior Aesthetician', 'Facials, Peels & Add-On Treatments', 'Runs our cleanup, facial and peel menu, and advises on which add-on boosters will actually move the needle for your skin.', 3, 1),
  (4, 'wellness-therapist', 'Wellness Therapist', 'Massages, Body Polish & Nail Care', 'Delivers our massage, reflexology and body polish menu — the slower half of ESTEQO, built around release rather than results.', 4, 1);

INSERT IGNORE INTO `testimonials` (`id`, `author`, `location`, `treatment`, `quote`, `rating`, `sort_order`, `is_active`) VALUES
  (1, 'A. Sharma', 'Sector 25, Noida', 'Hydra Facial', 'The consultation before the facial was longer than the facial I used to get elsewhere. They actually explained why my skin was reacting the way it was.', 5, 1, 1),
  (2, 'R. Kapoor', 'Indirapuram', 'Eyebrow Mapping with Wax', 'Seema mapped the shape and showed me before touching anything. First time my brows have looked even in photos.', 5, 2, 1),
  (3, 'M. Verma', 'Greater Noida West', 'Carbon Laser Facial', 'No pressure to buy a package on day one. They set out how many sessions I would realistically need and why.', 5, 3, 1),
  (4, 'P. Singh', 'Sector 62, Noida', 'Hot Candle Aroma Oil Massage', 'Booked it on a whim after work. Easily the most relaxed hour of my month.', 5, 4, 1),
  (5, 'N. Gupta', 'Vaishali', 'Meline Pigmentation Peel', 'Pigmentation I had given up on has genuinely faded over the course. Slow, but real.', 5, 5, 1);

INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
  ('site_name', 'ESTEQO', 'brand'),
  ('site_tagline', 'Brows | Lasers | Skin', 'brand'),
  ('hero_subtitle', 'Clinically planned treatments for visible results and long-term skin confidence.', 'brand'),
  ('founder_name', 'Seema Nanda', 'brand'),
  ('founder_title', 'Founder & Lead Cosmetologist', 'brand'),
  ('phone', '+91 8010135135', 'contact'),
  ('phone_link', '+918010135135', 'contact'),
  ('whatsapp', '+918010135135', 'contact'),
  ('email', 'Info.esteqo@gmail.com', 'contact'),
  ('address_line1', 'ESTEQO, Shop No. 209, First Floor, Modi Mall', 'contact'),
  ('address_line2', 'Sector 25, Noida, Uttar Pradesh – 201301', 'contact'),
  ('map_query', 'Modi Mall, Sector 25, Noida, Uttar Pradesh 201301', 'contact'),
  ('hours', 'Open daily: 10:00 am – 8:30 pm', 'contact'),
  ('website', 'www.esteqo.com', 'contact'),
  ('facebook', 'https://www.facebook.com/', 'social'),
  ('instagram', 'https://www.instagram.com/esteqo_care/', 'social'),
  ('youtube', 'https://www.youtube.com/@cosmetologistseemanandaest4431', 'social');

SET FOREIGN_KEY_CHECKS = 1;

-- ESTEQO - starting content
--
-- Generated from react-app/src/data, which is what the website renders.
-- Import AFTER install.sql.
--
-- SAFE TO RUN ANY NUMBER OF TIMES. Every statement is INSERT IGNORE and
-- there is no DELETE, so:
--   * on an empty database it loads the full starting content
--   * on a database that already has content it changes NOTHING - your
--     blog posts, edits and enquiries are left exactly as they are
--
-- To deliberately refresh the treatment menu after editing menu.js, use
-- refresh-menu.sql instead. That one does replace the menu, on purpose.

SET FOREIGN_KEY_CHECKS = 0;

INSERT IGNORE INTO `service_categories`
  (`id`, `slug`, `name`, `tagline`, `intro`, `accent`, `hero_image`, `sort_order`, `is_featured`, `is_active`)
VALUES
  (1, 'brows', 'Brows', 'Precision brows, designed around your face — not a template.', 'Beautiful brows begin with the right structure. Every brow service starts with personalised brow mapping, so the shape suits your facial proportions, eye shape and natural growth pattern rather than a standard template.', 'light-brown', NULL, 0, 1, 1),
  (2, 'bridal', 'Bridal Services', 'Planned backwards from your wedding date, not booked in a panic.', 'Bridal skin is a schedule, not a single appointment. These packages combine treatments from across the menu into a plan that starts months before and finishes the week of the wedding — for the bride, the groom and the family.', 'light-pink', NULL, 0, 1, 1),
  (3, 'medi-facials', 'Medi-Facials', 'Advanced skin treatments planned after analysis, not trends.', 'Rejuvenation that goes beyond the surface. Our Medi-Facials combine medical technology with therapeutic relaxation to purify, hydrate and renew your skin from within.', 'light-blue', NULL, 1, 1, 1),
  (4, 'advanced-facials', 'Advanced Facials', 'Clinical technology for pigmentation, ageing and texture.', 'Laser, micro-needling and infusion protocols for concerns that a standard facial cannot reach — each planned around your skin assessment.', 'cream', NULL, 2, 1, 1),
  (5, 'facials', 'Facials', 'Target your concerns with facials that heal, balance and brighten.', 'Our classic facial menu — from gentle organic masks to anti-ageing protocols, each chosen for your skin type after consultation.', 'light-pink', NULL, 3, 0, 1),
  (6, 'face-clean-up', 'Face Clean Up', 'The monthly reset that keeps pores clear between facials.', 'A cleanup focuses on removing dirt and impurities. Booked once a month, it is maintenance — it keeps congestion from building up between your bigger treatments.', 'off-white', NULL, 4, 0, 1),
  (7, 'add-on-treatments', 'Add-On Treatments', 'Targeted boosters that amplify the results of any service.', 'Specialised boosters for pigmentation, dullness, scars and uneven texture. Most are designed to be added to a facial in the same session.', 'light-green', NULL, 5, 0, 1),
  (8, 'body-bleach-detan', 'Body Bleach & Detan', 'Lift tan and surface dullness, area by area.', 'Dermatologically approved formulas that lighten tan and remove surface dullness. Patch tests are performed before every session.', 'light-yellow', NULL, 6, 0, 1),
  (9, 'body-polish', 'Body Polish', 'Full-body care that leaves skin soft, even-toned and luminous.', 'Exfoliation, hydration and nourishment from head to toe — including our Hydra dermabrasion body protocols.', 'light-brown', NULL, 7, 0, 1),
  (10, 'manicure', 'Manicure', 'Nourishing hand treatments for lasting smoothness and shine.', 'From a classic tidy-up to algae and Drupe rituals with peel-off masks.', 'light-purple', NULL, 8, 0, 1),
  (11, 'pedicure', 'Pedicure', 'Foot care that goes further than a polish change.', 'Classic through to algae and Drupe pedicures, with peel-off mask options.', 'light-purple', NULL, 9, 0, 1),
  (12, 'threading', 'Threading', 'Precise, chemical-free shaping for every part of the face.', 'Threading uses no chemicals, which makes it ideal for sensitive or acne-prone skin, and gives precise control on small areas.', 'cream', NULL, 10, 0, 1),
  (13, 'face-waxing', 'Face Waxing', 'Low-temperature wax for a silky, glowing finish.', 'Hypoallergenic wax formulated for facial skin, with a patch test beforehand where your skin needs one.', 'light-pink', NULL, 11, 0, 1),
  (14, 'body-waxing', 'Body Waxing', 'Hot wax, Rica wax and peel-off options for every area.', 'Choose the wax that suits your skin: hot wax for precision, Rica for sensitive areas, peel-off where comfort matters most.', 'light-blue', NULL, 12, 0, 1),
  (15, 'nails', 'Nails', 'Quick nail care, on its own or as an add-on.', 'Nail shaping and polish, with a paraffin wax add-on for extra softness.', 'off-white', NULL, 13, 0, 1),
  (16, 'massages', 'Relaxing Massages', 'Unwind and rejuvenate with therapies built to restore balance.', 'Short focused massages by the 20 or 30 minute slot, plus full 60-minute body therapies. No downtime — you can return to your day immediately.', 'light-green', NULL, 14, 0, 1);

INSERT IGNORE INTO `services`
  (`id`, `category_id`, `slug`, `name`, `summary`, `bullets`, `what_to_expect`, `ideal_for`, `duration_minutes`, `price`, `image`, `sort_order`, `is_featured`, `is_active`)
VALUES
  (1, 1, 'brow-shape', 'Brow Shape', 'Personalised brow mapping combined with precision grooming to create a shape that complements your facial proportions, eye shape and natural brow growth.', '["Customised brow design, not a standard template","Natural brow preservation — density is protected wherever possible","Threading, waxing, tweezing and trimming combined as your brows need","No downtime — return to your routine immediately"]', '[]', 'Want cleaner, more defined eyebrows • Feel their brows lack structure or symmetry • Have thick, unruly or uneven brow hair • Want to refine their natural arch • Need regular professional brow maintenance • Have previously over-plucked their eyebrows • Want a professionally mapped shape before a PMU treatment', 20, NULL, NULL, 1, 1, 1),
  (2, 1, 'brow-tint', 'Brow Tint', 'A temporary colour treatment that deepens your natural brow hair for a more defined, fuller-looking finish — without committing to permanent makeup.', '["Shade selected around your natural colouring, not simply darkened","Controlled application that respects the existing brow shape","Professional formulations — vegan, cruelty-free, paraben-free and PPD-free options may be available","Minimal aftercare and no downtime"]', '[]', 'Want their brows to appear darker and more defined • Have naturally light or unevenly coloured brow hair • Want to create a fuller-looking appearance • Would like their brows to complement a new hair colour • Prefer a low-maintenance alternative to daily brow makeup • Want temporary enhancement without permanent makeup', 20, NULL, NULL, 2, 1, 1),
  (3, 1, 'hd-brows', 'HD Brows', 'A multi-step brow treatment combining mapping, tinting and precision shaping to build a fuller, high-definition brow.', '[]', '[]', NULL, NULL, NULL, NULL, 3, 0, 1),
  (4, 1, 'brow-lamination', 'Brow Lamination', 'A restructuring treatment that lifts and sets brow hairs upward for a fuller, groomed look that lasts for weeks.', '[]', '[]', NULL, NULL, NULL, NULL, 4, 0, 1),
  (5, 1, 'microblading', 'Microblading', 'Hair-stroke semi-permanent pigment applied by hand to fill sparse areas and rebuild a natural, defined brow.', '[]', '[]', NULL, NULL, NULL, NULL, 5, 0, 1),
  (6, 1, 'ombre-brow', 'Ombre Brow', 'A soft, machine-shaded permanent makeup technique creating a powdered finish with a light-to-dark gradient.', '[]', '[]', NULL, NULL, NULL, NULL, 6, 0, 1),
  (7, 1, 'hybrid-brow', 'Hybrid Brow', 'Microblading hair strokes combined with soft shading — definition at the tail with a natural gradient at the front.', '[]', '[]', NULL, NULL, NULL, NULL, 7, 0, 1),
  (8, 1, 'brow-tattoo-removal', 'Tattoo Removal', 'Corrective work that lightens or neutralises unwanted brow pigment from previous permanent makeup, before the brow is rebuilt.', '[]', '[]', NULL, NULL, NULL, NULL, 8, 0, 1),
  (9, 2, 'bridal-radiance-90-days', 'Bridal Radiance — 90 Days', 'Our most complete bridal plan. Three months of scheduled treatments that correct pigmentation and texture first, then build glow as the date approaches.', '["3 × Hydra Facial, spaced 3–4 weeks apart","2 × Glow Peel added to your facials","1 × Meline Pigmentation Peel for stubborn pigmentation","1 × Full Body Polish before the wedding week","Skin analysis and a written plan at the first session"]', '[]', NULL, NULL, 18999, NULL, 9, 1, 1),
  (10, 2, 'bridal-essentials-30-days', 'Bridal Essentials — 30 Days', 'The one-month plan for brides who have four to five weeks. Focused on brightening, even tone and smooth body skin.', '["2 × Hydra Facial","1 × Full Body Bleach / Detan","1 × Full Body Polish","1 × Full Face Threading"]', '[]', NULL, NULL, 11499, NULL, 10, 1, 1),
  (11, 2, 'wedding-week-glow', 'Wedding Week Glow', 'Everything in the final week — advanced hydration, full-body polish and hands and feet finished, timed so nothing is done too close to the day.', '["1 × Advanced Hydra Facial","1 × Full Body Polish with Hydra","1 × Classic Manicure and Classic Pedicure","1 × Full Face Wax"]', '[]', NULL, NULL, 11999, NULL, 11, 0, 1),
  (12, 2, 'bridal-day-before-ritual', 'Day-Before Ritual', 'A calm, low-risk session the day before — hydration and glow with no extractions or peels that could leave the skin reactive.', '["1 × Hydra Facial","1 × Glow Peel","1 × Head & Shoulder Massage (30 min)","1 × Eyebrow Threading"]', '[]', NULL, 150, 3999, NULL, 12, 0, 1),
  (13, 2, 'bridal-brow-design', 'Bridal Brow Design', 'Brow mapping and shaping planned around your wedding photographs, with the option of tint or semi-permanent work scheduled far enough ahead to settle.', '["Personalised brow mapping and shaping","Brow Tint or PMU planned to your timeline","Trial and settling time built into the schedule"]', '[]', NULL, NULL, NULL, NULL, 13, 0, 1),
  (14, 2, 'groom-grooming-package', 'Groom''s Grooming Package', 'Built around the facial hair area — clears irritation and ingrowns, brightens, and finishes hands and feet.', '["1 × Just For Men facial","1 × Full Face Wax","1 × Head Massage (30 min)","1 × Classic Manicure and Classic Pedicure"]', '[]', NULL, NULL, 5499, NULL, 14, 1, 1),
  (15, 2, 'groom-glow-course', 'Groom''s Glow Course — 30 Days', 'A month of preparation for grooms dealing with congestion, tan or uneven tone before the wedding.', '["2 × Hydra Facial","1 × Carbon Laser Facial","1 × Full Body Bleach / Detan"]', '[]', NULL, NULL, 8999, NULL, 15, 0, 1),
  (16, 2, 'bridesmaid-package', 'Bridesmaid Package', 'A short, well-priced session for the wedding party — clean, bright skin and tidy hands and feet.', '["1 × Hydra Clean Up","1 × Full Face Threading","1 × Classic Manicure","1 × Classic Pedicure"]', '[]', NULL, 120, 3299, NULL, 16, 0, 1),
  (17, 2, 'mother-of-the-bride-package', 'Mother of the Bride', 'Firming and brightening for mature skin, with body care and a relaxing finish.', '["1 × Upendice Anti Ageing Facial","1 × Full Body Polish","1 × Drupe Manicure and Drupe Pedicure"]', '[]', NULL, NULL, 9499, NULL, 17, 0, 1),
  (18, 2, 'bridal-party-group-booking', 'Bridal Party Group Booking', 'Four or more guests booked together on the same day, with the schedule planned so everyone finishes in time.', '["Four or more guests on a single day","Treatments chosen per guest from the full menu","Schedule planned around your getting-ready time"]', '[]', NULL, NULL, NULL, NULL, 18, 0, 1),
  (19, 3, 'hydra-clean-up', 'Hydra Clean Up', 'A gentle cleansing facial ideal for sensitive or acne-prone skin — pore-cleansing with Hydra dermabrasion, a hydrating pack and finishing serums.', '["Ideal for sensitive or acne-prone skin","Customized cleansing","Pore-cleansing with Hydra dermabrasion","Hydrating pack","Serums and moisturizers"]', '[]', NULL, 30, 2000, '/services/21324.jpg', 19, 0, 1),
  (20, 3, 'hydra-facial', 'Hydra Facial', 'Our most loved multi-step facial: Hydra dermabrasion, serum infusion, cryo therapy, ultrasound and LED for instant radiance.', '["Hydra dermabrasion for exfoliation and comedone removal","Serum infusion for deep hydration and glow","Cryo cold therapy to calm and tighten","Ultrasound for enhanced absorption","LED light for brightening and repair"]', '[]', NULL, 80, 3000, '/services/21329.jpg', 20, 1, 1),
  (21, 3, 'hydra-glow-peel', 'Hydra + Glow Peel', 'Deep exfoliation meets hydration, with a glow-boosting peel added to your Hydra Facial.', '["Glow-boosting peel added to the Hydra Facial","Hydra dermabrasion and serum infusion","Cryo therapy, ultrasound and LED therapy"]', '[]', NULL, 90, 3800, '/services/21329.jpg', 21, 0, 1),
  (22, 3, 'hydra-carbon-laser-facial', 'Hydra + Carbon Laser Facial', 'Dual action — brightening carbon laser paired with hydrating Hydra therapy.', '["Brightening carbon laser","Hydrating Hydra therapy"]', '[]', NULL, 60, 5500, '/services/21329.jpg', 22, 0, 1),
  (23, 3, 'advanced-hydra-facial', 'Advanced Hydra Facial', 'Multi-step rejuvenation with lymphatic drainage and deep nourishment — Hydra Facial and Glow Peel with BB Glow meso micro-needling.', '["Multi-step rejuvenation with lymphatic drainage and deep nourishment","Hydra Facial + Glow Peel with BB Glow meso micro-needling"]', '[]', NULL, 90, 6500, '/services/21332.jpg', 23, 1, 1),
  (24, 4, 'carbon-laser-facial', 'Carbon Laser Facial', 'Q-Switched Nd:YAG laser with a carbon-based lotion to deep-clean, exfoliate and brighten.', '["Q-Switched Nd:YAG laser with carbon-based lotion","Deep-cleans, exfoliates and brightens"]', '[]', NULL, 45, 4000, NULL, 24, 1, 1),
  (25, 4, 'meso-glow-therapy', 'Meso Glow Therapy', 'Micro-needling with customised meso-cocktails rich in vitamins, peptides and antioxidants to target dullness, pigmentation and fine lines.', '["Micro-needling with customised meso-cocktails","Targets dullness, pigmentation and fine lines"]', '[]', NULL, 60, 4000, NULL, 25, 0, 1),
  (26, 4, 'bb-glow', 'BB Glow — Semi-Permanent Tinted Glow', 'Nano-needling with tinted serums to even out skin tone, boost radiance and reduce pigmentation.', '["Nano-needling with tinted serums","Evens skin tone and boosts radiance","Reduces pigmentation"]', '[]', NULL, 80, 5000, NULL, 26, 0, 1),
  (27, 4, 'oxygeneo-facial', 'OxyGeneo Facial', 'Triple-action technology — exfoliation, CO₂ oxygenation and active serum infusion for intense rejuvenation.', '["Exfoliation","CO₂ oxygenation","Active serum infusion"]', '[]', NULL, 70, 5000, NULL, 27, 0, 1),
  (28, 4, 'vampire-facial', 'Vampire Facial', 'Micro-needling with PRP (Platelet-Rich Plasma) to boost collagen, heal scars and rejuvenate skin.', '["Micro-needling with Platelet-Rich Plasma","Boosts collagen and heals scars"]', '[]', NULL, 60, 5500, NULL, 28, 0, 1),
  (29, 4, 'korean-pdrn-glowlift', 'Korean PDRN Glowlift', 'Advanced skin repair and hydration with Salmon DNA (PDRN), delivered by micro- or nano-needling.', '["Advanced repair and hydration with Salmon DNA (PDRN)","Smoother texture and reduced fine lines","Firm, plump skin with deep, dewy hydration","Boosted collagen and product absorption"]', '[]', NULL, 45, 6000, NULL, 29, 1, 1),
  (30, 4, 'pumpkin-enzyme-facial', 'Pumpkin Enzyme Facial', 'Power-packed with natural enzymes and AHA to exfoliate, detox and brighten dull, pigmented skin.', '["Natural enzymes and AHA","Exfoliates, detoxes and brightens dull, pigmented skin"]', '[]', NULL, 90, 7000, NULL, 30, 0, 1),
  (31, 4, 'luxe-skin-booster-glow', 'Luxe Skin Booster Glow', 'Micro-needling infusion of high-performance skin boosters to deeply hydrate, brighten and smooth the skin.', '["Micro-needling infusion of high-performance skin boosters","Deeply hydrates, brightens and smooths"]', '[]', NULL, 75, 8000, NULL, 31, 0, 1),
  (32, 4, 'just-for-men', 'Just For Men', 'Built for the facial hair area — reduces irritation, with Hydra dermabrasion, cryo cold therapy, ultrasound and LED.', '["Reduces irritation in the facial hair area","LED light for brightening and repair","Hydra dermabrasion, cryo cold therapy and ultrasound for enhanced absorption"]', '[]', NULL, 80, 4000, NULL, 32, 1, 1),
  (33, 5, 'lotus-puravital', 'Lotus Puravital', 'A detoxifying facial with Lotus extracts and Puravital serum to deeply cleanse and balance the skin.', '[]', '[]', NULL, 45, 1500, '/services/21377.jpeg', 33, 0, 1),
  (34, 5, 'lotus-puravital-tightening-mask', 'Lotus Puravital with Tightening Mask', 'The Puravital facial finished with a tightening mask for extra firmness and definition.', '[]', '[]', NULL, 60, 2000, '/services/21377.jpeg', 34, 0, 1),
  (35, 5, 'o3-whitening-facial', 'O3 Whitening Facial (1 pack = 1 mask)', 'An advanced brightening facial using O3+ technology to lighten tan, hydrate and restore even skin tone.', '[]', '[]', NULL, 70, 3500, '/services/21339.jpg', 35, 0, 1),
  (36, 5, 'casmara-prestige', 'Casmara Prestige', 'A premium facial delivering instant luminosity through Casmara''s signature peel-off mask and antioxidants.', '[]', '[]', NULL, 70, 3500, '/services/21333.jpg', 36, 0, 1),
  (37, 5, 'japanese-seed-mask-organic-facial', 'Japanese Seed Mask Organic Facial', 'A luxurious organic facial enriched with Japanese seed extracts that boost collagen and even out skin tone.', '[]', '[]', NULL, 90, 3500, '/services/21357.jpg', 37, 1, 1),
  (38, 5, 'blanch-skin-whitening', 'Blanch Skin Whitening', 'An advanced whitening therapy designed to reduce pigmentation and brighten dull skin from within.', '[]', '[]', NULL, 90, 4500, '/services/21339.jpg', 38, 0, 1),
  (39, 5, 'casmara-goji-treatment-facial', 'Casmara Goji Treatment Facial', 'Powered by Goji berry extracts, this facial protects skin from free radicals and deeply revitalises it.', '[]', '[]', NULL, 80, 4500, '/services/21339.jpg', 39, 0, 1),
  (40, 5, 'upendice-anti-ageing', 'Upendice Anti Ageing', 'A rejuvenating treatment that minimises fine lines, firms skin and restores elasticity using anti-ageing peptides.', '[]', '[]', NULL, 90, 4500, '/services/21339.jpg', 40, 0, 1),
  (41, 5, 'depuffing-ritual', 'Depuffing Ritual', 'A lymphatic-focused ritual that drains puffiness and re-sculpts a tired face. New on the ESTEQO menu.', '[]', '[]', NULL, 45, 2500, '/services/21357.jpg', 41, 0, 1),
  (42, 6, 'lotus-cleanup', 'Lotus Cleanup', 'A refreshing cleanup that purifies pores, removes oil and restores brightness to your complexion.', '[]', '[]', NULL, 30, 800, '/services/21375.jpg', 42, 1, 1),
  (43, 6, 'o3-plus-whitening-clean-up', 'O3+ Whitening Clean Up', 'A quick, effective brightening cleanup that removes impurities and evens your skin tone.', '[]', '[]', NULL, 30, 2000, '/services/21375.jpg', 43, 0, 1),
  (44, 7, 'glow-peel', 'Glow Peel', 'A mild exfoliating peel for dull, tired skin — perfect for that pre-event glow-up. Add it to your Hydra Facial for enhanced radiance at ₹800.', '["Mild exfoliating peel for dull, tired skin","Add to a Hydra Facial for ₹800"]', '[]', NULL, 20, 1200, '/services/21351.jpg', 44, 1, 1),
  (45, 7, 'spot-peel', 'Spot Peel', 'A targeted chemical peel that treats dark spots, pigmentation and acne marks — customised per area.', '[]', '[]', NULL, NULL, 3000, '/services/21351.jpg', 45, 0, 1),
  (46, 7, 'butt-glow-facial', 'Butt Glow Facial', 'A clarifying and brightening treatment for the buttocks — cleansing, exfoliation, a targeted mask and an optional peel for acne, pigmentation and rough texture.', '[]', '[]', NULL, 40, 4500, '/services/21353.jpg', 46, 0, 1),
  (47, 7, 'green-sea-peel', 'Green Sea Peel', 'A Korean algae-based herbal peel for acne, scars and pigmentation, offering deep exfoliation without harsh chemicals.', '["Korean algae-based herbal peel","Deep exfoliation without harsh chemicals"]', '[]', NULL, 45, 6000, '/services/21351.jpg', 47, 0, 1),
  (48, 7, 'signature-hydra-glow-body-polish', 'Signature Hydra Glow Body Polish', 'Cleanses, exfoliates, detoxifies, hydrates and nourishes with a revitalising pack, using Hydra dermabrasion.', '[]', '[]', NULL, 120, 5500, '/services/21355.jpg', 48, 0, 1),
  (49, 7, 'intimate-peel', 'Intimate Peel', 'Targets pigmentation on the bikini area, underarms, inner thighs or any intimate area using Meline or BioRepeel — with zero downtime. Two to three sessions may be needed for optimal results.', '[]', '[]', NULL, 20, 6000, '/services/21353.jpg', 49, 0, 1),
  (50, 7, 'meline-pigmentation-peel', 'Meline Pigmentation Peel', 'A medical-grade depigmenting peel designed to treat melasma, tanning and uneven skin tone with minimal downtime.', '[]', '[]', NULL, 45, 7500, '/services/21357.jpg', 50, 0, 1),
  (51, 7, 'dermaplaning', 'Dermaplaning', 'Gentle exfoliation using a surgical blade to remove dead skin and peach fuzz for instant smoothness and glow.', '[]', '[]', NULL, NULL, 1000, '/services/21357.jpg', 51, 0, 1),
  (52, 7, 'esthemax-masks', 'Esthemax Masks', 'Hydro-jelly masks — Egyptian Rose, Youthful Elixir, Spot Diminishing, ALA, Radiance Biotin and Brightening Complex — to boost hydration, glow and targeted results.', '["Egyptian Rose | Youthful Elixir | Spot Diminishing","ALA | Radiance Biotin | Brightening Complex","Boosts hydration, glow and targeted results"]', '[]', NULL, NULL, 1500, '/services/21339.jpg', 52, 0, 1),
  (53, 7, 'biorepeel', 'BioRepeel', 'A biphasic TCA peel that exfoliates, brightens and stimulates collagen — without visible peeling or downtime.', '[]', '[]', NULL, NULL, 6000, '/services/21351.jpg', 53, 0, 1),
  (54, 8, 'face-bleach-detan', 'Face Bleach / Detan', 'A quick facial bleach that lifts tan and softens your complexion — ideal for regular maintenance.', '[]', '[]', NULL, NULL, 500, '/services/21385.jpg', 54, 0, 1),
  (55, 8, 'half-hands-bleach-detan', 'Half Hands Bleach / Detan', 'Brightens the arms from shoulders to elbows by reducing sun tan and evening out tone.', '[]', '[]', NULL, NULL, 600, '/services/21388.jpg', 55, 0, 1),
  (56, 8, 'full-hands-bleach-detan', 'Full Hands Bleach / Detan', 'A complete arm lightening service for visibly smoother, more even skin.', '[]', '[]', NULL, NULL, 800, '/services/21388.jpg', 56, 0, 1),
  (57, 8, 'half-legs-bleach-detan', 'Half Legs Bleach / Detan', 'Brightens the lower legs by removing tan and buildup caused by sun exposure.', '[]', '[]', NULL, NULL, 600, '/services/21390.jpg', 57, 0, 1),
  (58, 8, 'full-legs-bleach-detan', 'Full Legs Bleach / Detan', 'A comprehensive tan-removal treatment for smooth, glowing legs.', '[]', '[]', NULL, NULL, 900, '/services/21390.jpg', 58, 0, 1),
  (59, 8, 'half-back-bleach-detan', 'Half Back Bleach / Detan', 'Evens tone across the upper back — a common request before an event.', '[]', '[]', NULL, NULL, 600, '/services/21390.jpg', 59, 0, 1),
  (60, 8, 'full-back-bleach-detan', 'Full Back Bleach / Detan', 'Full back tan removal for an even tone from shoulders to waist.', '[]', '[]', NULL, NULL, 800, '/services/21390.jpg', 60, 0, 1),
  (61, 8, 'half-front-bleach-detan', 'Half Front Bleach / Detan', 'Targets the neck and décolleté, where tan lines show most.', '[]', '[]', NULL, NULL, 400, '/services/21385.jpg', 61, 0, 1),
  (62, 8, 'full-front-bleach-detan', 'Full Front Bleach / Detan', 'Complete front-of-body detan for an even, brighter tone.', '[]', '[]', NULL, NULL, 800, '/services/21385.jpg', 62, 0, 1),
  (63, 8, 'full-body-bleach-detan', 'Full Body Bleach / Detan', 'Brighten and refresh your entire body with this tan-removal treatment, performed with dermatologist-approved bleach.', '[]', '[]', NULL, NULL, 3000, '/services/21390.jpg', 63, 1, 1),
  (64, 9, 'full-body-polish', 'Full Body Polish', 'A rejuvenating treatment that exfoliates, hydrates and nourishes — revealing silky smoothness head to toe.', '[]', '[]', NULL, 180, 4000, '/services/21392.jpg', 64, 1, 1),
  (65, 9, 'full-body-polish-with-hydra', 'Full Body Polish with Hydra', 'Medical-grade body polishing using Hydra dermabrasion for deep hydration and brightening.', '[]', '[]', NULL, 220, 5500, '/services/21392.jpg', 65, 0, 1),
  (66, 9, 'hand-polish', 'Hand Polish', 'A focused polish that renews the hands, removing tan and dry patches.', '[]', '[]', NULL, 30, 1000, '/services/21395.jpg', 66, 0, 1),
  (67, 9, 'full-leg-polish', 'Full Leg Polish', 'Exfoliation and hydration for the full leg, leaving skin smooth and even.', '[]', '[]', NULL, 30, 2000, '/services/21395.jpg', 67, 0, 1),
  (68, 9, 'back-polish', 'Back Polish', 'Clears congestion and roughness across the back with gentle exfoliation.', '[]', '[]', NULL, 30, 1000, '/services/21392.jpg', 68, 0, 1),
  (69, 9, 'back-facial-with-hydra', 'Back Facial with Hydra', 'A proper facial for the back — Hydra dermabrasion, extraction and a soothing finish for back acne and texture.', '[]', '[]', NULL, 45, 2500, '/services/21392.jpg', 69, 0, 1),
  (70, 10, 'classic-manicure', 'Classic Manicure', 'Shaping, cuticle care and a polish finish.', '[]', '[]', NULL, 30, 550, NULL, 70, 0, 1),
  (71, 10, 'oil-manicure', 'Oil Manicure', 'A nourishing warm-oil treatment for dry hands and brittle nails.', '[]', '[]', NULL, 30, 800, NULL, 71, 0, 1),
  (72, 10, 'pedipie-manicure', 'Pedipie Manicure', 'The Pedipie ritual adapted for hands — cleansing, scrub and mask.', '[]', '[]', NULL, 30, 900, NULL, 72, 0, 1),
  (73, 10, 'algae-manicure', 'Algae Manicure', 'A marine algae treatment that deeply hydrates and firms the skin on the hands.', '[]', '[]', NULL, 45, 2000, NULL, 73, 0, 1),
  (74, 10, 'drupe-manicure', 'Drupe Manicure', 'A premium Drupe ritual for softness, shine and lasting hydration.', '[]', '[]', NULL, 45, 1500, NULL, 74, 1, 1),
  (75, 10, 'drupe-manicure-peel-off-mask', 'Drupe Manicure with Peel Off Mask', 'The Drupe manicure finished with a peel-off mask for extra brightness.', '[]', '[]', NULL, 60, 2000, NULL, 75, 0, 1),
  (76, 11, 'classic-pedicure', 'Classic Pedicure', 'Soak, shaping, cuticle care, scrub and polish.', '[]', '[]', NULL, 45, 800, NULL, 76, 0, 1),
  (77, 11, 'oil-pedicure', 'Oil Pedicure', 'A warm-oil pedicure for dry, cracked heels and tired feet.', '[]', '[]', NULL, 45, 1000, NULL, 77, 0, 1),
  (78, 11, 'pedipie-pedicure', 'Pedipie Pedicure', 'The Pedipie ritual — cleansing, scrub and a nourishing mask.', '[]', '[]', NULL, 45, 1200, NULL, 78, 0, 1),
  (79, 11, 'algae-pedicure', 'Algae Pedicure', 'A marine algae pedicure that hydrates deeply and calms tired feet.', '[]', '[]', NULL, 80, 2500, NULL, 79, 0, 1),
  (80, 11, 'drupe-pedicure', 'Drupe Pedicure', 'A premium Drupe pedicure for softness and lasting hydration.', '[]', '[]', NULL, 60, 2000, NULL, 80, 1, 1),
  (81, 11, 'drupe-pedicure-peel-off-mask', 'Drupe Pedicure with Peel Off Mask', 'The Drupe pedicure finished with a peel-off mask.', '[]', '[]', NULL, 80, 2500, NULL, 81, 0, 1),
  (82, 12, 'lowerlips-threading', 'Lowerlips Threading', 'Removes fine hair around the lower lip for a clean, even finish.', '[]', '[]', NULL, NULL, 50, '/services/21418.jpg', 82, 0, 1),
  (83, 12, 'upperlips-threading', 'Upperlips Threading', 'Quick, clean and gentle removal of unwanted upper-lip hair.', '[]', '[]', NULL, NULL, 50, '/services/21418.jpg', 83, 0, 1),
  (84, 12, 'chin-threading', 'Chin Threading', 'Precise hair removal for the chin and jawline.', '[]', '[]', NULL, NULL, 60, '/services/21420.jpg', 84, 0, 1),
  (85, 12, 'forehead-threading', 'Forehead Threading', 'Clears baby hair and uneven patches around the forehead.', '[]', '[]', NULL, NULL, 60, '/services/21420.jpg', 85, 0, 1),
  (86, 12, 'eyebrows-threading', 'Eyebrows Threading', 'Perfectly shaped brows that define and lift your entire face.', '[]', '[]', NULL, NULL, 100, '/services/21416.jpg', 86, 1, 1),
  (87, 12, 'full-face-threading', 'Full Face Threading', 'Complete hair removal from the face for a soft, velvety finish.', '[]', '[]', NULL, NULL, 500, '/services/21420.jpg', 87, 0, 1),
  (88, 13, 'chin-wax', 'Chin Wax', 'Quick, smooth removal of coarse chin hair.', '[]', '[]', NULL, NULL, 100, '/services/21357.jpg', 88, 0, 1),
  (89, 13, 'forehead-wax', 'Forehead Wax', 'Removes fine baby hair and dull buildup for a polished finish.', '[]', '[]', NULL, NULL, 100, '/services/21357.jpg', 89, 0, 1),
  (90, 13, 'upperlips-wax', 'Upperlips Wax', 'Gentle hair removal for a clean, soft upper-lip area.', '[]', '[]', NULL, NULL, 100, '/services/21339.jpg', 90, 0, 1),
  (91, 13, 'lower-neck-wax', 'Lower Neck Wax', 'Removes hair around the lower neck for a neat, polished neckline.', '[]', '[]', NULL, NULL, 300, '/services/21339.jpg', 91, 0, 1),
  (92, 13, 'sidelock-wax', 'Sidelock Wax', 'Targets the sideburn area for a clean, defined jawline.', '[]', '[]', NULL, NULL, 300, '/services/21339.jpg', 92, 0, 1),
  (93, 13, 'eyebrow-mapping-with-wax', 'Eyebrow Mapping with Wax', 'A precise brow-shaping session that maps your ideal brow structure to your facial proportions, then shapes with wax.', '[]', '[]', NULL, NULL, 500, '/services/21687.png', 93, 1, 1),
  (94, 13, 'full-face-wax', 'Full Face Wax', 'Low-temperature wax across the face for a silky, glowing finish.', '[]', '[]', NULL, NULL, 650, '/services/21339.jpg', 94, 0, 1),
  (95, 14, 'underarms-wax', 'Underarms', 'Choose hot wax, Rica or peel-off for the underarm area.', '[]', '[]', NULL, NULL, 100, NULL, 95, 0, 1),
  (96, 14, 'full-arms-wax', 'Full Arms', 'Full arm waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 300, NULL, 96, 0, 1),
  (97, 14, 'half-legs-wax', 'Half Legs', 'Knee-down waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 300, NULL, 97, 0, 1),
  (98, 14, 'full-legs-wax', 'Full Legs', 'Full leg waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 550, NULL, 98, 1, 1),
  (99, 14, 'stomach-wax', 'Stomach', 'Stomach waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 350, NULL, 99, 0, 1),
  (100, 14, 'bums-wax', 'Bums Wax', 'Waxing for the bum area in hot wax or Rica.', '[]', '[]', NULL, NULL, 400, NULL, 100, 0, 1),
  (101, 14, 'full-back-wax', 'Full Back', 'Full back waxing in hot wax or Rica.', '[]', '[]', NULL, NULL, 550, NULL, 101, 0, 1),
  (102, 14, 'bikini-wax', 'Bikini', 'Bikini waxing with hot wax, Rica or peel-off for maximum comfort.', '[]', '[]', NULL, NULL, 1000, NULL, 102, 0, 1),
  (103, 14, 'full-body-wax', 'Full Body', 'Full body waxing. Bikini and bums are not included.', '[]', '[]', NULL, NULL, 1800, NULL, 103, 0, 1),
  (104, 14, 'full-face-wax-rica', 'Full Face Wax (Rica)', 'Full face waxing in Rica wax.', '[]', '[]', NULL, NULL, 650, '/services/21339.jpg', 104, 0, 1),
  (105, 15, 'nailcut-filing-polish', 'Nailcut, Filing and Polish', 'Nail shaping, filing and a polish finish.', '[]', '[]', NULL, 15, 250, NULL, 105, 0, 1),
  (106, 15, 'paraffin-wax-add-on', 'Paraffin Wax Add On', 'A warm paraffin wrap that softens hands or feet — added to any manicure or pedicure.', '[]', '[]', NULL, 15, 300, NULL, 106, 0, 1),
  (107, 16, 'foot-massage', 'Foot Massage', 'A deeply soothing therapy focusing on the pressure points of the feet to release fatigue and improve circulation.', '["Reduces swelling and soreness","Improves energy flow","Relieves stress and tension"]', '[]', NULL, 20, 400, '/services/21652.png', 107, 0, 1),
  (108, 16, 'hand-massage', 'Hand Massage', 'A gentle treatment that eases stiffness and strain from the hands.', '["Improved mobility","Relief from muscle fatigue","Enhanced blood circulation"]', '[]', NULL, 20, 400, NULL, 108, 0, 1),
  (109, 16, 'head-massage', 'Head Massage', 'A calming, stress-relieving treatment focused on scalp pressure points.', '["Reduces headaches and migraines","Improves sleep quality","Promotes relaxation and better blood flow"]', '[]', NULL, 20, 400, '/services/21653.png', 109, 1, 1),
  (110, 16, 'head-shoulder-massage', 'Head & Shoulder', 'Releases tightness caused by long working hours, poor posture or stress.', '["Relief from neck stiffness","Reduced shoulder tension","Instant relaxation"]', '[]', NULL, 20, 400, '/services/21653.png', 110, 0, 1),
  (111, 16, 'back-massage', 'Back Massage', 'Targets deep-seated tension along the spine and lower back.', '["Releases knots","Reduces muscle tightness","Improves flexibility"]', '[]', NULL, 20, 600, '/services/21655.png', 111, 0, 1),
  (112, 16, 'face-massage', 'Face Massage', 'A gentle, rejuvenating therapy that boosts glow and relaxation.', '["Enhanced blood flow","Reduced puffiness","Improved skin texture"]', '[]', NULL, 20, 600, NULL, 112, 0, 1),
  (113, 16, 'foot-reflexology', 'Foot Reflexology', 'A targeted treatment based on pressure points connected to various organs.', '["Improves internal balance","Reduces stress","Supports overall wellbeing"]', '[]', NULL, 20, 600, '/services/21657.png', 113, 0, 1),
  (114, 16, 'hand-reflexology', 'Hand Reflexology', 'A therapeutic experience stimulating the reflex zones in the hands.', '["Better energy flow","Reduced fatigue","Relaxation of hand muscles"]', '[]', NULL, 20, 600, '/services/21657.png', 114, 0, 1),
  (115, 16, 'swedish-massage', 'Swedish Massage', 'A classic full-body relaxation massage using long, flowing strokes. Perfect for first-time massage clients.', '["Stress relief","Improved blood circulation","Deep relaxation"]', '[]', NULL, 60, 1800, '/services/21655.png', 115, 1, 1),
  (116, 16, 'deep-tissue-massage', 'Deep Tissue Massage', 'Firm, focused pressure that works into chronic tension and knots.', '[]', '[]', NULL, 60, 2000, '/services/21655.png', 116, 0, 1),
  (117, 16, 'hot-candle-aroma-oil-massage', 'Hot Candle Aroma Oil Massage', 'Warm aromatic candle oil poured and massaged in — our most indulgent full-body therapy.', '[]', '[]', NULL, 60, 2500, '/services/21655.png', 117, 1, 1);

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
  (1, 'general', 'Where is ESTEQO located?', 'ESTEQO, Shop No. 209, First Floor, Modi Mall, Sector 25, Noida – 201301. Open Monday to Saturday, 9 am to 8 pm, and Sunday 10 am to 3 pm.', 1, 1),
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
  ('hours_weekday', 'Mon – Sat: 9:00 am – 8:00 pm', 'contact'),
  ('hours_sunday', 'Sunday: 10:00 am – 3:00 pm', 'contact'),
  ('website', 'www.esteqo.co.in', 'contact'),
  ('facebook', 'https://www.facebook.com/', 'social'),
  ('instagram', 'https://www.instagram.com/esteqo_care/', 'social'),
  ('youtube', 'https://www.youtube.com/@cosmetologistseemanandaest4431', 'social');

SET FOREIGN_KEY_CHECKS = 1;

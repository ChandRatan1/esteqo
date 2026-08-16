'use strict';

/**
 * Offer tracking on `contacts`.
 *
 * The ₹500-off badge and the one-time popup submit the same enquiry form, so
 * they land in the same table. These columns record which submissions claimed
 * the offer and how the visitor reached the form, so the promotion can be
 * measured without a separate table.
 */

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  await knex.schema.alterTable('contacts', (t) => {
    // Discount claimed, in INR. NULL for ordinary enquiries.
    t.decimal('offer_price', 10, 2).nullable();
    t.string('offer_code', 40).nullable();
    t.string('offer_label', 120).nullable();
    // 'badge'   — clicked the floating offer button
    // 'popup'   — the one-time popup after a minute of activity
    // 'page'    — the normal contact/appointment page form
    t.string('offer_source', 20).nullable();

    t.index(['offer_code'], 'idx_contacts_offer_code');
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  await knex.schema.alterTable('contacts', (t) => {
    t.dropIndex(['offer_code'], 'idx_contacts_offer_code');
    t.dropColumn('offer_price');
    t.dropColumn('offer_code');
    t.dropColumn('offer_label');
    t.dropColumn('offer_source');
  });
};

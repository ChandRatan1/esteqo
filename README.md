# ESTEQO

A React rebuild of esteqo.com — the ESTEQO clinic site for Sector 25, Noida.

```
d:\esteqo
├── react-app/    Vite + React front end (runs standalone, no backend needed)
├── backend-php/  PHP 8 + MySQL API — deployable on Hostinger shared hosting
├── uploads/      blog images written by the admin screen
└── Esteqo revised menu 2.pdf   source of the treatment menu
```

There is no shop, no cart and no customer login — the site publishes the
treatment menu, a blog, and enquiry forms.

---

## 1. Front end (`react-app`)

```bash
cd react-app
npm install
cp .env.example .env
npm run dev            # http://localhost:4142
npm run build          # production build into dist/
```

**It runs with no backend.** All content ships in `src/data`:

| File | Contents |
| --- | --- |
| `src/data/menu.js` | 16 departments, 117 treatments with durations and prices — from `Esteqo revised menu 2.pdf`, plus Brows (`brows.js`) and Bridal packages (`bridal.js`) |
| `src/data/site.js` | Contact details, blog posts, FAQs, team, testimonials, location and time dropdown options, enquiry recipients |

To change a price, a treatment or an opening time, edit those two files — no
database, no rebuild pipeline beyond `npm run build`.

### Pages

| Route | Page |
| --- | --- |
| `/` | Home — hero, departments, founder, signature treatments, values, testimonials, blog |
| `/services` | Full menu: sticky department jump bar, live search, every treatment with duration and price |
| `/services/:category` | One department — alternating text/image rows per treatment, then that department's FAQs |
| `/treatments/:service` | Single treatment: detail, pricing, wax/duration variants, related treatments, FAQs |
| `/about` | Clinic story, what we offer, team, visit us |
| `/values` | Principles plus the full FAQ, filterable by department |
| `/blog`, `/blog/:post` | Blog index with category filter and pagination; article pages |
| `/contact` | Clinic details, enquiry form, embedded map |
| `/appointment` | Booking request form (accepts `?service=<slug>` to preselect a treatment) |

### Enquiry forms

Both the contact and appointment forms collect:

- Name, email, mobile number
- **Service** — grouped dropdown listing every treatment with its price
- **Location** — Noida sectors, Greater Noida, Ghaziabad, New Delhi and nearby areas
- **Preferred date** — native calendar picker (or type `dd/mm/yyyy`)
- **Preferred time** — pick a slot, or switch to "Enter a time manually" for a free time input
- Preferred contact method, and a message

### Where enquiries go

Pressing **Send** posts the data straight from the browser to a hosted form
service, which emails it on. The visitor stays on the page and sees a success
message — **their mail app is never opened.**

- **Sends through:** `ratanchandbind4056@gmail.com`
- **Copied on every enquiry:** `neetukumarseo00@gmail.com`

Both are set in `src/data/site.js` (`enquirySender` / `enquiryCc`).

**Whatever email a visitor types goes only into the message body — it is never
used as a destination.** It is also set as `Reply-To`, so hitting reply in Gmail
answers the customer directly.

#### One-time activation (required)

The default transport is [FormSubmit](https://formsubmit.co) — no signup, no key
in the code. It needs one activation click before it will deliver:

1. Submit the form once (or just open the site and send a test enquiry).
2. FormSubmit emails an **"Activate Form"** link to
   `ratanchandbind4056@gmail.com`.
3. Click it once. Every later enquiry then arrives automatically, in both inboxes.

*This has already been triggered — the activation email is sitting in that inbox
now. Until it is clicked, the form shows an error instead of sending.*

After activating, FormSubmit issues a random alias for the address. Paste it into
`react-app/.env` so the inbox is not visible in the page source:

```
VITE_FORMSUBMIT_ID=your-alias
```

#### Alternative transport

To use [Web3Forms](https://web3forms.com) instead, create a free access key
against `ratanchandbind4056@gmail.com` and set it — it takes priority and needs
no activation step:

```
VITE_WEB3FORMS_KEY=your-access-key
```

Forms also carry a honeypot field and client-side validation.

### Design system

Layout scale, spacing rhythm and the pastel accent set follow the Silver Mirror
system — 90vw container capped at 1600px, 12-column grid, 40px gutter, a serif
display face over a geometric sans, uppercase letter-spaced CTAs. Tokens live in
`src/styles/tokens.css`; brand colours and all copy are ESTEQO's own.

Fonts are Playfair Display and Jost (free stand-ins for Freight Display Pro and
Averta). Swap the `<link>` in `index.html` and the two font variables in
`tokens.css` if you license the originals.

### Images

24 photographs taken from the live esteqo.com site cover 65 treatments; files
live in `react-app/public/services/` and the slug-to-file map is
`src/data/service-images.js`. Anything without an entry falls back to a tinted
placeholder in the department's accent colour, so nothing breaks.

To add one: drop the file into `public/services/` and add its slug to that map.

---

## 2. Backend (`backend-php`) — optional

PHP 8 + MySQL, so it runs on Hostinger shared hosting. The front end does not
require it; it adds the blog admin screen and stores enquiries in MySQL.

```bash
cd backend-php
cp config.example.php config.php     # database credentials + admin_key
php -S 127.0.0.1:4143 index.php
curl http://127.0.0.1:4143/api/health
```

Import `backend-php/esteqo.sql` (schema and content in one file) through
phpMyAdmin. It is safe to run on a database that already holds WordPress — no
table name collides with `wp_*` and nothing is dropped.

See [backend-php/README.md](backend-php/README.md) for the full deployment
guide, endpoint list and security notes.

### What needs it

| Feature | Needs the API? |
| --- | --- |
| Every page, 117 treatments, prices, Brows, Bridal | No — bundled data |
| Enquiry forms emailed to both inboxes | No — posts direct from the browser |
| ₹500 offer badge and popup, captcha, validation | No |
| SEO: robots, sitemap, meta, JSON-LD | No |
| Reading blog posts | No — falls back to the bundled posts |
| **Publishing posts at `/admin/blog`** | **Yes** |
| **Enquiries saved to MySQL** | **Yes** |

Point the front end at it with these in `react-app/.env`:

```
VITE_BLOG_API=http://localhost:4143
VITE_CONTACT_API=http://localhost:4143
```

## SEO

Everything an SEO team needs is in place, so nothing has to be retrofitted later.

| Asset | Where | Notes |
| --- | --- | --- |
| `robots.txt` | `react-app/public/robots.txt` | Allows everything, points at the sitemap |
| `sitemap.xml` | generated into `react-app/public/` | **146 URLs** — 7 static pages, 16 departments, 117 treatments, 6 posts |
| Titles / meta descriptions | `src/seo/Seo.jsx` per page | Unique on all 10 page types |
| Canonical tags | `src/seo/Seo.jsx` | Absolute, from `SITE_URL` |
| Open Graph + Twitter cards | `src/seo/Seo.jsx` | Title, description, image, locale `en_IN` |
| JSON-LD structured data | `src/seo/Seo.jsx` | See below |

**The sitemap regenerates itself.** `npm run build` runs
`scripts/generate-sitemap.mjs` first. Services come from the bundled data; blog
posts are fetched from the **live API**, because posts written at `/admin/blog`
live in MySQL and the bundled file only holds the seed content. Start the
backend before building, or the script prints a warning and falls back to the
seed posts. Run it alone with `npm run sitemap`.

**Structured data emitted:**

- `HealthAndBeautyBusiness` / `BeautySalon` — address, geo, phone, opening hours
  (Mon–Sat 9–8, Sun 10–3), areas served across Noida/Greater Noida/Ghaziabad/Delhi NCR — on every page
- `BreadcrumbList` — on every inner page
- `Service` + `Offer` (price in INR) — treatment pages
- `BlogPosting` — article pages
- `FAQPage` — department pages and `/values`

**Set your domain before launch.** Everything derives from one value:

```
# react-app/.env
VITE_SITE_URL=https://esteqo.com
```

Then `npm run sitemap` to rewrite `sitemap.xml` and the `Sitemap:` line in
`robots.txt`.

**One limitation to be aware of.** This is a client-rendered React app, so meta
tags are set in the browser rather than in the served HTML. Google renders
JavaScript and will index it correctly, but some crawlers and social-preview
scrapers (WhatsApp, older LinkedIn) only read the raw HTML. If link previews or
Bing coverage matter, the fix is pre-rendering at build time — worth doing
before a serious SEO push, and a contained change.

---

## Content notes

- **Treatment menu** — transcribed from `Esteqo revised menu 2.pdf`: 14
  departments, 99 treatments with durations and INR prices, including the
  multi-price rows (hot wax / Rica / peel-off, 20 vs 30 minute massages).
- **Contact details** — from the menu PDF: Shop No. 209, First Floor, Modi Mall,
  Sector 25 Noida 201301 · +91 8010135135 · Info.esteqo@gmail.com · @esteqo_care.
- **Testimonials** are sample copy with initials only. Replace them with genuine
  client reviews in `src/data/site.js` before launch.
- **Blog posts** are written for ESTEQO and reference the real menu and prices.
- The **layout and design language** follow the Silver Mirror reference; the
  wording throughout is ESTEQO's own rather than copied from that site.

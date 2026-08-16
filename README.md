# ESTEQO

A React rebuild of esteqo.com — the ESTEQO clinic site for Sector 25, Noida.

```
d:\esteqo
├── react-app/    Vite + React front end (runs standalone, no backend needed)
├── backend/      Express + MySQL 8 REST API, Knex migrations and seeds
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
npm run dev            # http://localhost:5173
npm run build          # production build into dist/
```

**It runs with no backend.** All content ships in `src/data`:

| File | Contents |
| --- | --- |
| `src/data/menu.js` | 14 departments, 99 treatments — names, descriptions, durations and prices, transcribed from `Esteqo revised menu 2.pdf` |
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

The catalogue has an `image` field but no photography yet, so cards and headers
render a tinted placeholder in the department's accent colour. Drop files into
`react-app/public/` and set `image: '/your-file.jpg'` on a category or service in
`src/data/menu.js` to start using real photos.

---

## 2. Backend (`backend`) — optional

A complete Express + MySQL 8 API. The front end does not require it; it exists
for when you want enquiries stored in a database and content editable outside the
code.

```bash
cd backend
npm install
cp .env.example .env    # set DB_USER / DB_PASSWORD
npm run db:create       # CREATE DATABASE esteqo
npm run migrate         # build the schema
npm run seed            # load content
npm start               # http://localhost:4000
```

`npm run db:reset` does all four in one go.

Prefer plain SQL? `sql/01_create_database.sql` then `sql/02_schema.sql` produce
the same schema without Node migrations.

### Tables

**Content:** `service_categories`, `services`, `blog_categories`, `blog_posts`,
`testimonials`, `faqs`, `team_members`, `site_settings`

**Submissions:** `contacts`, `appointments`, `contact_messages`,
`newsletter_subscribers`

#### `contacts` — every website form lands here

One row per submission, one column per field, so the data is queryable rather
than stuffed into a blob. `form_type` separates contact / appointment /
newsletter.

| Group | Columns |
| --- | --- |
| Who | `full_name`, `email`, `phone`, `location` |
| What | `service_slug`, `service_name`, `service_price`, `category_slug`, `preferred_date`, `preferred_time`, `contact_method` |
| Text | `subject`, `message` |
| Origin | `source_page`, `referrer`, `ip_address`, `user_agent` |
| Workflow | `reference`, `status` (new/read/responded/booked/closed), `is_spam`, `captcha_passed`, `email_sent`, `admin_notes` |
| Timestamps | `created_at`, `updated_at` |

Indexed on `form_type + status`, `created_at`, `email` and `phone`.

#### `blog_posts`

`id`, `slug`, `title`, `excerpt`, `content` (LONGTEXT), `image_url`,
`image_alt`, `cover_image`, `og_image`, `author`, `category_id`,
`read_minutes`, `tags` (JSON), `is_featured`, `status` (draft/published),
`published_at`, plus SEO columns `meta_title`, `meta_description`,
`focus_keyword`, `canonical_url`, `sitemap_priority`, `sitemap_changefreq`,
`noindex`, and timestamps.

`services` and `service_categories` carry the same SEO column set.

### Storing form submissions

Point the front end at the API and every submission is written to `contacts`
**as well as** emailed:

```
# react-app/.env
VITE_CONTACT_API=http://localhost:4000
```

The two destinations are independent — if the email service is down but the
database write succeeds, the enquiry is still captured (and vice versa). The
visitor only sees an error if both fail. Leave the variable unset and the site
just emails, exactly as before.

### Endpoints

```
GET  /api/health
GET  /api/settings
GET  /api/categories              GET /api/categories/:slug
GET  /api/services                GET /api/services/:slug
     ?category= &q= &featured= &grouped= &page= &limit=
GET  /api/blog/posts              GET /api/blog/posts/:slug
GET  /api/blog/categories
GET  /api/testimonials            GET /api/faqs?group=      GET /api/team
POST /api/appointments            POST /api/contact         POST /api/newsletter
```

Writes are validated with zod, rate-limited per IP, and return field-level
errors. Helmet, CORS allow-listing and gzip are on by default.

### Switching the front end onto it

```
# react-app/.env
VITE_USE_API=true
VITE_API_PROXY=http://localhost:4000
```

`src/api/client.js` then calls the API instead of the bundled data, using
identical response shapes — no page changes needed.

**Note:** the backend seed (`backend/seeds/data/`) still holds the catalogue
scraped from the live WordPress site, not the PDF menu. If you switch
`VITE_USE_API=true`, re-seed it from `react-app/src/data/menu.js` first so the two
sources agree.

---

## SEO

Everything an SEO team needs is in place, so nothing has to be retrofitted later.

| Asset | Where | Notes |
| --- | --- | --- |
| `robots.txt` | `react-app/public/robots.txt` | Allows everything, points at the sitemap |
| `sitemap.xml` | generated into `react-app/public/` | **135 URLs** — 7 static pages, 15 departments, 107 treatments, 6 posts |
| Titles / meta descriptions | `src/seo/Seo.jsx` per page | Unique on all 10 page types |
| Canonical tags | `src/seo/Seo.jsx` | Absolute, from `SITE_URL` |
| Open Graph + Twitter cards | `src/seo/Seo.jsx` | Title, description, image, locale `en_IN` |
| JSON-LD structured data | `src/seo/Seo.jsx` | See below |

**The sitemap regenerates itself.** `npm run build` runs
`scripts/generate-sitemap.mjs` first, and that script reads the same data files
the site renders from — so adding a treatment or a blog post puts it in the
sitemap automatically. Run it on its own with `npm run sitemap`.

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
VITE_SITE_URL=https://esteqo.co.in
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

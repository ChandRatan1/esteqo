# ESTEQO API (PHP)

The backend rewritten in **PHP 8 + MySQL (PDO)** so it runs on Hostinger shared
hosting, which cannot run Node.

Same routes and same JSON shapes as the previous Node/Express backend, so the
React app works against either one without a single code change.

---

## What runs where

```
public_html/
├── index.html          ← React build (contents of react-app/dist/)
├── assets/
├── .htaccess           ← SPA routing, HTTPS, caching
├── robots.txt
├── sitemap.xml
├── api/                ← THIS FOLDER
│   ├── index.php
│   ├── config.php      ← you create this (git-ignored)
│   ├── lib/
│   └── routes/
└── uploads/            ← blog images, chmod 755
```

Requirements: **PHP 8.0+**, PDO MySQL. `mbstring` is used if present but not
required — there is a fallback.

---

## Deploying

### 1. Database

hPanel → **Databases → MySQL Databases** → create a database and user. Note the
prefixed names Hostinger gives you (e.g. `u123456789_esteqo`).

hPanel → **phpMyAdmin** → select that database → **Import** → upload
`esteqo.sql`. That one file creates every table and loads the full site
content: the departments and treatments shown on the website, 6 blog posts,
32 FAQs, the team, testimonials and contact settings. **It is safe to run on
the database that already holds WordPress** — none of the table names collide
with `wp_*`, and nothing is dropped.

### 2. Upload the API

Upload this folder to `public_html/api/`.

Copy `config.example.php` to `config.php` and fill it in:

```php
'db' => [
    'host'     => 'localhost',
    'name'     => 'u123456789_esteqo',
    'user'     => 'u123456789_esteqo',
    'password' => 'the password you set',
],
'admin_key'    => 'a-long-random-string',
'cors_origins' => ['https://esteqo.com', 'https://www.esteqo.com'],
'upload_url'   => 'https://esteqo.com/uploads',
'site_url'     => 'https://esteqo.com',
```

`site_url` is the canonical domain `/api/sitemap.xml` builds URLs from — set it
to whatever `VITE_SITE_URL` is set to below.

Create `public_html/uploads/` and set it to **755** so images can be written.

### 3. Front end

```bash
cd react-app
npm run build
```

Set these in `react-app/.env` **before** building — Vite bakes them in:

```
VITE_SITE_URL=https://esteqo.com
VITE_BLOG_API=https://esteqo.com
VITE_CONTACT_API=https://esteqo.com
```

Upload the **contents** of `dist/` into `public_html/` (not the `dist` folder
itself). `.htaccess`, `robots.txt` and `sitemap.xml` are included in the build.

### 4. Check it

```
https://esteqo.com/api/health         → {"status":"ok","database":"connected"}
https://esteqo.com/api/sitemap.xml    → live sitemap, generated from the database
https://esteqo.com/admin/blog         → sign in with your admin_key
https://esteqo.com/admin/services     → sign in with your admin_key
```

---

---

## Deployment checklist

### Upload every time you deploy

| From | To on Hostinger | Notes |
| --- | --- | --- |
| contents of `react-app/dist/` | `public_html/` | not the `dist` folder itself |
| `backend-php/` (php files only) | `public_html/api/` | only when the API changed |
| `uploads/*.jpg` | `public_html/uploads/` | first deploy only; never delete this folder |

**Do not delete `public_html/uploads/` or `public_html/api/config.php` when
re-uploading.** Overwrite files, do not wipe folders — `uploads/` holds every
blog image and `config.php` holds your database password.

### The .sql files do NOT run on the server

Just one, `esteqo.sql`, and nothing on Hostinger executes it — it is imported
by hand, from your own computer, through **phpMyAdmin -> Import**. You never
have to upload it.

| File | What it does | When to import | Destructive? |
| --- | --- | --- | --- |
| `esteqo.sql` | Creates every table and loads the site content: departments, services, blog posts, FAQs, team, testimonials, settings. | On first setup, and again whenever the content in it should be pushed to the live database. | No |

It is written so it can be imported repeatedly: every CREATE is `IF NOT
EXISTS` and every content row is a `REPLACE`, which updates a row that already
exists and adds one that does not. Enquiries, appointments, gift card requests
and other visitor data are never touched — they are not in the file at all.

To refresh the file after editing content in `/admin`, dump the schema with
`mysqldump --no-data --skip-add-drop-table` and the content tables with
`mysqldump --no-create-info --replace --complete-insert`, then paste both into
`esteqo.sql` under its header.

Once they have run, the treatment menu no longer lives in a .sql file at all —
edit departments and services directly at `/admin/services` and the change is
live immediately, no re-import or redeploy needed.

If you do upload the .sql files with the API folder, `.htaccess` blocks them
from being downloaded — nobody can fetch `/api/esteqo.sql`.

### A normal deploy, after the first one

1. `cd react-app && npm run build`
2. Upload the contents of `dist/` over `public_html/`
3. Done. No database step, no SQL import.

## Endpoints

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/health` | — |
| GET | `/api/blog/posts?category=&featured=&page=&limit=` | — |
| GET | `/api/blog/posts/{slug}` | — |
| GET | `/api/blog/categories` | — |
| GET | `/api/categories` · `/api/categories/{slug}` | — |
| GET | `/api/services?category=&featured=&q=&grouped=` · `/api/services/{slug}` | — |
| GET | `/api/sitemap.xml` | — |
| GET | `/api/robots.txt` | — |
| POST | `/api/contacts` | — |
| GET | `/api/contacts` · `/api/contacts/stats` | admin key |
| GET | `/api/admin/blog/posts` | admin key |
| GET/PUT/DELETE | `/api/admin/blog/posts/{id}` | admin key |
| POST | `/api/admin/blog/posts` | admin key |
| POST | `/api/admin/blog/categories` | admin key |
| POST | `/api/admin/blog/upload` | admin key |
| GET/POST | `/api/admin/services` | admin key |
| GET/PUT/DELETE | `/api/admin/services/{id}` | admin key |
| GET/POST | `/api/admin/categories` | admin key |
| PUT/DELETE | `/api/admin/categories/{id}` | admin key |
| GET/PUT | `/api/admin/settings/{key}` (e.g. `robots_txt`) | admin key |

`/api/appointments`, `/api/contact` and `/api/newsletter` are accepted as
aliases of `/api/contacts`, so older front-end builds keep working.

Auth is the `x-admin-key` header, compared with `hash_equals` so the key cannot
be recovered by timing. Blank `admin_key` disables every admin route rather than
leaving them open.

---

## Security notes

- **Prepared statements everywhere**, with `ATTR_EMULATE_PREPARES => false`, so
  user input can never be parsed as SQL.
- **`config.php` is blocked** by `.htaccess` and git-ignored.
- **Offer amounts are server-side.** The browser sends only a code such as
  `WELCOME500`; the value is looked up in `routes/contacts.php`. Editing the
  request cannot change the discount.
- **Uploads are verified** with `getimagesizefromstring`, not by trusting the
  MIME type the client claims, and are capped at 8 MB.
- **Rate limiting** on public writes: 30 per IP per 15 minutes, tracked on the
  filesystem since shared hosting has no Redis.
- Serve over **HTTPS** — the admin key travels in a request header.

---

## Local development

```bash
cd backend-php
cp config.example.php config.php     # point at your local MySQL
php -S 127.0.0.1:4143 index.php
curl http://127.0.0.1:4143/api/health
```

That is the port `react-app/.env` already points at, so nothing else to change.

---

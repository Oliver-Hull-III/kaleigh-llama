# CLAUDE.md — Kaleigh Llama

Personal art portfolio site for Kaleigh Llama (paintings, pet portraits, art shows). React single-page app (Create React App), hosted on **Netlify** at `kaleighllama.com`. Gallery content is authored in a **Strapi 5** CMS on a Raspberry Pi and baked into the site **at build time** — the browser never talks to the Pi.

> **Sibling project:** the same Pi also hosts the CMS for **McCurdy Custom Carpentry** (`C:\Users\ohull\IdeaProjects\mccurdy-woodworking`, `cms.mccurdycustomcarpentry.com`). The two share pm2, one Cloudflare Tunnel, nginx and Certbot. McCurdy's setup is the more fully documented one and is the reference pattern — see [Shared Raspberry Pi](#shared-raspberry-pi-both-projects).

---

## Repo layout

```
/                       React site (deployed to Netlify)
├── scripts/fetch-content.js   Build-time sync from Strapi (runs as prebuild)
├── src/
│   ├── index.js        createRoot + BrowserRouter
│   ├── App.js          routes, loading overlay, image preloading
│   ├── Home.js, About.js, Art.js, Contact.js, AnimalCare.js
│   ├── Components/     Navbar.js, Footer.js
│   ├── css/            App.css, home.css, about.css, index.css, utilities.css
│   ├── utils/netlifyImage.js   Netlify Image CDN URL builder
│   └── data/galleries.json     GENERATED at build time (gitignored)
├── public/
│   ├── images/         static site images (committed)
│   │   ├── paint-ur-pup/, songs-for-bffs/   GENERATED gallery downloads (gitignored)
│   │   └── paintyourpup/, songs4bffs/       legacy committed copies — not used by the CMS pipeline
│   ├── icons/, manifest.json, _redirects, index.html
├── netlify.toml
└── cms/                Strapi 5 app — runs ONLY on the Pi
    └── src/api/gallery/
```

Branches: **`master` is the production branch** — Netlify builds only `master`, so pushing to it deploys (same as McCurdy). `dev` was the historical working branch and is GitHub's default branch; as of 2026-11-15 both point at the same commit. Remote: `github.com/Oliver-Hull-III/kaleigh-llama`. There's also a stale `gh-pages` branch and many dependabot branches.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19, plain JavaScript (no TypeScript), function components + hooks |
| Build | Create React App (`react-scripts` 5) → `build/` |
| Routing | react-router-dom 7 (`BrowserRouter`), react-router-hash-link for `/#art` |
| UI | react-bootstrap 2 + Bootstrap 5 CSS, react-icons |
| Galleries | react-photo-album (`ColumnsPhotoAlbum`) + yet-another-react-lightbox |
| Tests | Jest + Testing Library via `react-scripts test` (`App.test.js`) |
| CMS | Strapi 5.50.1, SQLite, local upload provider — on the Pi |
| Hosting | Netlify, Node **20** (`netlify.toml`) |

---

## Commands

| Command | Does |
|---|---|
| `npm start` | CRA dev server on :3000 (does **not** sync — run `fetch-content` first) |
| `npm run fetch-content` | Run `scripts/fetch-content.js` against `$STRAPI_URL` |
| `npm run build` | `prebuild` sync, then `react-scripts build` → `build/` (what Netlify runs) |
| `npm test` | Jest watch mode |

`STRAPI_URL` defaults to `http://localhost:1337` in the fetch script. To develop against production content:
```bash
STRAPI_URL=https://cms.kaleighllama.com npm run fetch-content
npm start
```
`src/data/galleries.json` is imported directly by `Art.js`, so **`npm start` fails to compile until a sync has run** (unlike McCurdy, there's no `import.meta.glob`-style empty fallback).

---

## Content pipeline

```
Strapi (Pi :1337) ──webhook──▶ Netlify build hook ──▶ npm run build
                                                       ├─ prebuild: fetch-content.js
                                                       │   └─ GET /api/galleries?populate=images&sort=displayOrder:asc
                                                       │       ├─ download each image → public/images/<gallery-slug>/<file>  (skipped if file already exists)
                                                       │       └─ write src/data/galleries.json
                                                       └─ react-scripts build → build/ → deploy
```

- Reads are **unauthenticated**: the Strapi Public role has `find`/`findOne` on `gallery`. The script sends no token.
- `Art.js` renders each gallery as a card with `ColumnsPhotoAlbum` (`columns` from the CMS) and a per-gallery lightbox. Image `src` goes through `netlifyImageUrl(src, { w })` → `/.netlify/images?url=…` (800px for the grid, 1920px for the lightbox).
- Failure behavior: Strapi non-2xx → exit 1 → build fails, previous deploy stays live. Empty result → writes `[]` and the Art section renders nothing.
- Downloads are **not cleaned between runs** — locally, renamed/deleted images linger in `public/images/<slug>/` (Netlify builds start clean, so production is fine).
- Do not hand-edit or commit `src/data/galleries.json` or the generated `public/images/<slug>/` dirs. When adding a gallery with a new slug, add its directory to `.gitignore`.

### Strapi content type: `gallery` (collection, draft & publish)

| field | type | output (`galleries.json`) |
|---|---|---|
| `name` | string | `name` (card header) |
| `slug` | uid | `slug`, and the image folder `public/images/<slug>/` |
| `description` | string | `description` (lead text; optional) |
| `displayOrder` | integer | sort order (API sort, ascending) |
| `columns` | integer | photo-album column count (default 2) |
| `images` | media, multiple (images/files/videos/audios) | `images: [{ src, width, height, alt }]` — `alt` from Strapi's `alternativeText` |

Published galleries as of 2026-11-15: **Paint Ur Pup** (16 images), **2o Dollar Art Show – Bend, OR** (18 images).

Changing the schema: edit `cms/src/api/gallery/content-types/gallery/schema.json` (or use the Content-Type Builder in a **local** `strapi develop`), commit, deploy to the Pi, and update `fetch-content.js` + `Art.js` to match.

---

## Routing

`/` Home · `/about` · `/art` · `/contact`. The navbar's "Art" link is a hash link to `/#art` on the home page. "Shop" links to Etsy; social links to Instagram/Facebook/YouTube.

`public/_redirects` contains `/about /` and `/contact /` — on Netlify these **redirect** those paths to the home page (default 301), and there is no `/* /index.html 200` SPA fallback, so a direct load of `/art` returns 404 (verified 2026-11-15). Check intent before changing.

---

## Conventions

- Plain JS function components; match the existing file-per-page structure at `src/` top level, shared pieces in `src/Components/`.
- Layout with react-bootstrap (`Container`, `Row`, `Col`, `Card`), styling via the CSS files in `src/css/` and Bootstrap utility classes. No Tailwind, no CSS-in-JS.
- CMS images always go through `netlifyImageUrl()`.
- Some decorative/background images are hot-linked from `u.cubeupload.com/kaleighllama/` and preloaded in `App.js` behind a loading overlay.

---

## The CMS (`cms/`)

Stock Strapi 5 TypeScript scaffold plus the `gallery` API. Config reads all secrets from env (`config/*.ts`); see `cms/.env.example`. Unlike McCurdy's CMS, this config does **not** use `PUBLIC_URL`, `IS_PROXIED`, `CORS_ALLOWED_ORIGINS` or `UPLOAD_SIZE_LIMIT` — media URLs come back relative (`/uploads/…`) and the fetch script prefixes `STRAPI_URL`.

`cms/` was added to git on 2026-11-15 by copying from the Pi. Gitignored: `node_modules`, `.env`, `.tmp/` (SQLite DB), `public/uploads/*`, `dist/`, `build/`, `.strapi/`, `types/generated/`, `license.txt`.

**The Pi does not run from this repo.** It runs a standalone copy at `/home/ohull/kaleigh-cms` (not a git clone). Until that's converted to a clone (like McCurdy's `~/mccurdy-woodworking`), changes made in `cms/` here must be copied to the Pi manually, and changes made on the Pi must be copied back here. Never copy `.env`, `.tmp/` or `public/uploads/` into the repo.

Deploying a CMS change today:
```bash
# copy changed files to ohull@192.168.0.31:~/kaleigh-cms/ (scp / WinSCP), then on the Pi:
cd ~/kaleigh-cms && npm ci && npm run build
pm2 restart kaleigh-cms
```

---

## Shared Raspberry Pi (both projects)

Both CMSes run on one Pi. Keep this section in sync with the copy in `mccurdy-woodworking/CLAUDE.md`.

| | Kaleigh Llama | McCurdy |
|---|---|---|
| Public CMS URL | `https://cms.kaleighllama.com` | `https://cms.mccurdycustomcarpentry.com` |
| Pi path | `/home/ohull/kaleigh-cms` (standalone copy, **not** a git clone) | `/home/ohull/mccurdy-woodworking/cms` (git clone) |
| Port | **1337** | **1338** |
| pm2 app | `kaleigh-cms` | `mccurdy-cms` |
| Strapi | 5.50.1 | 5.53.0 on Pi (its repo says 5.45.0 — drift) |
| Content types | `gallery` | `portfolio-piece`, `text-block` |
| API access | Public read | Public read |
| Netlify | env `STRAPI_URL` only; builds `master` only | env `STRAPI_URL` only; builds `master` only |
| Frontend | React (CRA), Netlify | Vue 3 + Vite, Netlify |
| DNS zone | Cloudflare (moved from Netlify DNS 2026-11-15; registrar Squarespace) | Cloudflare |

**Access:** `ssh ohull@192.168.0.31` (LAN). Key auth only — passwords are disabled; `C:\Users\ohull\.ssh\id_rsa` is authorized (for WinSCP, convert it to `.ppk` under Advanced → SSH → Authentication). `ohull` has passwordless sudo. Node 22 on the Pi.

**Process management — pm2.** `pm2-ohull.service` (from `pm2 startup`) resurrects the saved pm2 list on boot. Each app runs `npm run start` in its directory.
```bash
pm2 ls
pm2 logs kaleigh-cms --lines 50
pm2 restart kaleigh-cms
pm2 save            # after adding/removing apps, or they won't come back on reboot
```

**Cloudflare Tunnel:** one named tunnel `pi-tunnel` (ID `82953f34-d8a5-4d6a-855d-e4124f5f4eb4`) run by `cloudflared.service` (systemd). Config: `/etc/cloudflared/config.yml`:
```yaml
ingress:
  - hostname: cms.mccurdycustomcarpentry.com
    service: http://localhost:1338
  - hostname: cms.kaleighllama.com
    service: http://localhost:1337
  - service: http_status:404
```
- Validate before restarting: `cloudflared tunnel --config /etc/cloudflared/config.yml ingress validate`. Back up the file first. `sudo systemctl restart cloudflared` briefly drops **both** CMSes.
- DNS for a tunnel hostname is a **proxied (orange)** CNAME → `82953f34-d8a5-4d6a-855d-e4124f5f4eb4.cfargotunnel.com`, added **by hand** in the Cloudflare dashboard. The Pi's `~/.cloudflared/cert.pem` is scoped to the McCurdy zone, so `cloudflared tunnel route dns … cms.kaleighllama.com` creates the record in the **wrong zone**.
- `kaleighllama.com` apex + `www` are **DNS-only (grey)** CNAMEs → `kaleighllama.netlify.app`. Don't proxy Netlify records.
- Spectrum blocks inbound ports — never point DNS at the home IP (that was the cause of the 2026-11 outage: `cms` was an A record to the home IP on Netlify DNS).

**nginx / Certbot:** legacy. The old `kaleigh-cms` nginx site (TLS on :443 → :1337) is disabled — still in `/etc/nginx/sites-available/` if ever needed. Only the stock `default` site is enabled. Both Certbot renewal configs are disabled (`/etc/letsencrypt/renewal/*.conf.disabled`).

**Pitfalls**
- **Never run `strapi develop` in a Pi CMS dir while pm2 is running it.** It wipes `dist/` (including the built admin panel) *before* failing on the busy port, leaving production `/admin` returning 404. Recovery: `npm run build` in that dir, then `pm2 restart <app>`. Role permissions, API tokens and webhooks are DB settings — change them in the **production** admin (`https://cms.kaleighllama.com/admin`).
- **Back up** `~/kaleigh-cms/.tmp/data.db` and `~/kaleigh-cms/public/uploads/` — the DB exists only on the Pi.
- Restarting one Strapi doesn't affect the other; restarting `cloudflared`, rebooting, or running out of memory/disk affects both.

**Health check (from anywhere):**
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://cms.kaleighllama.com/_health             # 204
curl -s -o /dev/null -w "%{http_code}\n" https://cms.mccurdycustomcarpentry.com/_health   # 204
```

### Netlify config (dashboard, not in repo)
- Env: `STRAPI_URL=https://cms.kaleighllama.com` (required — the script's default is localhost). No token.
- Only the production branch (`master`) builds — no branch deploys or deploy previews.
- A Netlify build hook (`https://api.netlify.com/build_hooks/<id>`) is registered as a Strapi webhook, firing on content entry/media changes, so publishing in Strapi redeploys. McCurdy's site is wired the same way with its own hook. Treat hook URLs as secrets.

---

## Known issues / open work (as of 2026-11-15)

- Pi runs a non-git copy of the CMS; convert `~/kaleigh-cms` to a clone of this repo (or document a sync procedure) so the repo stays the source of truth.
- Confirm a Strapi publish triggers a rebuild post-DNS-cutover (webhook + hook are configured; end-to-end not yet tested).
- Consider switching GitHub's default branch from `dev` to `master` to match the production branch.
- `public/_redirects` 301s `/about` and `/contact` to `/`, and with no SPA fallback `https://kaleighllama.com/art` returns 404 — likely unintended.
- `package.json` still has a `gh-pages` `deploy`/`predeploy` script and `gh-pages` devDependency from before Netlify; `homepage` is set for GitHub Pages.
- `src/utils/netlifyImage.js` has a leftover `console.log(fit)`.
- Legacy committed images in `public/images/paintyourpup/` and `public/images/songs4bffs/` duplicate CMS content.
- `fetch-content.js` never clears old downloads.
- Optional: upgrade Strapi 5.50.1 → match McCurdy (5.53.0) via `npx @strapi/upgrade latest`.
- `cloudflared` on the Pi is outdated (2026.8.3).

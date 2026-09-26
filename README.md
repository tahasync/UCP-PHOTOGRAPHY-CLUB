# UCP Photography Club — 2026–27

Digital identity and hierarchy website for the **UCP Photography Club, 2026–27 tenure**.

Each leadership position has a **stable URL** (`/vice-president`, `/editing/director`, …) that a
printed UPC hierarchy card can point to via QR code. Scanning a card opens an editorial
digital identity page: name, position, tenure, portrait, approved links, and a route back
into the club hierarchy.

This site documents **only the current 2026–27 tenure**.

---

## 1. Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 18 + Vite 5 |
| Routing | React Router 6 (BrowserRouter, `basename` aware) |
| Motion | Framer Motion 11 (fast, ease-out, reduced-motion aware) |
| Styling | Plain CSS with custom properties (`src/styles`) — no UI kit |
| Theme | Light + dark, CSS-token based, toggle in the header, `prefers-color-scheme` aware |
| Fonts | Inter Variable, self-hosted through `@fontsource-variable/inter` |
| Build assets | `sharp` (logo, favicons, OG image, portrait compression) |
| Hosting | Static — Netlify or GitHub Pages (both configured) |

No backend, no database, no CMS.

---

## 1b. Light & dark theme

The site ships with two themes that share one layout and one set of semantic CSS tokens
(`--bg`, `--fg`, `--line`, `--surface`, `--muted`, `--inverse-*`).

* The header has a **sun / moon switch** (44×44px, keyboard accessible, `aria-pressed`).
* The choice is stored in `localStorage` under `upc-theme`; with no stored preference the
  operating system setting wins.
* `index.html` sets `data-theme` **before the first paint**, so there is no flash.
* The browser `<meta name="theme-color">` follows the active theme.
* Inverted sections (footer, manifesto band, mobile menu) keep their dark-panel identity in
  both themes via the `--inverse-*` tokens.

To tweak a theme, edit `:root` and the `[data-theme='dark']` block at the top of
`src/styles/globals.css` — no component changes needed.

---

## 2. Install & run

```bash
npm install        # install dependencies
npm run dev        # dev server on http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build on http://localhost:4173
```

Optional content tasks:

```bash
npm run assets   # regenerate logo / favicons / OG image / placeholder portraits
npm run images   # optimise official portraits (after the photoshoot)
```

Both are one-off maintenance commands and are not part of the build or deployment.

---

## 3. Project structure

```text
├── index.html                  # shell, boot state, base-aware asset links
├── vite.config.js              # base path handling + 404.html deep-link emitter
├── netlify.toml                # Netlify build, SPA redirects, cache headers
├── public/
│   ├── _redirects              # Netlify SPA fallback (/*  ->  /index.html  200)
│   ├── robots.txt
│   ├── site.webmanifest
│   └── images/
│       ├── branding/           # logo, favicons, apple-touch-icon, og-cover
│       └── members/            # portraits (placeholders until the shoot)
├── scripts/
│   ├── 404.template.html       # static-host deep-link fallback template (used by the build)
│   ├── generate-assets.mjs     # branding + placeholder generation
│   └── optimize-images.mjs     # portrait optimisation for the official shoot
└── src/
    ├── components/             # Navigation, MobileMenu, PersonHero, Portrait, Arrow, …
    ├── data/
    │   ├── site.js             # club name, tenure, branding paths, content status
    │   ├── members.js          # every person + QR slug (single source of truth)
    │   ├── hierarchy.js        # the five teams, order and placeholder intros
    │   ├── patrons.js          # Patrons Body (names pending)
    │   └── navigation.js       # primary nav items + active-state rules
    ├── lib/motion.js           # shared easing/duration/stagger tokens
    ├── pages/                  # Home, PresentBody, Patrons, Hierarchy, Department, Person, 404
    ├── styles/                 # fonts.css, globals.css, animations.css
    ├── App.jsx                 # route table generated from the data layer
    └── main.jsx                # router bootstrap + deep-link restore
```

**Rule of thumb:** never hard-code a person, position or team in a component. Everything
comes from `src/data`.

---

## 4. How to change members

All people live in [`src/data/members.js`](src/data/members.js). The object key **is** the URL slug.

```js
'vice-president': {
  slug: 'vice-president',
  path: '/vice-president',        // what the QR code points to
  name: 'Taha Naeem',
  position: 'Vice President',
  positionLines: ['Vice', 'President'], // how the position stacks visually
  body: 'President Body',
  group: 'present-body',          // 'present-body' | 'hierarchy' | 'patrons'
  departmentSlug: null,           // 'operations' | 'editing' | 'comms' | …
  order: 2,                       // position order inside the team
  ...portrait(2),                 // temporary portrait wiring
  bio: 'Approved introduction…',
  bioIsPlaceholder: false,        // set false once the copy is official
  role: '',                       // optional extra line, hidden when empty
  links: { instagram: '', linkedin: '', email: '', portfolio: '' }
}
```

* **Add a member** – add a record (key = slug) to `members.js`; the route, the department
  listing and the page are generated automatically.
* **Rename someone** – change `name` only. Never change `slug` after cards are printed.
* **Reorder positions** – change `order`.
* **Team intros & names** – `src/data/hierarchy.js` (`name`, `index`, `intro`, `introIsPlaceholder`).
  Display names may change freely; the `slug`/`route` must not. Current display names:

  | slug | Display name | Route |
  | --- | --- | --- |
  | `operations` | Operations | `/operations` |
  | `editing` | Editing | `/editing` |
  | `comms` | Communication And Publication | `/comms` |
  | `social-media` | Social Media | `/social-media` |
  | `creatives` | Graphics and Art And Craft | `/creatives` |

  The slug, the member `departmentSlug` and the URL stay `comms` / `creatives` so already
  printed QR codes keep working — only the visible team name changed.
* **Patrons** – `src/data/members.js` (`patrons/patron`, `patrons/co-patron`). Names stay
  `[Name to be added]` until the club supplies them.

After editing, rebuild (`npm run build`) and open any QR URL with `npm run preview` to confirm it
still resolves.

---

## 5. Replace the placeholder portraits

The official hierarchy photoshoot has not happened yet, so every record points at a neutral
placeholder (`public/images/members/member-placeholder-0*.jpg`).

When real portraits arrive:

1. Put the full-resolution originals (JPG/PNG) in `assets-source/members/`, named with the
   person, e.g. `taha-naeem.jpg`, `mateen-kashif.jpg`.
2. Run:

   ```bash
   npm run images
   ```

   The script writes `public/images/members/<slug>.jpg` (max 1600px wide) and a `.webp`
   version, then prints the exact data snippet to paste.
3. In `src/data/members.js`, replace `...portrait(n)` for that person with:

   ```js
   image: '/images/members/taha-naeem.jpg',
   imageWebp: '/images/members/taha-naeem.webp',
   imagePlaceholder: false,
   ```

   Setting `imagePlaceholder: false` also removes the "Placeholder portrait" caption.

**Photo guidance** (for the shoot): portrait orientation, 4:5 crop, consistent background and
lighting, high resolution, face positioned safely for responsive cropping. No filters are
applied by the site — the photographer's original work is preserved.

If an image file is ever missing, the page falls back to a neutral panel instead of a broken
image.

---

## 6. Replace the logo and favicons

The official logo (`Logo-Photography-Club-01.png`) is already integrated as a trimmed,
optimised PNG:

```text
public/images/branding/upc-logo.png
```

* Keep the same filename and nothing else needs to change.
* If the club supplies a **vector** logo later, drop it in as `upc-logo.svg` and point
  `BRANDING.logo` in `src/data/site.js` at it — components never hard-code the path.
* Regenerate every derived asset (favicons, Apple touch icon, PWA icons, OG image) with:

  ```bash
  npm run assets           # uses D:\UPC\Logo-Photography-Club-01.png
  LOGO_PATH=/path/to/logo.png npm run assets   # or point at another file
  ```

  Outputs: `favicon.svg`, `favicon-16/32/48.png`, `apple-touch-icon.png`, `icon-192/512.png`
  and `og-cover.jpg` (1200×630 social preview).

The header itself uses a typographic `UPC` wordmark plus a red rule, so the site never looks
broken if the logo asset changes shape.

---

## 7. Add social links

Links are per-member and optional in `src/data/members.js`:

```js
links: {
  instagram: 'https://www.instagram.com/…',
  linkedin: 'https://www.linkedin.com/in/…',
  email: 'name@example.com',      // rendered as mailto:name@example.com
  portfolio: 'https://…'
}
```

* Only non-empty values are rendered, in the order Instagram → LinkedIn → Portfolio → Email.
* External links open with `target="_blank" rel="noopener noreferrer"`.
* While a member has no links, the page shows a neutral note instead of an empty list.

Do not invent links — leave them empty until the club supplies approved accounts.

---

## 8. QR URLs — the printed card flow

```text
printed UPC card (name, position, 2026–27, QR)
        ↓
https://<domain>/vice-president
        ↓
digital identity page
        ↓
hierarchy / present body
```

The site never generates QR codes and never passes data through the code — the QR simply
opens a stable URL.

### Stable destinations (2026–27)

```text
/                        /president
/present-body            /vice-president
/patrons                 /operations/director
/hierarchy               /operations/deputy-director
/operations              /operations/assistant-director
/editing                 /editing/director · /editing/deputy-director · /editing/assistant-director
/comms                   /comms/director-publications · /comms/deputy-director-publications · /comms/director-communications
/social-media            /social-media/director · /social-media/deputy-director
/creatives               /creatives/director-graphics · /creatives/director-art-craft
/patrons/patron          /patrons/co-patron
```

**Rule:** once a card is printed, never change that URL. To update a person, edit
`src/data/members.js` — the URL stays the same.

### Testing before printing

```bash
npm run build
npm run preview   # then open each destination, e.g. http://localhost:4173/vice-president
```

Or open any URL directly in a browser and refresh — direct loads and hard refreshes must both
work (they are handled by `netlify.toml` / `public/_redirects` on Netlify and by
`dist/404.html` on GitHub Pages).

Every QR destination is also **pre-rendered as a real folder** at build time: the Vite plugin
in `vite.config.js` writes `dist/vice-president/index.html`, `dist/editing/director/index.html`,
and so on for all 25 non-root routes. That means a scanned QR link returns **HTTP 200** with no
404 request in the browser console — `dist/404.html` is then only a safety net for unknown URLs.

---

## 9. Deploy

### Netlify

1. New site → **Import from GitHub** → `tahasync/ucp-photography-club`.
2. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
3. Deploy. SPA fallback and cache headers come from `netlify.toml` + `public/_redirects`.
4. Add the custom domain in **Domain settings** when the club chooses one.

### GitHub Pages

1. Push the repository to `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. The included workflow (`.github/workflows/deploy.yml`) runs `npm run build:gh` (which sets
   `VITE_BASE=/ucp-photography-club/` from `.env.github`) and publishes `dist/`.
4. Site: `https://tahasync.github.io/ucp-photography-club/`

Local check of the GitHub Pages build (base path + deep links):

```bash
npm run build:gh    # then serve dist/ with any static server and open a QR URL
```

### Custom domain / repository rename

If the site moves to a root domain or the repo is renamed, update `VITE_BASE` in `.env.github`
(or add a `.env.production` with `VITE_BASE=/`). The router `basename`, asset URLs, manifest
and `404.html` all follow that single value.

---

## 10. Accessibility & performance

Implemented:

* semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, skip link
* keyboard support everywhere; visible red focus outlines; ~44px minimum touch targets
* mobile menu traps focus, closes on `Escape`, locks background scroll
* descriptive `alt` text; placeholders are announced as placeholders, never as real photos
* full `prefers-reduced-motion` support (CSS + Framer Motion)
* route-level code splitting, lazy portraits, WebP sources, `width`/`height` to avoid CLS
* single 48 kB Latin font subset, no blocking third-party requests

Targets: Lighthouse Performance 90+ and Accessibility 90+ on the QR profile pages.

---

## 11. Content still to be replaced (post-photoshoot checklist)

| Item | Where | Current state |
| --- | --- | --- |
| Portraits (17 records) | `public/images/members/` + `members.js` | neutral placeholders |
| Bios | `src/data/members.js` (`bio`, `bioIsPlaceholder`) | marked placeholder copy |
| Social / contact links | `src/data/members.js` (`links`) | empty (nothing invented) |
| Team introductions | `src/data/hierarchy.js` (`intro`, `introIsPlaceholder`) | marked placeholder copy |
| Patron & Co-Patron names | `src/data/members.js` (`patrons/*`) | `[Name to be added]` |
| Vector logo | `public/images/branding/` | optimised raster logo in use |
| Custom domain | hosting dashboard | not set |

`src/data/site.js` keeps a `CONTENT_STATUS` map for development reference; it is never
rendered in production.

---

## 12. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Deep link (e.g. `/vice-president`) shows a server 404 | SPA fallback missing: keep `netlify.toml` + `public/_redirects` (Netlify) or `dist/404.html` (GitHub Pages) and make sure Pages uses the GitHub Actions source |
| Blank page or 404s for assets on GitHub Pages | Base path mismatch — rebuild with `npm run build:gh`, or fix `VITE_BASE` |
| Portrait not showing | File name/path must match `image` in `members.js`; missing files fall back to a neutral panel |
| Old content after editing data | Rebuild (`npm run build`) — data is bundled at build time |
| A QR URL 404s after a data edit | A slug was renamed. Restore it, or keep the old path as a redirect |

---

## 13. Scope notes

Deliberately **not** included: previous-tenure archives, historical leadership, invented
members, invented social accounts, generated QR images, admin dashboards, or an on-screen
replica of the printed card. The design language (black/white/red editorial, large type,
photographic crops, restrained motion) follows the club's 2026–27 hierarchy document.



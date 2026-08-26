# KingsWord Chicago — WordPress Rebuild

Rebuild of [chicago.kingsword.org](https://chicago.kingsword.org/) as a WordPress
site, with the Believers Training LMS folded in as a section of it rather than a
separate application.

**Target stack:** WordPress + LearnDash. LearnDash was chosen because it covers
sequential modules, drip release by date, quizzes with a pass mark and retakes,
assignment submission and instructor review, certificates, and per-course
discussion natively — which is most of what the existing Next.js LMS does by
hand.

## Where this stands

| Piece | State |
|---|---|
| Homepage design | **Built and reviewed** — `site/index.html` |
| Content migration (7 modules / 77 lessons / 35 questions) | **Built and verified** — `content/bt-content-bundle.json` |
| WordPress block theme | **Built, renders correctly** — `theme/kingsword-chicago/` |
| About, Children Ministry, Contact pages | **Built and reviewed** — patterns + page templates |
| Site navigation | **Built** — absolute links, working from every page |
| Give | Not a page. The existing site links straight out to Square checkout, so the theme does the same. |
| LearnDash importer | Not started |
| Admissions + activation-link plugin | Not started |
| Believers Training section | Not started — the masthead links `/#training` on the homepage |

The theme has been PHP-syntax-checked and its patterns rendered and reviewed
via `tools/preview-theme.php`, but it has **not yet run inside WordPress**.

## Layout

```
theme/kingsword-chicago/  The WordPress block theme
  theme.json                Design tokens: palette, type scale, spacing, fonts
  style.css                 Theme header + the bespoke layout CSS
  functions.php             Asset loading, pattern category, image helper
  templates/                front-page, index, page, single
  parts/                    header, footer (thin wrappers around patterns)
  patterns/                 masthead, home-hero, home-sections, site-footer
  assets/                   Fonts, images, reveal.js + font licenses
site/
  index.src.html          Standalone homepage template, {{ASSET}} placeholders
  index.html              Built self-contained page (generated) — the design reference
  theme-preview.html      Theme patterns rendered outside WordPress (generated)
  assets/                 Fonts, photography, logo variants + font licenses
tools/
  build-content-bundle.mjs  Next.js curriculum -> WordPress-ready JSON
  build-site.mjs            Inlines fonts/images as data URIs -> index.html
  preview-theme.php         Renders theme patterns with WordPress stubbed out
  shoot.mjs                 CDP screenshots; forces color scheme and page height
content/
  bt-content-bundle.json    Generated content bundle (do not hand-edit)
```

## Commands

```bash
node tools/build-content-bundle.mjs          # regenerate the content bundle
node tools/build-site.mjs                    # rebuild the standalone homepage
php tools/preview-theme.php <page> > site/preview-<page>.html   # home | about | children | contact
node tools/shoot.mjs site/index.html out.png --scheme light --width 1440
```

`build-content-bundle.mjs` reads from `C:/Users/kC/seven-module-lms` by default;
override with `--src <path>`.

PHP is not on `PATH`; use the binary Local ships:
`~/AppData/Roaming/Local/lightning-services/php-8.2.29+0/bin/win64/php.exe`.
Local also bundles WP-CLI at
`~/AppData/Local/Programs/Local/resources/extraResources/bin/wp-cli/wp-cli.phar`.

## Installing the theme in Local

1. In the Local app, create a site (any name; PHP 8.2, MariaDB is fine).
2. Note its path, e.g. `C:\Users\kC\Local Sites\<site>\app\public`.
3. Copy or symlink `theme/kingsword-chicago` into that site's
   `wp-content/themes/` directory.
4. Activate **KingsWord Chicago** under Appearance → Themes.
5. Under Settings → Reading, set the homepage to a static page so
   `templates/front-page.html` is used.

## Design system

Derived from the sanctuary light in the hero photograph and the ministry's
existing navy-and-orange identity.

| Token | Value | Role |
|---|---|---|
| `--midnight` | `#0a0f24` | Ground for dark bands, header, footer |
| `--indigo` | `#16204a` | Raised dark surface |
| `--gold` | `#d9963a` | Primary accent (brand orange, deepened) |
| `--gold-lt` | `#f0c579` | Accent text on dark grounds |
| `--bone` / `--bg` | `#f5f2ec` | Light ground |
| `--slate` / `--text-soft` | `#3a4160` | Body text, indigo-biased |

**Type:** Fraunces (variable, `opsz` + `wght`) for display; Manrope (variable)
for body, labels and UI. Both OFL, both embedded as woff2 data URIs — licenses
are in `site/assets/`.

**Layout:** an asymmetric 7/5 editorial spine, alternating bone and midnight
bands. The service-times card deliberately overlaps the hero's bottom edge so
service times and address occupy the most prominent structural position on the
page — the current site's single worst failure is that neither appears above the
fold.

The standalone `site/index.html` defines both light and dark themes at token
level, because a published artifact renders in the viewer's own theme. **The
WordPress theme deliberately ships one committed light appearance** — a church
homepage is a front door, not a reading app, and a single look is far less for a
first-time WordPress maintainer to keep straight.

## What the redesign fixes

The current site's concrete problems, each addressed:

- Service times and address were nowhere above the fold → now the overlapping card.
- Brand colors fought each other (orange nav and hero vs. purple card buttons) → one gold accent throughout.
- Body copy sat unreadably over busy photography → scrims and a lifted hero image.
- "Upcoming Events" rendered a live **"No Post Found"** error → section dropped until there is a real events feed.
- No mobile navigation → `<details>`-based disclosure menu, keyboard-operable, no JS required.

## Known gaps

- Copy for the Believers Training section is written to the real curriculum but the CTAs are not yet wired to an application flow.
- The "Get Involved" cards all link to `#visit` as a placeholder.
- Giving links to a generic Square checkout URL, not the church's real one.
- No Children's Ministry, Summer Blast, or events pages yet.
- Photography is reused from the current site at moderate compression; originals should be re-exported for production.

## Local constraint

Local by Flywheel is installed, which supplies PHP 8.2.29 and WP-CLI 2.12.0 (see
paths above). There is still no PHP or `wp` on `PATH`, and no Composer or Docker.
No Local site exists yet — creating one is a GUI step.

`tools/preview-theme.php` exists because of this: it stubs the handful of
WordPress functions the patterns call, so theme output can be rendered and
reviewed without a running WordPress. It is a development aid only and
WordPress never loads it.

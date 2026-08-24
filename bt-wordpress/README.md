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
| LearnDash importer | Not started |
| Admissions + activation-link plugin | Not started |
| WordPress block theme | Not started |
| Remaining pages (About, Children, Give, Contact) | Not started |

## Layout

```
site/
  index.src.html          Homepage template, with {{ASSET}} placeholders
  index.html              Built, fully self-contained page (generated)
  assets/                 Fonts, photography, logo variants + font licenses
tools/
  build-content-bundle.mjs  Next.js curriculum -> WordPress-ready JSON
  build-site.mjs            Inlines fonts/images as data URIs -> index.html
  shoot.mjs                 CDP screenshots; forces color scheme and page height
content/
  bt-content-bundle.json    Generated content bundle (do not hand-edit)
```

## Commands

```bash
node tools/build-content-bundle.mjs          # regenerate the content bundle
node tools/build-site.mjs                    # rebuild the homepage
node tools/shoot.mjs site/index.html out.png --scheme light --width 1440
```

`build-content-bundle.mjs` reads from `C:/Users/kC/seven-module-lms` by default;
override with `--src <path>`.

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

Light and dark themes are both defined at token level and handle all three
viewer states (explicit light, explicit dark, and unset/system).

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

There is no PHP, WP-CLI, Composer, or Docker on this machine, so WordPress code
here can be authored but not executed. Install Local by Flywheel or XAMPP before
attempting to run the importer or plugins.

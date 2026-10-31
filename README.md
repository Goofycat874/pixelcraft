# Pixelcraft

Website for Pixelcraft, a website design & development studio: daylight glass theme, 3D scroll animations, packages, a WhatsApp booking form and three live concept sites.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

Deploys as a static site (Vercel, Netlify, GitHub Pages). On Vercel, import the repo and it picks up Vite automatically.

## Edit content

Everything editable lives in `src/data/site.js`:

- `brand`: name, logo path (`public/logo.png`), call number, WhatsApp number (`918910185902`), Instagram link (empty hides the icon)
- `services`: the "What we build" list. `from` names a pricing tab so each row shows a real starting price
- `devices`: the three concept sites in the hero and the Demos section. `src` is a first-screen capture, `full` a whole-page capture (`fullSize` is its pixel size); both live in `public/work/` and are screenshots of the demos. Labelled as concepts; swap in real client work once you have permission
- `work`: 3D carousel of real client sites (landscape, about 1200x900, in `public/work/`). Hidden while empty, so stock photos are never shown as client work
- `packs`, `addons`, `pricingNotes`: the price sheet. `bookingOptions` feeds the quote form
- `timelines`, `process`, `faqs`

Logo: `public/logo.png` (512px rounded tile of the Pixelcraft icon), `public/favicon.png` (64px) and `public/apple-touch-icon.png` (180px). Brand blue is `--color-accent` in `src/index.css`.

## Booking

The form validates name, phone and project type, then opens `wa.me/918910185902` with the booking details typed into the message. Clicking "Choose plan" on a package fills the project type and package in the form.

## Theme

Daylight glass: a fixed blue-to-peach sky (`Background.jsx`, `.sky` in `src/index.css`) with three slow, blurred lights, frosted white glass panels, navy ink (`--color-ink`) and logo blue (`--color-accent`) for actions. `--color-accent-text` is the darker blue for small text. The nav, intro and footer use `public/logo.png`, a rounded tile cut from the Pixelcraft logo.

## Style rules

Written down so the site does not drift back into generic AI-template territory:

- One colour: logo blue (`--color-accent`). The logo's orange only appears in the sky and on the Most popular tag. Everything else is navy ink, white or cool grey.
- Corners: 16px for panels and cards, 12px for buttons and inputs, 8px for small tags.
- No bento grids, no rows of identical cards, no stock photos, no screenshots dressed up as client work.
- Copy says what actually happens (written quote, preview link, you own it). No "elevate", "seamless", "grow online".
- One CTA label per intent: "Get a quote". Plan buttons say which plan ("Ask about Business").
- FAQ only answers what the rest of the page does not.

## Motion and 3D

All CSS 3D and Motion; there is no WebGL on the main site, so it loads fast on phones.

- Intro: the wordmark fills with sloshing liquid, then the screen wipes away.
- Hero: the three demo sites as a 3D stack of windows. They fly in after the intro, lean toward the pointer and drift apart in depth as the hero scrolls away. Each window opens its demo.
- Headlines: words flip up in 3D; sections fold into place as they enter.
- Word ring: a spinning 3D cylinder of commitments that speeds up and reverses with scroll speed.
- Demos (`#screens`): browser, tablet and phone frames turn in from the sides; inside each, a full-page capture of the demo scrolls up and down by itself.
- Pricing: the pack panel flips in on tab change.
- Process: a line draws itself across the four steps as you scroll, each dot fills as the line reaches it.
- Booking: a WhatsApp-style preview of the message builds as the form is filled in; the form flips over to the success card.
- Footer: wordmark letters stand up one by one.
- Work: coverflow carousel of real client sites (shown once projects are added).

## Concept demo sites

`demos/` holds three full one-page sites, built as extra pages of the same Vite build and linked from the device screens:

- `/demos/velorra/`: Velorra Motors, EV showroom. A real car photo drives in over a moving floor and drives off on scroll, spec numbers flip up and count, scrolling repaints the car, features pan past in a 3D coverflow. `car.webp` is the owner-supplied photo cut out of its white background, with the maker's bonnet badge painted out (the brand is made up). `paint.webp` masks only the bodywork, so the paint colours (a white screen layer plus a colour-blend layer) leave glass, wheels and lights alone.
- `/demos/monsoon/`: Monsoon Bean, café. Rain on a canvas, the headline falls in like raindrops, the photo irises open to fill the screen, a split-flap menu board, a latte poured and drawn on scroll, coffee bags that spin as they pass.
- `/demos/crumb/`: Crumb & Copper, bakery (mobile-first, with a bottom tab bar). Pink and red with Unbounded type. Words rise like dough, pastries pop onto a plate around a spinning "fresh out at 6" stamp, a marquee band, an oven where the tray rises and browns behind the glass before the door drops open, and a working tray: add pastries (they fly to the tray button), pick a pick-up time, and the ticket prints each line. Pastry art is Microsoft's Fluent Emoji 3D (MIT, via `@lobehub/fluent-emoji-3d`, copied into `demos/crumb/img/`; licence in `public/licenses.txt`).

`demos/shared/` has what all three share: the cross-page view transition, the "Concept by Pixelcraft" badge (links back to the device section) and the popup every booking button opens, which says the business is made up. The pages are `noindex`.
All three run with no pinning or animation under reduced motion.

To refresh the device screenshots after editing a demo, screenshot each page after its intro: Velorra at 1280x800 at 1.25x (1600x1000), Monsoon at 720x960 at 1.25x (900x1200), Crumb at 390x823 at 1.385x (540x1140), into `public/work/`. The `*-full.jpg` files are whole-page captures with reduced motion (badge and tab bar hidden): Velorra at 1280 wide scaled to 1000, Monsoon at 720 scaled to 560, Crumb at 390 (1.5x) scaled to 420; update `fullSize` in site.js to match.

`demos/monsoon/coffee.jpg` is from scikit-image's sample data: "No copyright restrictions. CC0 by the photographer (Rachel Michetti)". All other artwork in the demos is hand-drawn SVG and CSS.

## Deploy safety

Checked before release:

- Security headers in `vercel.json`: strict Content-Security-Policy (no third-party scripts, fonts or images), HSTS, nosniff, no framing, locked-down permissions. Tested in a browser with zero CSP violations.
- No cookies, analytics, trackers or third-party requests. Fonts are self-hosted. The booking form stores nothing and only opens WhatsApp.
- No WebGL or 3D library on the main site; all motion is CSS 3D and Motion, and switches off under reduced motion. Every section has an error boundary.
- axe (WCAG 2.1 AA) passes with no violations on the home, privacy, terms and 404 pages, and on all three demos (with motion, with reduced motion and with the popup open). `npm audit` is clean.
- `public/licenses.txt` is regenerated on every build with the licence text of all production dependencies (all permissive: MIT, ISC, BSD, Apache-2.0, OFL fonts).
- Privacy Policy (`/privacy.html`, DPDP Act 2023 and IT Rules) and Terms (`/terms.html`) are linked from the footer, pricing note and booking form.
- Social previews: set `SITE_URL` (e.g. `https://pixelcraft.in`) in Vercel env vars for a custom domain. Without it, the Vercel production URL is used.

### Before launch, the owner must

1. Prices are the real price sheet. Re-check them for typos.
2. Read `public/privacy.html` and `public/terms.html` and confirm they match how you actually work (advance, refunds, ownership, timelines). These are a sensible starting point, not legal advice.
3. Confirm the FAQ answers (timelines, payment) match your real process.
4. Check that the name "Pixelcraft" is free to use as a business name/trademark in India (search the IP India trademark registry).
5. If you register for GST, add your GSTIN and legal business name to the Terms page.

# Study Abroad Website 2 — Passage Education (demo)

Second landing page for the **Study Abroad & Visa/Immigration Consultancies** sector. Deliberately different from `study abroad web1` in theme, layout and motion.
Plain HTML/CSS/JS, no build step. Double-click `index.html`, or serve the folder (`npx serve .`).

## Design
- Palette: mist `#EAF0EC`, evergreen `#0F3D36`, stamp red `#C8323C`, passport lilac `#E3DEF7`
- Type: Young Serif (headlines, quotes, numbers) + Onest (body/UI)
- Shape: very round (36px media, 26px panels, pill nav, pill inputs and buttons)
- Wireframe: floating pill nav → full-bleed video hero with course-finder card → editorial statement with inline photo chips → horizontal-scroll countries → passport services → cost estimator → sticky timeline → postcard testimonials → red call-back panel → giant wordmark footer

## Animations (all respect reduced motion)
- Hero headline: words slide up out of a mask on load
- Countries: vertical scroll drives the card track sideways (desktop); native swipe on tablet/mobile
- Passport: six service stamps thump onto the pages when it scrolls into view
- Timeline: red progress line fills and step dots tick as you scroll
- Nav hides on scroll down, returns on scroll up; postcards straighten on hover; estimator bars animate on change

## Replace before going live
- Brand, logo, phone, office addresses, "since 2015"
- Postcard testimonials (sample text — use real, consented ones)
- Tuition ranges in the finder/country cards and the cost table in `js/main.js` (`COST`) are indicative — re-check yearly
- Call-back form only logs to the console — wire it to the client's CRM in `js/main.js`

## Media
Loaded from Wikimedia Commons (free licences, attribution required). See `CREDITS.md`; keep the footer credit line.

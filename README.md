# Penny Appeal Caribbean

Home page for Penny Appeal Caribbean, built with Next.js 16 (App Router), GSAP 3.12 and Lenis.

## Run it

```bash
npm install
npm run dev -- -p 3010   # http://localhost:3010 (3000–3003 are often taken on this machine)
npm run build            # production build
npm run lint
```

## Where things live

| Path | What it holds |
|---|---|
| `lib/content.ts` | **All copy and data**: slides, programmes, causes, totals, photos, map pins. Edit text here. |
| `components/sections.tsx` | One component per page section (Header, Hero, About, Causes, Impact, TakeAction, Zakat…). |
| `components/gift.tsx` | The "Choose your gift" form as React state, shared by the hero dock and the side drawer. `<GiveButton give="feed">` anywhere opens it preset to that programme. |
| `lib/effects.ts` | Imperative motion: smooth scroll, hero carousel, scroll reveals, drifting tickers, curved marquee, counters. Returns a full cleanup. |
| `app/globals.css` | The single stylesheet. Colour tokens are on `:root`. |
| `reference/static-version.html` | The original one-file version, kept for comparison. |

## Before going live

- **Checkout:** `submit()` in `components/gift.tsx` shows a confirmation toast. Connect the payment provider there.
- **Photos:** loaded from `https://pennyappeal-caribbean.netlify.app/images/`. Copy them into `public/images/`, change `IMG` in `lib/content.ts` to `/images/`, and switch the `<img>` tags to `next/image`.
- **Placeholders:** footer contact and charity number, plus the `#` links for Financial Reports, Scholars, Volunteer, News, Privacy and Terms.
- **Totals:** `RAISED_TOTAL`, `TOTALS` and `RAISED_UPDATED` in `lib/content.ts`.

## Notes for editing motion

- Don't let GSAP tween `transform` on an element that also has a CSS `transition` on transform. They fight, and the element freezes part-way.
- Map pins are placed by latitude and longitude. The projection is fitted to the map artwork (see `PINS` in `lib/content.ts`).

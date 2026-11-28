# Public site: visual diff against the AngularJS site

Compared: `e2e/baseline-screenshots/public` (old site, Phase 1) with `e2e/visual-screenshots/public` (new site, Vite dev server on the same data). Both sets: 8 pages × 4 locales × desktop (1440) / mobile (375) = 64 screenshots each. Both are gitignored (taken from a copy of the production data); regenerate with:

```
docker compose up -d mongo web && docker compose --profile baseline up -d baseline
VITE_PROXY_TARGET=http://localhost:3000 pnpm exec vite --port 5175
pnpm exec playwright test -c playwright.baseline.config.ts   # old site (needs E2E_ADMIN_TOKEN only for the admin part)
pnpm exec playwright test -c playwright.visual.config.ts     # new site
node e2e/visual/compare.ts [filter]                          # old | new | diff images in e2e/visual-screenshots/diff
```

## Result

Layout is pixel-identical where it can be measured: element boxes (hero, breadcrumb, grid items, figures, form, contact blurbs, footer, product details, navigation) have the same x/y/width/height in old and new on contacts, collections, product and the footer of every page (checked with `getBoundingClientRect` on both sites with images blocked). `compare.ts` reports a height difference of 1px or less and 0.2–2.5% differing pixels (text and icons only) for collections, accessories, contacts and mobile home in all four locales.

## Deliberate differences

| Area | Old | New | Why |
|---|---|---|---|
| Text | Lato was requested from Google Fonts, which did not load in the baseline run, so everything rendered in Arial | Lato 300/400 self-hosted (Fontsource) | Plan: self-hosted fonts. This is the main source of "differing pixels" and of line wraps (e.g. the mobile breadcrumb fits on 2 lines instead of 3). |
| Icons | Themify icon font (`ti-*`) | Iconify: simple-icons for Telegram, Instagram, VK, Pinterest, Facebook, Skype, Viber; Lucide for e-mail, menu, arrows, chevrons. The `css_class` stored in the database is mapped in `src/app-next/icons.ts`; unknown classes get a link icon | Plan: Lucide/Iconify closest equivalents. Icons are 30px (social) / 40px (contacts) like before. |
| Product navigation arrows | Glyphicon triangles | CSS triangles in the same colour and size | Glyphicons are gone with Bootstrap. |
| Slider | Owl Carousel; arrows and dots were positioned inside a stage as tall as the tallest slide, which left ~400px of blank space under shorter slides on the home page (visible in the baseline) | Embla: slides, text overlay, link button, arrows (hidden below 769px), 15px dots, loop, 5s autoplay only when the slider has `autoplay`, pause on hover. Dots overlay the bottom edge of the slides; no blank gap | Gap was a layout side effect, not a design. |
| Lightbox | lightGallery with its fullscreen plugin | PhotoSwipe 5 (zoom, swipe, keyboard, counter; no fullscreen button) | Plan. |
| Product gallery | Pictures inside `<a>` links, floated `<img>` | Floated `<a>` boxes with the same sizes and breakpoints; the cover first, the others in order | Same look; makes the links clickable/focusable. |
| Toast on contact form | toastr (green box, top right) | Own toast (same colour/position), also shows an error toast when sending fails | Old site showed nothing on failure. |
| Contact form e-mail check | Lowercase-only pattern `^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$` (rejected `Anna@Example.com`, `x@my-site.com`) | `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` | The old pattern rejected valid addresses. |
| Mobile menu | Chevron glyph | Chevron icon; the item of the current page is highlighted | — |
| Main menu sub items | Never highlighted | Same (not highlighted) | Kept on purpose. |
| Unpublished collection / product | Reachable by URL (the API returns them) | Shown as "not found", excluded from previous/next | They are not part of the site. |
| Unknown collection / product | Redirect to home (route `otherwise`) or an empty page | "Page not found" content with the page title `<Page not found> \| <site name>`; Rails returns the 404 status later | Plan 3.4. |
| Language | Browser language picked when nothing was saved; language change reloaded the page 1s later | URL locale → saved choice (also the old `NG_TRANSLATE_LANG_KEY` cookie) → `ua`; the selector moves to the same page with a locale prefix (`/en/collections`); internal links keep the prefix | Plan 3.5. |
| Document title | `<title>` never changed | `<site name>` on home, `<page> \| <site name>` elsewhere, updated on every navigation and language change | Plan 3.4; same format Rails renders. |
| Focus / semantics | Anchors without labels, no `aria-*` | Labelled buttons and links (menu, language, slider arrows/dots, social links), `aria-current` on the breadcrumb | Accessibility. |

## Not comparable (baseline noise)

The pictures come from a third-party host that answers 503 intermittently. In the baseline the same page has different heights per locale (e.g. `collection-accessories` desktop: 1926 / 2283 / 2707 / 3209 px) because failed pictures collapse. Pages that depend on many pictures (`collection-*`, `product-accessory`, desktop `home` below the slider) therefore show large height differences (+300…+2600px) and 30–65% differing pixels that say nothing about the layout. Compare them with the pictures stubbed on both sides (`page.route`) if a picture-level check is needed.

The product "Miroslava's gloves" that the baseline uses for `product-dress` has no pictures, so neither site shows a gallery in that screenshot; the gallery was checked separately (e2e: lightbox opens/closes; component tests; manual screenshots with stubbed pictures).

## Open

- Hover/active states of the Themify glyph icons (colour on hover) are not reproduced for the new icons.
- Lighthouse before/after and the Facebook link-preview check need the deployed site (see plan, Phase 3).

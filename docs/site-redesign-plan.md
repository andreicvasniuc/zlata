# Zlata public website redesign plan

Date: 2026-11-01  
Status: Proposed design and implementation plan; not an authorization to deploy.

## 1. Objective and scope

Modernize the public website into an understated, editorial bridal catalog with a clear journey:

**Discover a dress -> understand its details -> save or share it -> enquire about it.**

Keep the existing Zlata logo, authorized product photography, multilingual support, useful gallery interactions and indexed URLs. Implement incrementally in the existing Vue 3 / TypeScript frontend and Rails API; no replatforming is required.

In scope:

- Public homepage, navigation, collection indexes, collection grids, product pages, accessories, contact page, footer and error states.
- Desktop and mobile usability, accessibility, image reliability and performance.
- Search, filters, saved dresses and contextual enquiries, introduced in stages.
- Content and API changes only where needed to support approved public features.

Out of scope unless separately approved:

- Shopping cart, checkout, payments, customer accounts or a mobile application.
- A full admin redesign.
- Appointment booking, store locators or wholesale workflows without a confirmed business requirement.
- Production deployment before review and explicit confirmation.

## 2. Evidence from the current site

The review inspected `http://localhost:8080/en`, using desktop 1440 x 1000 and mobile 390 x 844 viewports. It covered the homepage, three index/contact pages, all 12 collection pages and all 255 English product pages: 271 public pages corresponding to the sitemap inventory.

Navigation, breadcrumbs, previous/next product browsing, fullscreen gallery, language switching, contact-form validation and the 404 page were also inspected. Other languages were sampled through the product language switch, not exhaustively audited. No enquiries were submitted.

| Observation | Consequence |
|---|---|
| Desktop card names are hidden until hover. | Visitors cannot identify dresses and collections at a glance. |
| Homepage slides prominently feature years 2019-2021. | The offering appears archival, regardless of actual availability. |
| All 255 English product pages lack a visible price and enquiry action. | Visitors have no clear next step or pricing expectation. |
| 253 of 255 English products lack a description. | Photography alone must answer fit, design and ordering questions. |
| Some images show imgbb service-unavailable placeholders or fail to load. | Broken photography undermines the catalog and visual consistency. |
| Queen collection's "Miroslava's gloves" has no gallery or cover image. | The item cannot be meaningfully evaluated. |
| Mobile homepage is approximately 11,700 px long, displaying 22 featured dresses in one column. | Discovery requires excessive scrolling. |
| Arina's mobile information block began more than 2,100 px down, before all gallery images finished loading. | Essential information is buried below stacked photographs. |
| Mobile menu remains open after selecting a destination; Escape did not close it. | Navigation obscures the destination and lacks expected dismissal behavior. |
| Browser Back resets a collection from 1,000 px scroll to the top. | Visitors lose their browsing position. |
| Email and phone contact values are plain text; Skype is still promoted. | Contacting Zlata requires unnecessary effort and includes an obsolete channel. |
| Product-title color `#99a098` has approximately 2.68:1 contrast on white. | It falls below the 3:1 minimum for large text. |
| Ukrainian HTML language metadata uses `ua`. | Use the language code `uk`, while preserving legacy `/ua` URLs. |

These are local-site observations, not production performance measurements or a formal accessibility certification. Recheck content and image availability before implementation.

## 3. Decisions required before behavior changes

1. **Audience and purchase journey:** clarify direct enquiries versus purchases through retailers. Default design direction is an enquiry-led catalog, not ecommerce.
2. **Availability and archives:** identify current collections and which older dresses remain available. Do not infer availability from a collection year.
3. **Pricing:** retain the existing optional "from" price format and currency rules. Approve whether unpriced products should show a localized "Price on request" label rather than remain blank.
4. **Homepage pricing:** the existing [product price plan](./product-price-plan.md) excludes Top products from price display. The visual concepts show request labels on featured cards; approve this scope change separately.
5. **Contact channels:** confirm which phone and messaging channels are actively monitored, and whether physical appointments are offered.
6. **Product content:** assign ownership for descriptions, size guidance, ordering information and photo verification in all four languages.
7. **Image storage:** choose a reliable hosting strategy and approve any migration of existing image URLs.

Do not invent prices, stock status, lead times, customer reviews, addresses, craftsmanship claims or booking services to fill the new layout.

## 4. Visual direction and concept references

Direction: **quiet bridal luxury with practical catalog usability**.

- Warm ivory surfaces, charcoal text and restrained champagne/taupe accents.
- High-contrast charcoal primary buttons; pale accents are decorative, not substitutes for readable controls.
- Elegant serif headings paired with readable sans-serif navigation and body text.
- Reuse the installed Crimson Text and Lato fonts where suitable; verify required Ukrainian, Russian and Romanian glyphs and load the appropriate subsets.
- Preserve the existing logo rather than replacing the brand identity.
- Consistent portrait product frames that preserve the full dress; use full-length photography as the initial product image where available.
- Minimal shadows, subtle borders and purposeful whitespace.
- No aggressive hover zoom, essential hover-only content or distracting animation.

Four PNG concepts supplied with the design review establish the intended direction:

| Concept | Design intent |
|---|---|
| Homepage | Split editorial hero, clear discovery actions, category shortcuts and a small featured selection. |
| Dress catalog | Always-visible names, consistent photography, filters, search and save controls. |
| Product page | Full-length main photo, compact thumbnails, readable details, color/size options and enquiry action. |
| Mobile product | Compact gallery, details immediately afterward and a persistent enquiry action. |

The images contain sample copy and proposed controls, not implemented features or confirmed business content. Use them as visual references alongside the requirements below, not as proof of availability or pricing.

## 5. Navigation and information architecture

### Desktop

Proposed primary navigation:

**Logo | Wedding dresses | Collections | Evening dresses | Accessories | About | Contact**

Utility controls: **Search | Saved dresses | Language**.

- "Wedding dresses" browses across published bridal collections; "Collections" remains the editorial collection index.
- Give evening dresses and accessories recognizable destinations instead of hiding everything under "Catalog".
- Enable dropdowns through click and keyboard interaction, not hover alone.
- Use visible language names, not flags alone; preserve the current destination when switching languages.
- Keep the header compact and readable when scrolling, with a clear active state.
- Add About only when approved content and the full route/SEO support are ready.

### Mobile

- Compact header with Menu, logo and search.
- Drawer with visible labels, expandable groups, an explicit close control and language names.
- Close on destination selection, Escape and outside/backdrop interaction.
- Move focus into the open drawer, prevent focus escaping behind it, restore focus on dismissal and lock background scrolling.
- Distinguish a parent navigation link from its submenu expansion control.
- Prefer approximately 44-48 px touch targets.
- Do not add a crowded bottom navigation bar without a demonstrated need.

Keep breadcrumbs and previous/next product navigation. Restore collection scroll position and filter state when returning from a product.

## 6. Page-by-page requirements

### Homepage

1. One strong editorial hero photograph, concise brand statement and primary "Explore wedding dresses" action.
2. Secondary collection discovery or contact action.
3. Category shortcuts for wedding dresses, evening dresses and accessories.
4. Current collection feature, selected from verified published content.
5. Six to eight featured dresses with always-visible names and "View all dresses".
6. Concise brand story and verified customer photography/testimonials, only if suitable content exists.
7. Clear enquiry invitation and useful footer.

Prefer a static hero. If a carousel is retained, provide a pause control, accessible navigation and reduced-motion behavior. Do not add autoplay video.

### Collection indexes

- Always-visible collection names, short introductions and accurate published-item counts.
- Clearly distinguish current collections from archives without deleting historical names or indexed URLs.
- Use consistent editorial cards; avoid repeated large blurred banners above every page.
- State availability separately from collection age.

### Collection grids and all-dress browsing

- Persistent product names and approved price/request labels below photographs.
- Consistent portrait frames, stable dimensions and graceful image-loading states.
- Search by model name; result counts, sorting and clear filter-reset controls.
- Begin with collection, size and color filters using existing catalog data.
- Add silhouette, neckline and fabric only after those attributes are genuinely populated.
- Use a compact two-column mobile grid where legible, with an optional larger-photo view.
- Preserve filters, sorting and scroll position across product visits and browser Back.
- Show useful empty/error states with recovery actions.

Choose client-side versus server-side search/filtering after measuring API payloads and interaction performance. Do not download every full product gallery just to build a browsing index; add a lightweight published-only projection if needed.

### Product pages

- Desktop: main gallery beside a focused information panel.
- Mobile: one main photo -> name and essential details -> enquiry controls -> further information.
- Main image shows the full dress where a suitable image exists. Keep fullscreen zoom and a controlled swipe/thumbnail gallery for alternate views.
- Include name, collection, approved pricing display, a meaningful description, colors, sizes and verified ordering information.
- Provide a size guide; avoid presenting catalog sizes as live stock guarantees.
- Primary action: "Enquire about this dress".
- Carry the dress name/link and selected size/color into the enquiry. Preserve user-entered text and validate product context.
- Add lightweight save/share controls and relevant related dresses/accessories.
- On mobile, keep the enquiry action available without covering content, focus targets or device safe areas.
- Add appointment booking only if the business actually offers it.

Reuse the current price formatter and `usePriceLabel`; missing prices in the audit are not evidence that the implemented price feature is broken. Do not publish numeric SEO offers for "Price on request".

### Accessories

- Replace inconsistent English labels such as "ACCESSOIRES" versus "ALL ACCESSORIES".
- Group by real accessory types where that data exists.
- Clearly identify accessories appearing inside dress collections.
- Apply the same useful descriptions, gallery, pricing policy and enquiry journey.

### Contact page

- Make email, telephone and supported messaging channels clickable.
- Remove or replace obsolete Skype information; [Skype retired on 2025-05-05](https://support.microsoft.com/en-us/skype/skype-is-retiring-in-may-2025-what-you-need-to-know).
- Use visible labels, correct email/telephone input types and appropriate autocomplete.
- Clearly identify required fields and associate validation errors with the relevant inputs.
- Provide understandable sending, success and failure states; preserve content on failure.
- Remove the prominent Reset button to reduce accidental message deletion.
- Explain validation problems rather than relying solely on a disabled Send button.
- Prefill relevant dress context for product enquiries.
- Include response expectations, location or opening information only when verified.
- Link appropriate privacy information; do not place personal contact details in URL query strings.

### Footer and error pages

- Include important navigation, contact details, verified size/ordering guidance, privacy information and relevant social links.
- Keep correct HTTP 404 behavior and add a prominent "Browse dresses" recovery action.
- Distinguish unavailable content from temporary API/image failures; provide retry or useful recovery where appropriate.

## 7. Engineering integration

| Area | Existing implementation surfaces |
|---|---|
| Design tokens and public layout | [site.css](../client/src/app/styles/site.css), [AppLayout.vue](../client/src/app/layouts/AppLayout.vue), [PageLayout.vue](../client/src/app/components/PageLayout.vue) |
| Header and menus | [AppHeader.vue](../client/src/app/components/AppHeader.vue), [MainMenu.vue](../client/src/app/components/MainMenu.vue), [MobileMenu.vue](../client/src/app/components/MobileMenu.vue), [LanguageSelector.vue](../client/src/app/components/LanguageSelector.vue) |
| Homepage | [HomeView.vue](../client/src/app/views/HomeView.vue), [HeroSlider.vue](../client/src/app/components/HeroSlider.vue), [SlideCarousel.vue](../client/src/app/components/SlideCarousel.vue), [TopProducts.vue](../client/src/app/components/TopProducts.vue) |
| Collection browsing | [CollectionListView.vue](../client/src/app/views/CollectionListView.vue), [CollectionView.vue](../client/src/app/views/CollectionView.vue), [ItemGrid.vue](../client/src/app/components/ItemGrid.vue) |
| Product experience | [ProductView.vue](../client/src/app/views/ProductView.vue), [ProductDetails.vue](../client/src/app/components/ProductDetails.vue), [ProductGallery.vue](../client/src/app/components/ProductGallery.vue), [ProductNavigation.vue](../client/src/app/components/ProductNavigation.vue) |
| Pricing | [usePriceLabel.ts](../client/src/app/composables/usePriceLabel.ts), [price.ts](../client/src/shared/format/price.ts), [product price plan](./product-price-plan.md) |
| Contact and footer | [ContactsView.vue](../client/src/app/views/ContactsView.vue), [ContactForm.vue](../client/src/app/components/ContactForm.vue), [ContactGroups.vue](../client/src/app/components/ContactGroups.vue), [AppFooter.vue](../client/src/app/components/AppFooter.vue) |
| Routing, data and localization | [router.ts](../client/src/app/router.ts), [public API resources](../client/src/shared/api/resources/public/index.ts), shared types and locale files |
| Server-rendered SEO and shells | [PageMeta](../app/services/page_meta.rb), [SitemapsController](../app/controllers/sitemaps_controller.rb), Rails routes, HTML shells and [ViteHelper](../app/helpers/vite_helper.rb) |

Integration rules:

- Keep public styling isolated from the PrimeVue admin.
- Preserve public API compatibility and `_id`/`$oid` normalization through the existing shared normalizer.
- Respect embedded product lookup under collections and published-only public visibility.
- Put approved new catalog fields in the shared model concern and admin strong parameters; cover admin editing and data import/export where relevant.
- Wire any new public destination through Vue routing, Rails shell/route recognition, page metadata and tests. Place explicit frontend routes before dynamic collection routes.
- Add indexable destinations to the sitemap. Keep private saved-dress state out of indexed content; avoid duplicate indexed filter URLs.
- Preserve existing localized URLs, canonical behavior and hreflang. Correct Ukrainian language metadata without renaming `/ua`.
- Keep contact payloads compatible unless an additive API change is explicitly needed.
- Saved dresses should not require an account. Persist only minimal product references locally, not enquiry/contact personal data; handle storage errors visibly and remove stale unpublished references.
- Migrate photography deliberately, preserving product identity and import/export integrity. Do not silently substitute unrelated images.

## 8. Delivery phases and dependencies

| Phase | Deliverables | Prerequisites |
|---|---|---|
| 0. Content and decisions | Confirm audience, pricing policy, current/archive status, supported contacts, content owners and image-hosting strategy. Audit and repair missing photographs. | None; content work can proceed alongside design refinement. |
| 1. Foundation and critical UX | Public design tokens, readable type/contrast, compact header, usable desktop/mobile menus, visible card labels, reliable image states and clickable contacts. | Approved visual direction and relevant phase 0 decisions. |
| 2. Product-to-enquiry journey | Controlled galleries, meaningful product information, approved pricing/request labels, size/color context, contextual enquiry and mobile persistent action. | Foundation; verified product content and enquiry/pricing decisions. |
| 3. Page refresh | Homepage, collection indexes, accessories organization, contact page, footer and recovery pages. Limit featured content and remove redundant banners. | Foundation and approved content. This can run alongside phase 2. |
| 4. Discovery enhancements | Cross-collection browsing, search, filters, sorting, saved dresses, related items and browsing-state restoration. | Suitable catalog data, route/API wiring and performance measurements. |
| 5. Release verification | Multilingual, accessibility, responsive and performance checks; committed frontend build; reviewed rollout and rollback. | All features selected for the release are complete. |

Deliver small coherent changes rather than a big-bang rewrite. Agree which phases belong in the first release; advanced discovery must not block fixing broken images, navigation or enquiry actions.

## 9. Acceptance criteria

### UX and content

- Names are visible on every product/collection card without hover.
- Every published product has an enquiry action and an explicitly approved pricing presentation.
- Current/archive labels and product descriptions are based on verified data.
- The homepage features at most eight dresses before the all-dresses action.
- Product details follow the initial mobile photo, not the entire gallery.
- Full-length product photography is not accidentally cropped by its container.
- Drawer dismissal, keyboard operation and focus restoration work as specified.
- Returning from a product restores collection position, filtering and sorting.
- Enquiries retain the selected product context; errors do not erase the message.
- Missing photos and empty search results have understandable recovery states.

### Accessibility and localization

- Target [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/): normal text contrast at least 4.5:1, large text at least 3:1, and applicable non-text control contrast.
- Visible keyboard focus, appropriately labelled controls, meaningful image alternatives, semantic headings and associated form errors.
- Approximately 44-48 px touch targets as the design goal; validate the applicable WCAG target-size requirements.
- No focus hidden behind sticky controls; support reduced motion and 200% zoom without losing functionality.
- Check responsive layouts at 320, 390, 768, 1024 and 1440 CSS px, plus a wider desktop.
- Verify all new labels, errors and price wording in `en`, `ua`, `ru` and `ro`; obtain native-speaker review for copy.
- Language changes retain the current collection/product and use correct document language metadata.

### Reliability, performance and SEO

- No broken-image icons, hosting-provider error graphics or layout collapse in release-critical catalog paths.
- Serve appropriately sized responsive images with reserved dimensions; lazy-load below-fold images without delaying the initial hero/product photo.
- Target [Core Web Vitals](https://web.dev/articles/vitals) at the 75th percentile: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1, segmented by mobile and desktop.
- Measure on deployed infrastructure and representative network/device conditions; do not treat localhost timings as production evidence.
- Existing URLs, published-only visibility, 404 responses, canonical links, hreflang and valid price metadata remain correct.
- No new required fields or accidental response-shape changes for existing API consumers.

## 10. Validation and release

Use existing tooling and the smallest test selection covering each change:

- Vitest: existing header, language, carousel, gallery, contact-form and page specs; add targeted coverage for menus, pricing presentation, filtering, saved state and contextual enquiries.
- Playwright: extend [public site specs](../client/e2e/public/site.spec.ts) for desktop/mobile navigation, gallery, browser Back, filters, language retention and enquiry context.
- Do not send real customer emails in automated checks; intercept delivery or use a controlled test transport.
- Run frontend type-check/lint and relevant tests; run `pnpm check` for the integrated release.
- Run relevant Docker-based RSpec and backend lint checks only when backend/SEO/shell/data behavior changes.
- Use API snapshots when response shapes change, and update visual baselines only for reviewed intentional differences.
- Review screenshots against the four concepts, supplemented by real keyboard, zoom and mobile-device checks.

**Frontend output is committed:** every change under `client/src` requires `pnpm build` from `client/` and regenerated `public/build/` in the same commit. Never hand-edit build output. Verify the manifest references existing files and run the relevant Vite-helper/shell specs.

Before release:

1. Review the implementation and approved behavior/content changes.
2. Verify on a non-production environment using representative published data.
3. Prepare a rollback to the previous matching source/build revision; keep additive content changes reversible.
4. Obtain explicit confirmation before production deployment through the existing deployment workflow.
5. Smoke-test published URLs, localized navigation, image loading and a controlled enquiry after release.
6. Measure enquiry-action usage and form completion, using an approved privacy-conscious analytics approach if available. Do not log message contents or contact personal data.

## Recommended first release

Prioritize **image reliability, visible labels, navigation, product information and contextual enquiries**, then the homepage and page styling refresh. Introduce advanced discovery afterward.

The redesign succeeds when visitors can confidently find and enquire about a dress, not merely when the homepage looks more elaborate.

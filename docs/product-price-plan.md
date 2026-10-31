# Plan: add a price to products

## Decisions

| Topic | Decision |
|---|---|
| Amount | Optional, whole numbers only, greater than 0. If empty, no price is shown anywhere |
| Currency | Chosen per product: `EUR`, `USD` or `UAH`. Required when an amount is set |
| Display | Always "from X", e.g. "from 1 200 €" / "від 1 200 €" |
| Where | Public product page, public collection grid, admin product list and editor. Not in Top products |
| SEO | `product:price:*` OG tags plus schema.org JSON-LD, only when the product has a price |

**Assumptions:**

- The price is the same in every locale (the field isn't localized). Only the "from" label is translated.
- The currency defaults to EUR in the editor.
- Clearing the amount also clears the currency.

## 1. Backend

1. **`ProductConcern`** (`app/models/concerns/product_concern.rb`):
   - Add `CURRENCIES = %w[EUR USD UAH]`, `field :price, type: Integer` and `field :currency, type: String` (neither uses `localize`).
   - Validations: `price` must be an integer > 0 or nil. `currency` must be in `CURRENCIES` and is required only when `price` is present.
   - `as_json` already includes the fields, so it needs no change. The change is additive for the API: old products without a price have no new keys.
2. **`Admin::Product#create_for_all_locales`:** no change, since the fields aren't localized.
3. **Strong params** (`app/controllers/admin/products_controller.rb`, `product_params`): add `:price, :currency`. Invalid input already returns 422 with `errors`.
4. **Import** (`lib/data_processor.rb`, products loop): read `price` and `currency` the same way as the other fields. Export picks them up through `as_json`.
5. **`PageMeta`** (`app/services/page_meta.rb`):
   - In `product_page`, return `price`, `currency` and a `json_ld` hash.
   - Extend `Result` with these.
   - Use `og:type` `product` for priced products.
   - JSON-LD: `Product` (name, description, image, url) with an `AggregateOffer` (`lowPrice`, `priceCurrency`), which fits a "from" price.
6. **Shell** (`app/views/home/index.html.erb`):
   - Render `product:price:amount` and `product:price:currency`.
   - Render a `<script type="application/ld+json">` from `json_ld.to_json`. Rails escapes `<>&` in JSON, but a spec will cover it.
7. No data migration: Mongo needs no schema change, and existing products simply have no price.

## 2. Frontend

1. **Types** (`client/src/shared/types/index.ts`): add `type Currency = 'EUR' | 'USD' | 'UAH'` and `price?: number | null` and `currency?: Currency | null` on `Product`.
2. **Formatter:** add `client/src/shared/format/price.ts` with `formatPrice(price, currency, locale)`.
   - Uses `Intl.NumberFormat` with no decimals.
   - Locale map: en→`en-GB`, ua→`uk-UA`, ru→`ru-RU`, ro→`ro-RO`.
   - Returns `null` when there is no price.
   - The "from" wording comes from a new i18n key, `PRICE_FROM`, in all 4 locale files ("from {price}" / "від {price}" / "от {price}" / "de la {price}"). The translations need a native-speaker check.
3. **Admin editor** (`client/src/admin/components/ProductEditor.vue`):
   - Add a `FormRow` with a PrimeVue `InputNumber` (integer, min 1, grouping) and a `Select` for the currency.
   - Send `null` when the amount is cleared and show server validation errors.
   - New admin i18n keys: `PRICE`, `CURRENCY`.
4. **Admin list** (`client/src/admin/views/CollectionProductsView.vue`, `columns`): add a sortable `PRICE` column showing the formatted price. That needs a small formatter hook in `EntityGrid` if it doesn't have one yet.
5. **Product page** (`client/src/app/components/ProductDetails.vue`): show the price under the `<h1>`, above colors and sizes, with mobile styling.
6. **Collection grid** (`client/src/app/views/CollectionView.vue`, `items`): pass the formatted price into `GridItem`. `ItemGrid` gets an optional `price` and shows it under the name only when it's set, so the other grids that use it don't change.

## 3. Tests

- **RSpec:**
  - Admin: create, update and clear the price; reject a price without a currency, a currency outside the list, 0, a negative or a decimal price.
  - Public `catalog_spec`: the price is in the JSON.
  - Shell specs: OG tags and JSON-LD appear only when the product has a price, and the output is escaped.
  - `DataProcessor`: import round-trip.
- **Vitest:** `formatPrice` for each locale and currency, `ProductDetails`, `ItemGrid` and `ProductEditor` (form payload).
- **Playwright:** extend `client/e2e/admin/products.spec.ts` to set a price and check it on the public page.
- **API snapshot:** run `script/api_snapshot.rb`. Only the added `price`/`currency` keys should differ.
- `pnpm check`, `bin/ci`. The visual baselines change only for products that have a price.

## 4. Delivery

1. Work on `feat/add_price_to_product` and run `pnpm build` so the regenerated `public/build/` lands in the **same commit** as the `client/src` changes.
2. Open a PR to `master` and merge it into `develop`. Confirm the deploy, then run `.\deploy.ps1`.
3. After the deploy, the admin enters prices. Check a priced product with Google's Rich Results Test.
4. **Rollback:** revert the commit and redeploy. Stored `price`/`currency` values are ignored harmlessly.

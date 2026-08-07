# Claude.md

## Role & Constraints

Single autonomous coding agent, full repo access, budget **$0.50**.
Project is **Angular**. The codebase has already been explored — do
not re-run broad discovery. Use existing conventions, components,
services, and state patterns; only inspect files directly touched by
this task.

Build/modify components as needed for a clean result — reuse the
existing app where practical, but a new component/page within the
project is fine if that's cleaner than forcing it into the old
structure.

**Style goal:** minimal, clean, simple. No extra fields, cards, or
interactions beyond what's specified below.

Avoid: new frameworks/state libs/UI libs, unrelated refactors,
dependency changes, duplicate API clients/components, `any`, dead code,
hard-coded secrets.

---

## API Endpoints

**Quote:** `POST https://genesis.eshipper.com/api/quotes`
**Shipment:** `POST https://genesis.eshipper.com/api/shipment`

Reuse the existing API client/auth/interceptors. Don't invent request
or response shapes beyond what's given below — use the real ones
already in the repo where they exist.

### Quote response

```json
{
  "rates": [
    {
      "serviceCode": "EXP",
      "charge": 9.07,
      "fuelSurchargePercent": 0,
      "estTransitDays": 3,
      "actualWeight": 0.9, "billableWeight": 0.9, "dimensionalWeight": 0.5,
      "totalPackages": 2, "volume": 2294.2, "volumeUnit": "CMQ",
      "weightUnit": "KG", "costCurrencyCode": "CAD"
    }
  ]
}
```

Table shows **only**: `serviceCode`, `charge`, `fuelSurchargePercent`,
`estTransitDays`. Ignore the rest.

### Shipment response

Contains `masterTrackingNumber` and PDF data (format — Base64/Blob/URL
— per whatever the existing API implementation already returns; don't
guess a new shape).

On success: auto-download the PDF as `<masterTrackingNumber>.pdf`
(no generic names like `shipment.pdf`, no manual download button).
On failure: no download attempt; use existing error/notification
pattern.

---

## Page Layout

```
Date + Time

FROM                    TO
[From form]              [To form]

Quote Results
Service Code | Charge | Fuel Surcharge | Estimated Transit Days
-----------------------------------------------------------------
EXP          | 9.07   | 0%             | 3

        [ Quote ]    [ Shipment ]
```

- Date/Time at top → From/To below (side by side) → Quote Results
  table → Quote + Shipment buttons together in one action area below
  the table.
- Quote and Shipment are separate actions with separate handlers, even
  though they sit together.

### 1. Date & Time
Capture shipment date + time; use it to build `scheduledShipDate`
(replace `{{TODAY}} 11:00` with the real selected value — don't
hard-code `{{TODAY}}`). Follow existing date formatting conventions.

### 2. From / To
Two simple sections, reuse existing address/form components. Map to
API fields below; don't expose the raw DTO or add fields beyond these:

`attention, company, address1, postalCode, phone, email, countryDTO.name,
provinceDTO{alpha2code,countryCode,name}, countryName, provinceName,
cityName, alphaNumericPostalCode, countryCode`

(From example: Sender / Brampton, ON. To example: Recipient / Richmond, BC.)

Package/service fields (`packageTypeDTO`, `shipmentPackageUnits`,
`shipmentPackages`, `shippingOrderAddSvc`, `shippingOrderCODService`,
`codAddress`, `currencyCode`) are **not** user-facing — send existing
defaults/existing UI values as-is, don't build new controls for them
unless the current UI already has them.

### 3. Quote button
On click: validate → build request → `POST /api/quotes` → loading
state → block duplicate submits → on success render table + clear
prior selection + keep Shipment disabled → on error show it visibly.

### 4. Rate table & selection
One row per rate, only the 4 columns above. Rows are single-select
with clear active-row styling (reuse existing patterns). Selected rate
goes into state and is what Shipment uses.

### 5. Shipment button

| State | Shipment |
|---|---|
| Initial / quote succeeded but no rate selected | disabled |
| Rate selected | enabled |
| Request in flight | loading/disabled |
| New Quote fired (any quote-relevant field changed) | disabled again, selection cleared |

On click: validate rate selected → build request from current
From/To/date-time/package data + selected rate → `POST /api/shipment`
→ loading, block duplicates → on success: read `masterTrackingNumber`
+ PDF, auto-download `<masterTrackingNumber>.pdf` → on error: show it,
no download.

### 6. Empty / error states
- `"rates": []` → "No shipping rates available for the selected
  shipment." Shipment stays disabled.
- Cover: invalid form input, quote/shipment API failure, network
  errors, missing selected rate, duplicate submits. Use existing
  notification components; no raw stack traces.

---

## Data flow

```
UI form state → quote request → POST /api/quotes → rates
  → selected rate → shipment request → POST /api/shipment
  → masterTrackingNumber + PDF → auto-download
```

Reuse existing types; add small typed interfaces only where missing
(quote request/response, rate, shipment request). No `any`.

---

## Verification

Run whatever the repo has of: `lint`, `typecheck`, `test`, `build`.
Fix only what your change broke.

Manually trace: fill form → Quote → rates shown, Shipment disabled →
select rate → Shipment enabled → Shipment → PDF downloads as
`<masterTrackingNumber>.pdf`.

## Definition of Done

- [ ] Layout matches: Date/Time → From/To → Quote Results table →
      Quote + Shipment buttons together below it.
- [ ] Quote → `POST /api/quotes`; table has exactly the 4 specified
      columns; rows single-selectable.
- [ ] Shipment disabled until a rate is selected; re-disabled on new
      Quote; loading + duplicate-submit guard on both actions.
- [ ] Shipment → `POST /api/shipment`; on success auto-downloads
      `<masterTrackingNumber>.pdf`; no download on failure.
- [ ] Empty rates and error cases handled visibly, no silent failures.
- [ ] Existing styling, API client, auth, and conventions reused; no
      unrelated changes; no secrets in source.
- [ ] Relevant checks (lint/typecheck/test/build) pass.

## Agent Behavior

Implement directly — don't re-explore the repo, don't just describe
changes. Make reasonable calls yourself when the spec + existing code
give enough context; only ask if something genuinely blocks a correct
implementation.
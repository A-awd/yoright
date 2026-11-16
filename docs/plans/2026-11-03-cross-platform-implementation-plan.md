# YoRight cross-platform implementation plan (web, iOS, Android) — 2026-11-03

Status: approved by the owner on 2026-11-03 in the Claude Code browser session. Documentation only; no application code, schema, config, deployment, secret, private file, paid service, booking or payment was created or changed when this plan was recorded.

---

## الملخص التنفيذي

- هذه خطة مرحلية لبناء يورايت كمنصة حجز فنادق عربية أولاً على الويب المتجاوب وتطبيقي الجوال.
- الخطة تعتمد على الكود الموجود فعلاً في المستودع وتعيد استخدام ما هو سليم منه.
- الواجهة الخلفية الحالية المقترحة كخط أساسي هي بوابة
NestJS
- واجهة الويب الحالية المقترحة كخط أساسي هي تطبيق
React
- خط التطبيق الثاني في جذر المستودع يُحفظ كتاريخ ولا يُحذف، ويُوثَّق قرار الخط الأساسي رسمياً.
- المرحلة الأولى شريحة عمودية محلية بالكامل بمورّدين اصطناعيين، بلا أي اتصال حي ولا بيانات حقيقية.
- الشريحة تشمل سجل الفندق الموحّد، وربط معرّفات المورّدين، ومراجعة التطابقات الغامضة يدوياً.
- مطابقة الغرف محافظة: أي صفة حرجة مجهولة تمنع اعتبار الغرفتين متكافئتين.
- مقارنة الأسعار تتم فقط بين عروض متكافئة الشروط وبالإجمالي النهائي بالريال السعودي وبسعر صرف موثّق.
- واجهة برمجية مشتركة واحدة تخدم الويب والجوال، مع عقد موثّق يُولَّد منه عميل العملاء تلقائياً.
- العربية بالاتجاه من اليمين لليسار هي الافتراضي، والريال السعودي هو عملة العرض الافتراضية.
- دورة الحجز تشمل إعادة التسعير قبل الدفع، والإلغاء بغرامة معلنة، والاسترداد الكامل أو الجزئي بسجل تدقيق.
- خدمة الكونسيرج تُبنى كطلب يراجعه الإنسان، وتُربط لاحقاً بقناة
WhatsApp
- حسابات العملاء ولوحة الإدارة تُؤمَّن أولاً بإزالة الإعدادات الافتراضية غير الآمنة الموجودة اليوم.
- تطبيقا الجوال يُقترح بناؤهما بإطار واحد مشترك بلغة البرمجة نفسها لتقليل الكلفة، مع ترك القرار النهائي للمالك.
- ربط المورّدين الحقيقيين والدفع الحقيقي له شروط مسبقة مكتوبة ولا يبدأ قبل اعتماد المالك.
- لا إنتاج، ولا أسرار، ولا ملفات عملاء، ولا خرائط مدفوعة، ولا حجوزات حقيقية، ولا دفع رسوم في أي مرحلة من هذه الخطة بدون تفويض صريح.

### المعالم التنفيذية

| المعلم | المحتوى | التقدير الهندسي |
|---|---|---|
| 0 | تثبيت الخط الأساسي، إزالة الإعدادات غير الآمنة، بنية الاختبار والتكامل المستمر | 20 إلى 30 ساعة |
| 1 | الشريحة العمودية المحلية: مورّدان اصطناعيان، ربط الفنادق، مراجعة التطابقات، مطابقة الغرف، مقارنة العروض | 170 إلى 270 ساعة |
| 2 | الواجهة البرمجية المشتركة الإصدار الأول وإكمال تطبيق الويب بالعربية والريال | 60 إلى 90 ساعة |
| 3 | دورة الحجز: عرض سعر، إعادة تسعير، حجز، إلغاء، استرداد، منفذ دفع تجريبي | 80 إلى 120 ساعة |
| 4 | الكونسيرج وسير عمل الرسائل ولوحة الإدارة | 60 إلى 90 ساعة |
| 5 | تطبيقا الجوال من الواجهة المشتركة نفسها | 120 إلى 180 ساعة |
| 6 | الإصدار الآمن والاختبار الشامل للمنصات الثلاث | 40 إلى 60 ساعة |
| 7 | بوابات الربط بالمورّدين الحقيقيين والدفع الحقيقي | حسب العقود والموافقات |

- التقديرات اجتهاد هندسي للتخطيط وليست عرض سعر ولا التزاماً زمنياً.
- التقدير الخاص بالمعلم الأول مأخوذ من دراسة الجدوى الداخلية المعتمدة في المستودع.

---

## 1. Context

The owner authorized building YoRight for responsive web, iOS and Android (STATE.md kickoff entry, 2026-11-03) and asked for a phased plan that starts with a local vertical slice: two synthetic suppliers, canonical hotel mapping, review of ambiguous matches, conservative room matching, and comparison of equivalent total prices and rate terms. The repository already holds two application lines, a RateHawk-specific supplier integration, a Siora-styled React web client, and five research notes (2026-11-02) that define the mapping approach and a 170–270 hour pilot estimate. This plan turns that research into executable phases with dependencies, acceptance tests, and the prerequisites for connecting real suppliers and payments later.

Governing constraints from AGENTS.md, DECISIONS.md and the owner request: GitHub is the only source of truth; no credentials, traveler data, bookings, or unsanitized supplier responses in the repo; no production, hosting, auth, or repository-setting changes without authorization; insecure defaults removed without documenting values; the migration merge gate to `main` stays closed until clone reconciliation, insecure-default remediation, and privacy review are independently validated.

## 2. Verified repository state (2026-11-03)

| Item | Value |
|---|---|
| Canonical repo / remote | `A-awd/yoright`, `origin=https://github.com/A-awd/yoright` |
| Designated branch | `migration/one-brain-foundation` |
| Remote tip at planning time | `d0844676a61d0c492772264442e1b3734dfdb05d` "Record browser-based Fable planning session" (docs only: STATE.md, HANDOFF.md) |
| Local checkout at planning time | `76aa530c76a51baf239f37a9ff54c8aad50a8b55`, one commit behind the remote, clean working tree; fast-forwarded to `d084467` before this plan was recorded |
| `main` | `03f05d9` (2026-05-10), stale relative to the migration branch (26 files differ); merge gate still closed |
| `work/yoright-fable-platforms` | Mentioned in STATE.md but not present on the remote |
| CI | None (`.github/` has only issue and PR templates) |
| Tests | None anywhere in the repo (no `*.test.*`, `*.spec.*`, jest/vitest config) |
| Node | 22 available in the planning environment; `package.json` engines `>=20` |
| Easy Life routine | Not connected in the planning session; the project documents above were used instead |

## 3. Existing code: what to reuse and what is missing

### 3.1 Two application lines (must be reconciled by a decision record)

| Line | Paths | Verdict |
|---|---|---|
| A. Gateway + SPA (recommended canonical) | `apps/gateway/` (NestJS 10 + Fastify, Prisma, Swagger at `/openapi.json`), `apps/web-client/` (React 18 + Vite + Tailwind, 13 pages, UI kit, RTL toggle), `apps/web/admin/index.html` (static admin), `apps/gateway/prisma/schema.prisma` | More complete; has supplier lifecycle (prebook/form/finish/status/cancel), OTP + JWT auth, feature flags, mock providers, OpenAPI output the native READMEs already target |
| B. Next.js 16 app | root `app/[locale]/…`, `lib/`, `prisma/schema.prisma`, `messages/{ar,en}.json`, `i18n/`, `middleware.ts`, `components/` | Thinner; `lib/adapters/ratehawk.ts` silently returns mock data on any error and fabricates a CONFIRMED booking on failure; root `package.json` scripts already point at line A. Keep as history, reuse only `messages/*.json` keys and `lib/providers/fx-rates.ts` idea (FX rate table with `asOf`) |

Decision record `0003` (Phase 0) selects line A. Line B is moved under `legacy/next-app/` with `git mv` so history is preserved and the root stops looking like a Next.js project.

### 3.2 Reusable pieces in line A

- `apps/gateway/src/main.ts`: Fastify bootstrap, Swagger document, `/openapi.json`, static serving of `web-client/dist`. Keep; add versioned `/v1` prefix and generated-client pipeline.
- `apps/gateway/src/core/flags/flags.service.ts` + `flags.json`: hot-reloaded feature flags. Keep; add per-supplier `liveEnabled` flags and `paymentsLive` flag (default false).
- `apps/gateway/src/modules/suppliers/ratehawk-api.service.ts`: a complete RateHawk v3 request map (search by region, hotel page, prebook, booking form/finish/status, cancel). Keep as the first real adapter behind a new `SupplierPort` interface in Phase 7; its `transformSearchResponse` (lines 384–424) hardcodes names, Dubai address, Unsplash images, rating 8.5 and must not reach the canonical model.
- `apps/gateway/src/modules/suppliers/ratehawk-mock.service.ts`: 50+ bilingual demo hotels. Reuse as seed content for synthetic Supplier A only after stripping Unsplash URLs (content rights) and adding native IDs and rate keys.
- `apps/gateway/src/modules/bookings/bookings.service.ts`: reference generator `YR-…`, status update helper. Keep the reference format; replace the Float money fields and the client-trusted totals.
- `apps/gateway/src/modules/auth/auth.service.ts`: bcrypt + JWT + OTP. Keep the shape; fix the defaults listed in 3.4.
- `apps/web-client/src/components/ui/*`, `HotelCard.tsx`, `FilterPanel.tsx`, `Map.tsx`, pages `Home`, `SearchResults`, `HotelDetails`, `Checkout`, `Confirmation`, `MyTrips`, `Profile`, `Login`, `SignUp`: keep layout and styling; rewire data to the v1 client; `HotelDetails.tsx` lines 366–500 become the offer-group renderer.
- `apps/web-client/src/i18n/translations.ts` + `useTranslation.ts`: move into `packages/i18n` so mobile shares the same strings; merge keys from `messages/ar.json`.
- `_native/ios/README.md`, `_native/android/README.md`: planned structure, design tokens (`#0F4C5C`, `#E8B449`, `#D4AF37`), RTL and MASVS checklists. Reused as the native checklist whichever mobile stack is chosen; note the README tokens differ from the web palette in `replit.md` (`#d4a862` gold, `#3d3d3d` charcoal), so Phase 0 creates one `packages/design-tokens` source of truth.
- `tools/scripts/smoke.js`: HTTP smoke test; extend for v1 endpoints and run in CI.

### 3.3 Gaps the plan must fill

- No canonical hotel/room/offer model in either Prisma schema; bookings store `hotelId`/`roomId` strings and `Json` snapshots only.
- Single-supplier search: `SuppliersService.searchHotels` (`suppliers.service.ts:80–170`) is RateHawk-only and returns `[]` when not configured, so the web UI is empty without the flag.
- Room data model is a flat `Room` (`apps/web-client/src/types/index.ts:34–45`) with `price: number` and no rate terms, occupancy, view, or supplier keys.
- Money is `Float` everywhere (`Booking.netPrice/total/vat`, `Payment.amount`, `MarginRule.percentage`); FX is a hardcoded table (`fx.service.ts:15–24`).
- Checkout computes `total` client-side and `POST /api/bookings` stores whatever the client sends (`bookings.controller.ts:273–293`, `Checkout.tsx:117–182`).
- `Checkout.tsx:100–105` holds card number, expiry and CVV in React state: card data must never touch YoRight code (hosted payment page / tokenization only).
- Prebook results live in a process `Map` (`suppliers.service.ts:50`), lost on restart; no quote expiry.
- No cancellation/refund flow in the API or UI beyond a raw `cancelOrder` pass-through; `BookingStatus` has no refund or cancellation-requested states.
- No concierge/WhatsApp entities at all; decision 0002 makes concierge the operating model.
- No tests, no CI, no lint config, no migrations committed (`apps/gateway/prisma/migrations` is git-ignored).
- Native apps are README-only.

### 3.4 Insecure defaults to remove in Phase 0 (values not recorded here)

- `apps/gateway/src/modules/admin/admin.controller.ts`: all admin routes, including `POST flags/toggle`, have no authentication.
- `apps/gateway/src/modules/auth/auth.service.ts:6`: hardcoded fallback JWT secret; `sendOtp` logs the code and returns it in the response in mock mode.
- `apps/gateway/src/modules/webhooks/webhooks.controller.ts`: accepts a signature header but never verifies it; `payments.controller.ts` webhook has no verification either.
- `apps/gateway/src/main.ts:21`: CORS defaults to `*` with credentials.
- `prisma/schema.prisma` (line B): `SupplierCredential.apiKey` stored in plaintext; line B `lib/adapters/ratehawk.ts` fabricates confirmed bookings on error.
- `.env.example` placeholders are fine; `.replit` pins a sandbox supplier URL (harmless, but the Replit workflow is not the release path).

## 4. Target architecture

```
yoright/
  apps/
    gateway/            NestJS API (canonical backend)        [existing, extended]
    web-client/         React responsive web                   [existing, rewired]
    mobile/             Expo (React Native) iOS + Android      [new, Phase 5; see decision D2]
    admin/              Admin console (React, replaces apps/web/admin/index.html) [Phase 4]
  packages/
    domain/             TS types + zod schemas for canonical hotel/room/offer/booking/money
    money/              minor-unit arithmetic, SAR formatting, FX application with rate provenance
    mapping-core/       framework-free matcher: normalizers, candidate scoring, decision rules
    supplier-sdk/       SupplierPort interface + synthetic suppliers A/B + fault injection
    api-client/         generated from gateway OpenAPI (openapi-typescript + thin fetch wrapper)
    i18n/               ar/en message catalogs, RTL helpers, number/date formatters
    design-tokens/      colors, spacing, type scale exported to Tailwind, RN and native
  legacy/next-app/      line B, preserved history, not built
  docs/plans/           this plan and phase reports
  tools/scripts/        seed, smoke, fixture generators
```

Runtime shape: one gateway process serves `/v1/*`, `/openapi.json`, the web SPA, and the admin SPA. Postgres via Prisma for all three platforms. Mobile and web use the same generated client and the same `packages/domain` types; no business rule lives in a client.

Shared-API principle: every price the client shows comes from the server as a `Money` object with `amountMinor`, `currency`, `display` (locale-formatted) and, when converted, an `fx` block `{ from, to, rate, asOf, source }`.

## 5. Domain model (additive Prisma models in `apps/gateway/prisma/schema.prisma`)

Property identity and mapping (names follow the 2026-11-02 estimate note):

- `Supplier` (code, displayName, kind SYNTHETIC|LIVE, enabled, config ref name only)
- `CanonicalHotel` (id, nameAr, nameEn, normalizedName, countryCode, cityCode, lat, lng, geohash, brand?, chainCode?, phoneE164?, addressNormalized, starRating?, status ACTIVE|MERGED|CLOSED, mergedIntoId?)
- `SupplierHotelIdentity` (supplierId, nativeHotelId, canonicalHotelId?, matchStatus PENDING|AUTO_ACCEPTED|VERIFIED|REJECTED|SPLIT, evidence Json, confidence Decimal, firstSeenAt, lastSeenAt)
- `SupplierPropertySnapshot` (supplierHotelIdentityId, payloadHash, normalizedFields Json, capturedAt) — change detection for rebrands, closures, moves
- `PropertyMatchCandidate` (identityId, canonicalHotelId, score, reasons Json, decision AUTO_ACCEPT|REVIEW|REJECT, decidedBy SYSTEM|REVIEWER, decidedAt)
- `MappingReview` (candidateId, reviewerUserId, action APPROVE|REJECT|MERGE|SPLIT|CREATE_NEW, note, createdAt)
- `MappingAudit` (entityType, entityId, before Json, after Json, actor, createdAt)
- `CanonicalRoom` (canonicalHotelId, signature Json {roomClass, bedConfig, view, maxOccupancy, sizeSqm?, smoking?}, nameAr, nameEn, status)
- `SupplierRoomIdentity` (supplierId, nativeRoomCode, canonicalRoomId?, matchStatus, evidence Json)
- `HotelContent` (canonicalHotelId, source, licence ref, descriptionsAr/En, imageRefs Json with provenance, updatedAt) — no third-party images without a recorded licence

Search, offers and comparison (ephemeral but persisted for quotes and audit):

- `SearchSession` (id, params Json {cityCode, checkIn, checkOut, rooms[{adults, childrenAges[]}], residency, currency}, createdAt, expiresAt)
- `Offer` (searchSessionId, supplierId, supplierHotelIdentityId, canonicalHotelId, canonicalRoomId?, supplierRoomIdentityId, rateKey, priceHashOrEquivalent, board, refundability FREE|PARTIAL|NON_REFUNDABLE|UNKNOWN, cancellationRules Json [{deadlineUtc, penaltyMinor, currency}], paymentTiming PREPAID|AT_PROPERTY|DEPOSIT, mandatoryFeesAtProperty Json, supplierTotalMinor, supplierCurrency, fxRateId?, netSarMinor, marginRuleId?, customerTotalSarMinor, comparableKey, capturedAt, expiresAt)
- `FxRate` (base, quote, rate Decimal, asOf, source) — reuse line B shape
- `MarginRule` (existing; percentage moves to basis points Int)

Booking lifecycle:

- `Quote` (offerId, customerTotalSarMinor, supplierQuoteRef, priceChanged bool, previousTotalMinor?, termsSnapshot Json, expiresAt, status ACTIVE|EXPIRED|CONSUMED)
- `Booking` (existing, extended: quoteId, canonicalHotelId, canonicalRoomId?, supplierId, supplierRef, state enum below, totals in minor units, guest data encrypted-at-rest column plan documented, idempotencyKey unique)
- `BookingEvent` (bookingId, type, from, to, payload Json, actor, createdAt) — append-only audit
- `CancellationRequest` (bookingId, quotedPenaltyMinor, quotedAt, supplierCancelRef?, state)
- `Refund` (bookingId, paymentId, amountMinor, reason, providerRef?, state PENDING|SUCCEEDED|FAILED, createdAt)
- `Payment` (existing, extended: providerRef, state AUTHORIZED|CAPTURED|VOIDED|REFUNDED_PARTIAL|REFUNDED, webhookVerified bool)

Concierge:

- `ConciergeRequest` (customerId?, channel WEB|APP|WHATSAPP, locale, freeText, structured Json {destination, dates, pax, budget, preferences}, state NEW|QUALIFYING|PROPOSED|ACCEPTED|BOOKED|CLOSED, assignedAgentId?)
- `ConciergeMessage` (requestId, direction IN|OUT, channel, body, templateKey?, externalMessageId?, createdAt)
- `ConciergeProposal` (requestId, offerIds[], notesAr/En, sentAt, acceptedOfferId?)

Booking state machine (enforced in `BookingsService`, every transition writes `BookingEvent`):

```
DRAFT → QUOTED → PAYMENT_PENDING → PAYMENT_AUTHORIZED → SUPPLIER_PENDING → CONFIRMED
                                  ↘ PAYMENT_FAILED                       ↘ SUPPLIER_FAILED → REFUND_PENDING → REFUNDED
CONFIRMED → CANCELLATION_REQUESTED → CANCELLED → REFUND_PENDING → REFUNDED | REFUND_PARTIAL
QUOTED → EXPIRED (quote TTL)        any → MANUAL_REVIEW (operator hold, concierge decision 0002)
```

Money rule: integer minor units (halalas) with currency; `Int` bound documented (≈21.4M SAR); never `Float`. VAT treatment (on margin/service versus on gross) is a configuration with an explicit documented assumption, not a code constant, until the owner's accountant confirms.

## 6. Shared API v1 contract (`apps/gateway`, prefix `/v1`, OpenAPI generated)

| Area | Endpoint | Notes |
|---|---|---|
| Places | `GET /v1/places/suggest?q=&locale=` | city codes from `City`, bilingual |
| Search | `POST /v1/hotels/search` | body: cityCode, checkIn, checkOut, rooms[], currency=SAR, locale; returns `searchSessionId`, items `{canonicalHotel, supplierCount, cheapestComparable: Money, cheapestAny: Money, badges}` |
| Details | `GET /v1/hotels/{canonicalId}?searchSessionId=` | content + `offerGroups[]`: `{canonicalRoom|unverifiedRoomLabel, comparableSets[]: {terms, offers[] sorted by customerTotal}}` |
| Offer | `GET /v1/offers/{offerId}` | full terms, cancellation timeline, due-at-property fees, provenance |
| Quote | `POST /v1/quotes {offerId}` | repricing (prebook); returns `quoteId, expiresAt, priceChanged, previousTotal, total` |
| Booking | `POST /v1/bookings {quoteId, guests[], contact, idempotencyKey}` | server computes totals from the quote only |
| Booking | `GET /v1/bookings/{reference}`, `GET /v1/me/bookings` | |
| Cancel | `POST /v1/bookings/{ref}/cancellation-quote`, `POST /v1/bookings/{ref}/cancel {cancellationQuoteId}` | two-step, penalty shown before confirmation |
| Payments | `POST /v1/payments/intents {bookingReference}`, `POST /v1/payments/webhooks/{provider}` | hosted checkout URL only; signature verification mandatory |
| Auth | `POST /v1/auth/otp/send`, `POST /v1/auth/otp/verify`, `POST /v1/auth/refresh`, `GET/PUT /v1/me` | phone-first; email/password kept for admin |
| Concierge | `POST /v1/concierge/requests`, `GET /v1/concierge/requests/{id}`, `POST /v1/concierge/requests/{id}/messages` | customer side |
| Admin | `GET/POST /v1/admin/mapping/reviews`, `/v1/admin/mapping/candidates/{id}/{approve|reject|merge|split}`, `/v1/admin/bookings`, `/v1/admin/bookings/{ref}/hold`, `/v1/admin/concierge/…`, `/v1/admin/margins`, `/v1/admin/flags`, `/v1/admin/suppliers/{code}/health` | role-guarded (SUPPORT, AGENT, ADMIN, SUPER_ADMIN) |
| Ops | `GET /health`, `GET /health/ready` (DB + suppliers), `GET /openapi.json` | existing, extended |

Conventions: `Accept-Language: ar|en` drives `display` strings; every list is paginated; errors use a problem-details shape with bilingual messages; all write endpoints accept `Idempotency-Key`. The legacy `/api/*` routes stay mounted until the web client is cut over, then are removed in Phase 2.

## 7. Matching and comparison rules (the heart of Phase 1)

Property matching (`packages/mapping-core`):

1. Normalize: strip diacritics and tatweel, unify Arabic letter variants (أ/إ/آ→ا, ة→ه, ى→ي), lowercase Latin, remove generic tokens (hotel/فندق/resort/منتجع/suites), keep distinguishing tokens (tower numbers, north/south, branch names, "annex").
2. Block candidates by `cityCode` + geohash neighbours (≈1 km).
3. Score evidence fields independently: name similarity (token Jaccard + trigram), distance (haversine), phone equality (E.164), address token overlap, brand/chain equality, star rating agreement, shared external ID when licensed.
4. Decide: AUTO_ACCEPT only if distance ≤ 150 m AND name ≥ 0.90 AND (phone equal OR address overlap ≥ 0.6) AND no distinguishing-token conflict. REVIEW when 0.60 ≤ composite < threshold or any single strong signal conflicts. REJECT otherwise. Name-only or proximity-only never auto-accepts.
5. Re-run on every snapshot change; a VERIFIED mapping is never silently downgraded, it raises a REVIEW with the diff.
6. AI assistance (optional, later): may rank REVIEW candidates and draft a justification; it cannot approve.

Room matching (conservative):

- Extract `RoomSignature` from supplier room name/attributes: roomClass (standard/superior/deluxe/suite/…), bedConfig (king/queen/twin/double/sofa, counts), view (sea/city/haram/garden/partial-X/none), maxOccupancy, sizeSqm, smoking.
- Two supplier rooms join one `CanonicalRoom` only when every known attribute is equal and no critical attribute (bedConfig, view, maxOccupancy) is unknown on either side. Unknown stays separate and is labelled "unverified room" in the UI. King ≠ queen; full view ≠ partial view; "Standard" substring alone proves nothing.

Offer comparison:

- `comparableKey = hash(canonicalRoomId | unverifiedRoomLabel, board, refundability class, paymentTiming, occupancy tuple)`.
- Compare `customerTotalSarMinor` only inside one comparable set; totals include taxes and mandatory prepaid fees; due-at-property fees are shown beside the total, not hidden; conversions carry the `FxRate` record used.
- UI shows one property, grouped rooms, and within each group the cheapest comparable offer with the alternatives visible (research illustration: B 610 wins the breakfast/refundable set; C 540 room-only is a different product).
- Supplier rate keys and booking identifiers survive untouched from search → offer → quote → booking.

## 8. Phases, dependencies, deliverables, acceptance tests

Dependency order: P0 → P1 → P2 → P3 → (P4 ∥ P5) → P6 → P7 gates. Each phase ends with STATE.md/HANDOFF.md updates and a phase report under `docs/plans/`.

### Phase 0 — Foundation and safety (prerequisite for everything)

Scope: decision records, workspace layout, test/CI harness, insecure-default removal.

- `DECISIONS.md` + `decisions/0003-canonical-implementation-line.md` (line A canonical, line B to `legacy/next-app/`), `decisions/0004-cross-platform-stack.md` (API-first, shared packages, mobile stack per D2), `decisions/0005-money-and-pricing-rules.md` (minor units, SAR display, FX provenance, VAT configuration assumption).
- Workspace: create `packages/*` skeletons, root `tsconfig.base.json`, ESLint + Prettier, Vitest for packages, Jest kept for gateway (already a dependency), Playwright for web e2e.
- CI (`.github/workflows/ci.yml`): install, lint, typecheck, unit tests, gateway build, web build, smoke against `MOCK_MODE=1` gateway. No secrets, no deploy.
- Security: admin guard (role-based) on `admin.controller.ts`; JWT secret required at startup (fail fast, no fallback); OTP never returned or logged outside an explicit `OTP_DEBUG` dev flag that CI asserts is off; webhook signature verification interface with mock verifier; CORS allowlist from env with no wildcard+credentials; remove card fields from `Checkout.tsx`; remove line B's fabricated-booking fallback by archiving line B.
- Prisma: commit migrations (`apps/gateway/prisma/migrations`, un-ignore in `.gitignore`), baseline migration from the current schema.

Acceptance: CI green on the branch; `npm run smoke` passes in mock mode; an unauthenticated `POST /v1/admin/flags` returns 401; gateway refuses to boot without `JWT_SECRET`; `grep` finds no card-number state in the web client; `git log --follow` still shows line B history.

### Phase 1 — Local vertical slice (first milestone, synthetic only)

Scope: two synthetic suppliers, canonical mapping, review queue, room matching, comparison, minimal API and web rendering. No network calls to any supplier.

- `packages/supplier-sdk`: `SupplierPort { searchByCity, getHotelContent, getRates, reprice(rateKey), book(quoteRef, guests), cancel(ref), status(ref) }` with typed, supplier-neutral DTOs; `SyntheticSupplierA` (JSON fixtures derived from `ratehawk-mock.service.ts` content after image stripping, SAR prices, IDs like `A-H-0001`, rate keys) and `SyntheticSupplierB` (different naming conventions, USD prices, different room taxonomy, IDs like `b:prop:…`); fault injection knobs: latency, timeout, sold-out on reprice, price change on reprice, pending-then-confirmed booking, cancel-penalty.
- Fixture design covers every acceptance case below (≈60 properties across Riyadh, Jeddah, Makkah; ≈8 room types each).
- `packages/mapping-core` with golden-fixture tests; `packages/money`.
- Gateway: `mapping` module (import, candidate generation, review endpoints), `search` module (fan-out to enabled suppliers with per-supplier timeout, join to canonical, build offers and comparable sets), Prisma models from §5 (mapping + offers + FxRate), `MarginRule` in basis points.
- Admin review UI (minimal page in `apps/admin` or a first screen of the new console): list REVIEW candidates with evidence side by side, approve/reject/merge/split, audit trail.
- Web: `SearchResults` and `HotelDetails` consume `/v1/hotels/search` and `/v1/hotels/{id}` and render offer groups with Arabic RTL and SAR.

Acceptance tests (automated, run in CI with synthetic data):

1. Same brand, two nearby buildings (e.g., synthetic "Tower 1" and "Tower 2" 120 m apart) remain two canonical hotels; never auto-merged.
2. Renamed verified property (snapshot name change, same phone/coords) keeps its canonical ID and produces a REVIEW with the diff and an audit row.
3. Name-only match (similar name, 900 m apart, no phone) lands in REVIEW, not AUTO_ACCEPT.
4. Room with unknown bed type never joins a group; shows as unverified.
5. King vs queen and full-view vs partial-view produce distinct canonical rooms.
6. Meal plan, refundability, payment timing and mandatory-fee differences produce distinct comparable sets; totals are not compared across sets.
7. Supplier B USD offer converts to SAR only with a stored `FxRate` row referenced on the offer; absence of a rate marks the offer "not comparable".
8. Rate keys and supplier native IDs on the chosen offer are byte-identical to the fixture values.
9. One supplier timing out still returns the other supplier's results with a `partialResults` flag.
10. Results in mock/synthetic mode carry `dataMode: "synthetic"` end to end and the UI shows a non-production banner.
11. Review precision check on the fixture set: zero false merges; recall reported, not asserted.

Exit criteria: all 11 pass in CI; a reviewer can approve/reject a candidate from the admin screen and the decision persists; `docs/plans/phase-1-report.md` records measured false-merge count and operator time per review on the fixture set.

### Phase 2 — Shared API v1 and web completion

Depends on P1.

- Finish v1 endpoints from §6 except payments/cancellation (P3) and WhatsApp (P4); OpenAPI spec committed to `packages/api-client/openapi.json` and the TS client generated in CI (fails if drift).
- `packages/i18n`: merge `translations.ts` and `messages/*.json`; Arabic default, locale switch persisted; number/date formatting via `Intl` with `ar-SA` and Western digits by default, Arabic-Indic digits as a user preference; `dir="rtl"` on `<html>`; logical CSS properties audit (replace `left/right` Tailwind classes with `start/end` in `apps/web-client/src/**`).
- Accounts: phone OTP login via a mocked SMS port, profile, saved hotels, my bookings; refresh tokens; session revocation.
- Responsive audit at 360, 768, 1024, 1440 px with Playwright screenshots in both directions.
- Remove legacy `/api/*` once the web client is on `/v1`.

Acceptance: OpenAPI drift check green; Playwright flows (search → details → offer selection → quote screen) pass in ar and en; axe accessibility scan has no critical issues; Lighthouse mobile performance ≥ 80 on the search page with synthetic data; all money on screen comes from server `display` strings (unit test on the client forbids local `toFixed` on prices).

### Phase 3 — Booking lifecycle: repricing, booking, cancellation, refunds, payment port

Depends on P2.

- `Quote` with TTL and repricing via `SupplierPort.reprice`; price-change dialog requiring explicit re-acceptance; expired quote cannot be booked.
- Booking state machine from §5 with `BookingEvent` audit, idempotency keys, server-computed totals; guest data minimization (names, one contact, nationality only if a supplier requires it; no passport numbers unless a later decision authorizes the field and its encryption).
- `PaymentProviderPort` with `MockPaymentProvider` (hosted-checkout simulation, webhook simulation with signed payloads, void, refund); adapter skeleton for Tap behind `paymentsLive=false` (no keys, no calls).
- Cancellation: two-step cancellation quote → cancel; penalty computed from stored `cancellationRules` and re-validated with the supplier; refund record created and reconciled with the payment provider state; partial refunds supported.
- Operator hold (`MANUAL_REVIEW`) and release per decision 0002.
- Web: quote screen, booking form (no card fields), hosted-checkout redirect/return, confirmation, booking detail with cancellation timeline, cancel flow with penalty disclosure, refund status.

Acceptance: state-machine tests reject every illegal transition; reprice with price-up requires re-acceptance and the stored booking total equals the re-accepted quote; supplier `pending` then `confirmed` via status polling and via webhook both converge to CONFIRMED exactly once (idempotent); supplier failure after capture creates REFUND_PENDING and a refund; cancellation after the free deadline shows the penalty and refunds `captured − penalty`; webhooks with bad signatures are rejected and logged; duplicate `POST /v1/bookings` with the same idempotency key returns the same booking.

### Phase 4 — Concierge and WhatsApp workflows, admin console

Depends on P3; can run in parallel with P5.

- Customer: concierge request form (web/app) with structured fields + free text; request timeline; proposal acceptance leading into the normal quote → booking flow.
- Operator console (`apps/admin`): request queue, qualification checklist, offer picker that reuses the comparison engine, proposal composer with bilingual templates, booking hold/release, mapping review (from P1), bookings and refunds, margins, supplier health, flags.
- Channel abstraction `MessagingChannelPort` with `WebChannel` and `MockWhatsAppChannel` (inbound webhook simulator, template registry, opt-in record, 24-hour session window rule modeled). Real WhatsApp Business Platform connection is a P7 gate (verified business, approved templates, number ownership) and is never configured here.
- Consent and retention: customer messages stored with retention policy and export/delete endpoints for the data subject.

Acceptance: an inbound synthetic WhatsApp message creates a request; operator proposes two comparable offers; customer accepts one; booking proceeds through P3 states; audit shows the human decision; template messages render correctly in Arabic RTL; opt-out stops outbound messages.

### Phase 5 — Mobile apps (iOS and Android)

Depends on P2 for the API and P3 for booking screens; parallel with P4.

Recommended stack (decision D2, owner to confirm): Expo (React Native, TypeScript) with EAS Build, sharing `packages/{domain, money, i18n, api-client, design-tokens}` with the web. Rationale: one language and one team, the existing UI is already React, RN has mature RTL support (`I18nManager`), and native modules are not needed for the product scope. Alternative kept in the native READMEs: SwiftUI + Jetpack Compose with generated Swift/Kotlin clients; higher cost, better platform fidelity; choose it only if the owner wants native-first UX or a native team exists.

- Screens: onboarding/locale, search, results, hotel details with offer groups, quote, booking, hosted-checkout web view, my trips, booking detail/cancel, concierge chat, profile.
- Platform work: secure token storage (Keychain/Keystore), certificate pinning option, deep links for booking references and payment return, push notifications for booking state changes (provider chosen in P6), Arabic/English store metadata, privacy manifest, no analytics SDK without a decision.
- RTL: `I18nManager.forceRTL` on locale change with restart handling; logical layout props; snapshot tests in both directions.

Acceptance: Detox or Maestro flows for search → quote → booking → cancel pass on iOS simulator and Android emulator against the synthetic gateway; RTL snapshot tests; TestFlight and Google Play internal builds produced by EAS from CI without secrets in the repo (signing credentials live in EAS/owner accounts, never committed); the same `openapi.json` revision powers web and mobile.

### Phase 6 — Safe release and testing for all three platforms

Depends on P4 and P5.

- Environments: local (synthetic), preview per PR (synthetic), staging (synthetic suppliers, mock payments, real infra), production (gated, flags off). Hosting choice is a decision (the research note's small VM example is not a selection).
- Observability: structured logs with PII redaction (names, phones, emails), request IDs, supplier call metrics, booking funnel metrics, error tracking; alerting on SUPPLIER_FAILED and REFUND_PENDING ageing.
- Data protection: backups, restore test, encryption at rest for guest data, data retention jobs, admin action audit, rate limiting on OTP and search.
- Release process: trunk = `migration/one-brain-foundation` until the merge gate to `main` is independently validated; semantic tags; changelog; rollback runbook; mobile staged rollouts (TestFlight → App Store phased release; Play internal → closed → production).
- Test pyramid summary: unit (packages), contract (OpenAPI + client), integration (gateway + Postgres via docker-compose in CI), e2e web (Playwright), e2e mobile (Maestro), synthetic fault-injection suite, load test on search (k6) with synthetic suppliers.

Acceptance: a release candidate passes the full pipeline from a clean clone; restore from backup verified on staging; a runbook exercise for "supplier confirmed after our timeout" completes without manual DB edits; privacy review checklist signed off and recorded in `DECISIONS.md`.

### Phase 7 — Prerequisites and gates for real suppliers and payments (not executed in this plan)

Each gate needs owner authorization and a decision record before any code path is switched on:

- Supplier gate (per supplier): signed agreement permitting the intended sales channel (research flags TBO's digital B2C restrictions and Nuitée settlement ambiguity); sandbox credentials stored only in the environment secret store; certification/test cases executed in sandbox; content/image licence recorded in `HotelContent.licence`; mapping of that supplier's catalogue run through P1 with review; `liveEnabled` flag per supplier; volume limits; reconciliation report format agreed. First candidate adapter: the existing RateHawk service wrapped as `RatehawkSupplierAdapter implements SupplierPort`.
- Payment gate: merchant account and KYC done by the owner; hosted checkout or tokenization only; webhook secret in the secret store; 3-D Secure; refund API tested in sandbox; settlement currency SAR; accounting confirmation of VAT handling; chargeback runbook.
- Mapping-service gate (optional): only if measured P1 recall on real catalogues is insufficient; compare written quotes (research 2026-11-02) before any subscription.
- WhatsApp gate: verified business, phone number ownership, approved templates, opt-in capture live.
- Licensing gate: owner's Ministry licence category/expiry verified privately (research 2026-11-01) before marketing concierge services.
- Production gate: P6 acceptance complete, security review of auth/payments/webhooks, privacy review, and the `main` merge gate validation.

## 9. Cross-cutting requirements

Arabic RTL and SAR: Arabic is the default locale on all platforms; every screen is built RTL-first and verified LTR; dates shown Gregorian with optional Hijri display later; SAR is the display currency, supplier currencies retained for audit; prices formatted server-side; Arabic hotel names from licensed content, with transliteration fallback marked as such.

Security and privacy: no secrets in git (`.env.example` placeholders only, CI secret scan); role-based guards on every admin route; OTP rate limits; JWT rotation; webhook verification; PII redaction in logs; guest data minimization; data-subject export/delete; synthetic data only until P7 gates; mock results can never be labelled live (`dataMode` propagated to every response and UI banner).

Reuse policy: keep file history with `git mv`; delete only after a decision record; do not rewrite the Siora UI, rewire it.

## 10. Milestones and effort (engineering judgment, not a quote)

| Milestone | Phases | Effort (hours) | Exit evidence |
|---|---|---|---|
| M0 Foundation | P0 | 20–30 | CI green, decisions 0003–0005 merged to the branch, insecure defaults gone |
| M1 Vertical slice | P1 | 170–270 (prototype 20–30 within) | 11 acceptance tests green, phase-1 report with measured false merges |
| M2 Web + API v1 | P2 | 60–90 | Playwright ar/en flows green, OpenAPI drift check |
| M3 Booking lifecycle | P3 | 80–120 | state-machine and refund tests green, no card data in clients |
| M4 Concierge + admin | P4 | 60–90 | synthetic WhatsApp → proposal → booking flow green |
| M5 Mobile | P5 | 120–180 | internal test builds from CI, Maestro flows green |
| M6 Release readiness | P6 | 40–60 | staging restore test, runbooks, privacy sign-off |
| M7 Live gates | P7 | contract-dependent | per-gate decision records |

Total before live gates: roughly 550–840 engineering hours. The M1 figure is the repository's existing 2026-11-02 estimate; all others are new estimates from this review and should be re-baselined after M1.

## 11. Open decisions for the owner (recommendation first)

- D1 Canonical line: adopt line A (gateway + web-client), archive line B under `legacy/`. Recommended; blocks P0.
- D2 Mobile stack: Expo/React Native sharing TypeScript packages (recommended) versus SwiftUI + Compose per `_native/*/README.md`. Needed before P5, not before P1.
- D3 Admin console: new React app in `apps/admin` (recommended) versus extending `apps/web/admin/index.html`. Needed before P1's review screen; a minimal page can start in either.
- D4 Numerals: Western digits for amounts by default with Arabic-Indic as preference (recommended). P2.
- D5 Hosting for staging/production: decision record in P6; no selection in this plan.
- D6 Implementation branching: feature branches from `migration/one-brain-foundation` merged by PR into it; `main` merge gate unchanged. Recommended.

## 12. Verification of this plan's execution

- Every phase runs in CI from a clean clone with `MOCK_MODE=1` and synthetic suppliers; no phase before P7 contacts any external host.
- Phase reports under `docs/plans/` record what ran, measured numbers (false merges, review time, test counts), and open risks; STATE.md and HANDOFF.md are updated and pushed only when authorized, then the remote revision is verified.
- Manual verification per phase: P1 reviewer walkthrough of the review queue; P2 Arabic RTL visual check on a phone-width viewport; P3 price-change and cancellation walkthrough with fault injection; P4 operator proposal walkthrough; P5 install on a physical iOS and Android device in Arabic; P6 release candidate dry run.

## 13. Session boundary

The planning session was plan-only: no application code, schema, config, deployment, secret, private file, paid service, booking or payment was created or changed. Recording this plan and the STATE.md/HANDOFF.md checkpoint is the only repository change from that session, committed on `migration/one-brain-foundation` and pushed only when the owner authorizes the push. Phase 0 starts in the next authorized session; owner decisions D1 and D3 are needed before Phase 0 and Phase 1 respectively.

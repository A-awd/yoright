# YoRight gap-aware foundation plan — 2026-11-16

Status: prepared on local branch `foundation/fable-52-code` (base `migration/one-brain-foundation` @ `d673ba5e752b4728bbcebf701b6e24cb78ac2aa4`). Not pushed, not merged. Owner authorization: foundation planning and isolated foundation implementation only ([decision 0006](../../decisions/0006-isolated-foundation-core.md)).

This plan extends, and does not replace, the recovered [2026-11-03 cross-platform plan](2026-11-03-cross-platform-implementation-plan.md). Where a section below says "unchanged", that plan's section is the specification. Evidence labels used throughout:

- **Verified** — inspected or executed in this session on this checkout.
- **Reported** — stated by an earlier session or document; not re-executed here.
- **Unknown** — no evidence available; must not be assumed.

---

## الملخص بالعربية

- فُحص المستودع المعتمد كما هو، ولم يُعثر على فرع المرحلة صفر الأصلي في أي مرجع متاح.
- لذلك لم يُعَد إنشاء ذلك العمل، ولم تُعَد اختباراته، وبقي استرداده شرطاً قبل أي دمج.
- أُضيفت حزمة منطق مستقلة لا تمس أي ملف قائم، وتغطي المال والمطابقة والمقارنة وحالات الحجز.
- اختُبرت الحزمة محلياً ببيانات اصطناعية فقط، ونجح واحد وثلاثون اختباراً.
- المنفَّذ اليوم فعلياً هو واجهة ويب وخادم للفنادق، وما عداه نطاق مستقبلي.
- التذاكر والباقات والجوال والدفع والمورّدون الحقيقيون كلها بوابات لاحقة تحتاج قرار المالك.
- لا يوجد في هذه الخطة أي مكوّن مدفوع إلزامي.

---

## 1. Actual state and source inventory

### 1.1 Refs (verified 2026-11-16)

| Ref | Head | Note |
|---|---|---|
| `origin/migration/one-brain-foundation` | `d673ba5` | Approved base; equals the audited head; local checkout was clean and in sync |
| `origin/main` | `03f05d9` | Stale; merge gate closed |
| `origin/codex/preserve-foundation-ui-20260721`, `origin/codex/preserve-main-search-20260721`, `origin/claude/cleanup-optimize-replit-3q0mT`, `origin/docs/easy-life-instructions-20260911` | present | Not inspected in depth this session; preserve |
| `feat/phase-0-foundation` | **absent** | Not on the remote, not in local refs |
| Commits `ba5aeb8`, `e0e4eb2`, `b48d3b8`, `8e5da0e` | **absent** | `git cat-file` finds none of them in this clone |
| `work/yoright-fable-platforms` | absent | Mentioned historically only |

### 1.2 Missing artifacts (explicit)

1. The five unpushed Phase 0 commits and their tree (legacy archive of 44 renames, seven package skeletons, lint/typecheck/unit/browser/CI/migration harness, JWT/admin/OTP/webhook/CORS/card-field hardening). **Reported** only.
2. Their test evidence (50 gateway, 7 package, 4 browser, 11 smoke, 5 startup-rejection checks; lint 0 errors / 66 warnings). **Reported**, never rerun outside the original session.
3. The original plan commit `ba5aeb8` as a Git object. The plan text itself is recovered: the file added here matches SHA-256 `5901e5d9f545b82af9857e83a3616552ad6dfb7b2e90494b47bffef48557611a`, 42,630 bytes (**verified** with `sha256sum` and `wc -c`). This is text identity with the source-editor recovery, not a claim of Git-blob identity with `ba5aeb8`.
4. Any native iOS or Android project. `_native/` holds two README files only (**verified**).
5. Supplier agreements, sandbox access, payment merchant account, WhatsApp business verification, licence status: **unknown** in the repository.

### 1.3 What exists at the base (verified by inspection, not by running it)

| Area | Evidence | State |
|---|---|---|
| Gateway `apps/gateway` | NestJS 10 + Fastify + Prisma; modules `admin, auth, bookings, city-intel, fx, health, hotels, payments, suppliers, webhooks`; ~3,900 lines in modules | Implemented for hotels; not built or run this session |
| Web client `apps/web-client` | React 18 + Vite + Tailwind; 13 pages (~5,900 lines) | Implemented for hotels; not built or run this session |
| Static admin `apps/web/admin` | single HTML page | Implemented, unauthenticated backend |
| Second line (Next.js) at repo root | `app/`, `lib/`, `components/`, `prisma/`, `messages/`, `i18n/` | Present; reported archived on the missing branch |
| Ticket research skill `skills/search-tickets` | skill, registry, validator, research notes | Research tooling only; not a product feature |
| Tests | no `*.test.*` / `*.spec.*` tracked outside the skill | None for the application |
| CI | `.github/` has templates only | None |
| Insecure defaults still present at base | hardcoded JWT fallback (`auth.service.ts:6`), admin controller without guards (no `UseGuards` anywhere in gateway), CORS wildcard default (`main.ts:21`), card fields in `Checkout.tsx:101–103`, 9 `Float` money columns in the gateway schema | **Verified present**; reported fixed only on the missing branch |

### 1.4 Implemented versus future scope

| Capability | Status |
|---|---|
| Hotel search/details/checkout UI, single-supplier (RateHawk-shaped) backend with mock path, mock payments, OTP/JWT auth | Implemented in source; live behaviour unverified |
| Multi-supplier canonical mapping, room matching, like-for-like comparison | Pure rules now in `packages/travel-core` (this branch); no persistence, API or UI yet |
| Server-authoritative totals, quotes, cancellation/refund flow, audit trail | Not implemented |
| Concierge / WhatsApp workflow | Not implemented (direction: decision 0002) |
| Match and event tickets, ticket + flight + hotel packages | Future scope, deferred (decision 0003); only a provisional comparison type exists |
| Flights, transfers, activities, visas | Future scope; nothing in the repository |
| iOS / Android apps | Not implemented; stack undecided |
| Real suppliers, real payments, production | Gated; not started |

## 2. Preserve / reuse / change map

| Item | Action | Reason |
|---|---|---|
| `apps/gateway` bootstrap, flags service, Swagger output, booking reference format, auth shape | Preserve, harden | Canonical line (decision 0005) |
| `ratehawk-api.service.ts` request map | Preserve; later wrap behind a supplier port | First real adapter candidate at the supplier gate |
| `ratehawk-api.service.ts` response transform with hardcoded content | Change | Fabricated fields must not reach a canonical model |
| `ratehawk-mock.service.ts` hotel content | Reuse as synthetic seed after removing third-party image URLs | Content rights unknown |
| `apps/web-client` pages and UI kit | Preserve layout; rewire data source in Phase 2 | Avoid a rewrite |
| `Checkout.tsx` card fields | Remove (Phase 0 scope) | Card data must never touch YoRight code |
| Client-computed booking totals; booking lookup by reference exposing guest data; placeholder webhook signatures | Change (open findings) | Three findings preserved from the 2026-11-12 handoff |
| Root Next.js line | Archive reversibly with `git mv` (Phase 0 scope, reportedly done on the missing branch) | Decision 0005 |
| `messages/*.json`, `translations.ts` | Reuse in a shared i18n package | One string source for web and mobile |
| `skills/search-tickets`, ticket research | Preserve untouched | Separate deferred track |
| `packages/travel-core` | New, additive | Independent of every file above |

## 3. Recovery dependency and integration order

Phase 0 was authorized and reportedly completed elsewhere. It is **not** redone here. Order of work:

1. **R0 — Recover.** Export `feat/phase-0-foundation` from the original session by a supported route (for example `git bundle create` inside that session and download, or an owner-authorized push of that branch only). Record the five commit IDs.
2. **R1 — Verify.** In a clean clone, rerun its own checks in mock mode and record actual results. Until this happens, its results stay "reported".
3. **R2 — Reconcile.** Rebase or merge it onto the current approved head (it was based on `d084467`; the approved branch has since moved to `d673ba5` with documentation-only commits). Renumber its decision records: its `0003` collides with the ticket decisions; this branch already uses `0006`, so the next free numbers are `0007+`.
4. **R3 — Integrate this branch.** `packages/travel-core` touches no shared file except `DECISIONS.md`, `STATE.md`, `HANDOFF.md` and `docs/plans/2026-11-03-…` (expected to be content-identical to `ba5aeb8`'s copy if that commit used the same path). Then decide whether to keep one package or `git mv` its modules into the recovered skeletons.
5. **If recovery proves impossible** (owner decision, not an assumption): redo Phase 0 from the recovered plan's section 8 on a fresh branch, clearly labelled as a second implementation.

Nothing in Phases 1+ that edits `apps/gateway`, `apps/web-client`, root manifests, `.github/` or Prisma should start before R2.

## 4. Architecture and module boundaries

Target layout is unchanged from the 2026-11-03 plan section 4. Boundary rules, now stated explicitly:

| Layer | May depend on | Must not |
|---|---|---|
| `packages/travel-core` (rules) | nothing | Perform I/O, read env, know about Nest/React/Prisma |
| Supplier adapters (synthetic first) | rules, their own fixtures | Leak supplier-specific fields past the port; rewrite rate keys |
| Gateway modules (`mapping`, `search`, `quotes`, `bookings`, `payments`, `concierge`, `admin`) | rules, adapters via ports, Prisma | Trust client-supplied prices; return unlabelled mock data |
| Generated API client | OpenAPI document | Be hand-edited |
| Web, mobile, admin clients | API client, i18n, design tokens | Compute prices, decide matching, hold card data |

Product-type neutrality: comparison and pricing in `travel-core` are generic over an offer with a customer total and a comparable key. Hotels supply one key function; tickets (future) supply another. Booking state, money and data-mode rules are shared. This lets the ticket track be added without reshaping the hotel path, and commits to no ticket supplier or sales model.

Paid components: none is required by this plan. PostgreSQL, NestJS, React, Vite, Prisma, Playwright and Node's test runner are open source. Hosting, SMS, payment, mapping-as-a-service, WhatsApp and app-store accounts are owner decisions at their gates, each with a mock port first.

## 5. Data model and API

Unchanged from the 2026-11-03 plan sections 5 and 6, with these additions:

- **Authoritative totals.** `POST /v1/bookings` accepts a `quoteId`, never an amount. Closes the client-supplied-total finding.
- **Booking read access.** `GET /v1/bookings/{reference}` requires the owning session or a second factor bound to the booking; the reference alone must not return guest details. Closes the reference-exposure finding. The exact second factor is an open design point.
- **Webhook verification.** One verifier interface per provider with that provider's real scheme before any live use; the mock verifier is rejected when a live flag is on.
- **Ticket readiness (future, not built).** If the ticket track is approved, add `CanonicalEvent`, `EventSeatingCategory`, `SupplierEventIdentity`, `TicketOffer` alongside the hotel models, and a `productType` discriminator on `Quote`/`Booking`. Do not generalize hotel tables in advance.
- **Mapping to `travel-core`.** `PropertyMatchCandidate.reasons/score` ← `evaluateMatch`; `CanonicalRoom.signature` ← `RoomSignature`; `Offer.comparableKey` ← `hotelComparableKey`; `FxRate` rows ← `FxRate`; `MarginRule` basis points ← `priceInSar`; `Booking.state` ← `BookingState`.

## 6. Technology choices and tradeoffs

| Choice | Recommendation | Alternative | Tradeoff | Status |
|---|---|---|---|---|
| Backend | Keep NestJS + Fastify + Prisma + PostgreSQL | Rewrite | Existing code and history are reusable; a rewrite buys nothing proven | Decided (0005) |
| Web | Keep React + Vite SPA | Next.js line | SPA is the more complete line; server rendering for SEO can be revisited later | Decided (0005) |
| Shared rules | Plain TypeScript package, CommonJS output | ESM-only | CommonJS loads in Nest today and in Vite; reversible | Provisional |
| Test runner for rules | Node built-in `node:test` | Vitest / Jest | Zero dependencies now; the recovered harness may standardize on another runner, migration is mechanical | Provisional |
| Mobile | Not chosen here | (a) React Native / Expo sharing TypeScript packages; (b) SwiftUI + Jetpack Compose; (c) wrapped responsive web | (a) one language, shares `travel-core`, some native-fidelity cost; (b) best platform fidelity, two codebases, rules must be reimplemented or served only by API; (c) cheapest, weakest app-store and UX standing | **Owner decision (D2)** |
| Admin console | Not chosen here | New React app vs extending the static page | New app shares client and tokens; static page is quicker for one review screen | **Owner decision (D3)** |
| Numerals | Parameterized in code | Western vs Arabic-Indic default | `formatMoney` takes the numeral system; default `latn` is provisional | **Owner decision (D4)** |
| Hosting, SMS, payments, WhatsApp | Mock ports first | Any provider | No provider is selected or implied | **Owner decisions at gates** |

AI tooling note: development tools (Claude Code, OpenCode, Codex) are not product dependencies. The product does not require in-app AI inference; the matching rules are deterministic, and any later AI ranking of review candidates would be optional and unable to approve a match.

## 7. Security and privacy

Unchanged from the 2026-11-03 plan sections 3.4 and 9, plus:

- The insecure defaults listed in 1.3 are still present on the approved base. Their removal is Phase 0 scope and depends on recovery (R0–R2); they are not patched a second time on this branch to avoid divergent fixes.
- The three open findings (guest data by booking reference, client-supplied totals, placeholder webhook signatures) remain open and are mapped to API changes in section 5.
- Synthetic-only rule: every response carries a data mode; any synthetic component makes the whole response synthetic (`combineDataModes`).
- No secrets, traveler data, bookings or supplier responses in Git; fixtures are invented and labelled.
- Privacy review and the `main` merge gate stay closed until independently validated.

## 8. Phases, acceptance criteria and dependencies

| Phase | Scope | Depends on | Acceptance (summary) |
|---|---|---|---|
| R | Recover, verify, reconcile Phase 0 (section 3) | Owner-supported export | Branch present in a clean clone; its checks rerun and recorded; decision numbers reconciled |
| 0 | Foundation and safety (2026-11-03 plan section 8) | R | CI green; unauthenticated admin write returns 401; gateway refuses to boot without a JWT secret; no card state in the web client |
| 1a | Pure rules — **done on this branch** | none | 31 synthetic tests pass (section 10) |
| 1b | Synthetic suppliers A/B behind a supplier port, with fault injection | R, 1a | Fixture set covers acceptance cases 1–11; no network calls |
| 1c | Gateway `mapping` + `search` modules, Prisma models, review queue, minimal review screen | 1b, D3 | Acceptance cases 1–11 pass end to end in CI; reviewer decision persists with audit row |
| 2 | API v1, generated client, web rewiring, Arabic RTL and SAR | 1c, D4 | OpenAPI drift check; Playwright flows in Arabic and English; no client-side price arithmetic |
| 3 | Quotes, booking state machine, mock payment port, cancellation and refunds | 2 | Illegal transitions rejected; idempotent booking; refund equals captured minus penalty; bad webhook signatures rejected |
| 4 | Concierge workflow, mock messaging channel, admin console | 3 | Synthetic inbound message → proposal → booking with a recorded human decision |
| 5 | Mobile apps | 2, 3, D2 | Flows on simulator and emulator against the synthetic gateway; RTL checks; same API revision as web |
| 6 | Release readiness | 4, 5, D5 | Clean-clone pipeline; restore test; runbooks; privacy review recorded |
| T | Tickets and packages (future) | Owner resumes decision 0003; supplier and resale authorization evidence | Separate plan; reuses comparison, money and booking state; no sales before authorization evidence |
| 7 | Live gates: suppliers, payments, WhatsApp, licensing, production | 6 and per-gate owner decisions | Per-gate decision record; nothing switched on by default |

Effort figures in the 2026-11-03 plan section 10 are that plan's engineering estimates; they are not re-derived here and are not a quote or commitment.

## 9. Testing, release and deployment requirements

- **Testing pyramid:** unit (rules — exists), contract (OpenAPI versus generated client), integration (gateway + PostgreSQL in CI), end-to-end web (Playwright, already available without a paid service), end-to-end mobile (after D2), fault-injection suite on synthetic suppliers.
- **Every phase before the live gates runs from a clean clone in mock mode and contacts no external supplier, payment or messaging host.**
- **Release:** feature branches into the approved branch by pull request when the owner authorizes; `main` merge gate unchanged; tags, changelog and rollback runbook in Phase 6.
- **Deployment:** no environment is selected or created by this plan. Requirements to state at the hosting decision: PostgreSQL with backups and tested restore, a secret store, TLS, log redaction of personal data, per-environment feature flags defaulting to off.
- **Mobile release** (after D2): signing material held in the owner's accounts, never in Git; internal test tracks before any store submission.

## 10. Foundation implemented on this branch

Package `packages/travel-core` — pure TypeScript, zero runtime dependencies. See its [README](../../packages/travel-core/README.md).

Executed in this session (Node v22.23.4, TypeScript 5.9.3 installed outside the repository):

```
tsc -p tsconfig.json                    → exit 0, no diagnostics
node --test "dist/test/*.test.js"       → tests 31, pass 31, fail 0
```

Coverage against the 2026-11-03 acceptance list, at rule level only (no API, database or UI is involved):

| Case | Rule-level test | End-to-end status |
|---|---|---|
| 1 Two towers never auto-merged | yes | pending 1c |
| 2 Renamed verified property raises review | no (needs snapshots/persistence) | pending 1c |
| 3 Name-only match goes to review | yes | pending 1c |
| 4 Unknown bed never joins a group | yes | pending 1c |
| 5 King/queen, full/partial view distinct | yes | pending 1c |
| 6 Terms split comparable sets | yes | pending 1c |
| 7 Foreign currency needs a stored FX rate | yes | pending 1c |
| 8 Rate keys untouched | yes (through comparison only) | pending 1b–3 |
| 9 Supplier timeout gives partial results | no (needs adapters) | pending 1b |
| 10 Synthetic data mode propagates | yes (combination rule only) | pending 1c–2 |
| 11 Zero false merges on fixtures | yes, on a 5-property synthetic set | pending the ≈60-property fixture set in 1b |

Not done on this branch: gateway or web changes, Prisma models, synthetic supplier adapters, CI, lint configuration, Phase 0 hardening, any build or run of the existing applications.

## 11. Unresolved owner decisions

| ID | Decision | Needed before | Recommendation |
|---|---|---|---|
| R0 | Route to recover the original Phase 0 branch (bundle export, or authorized push of that branch) | Any gateway/web work | Export a Git bundle from the original session |
| D2 | Mobile stack | Phase 5 | Decide after Phase 2, with the working API in hand |
| D3 | Admin console shape | Phase 1c | New React app sharing the generated client |
| D4 | Default numerals | Phase 2 | Western digits, Arabic-Indic as preference |
| D5 | Hosting | Phase 6 | No selection yet |
| D7 | One rules package or split into the recovered skeletons | After R2 | Decide when the skeletons are visible |
| D8 | Second factor for booking lookup by reference | Phase 3 | Design with the privacy review |
| D9 | VAT treatment in pricing | Before Phase 3 totals are final | Needs the owner's accountant; no assumption made in code |
| D10 | Whether and when to resume the ticket/package track | Phase T | Keep deferred until supplier/resale authorization evidence exists |

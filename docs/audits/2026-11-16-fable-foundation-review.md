# Independent review of Fable foundation — 2026-11-16

Status: preserved for review; **changes requested before integration**. No merge, production or paid/live activation.

## Reviewed artifact and provenance
Fable5.2 / Medium / Accept edits produced commit `7cefc64deaa972ab964c4c89e1898ca5d86b2078` on `foundation/fable-52-code`, parent `d673ba5e752b4728bbcebf701b6e24cb78ac2aa4`. Read the exact remote commit and all26 changed files. Changes are additive code/docs plus STATE/HANDOFF/DECISIONS; no existing application implementation changed. Fable pushed the branch after the owner's explicit preservation authorization. Its earlier “not pushed” wording is historical and superseded by this verified publication.

## What was delivered
- Original recovered plan and a219-line gap-aware continuation plan.
- Framework-free TypeScript travel-core: integer money/FX, hotel matching, room signatures, offer grouping, booking states, provisional ticket comparison.
-31 synthetic tests and clear disclosure that the package is not integrated with gateway/web/mobile.
- Original five-commit Phase0 branch remains missing from this new checkout. Recovery is still required; no restoration inferred.

## Independent checks on the Mac
Node24.22.3, TypeScript5.9.3 downloaded from npm registry outside the project:
- `npx --yes --package typescript@5.9.3 tsc -p tsconfig.json` in packages/travel-core: exit0.
- `node --test 'dist/test/*.test.js'`:31 passed,0failed.
- Added review probes below executed against compiled code; not edits to Fable's implementation.
No gateway/web build, provider request or live account operation. No claim of integration/device readiness.

## Findings
### YR-01 — P1: grouping ignores room-size mismatch
`src/room-matching.ts: roomGroupKey` omits size, although `roomsEquivalent` rejects a size difference above10%. Two otherwise identical rooms of20m² and60m² return SIZE_DIFFERS from roomsEquivalent, but identical grouping keys; `buildComparableSets(..., hotelComparableKey)` ranks them in one set. Reproduced on the Mac.
Required: one consistent conservative equivalence/grouping contract, with regression tests spanning non-equivalent sizes. Do not rely on the unused pairwise helper.

### YR-02 — P1: manual-review path bypasses lifecycle prerequisites
`src/booking-state.ts` permits QUOTED → MANUAL_REVIEW → CONFIRMED without PAYMENT_AUTHORIZED or SUPPLIER_PENDING. Both transitions return true. The current tests reject direct shortcuts but miss this path.
Required: retain previous state/allowed resolution and require payment/supplier evidence in the transition contract. Operator review must not manufacture confirmation. Currently standalone code, not an observed live booking incident.

### YR-03 — P2: like-for-like context is incomplete
`HotelOffer/hotelComparableKey` has no check-in/out/search-context identity and no detailed cancellation deadlines/penalties. FREE/PARTIAL labels alone do not establish equal cancellation conditions. Offers with different added cancellation deadlines produce the same key; callers cannot express those terms in the declared contract.
Required: encode immutable stay/search and cancellation-policy identity or enforce a documented validated context at the API boundary, with mixed-context regression tests before integration.

## Plan assessment and next action
The plan correctly separates implemented source from future scope, keeps the old Phase0 recovery dependency explicit, and avoids a forced rewrite or final mobile/hosting selection. The31-test green result is useful but does not establish correct commercial comparison or booking safety: the counterexamples above remain.
Preserve original implementation commit unchanged; fix findings on a separate follow-up commit/branch and rerun affected tests. Recover Phase0, reconcile decision numbering and validate in isolation before any integration authorization. No main/base merge or live enablement is authorized by this review.

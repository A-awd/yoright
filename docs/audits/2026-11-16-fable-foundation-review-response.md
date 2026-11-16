# Response to the independent foundation review — 2026-11-16

Responds to [the review](2026-11-16-fable-foundation-review.md) of `7cefc64` on `foundation/fable-52-code`.
Fixes are on branch `review-fix/fable-52-foundation`, created from the reviewed branch head `f06d7d1c277fdb92f9428210835e6c51a2fd6396`. The reviewed commit is unchanged. Scope: `packages/travel-core` and continuity documents only. No gateway, web, root build, schema or Phase 0 change. Not merged; not an acceptance.

All three findings were reproduced before any edit and are accepted as correct. One is broader than reported (YR-01, below).

## Reproduction before the fix (compiled code at `f06d7d1`)

```
YR-01  roomsEquivalent(20 m2, 60 m2) -> { equivalent: false, reasons: ['SIZE_DIFFERS'] }; group keys equal -> true
YR-01b roomsEquivalent(class known, class unknown) -> equivalent: true; group keys equal -> false
YR-02  canTransition('QUOTED','MANUAL_REVIEW') -> true; canTransition('MANUAL_REVIEW','CONFIRMED') -> true
```

## YR-01 — room-size grouping inconsistency (P1): fixed

Root cause: two independent definitions of "same room" (a pairwise helper with a 10 % size tolerance, and a grouping key that ignored size).

Reasoned correction to the finding: the defect is not only size. The two definitions also disagreed in the opposite direction for class and smoking (`YR-01b` above: pairwise said equivalent, keys differed). And a relative tolerance can never define groups because it is not transitive (20≈22, 22≈24, 20≉24), so "add the tolerance to the key" or a fuzzy bucket would have been a second wrong contract.

Contract now (`src/room-matching.ts`): one internal `roomIdentity`; `roomGroupKey` serialises it and `roomsEquivalent` compares it field by field, so they cannot disagree. Fail-closed rules: every field must be identical including "unknown"; size is whole square metres with no tolerance; non-positive or non-finite size is unknown; non-integer or non-positive occupancy is unverified. Near-equal sizes are left to a human reviewer.

Behaviour change to note: rooms that differ only by one side not stating size, class or smoking no longer group. This lowers recall deliberately; it never creates a false merge.

Tests (`test/rooms-offers.test.ts`): `YR-01: 20 m2 and 60 m2 …` (pairwise, key and `buildComparableSets`), `YR-01: no tolerance chain …`, `YR-01: pairwise equivalence and group key agree for every pair in a mixed matrix` (432 variants, 186,624 ordered pairs), `YR-01: unknown size, class or smoking …` (includes the normal successful grouping).

## YR-02 — manual-review bypass (P1): fixed

Root cause: transitions were decided from two state names; `MANUAL_REVIEW` had a fixed exit list unrelated to where the hold was placed, and no state required evidence.

Contract now (`src/booking-state.ts`): transitions are decided from a `BookingRecord` (`state`, `heldFrom`, `paymentRef`, `supplierConfirmationRef`, `refundRef`).
- A hold stores `heldFrom`. From `MANUAL_REVIEW` the only targets are that state (release) or the steps that state already allowed, under the same evidence rules. No nested holds.
- Evidence is required to be in a state: payment reference from `PAYMENT_AUTHORIZED` onward; supplier confirmation reference for `CONFIRMED`, `CANCELLATION_REQUESTED`, `CANCELLED`; refund reference for `REFUNDED`, `REFUND_PARTIAL`.
- Evidence can be added once and never replaced or cleared; a record that violates the invariants accepts no transition.
- The context-free `canTransition(from, to)` and `assertTransition` were removed; replaced by `checkTransition`, `canTransition(record, to, evidence)`, `applyTransition`, `nextStates(record)`, `newBooking`, `recordIssues`.

Limit stated honestly: this pure layer checks that a reference is present and consistent. Proving it is genuine (provider webhook signature, supplier response) is the owning service's job and is not implemented; the gateway's placeholder webhook signing remains an open finding.

Tests (`test/booking-state.test.ts`): `YR-02: QUOTED -> MANUAL_REVIEW -> CONFIRMED is refused, with or without claimed evidence`; `YR-02: no hold placed at any state opens a path …` (every holdable state × every target); `YR-02: exhaustive search finds no confirmed booking without payment and supplier evidence` (explores every reachable record under every evidence combination and still reaches all 15 states); evidence, forgery and three normal-path tests.

## YR-03 — incomplete like-for-like context (P2): fixed in the offer contract

Chosen option: encode the identity in the contract rather than rely on an undocumented caller precondition.

Contract now (`src/hotel-offers.ts`): `HotelOffer` requires `stay` (`checkIn`, `checkOut`, `roomCount`, `guestResidency`) and `cancellationPolicy` (rules of deadline instant + penalty, where a penalty is a percentage of the total in basis points or a currency amount). Both are part of `hotelComparableKey`. Deadlines are compared as instants, so the same moment written with another offset matches, and rule order does not matter. Fail-closed: a `FREE` or `PARTIAL` offer without a schedule, an invalid date or deadline, an out-of-range penalty, or two rules at the same instant yields no key, so the offer is shown but never ranked. New `hotelComparabilityIssues` returns the reasons.

Known conservative limits, not hidden: a percentage penalty and an amount penalty never match, and amounts in different currencies never match, even when economically equal. Only a non-refundable offer is accepted without a schedule.

Tests (`test/rooms-offers.test.ts`): `YR-03: different stay dates, room counts or residency …`, `YR-03: equal labels with different deadlines or penalties …`, `YR-03: the same schedule written differently still matches`, `YR-03: missing or malformed context fails closed with a stated reason` (11 cases plus two normal successes). Existing tests and fixtures were updated to the new required fields.

## Executed evidence

Environment: Node v22.23.4, TypeScript 5.9.3 installed outside the repository; synthetic data only; no network call by the package or tests. Run from `packages/travel-core`:

```
tsc -p tsconfig.json                 -> exit 0, no diagnostics
node --test "dist/test/*.test.js"    -> tests 44, pass 44, fail 0   (31 before; 8 room and offer tests added; the 4 booking tests replaced by 9)
```

Probes on the fixed build:

```
YR-01  roomsEquivalent(20, 60) -> { equivalent: false, reasons: ['SIZE_DIFFERS'] }; group keys equal -> false
YR-02  QUOTED -> MANUAL_REVIEW, then CONFIRMED with payment and supplier refs supplied
       -> { ok: false, reason: 'ILLEGAL_TRANSITION:MANUAL_REVIEW->CONFIRMED' }
```

Mutation check on a throwaway copy of the compiled output (not committed), to confirm the new tests detect each regression:

| Reintroduced defect | Failing tests |
|---|---|
| Size removed from room identity | 3 |
| Old fixed `MANUAL_REVIEW` exit list restored | 2 |
| Stay context removed from the key | 1 |
| Cancellation schedule removed from the key | 1 |
| Supplier-confirmation evidence check disabled | 2 |

## Not changed, still open

- Provisional `ticket-offers` type has the same class of gap as YR-03 (refund label without a schedule). Left as is: it is future scope and outside the three findings; it must be closed before any ticket work starts.
- Original Phase 0 branch is still unrecovered; its reported results are still not rerun.
- Insecure defaults on the approved base, and the three application findings (guest data by booking reference, client-supplied totals, placeholder webhook signatures), are untouched and open.
- `travel-core` is still not imported by any application; no gateway or web build was run.
- Decision-number reconciliation for the recovered plan is still pending.

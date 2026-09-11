## Instruction reconciliation — 2026-09-11

Consolidated duplicated session instructions while preserving project-specific safeguards, current decisions, and implementation history. Preserved the approved migration ref and its unmerged gates.

Prepared on `docs/easy-life-instructions-20260911`; canonical-ref adoption is pending. This checkpoint changes documentation only. Existing operational evidence and unfinished work below remain valid within their dated scope; refresh live facts before acting. No historical files, platform projects, settings, or production systems were changed.

---

# Project State

## Current phase

One Brain foundation, clone reconciliation, and security review.

## Approved state

- Canonical name: yoright.
- Project type: active Arabic-first online travel agency project.
- GitHub is the permanent source of truth.
- Existing application code and Git history must be preserved.
- Booking-supplier integrations include RateHawk and Travelopro, with implementation history involving hosted development tooling.

## Migration concerns

The inventory reports competing clones or architecture paths and insecure default administrative access. No credential value is recorded here. Privacy treatment for traveler and booking data also requires explicit validation.

## Merge gate

Do not merge the migration branch until clone reconciliation, removal of insecure default access, and the traveler-data privacy review are complete and independently validated.

## Next action

Reconcile clones and architecture paths, remove insecure default access through an authorized security change, and complete a privacy review before approving a canonical implementation line.

## Constraints

Do not copy traveler, booking, identity, payment, or supplier-response data into documentation. Do not change production systems during repository migration.

## Repository synchronization evidence

- Verified: 2026-07-18
- Canonical repository: `A-awd/yoright`
- Approved default branch: `main`
- Verified effective ref: `migration/one-brain-foundation`
- Verified baseline revision: `96e6b97042d9015b292bf977792e04c61aeef384`
- Evidence: the One Brain documents were refreshed from that exact GitHub revision; no business code or production system was changed.
- Runtime requirement: each agent must fetch or inspect the branch tip and remote synchronization state again before work. Local working-tree state was not inferred through the connector.

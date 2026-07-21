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

## Foundation UI preservation review

- Draft pull request [#2](https://github.com/A-awd/yoright/pull/2) preserves seven UI source files from a distinct foundation-based working state on `codex/preserve-foundation-ui-20260721`.
- The preserved source snapshot is commit `8146d2e23e8a08d5e7b0b9b36882ffd79799591f`, based on `migration/one-brain-foundation` at `273f45b24166b7fbe392faba979f62c90062aa01`.
- Incidental generated lockfile drift was excluded. The web-client production build passed for the preserved source snapshot.
- This review branch is preservation evidence, not a decision that its UI or architecture is canonical. The existing merge, security, and privacy gates remain unchanged.

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

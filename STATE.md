## Owner direction and research checkpoint — 2026-10-01

The owner is restarting YoRight as a WhatsApp travel concierge and explicitly deferred email review to a later phase. Current priority is supplier access and a practical automation path rather than building a new customer app. This does not resolve the historical clone or security gates below.

Official-source research covers 17 hotel supplier/access routes, additional activities and transfers, retail versus API access, Saudi licensing/TIDS distinctions, payment and cancellation risks, and a proposed 30-case matched-quote pilot. See [research report](docs/research/2026-10-01-whatsapp-concierge/YoRight-Travel-Research-2026-10-01.md) and [AI review audit](docs/research/2026-10-01-whatsapp-concierge/YoRight-AI-Research-Audit.md).

The existing RateHawk account and attractive historical prices are owner-reported, not live-verified. No email was read, supplier contacted, account created, terms accepted, booking placed, payment made, or production integration changed. No cheapest-supplier result or Saudi onboarding approval is established.

Next: collect five target destinations and hotel segment; complete Kimi sign-in and Claude review if pending; review travel correspondence only when the owner starts that phase, then prepare accurate supplier applications. Private document paths are not established in this checkpoint. Preserve the migration merge gate and security work below.

Verified starting approved ref: `migration/one-brain-foundation`, revision `a4ac915848523f75f3e8400cc3295606dcd0d3a2` (PR #3 merged). This is documentation-only progress.

## Instruction reconciliation — 2026-09-11

Consolidated duplicated session instructions while preserving project-specific safeguards, current decisions, and implementation history. Preserved the approved migration ref and its unmerged gates.

Owner authorized adoption under the Easy Life standing delegation on 2026-09-11. Prepared through PR #3; effective on the approved ref once that PR is merged. Verify its merge receipt before claiming adoption. This checkpoint changes documentation only. Existing operational evidence and unfinished work below remain valid within their dated scope; refresh live facts before acting. No historical files, platform projects, settings, or production systems were changed.

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

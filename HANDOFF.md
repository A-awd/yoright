# Handoff

## Resume from

The One Brain operating foundation is defined. The repository still requires a documented choice among competing clones or architecture paths and remediation of insecure default access.

## Next operator action

1. Inventory and compare the known implementation copies without exposing secrets.
2. Select the canonical path through an explicit decision.
3. Remove insecure defaults and verify authentication under separate authorization.
4. Review how traveler, booking, identity, and payment data are handled.
5. Update STATE.md and DECISIONS.md with validated outcomes.

## Foundation UI preservation branch

- Draft pull request: [#2](https://github.com/A-awd/yoright/pull/2).
- Review branch: `codex/preserve-foundation-ui-20260721`.
- Base revision: `migration/one-brain-foundation` at `273f45b24166b7fbe392faba979f62c90062aa01`.
- Preserved source snapshot: `8146d2e23e8a08d5e7b0b9b36882ffd79799591f`.
- Scope: seven web-client UI source files. Generated lockfile drift and unrelated files were excluded.
- Validation: the preserved source snapshot passed the web-client production build and contains no added credential values, private records, or generated outputs.
- Next safe action: review the UI changes against the chosen canonical implementation, security remediation, and traveler-data privacy gate. Keep the pull request Draft and unmerged until those gates close.

## Do not do

Do not paste credential values, import live booking data, merge competing implementations by assumption, or modify live services without an approved execution plan.

## Completion signal

One implementation is authoritative in GitHub, insecure defaults are removed, privacy controls are documented and validated, and the next product action is precise.

## Repository synchronization evidence

- Verified: 2026-07-18
- Canonical repository: `A-awd/yoright`
- Approved default branch: `main`
- Verified effective ref: `migration/one-brain-foundation`
- Verified baseline revision: `96e6b97042d9015b292bf977792e04c61aeef384`
- Evidence: the One Brain documents were refreshed from that exact GitHub revision; no business code or production system was changed.
- Runtime requirement: each agent must fetch or inspect the branch tip and remote synchronization state again before work. Local working-tree state was not inferred through the connector.

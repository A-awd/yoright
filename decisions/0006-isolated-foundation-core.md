# 0006 — Isolated foundation core and scoped execution authority

Date: 2026-11-16.
Status: owner-authorized for this scope; local branch only, not pushed, not merged.

## Decision

The owner authorized one Claude Code session to produce a gap-aware implementation plan and a small isolated foundation implementation. This supersedes the planning-only model role in [0005](0005-canonical-line-and-model-roles.md) only for that session's foundation planning and isolated foundation code. Every other limit in 0005 stands.

The foundation code is a new framework-free package, `packages/travel-core`, on local branch `foundation/fable-52-code` created from `migration/one-brain-foundation` at `d673ba5`. It is intentionally placed where it cannot overlap the unrecovered original Phase 0 branch (`feat/phase-0-foundation`).

## Consequences

- Recovery of the original Phase 0 branch remains a dependency for integrating anything into `apps/gateway`, `apps/web-client`, root tooling or CI. It was not recreated, and its reported test results were not rerun.
- No existing application file, root manifest, lockfile, schema or configuration was changed.
- Ticket types in the package are provisional comparison shapes for the deferred scope of [0003](0003-future-sports-and-event-ticket-packages.md); they do not activate ticket sales.
- Phase 1 gateway/web work, mobile stack, admin-console shape, numeral default, VAT treatment, hosting, suppliers and payments remain undecided or gated.
- Decision numbers `0003`–`0005` used inside the recovered 2026-11-03 plan refer to that plan's own proposed records and collide with this repository's numbering; they must be renumbered on integration.

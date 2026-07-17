# yoright

yoright is the canonical One Brain repository for the Arabic-first online travel agency project. GitHub is the only permanent source of truth for approved code, documentation, decisions, and operational state.

## Scope

The project covers the travel product, its web application, and sanitized integration guidance for booking and supplier APIs. Existing clones and competing architecture paths must be reconciled before one implementation is declared canonical.

## Operating documents

- [AGENTS.md](AGENTS.md) — binding project instructions.
- [STATE.md](STATE.md) — current state and next action.
- [HANDOFF.md](HANDOFF.md) — continuity for the next session.
- [DECISIONS.md](DECISIONS.md) — durable decision index.
- [LAUNCHER.md](LAUNCHER.md) — vendor-neutral launch protocol.
- [Project overview](docs/PROJECT-OVERVIEW.md) — sanitized product context.
- [Migration source index](migration/SOURCE-INDEX.md) — approved source classes and exclusions.

## Safety boundary

Do not commit credentials, default passwords, traveler information, booking records, passport or residency identifiers, payment data, or unsanitized API responses. Documentation migration does not authorize changes to live booking, hosting, database, or identity systems.


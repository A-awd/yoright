# AI Operating Model

## Role

`yoright` is a production-grade OTA platform. It owns booking flows, supplier integrations, payment flows, admin operations, and travel product UX.

## Durable Memory

- GitHub issues: features, bugs, integration tasks, operational incidents.
- Pull requests: implementation and verification records.
- `docs/architecture/`: long-lived architecture decisions.
- `docs/ai/REPO_HEALTH.md`: repo maturity, risks, and hardening backlog.

## Workflow

1. Claude handles architecture decisions for booking, supplier, payment, and data boundaries.
2. Codex implements with tests, migrations, and deterministic verification.
3. Gemini can compare supplier APIs, payment patterns, travel UX, and risk models.
4. Supabase/Postgres changes are additive and reviewed through migrations.
5. n8n workflows should be represented through docs or sanitized workflow exports.

## High-Risk Areas

- Payments and webhooks.
- Authentication/session handling.
- Supplier credentials and booking creation.
- User and booking data.
- Admin actions.

Changes in these areas require explicit verification notes.

# AGENTS.md

This repository participates in the A-awd GitHub-first AI operating system.

## Repository Role

`yoright` is a production-style online travel agency platform. Treat it as high-risk application infrastructure because it touches bookings, suppliers, payments, users, and operational workflows.

## AI Role Contract

- Claude: architecture, product direction, supplier/payment strategy, risk analysis.
- Codex: implementation, tests, migrations, CI, operational hardening.
- Gemini: research, external API comparison, product and security critique.

## Operating Rules

- Read `docs/ai/OPERATING_MODEL.md` before substantial work.
- Never commit supplier credentials, payment secrets, user data, booking data, JWT secrets, or database credentials.
- Prefer additive migrations and reversible changes.
- Payment, auth, webhook, and booking changes require tests or explicit verification notes.
- Use GitHub issues/PRs as durable memory; chat context is not authoritative.

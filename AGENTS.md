# Agent Instructions

These instructions apply equally to Claude, Codex, ChatGPT, Hermes, and future launchers.

## Start every session

1. Open yoright and inspect the latest GitHub branch and commit state.
2. Read README.md, this file, STATE.md, HANDOFF.md, and relevant DECISIONS.md entries.
3. Use ai-operating-system only for global guidance; yoright operational memory belongs here.
4. Treat local clones, hosted-platform state, AI memory, and raw conversations as non-authoritative until reconciled with GitHub.

## Working rules

- Preserve useful implementation and Git history while clones and architectures are reconciled.
- Never commit credentials, traveler records, bookings, identity documents, payment data, or unsanitized supplier responses.
- Do not alter live booking, hosting, database, authentication, repository settings, or production state without explicit authorization.
- Remove insecure defaults through an approved change without documenting their values.
- Resolve conflicts through the latest approved GitHub state and DECISIONS.md.

## End every meaningful session

Update STATE.md and HANDOFF.md, record decisions when needed, and commit and push approved work when authorized. Leave a precise next action independent of launcher-local memory.

## Session contract

Verify the canonical remote, approved ref, working tree, latest local and remote commits, and synchronization state. Read `README.md`, `AGENTS.md`, `STATE.md`, `HANDOFF.md`, `DECISIONS.md`, `LAUNCHER.md`, and relevant linked decisions and security guidance. The latest approved GitHub state governs sanitized instructions and continuity; platform instructions and conversations supplement verified gaps and never roll back newer decisions. Apply explicit current owner instructions when they supersede earlier policy.

After meaningful work, validate the exact change, update `STATE.md` and `HANDOFF.md`, record durable decisions, and record blockers and the next safe action. Commit and push when authorized, then verify the remote revision. Unpushed work is not durable GitHub completion. Keep project memory here; use `A-awd/ai-operating-system` only for global governance.

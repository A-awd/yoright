# Repo Health

## Snapshot

- Repository: `A-awd/yoright`
- Visibility: public
- Type: OTA monorepo
- Maturity: high ambition, needs production hardening discipline
- Risk: high, because bookings, payments, users, supplier APIs, and admin tools are involved

## Observed

- Monorepo with `apps/*`, `packages/*`, and `tools/*` workspaces.
- README documents a large production feature surface.
- Root scripts include build, lint, test, seed, and smoke commands.

## Required Hardening

- [ ] Ensure secrets are not in README examples beyond placeholders.
- [ ] Add/verify CI for lint, test, build, and smoke.
- [ ] Document supplier adapter contracts in `docs/architecture/`.
- [ ] Document payment/webhook idempotency and rollback.
- [ ] Add migration discipline docs for database changes.
- [ ] Add operational runbooks for booking incidents.

## AI Notes

Treat `yoright` as the most operationally sensitive repo in the ecosystem.

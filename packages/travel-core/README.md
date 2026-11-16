# @yoright/travel-core

Framework-free domain rules for YoRight. Pure TypeScript, no runtime dependencies, no I/O, no network, no secrets. Everything in `test/` is synthetic.

| Module | Purpose |
|---|---|
| `money` | Integer minor units, decimal-string parsing, basis-point margin, FX conversion that returns the rate record used |
| `text`, `geo` | Arabic/Latin normalisation, name similarity, distinguishing tokens, haversine distance |
| `hotel-matching` | Evidence collection and `AUTO_ACCEPT / REVIEW / REJECT` decision for two property records |
| `room-matching` | Room signature extraction (ar/en) and conservative equivalence; unknown critical attributes never match |
| `comparison` | SAR pricing with FX provenance, like-for-like comparable sets, data-mode propagation |
| `hotel-offers` | Hotel offer shape and comparable key |
| `ticket-offers` | Provisional, future-scope ticket offer shape and comparable key (decision 0003; not a sales capability) |
| `booking-state` | Booking lifecycle transition table |

## Commands

From this directory, with TypeScript 5.x available (`npm install` at the repo root provides it through the gateway's dev dependency):

```bash
npm run typecheck
```

```bash
npm test
```

Without installing anything into the repository:

```bash
npx --yes -p typescript@5.9.3 tsc -p tsconfig.json && node --test "dist/test/*.test.js"
```

## Integration notes

- Not yet imported by `apps/gateway` or `apps/web-client`. Wiring it in belongs to Phase 1 and must follow recovery of the original Phase 0 branch.
- The unrecovered Phase 0 branch reportedly created seven package skeletons (`domain`, `money`, `mapping-core`, `supplier-sdk`, `api-client`, `i18n`, `design-tokens`). This package deliberately uses a different path so nothing collides. After recovery, either keep it as one package or move modules into those skeletons with `git mv`; the public API in `src/index.ts` is the stable surface either way.
- Thresholds in `DEFAULT_MATCH_CONFIG` are starting values from the plan, not measured results.
- Output is CommonJS so both the NestJS gateway and Vite can consume it. Reversible by changing `module` in `tsconfig.json`.

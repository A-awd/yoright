# Independent recheck after Claude fixes — 2026-11-17

Reviewed implementation `2f7fb34b8a82f0e3a3b97f3b832a4adf1def574f`, branch `review-fix/fable-52-foundation`, parent `f06d7d1c277fdb92f9428210835e6c51a2fd6396`. Read all10 changed files. Scope remained travel-core and related docs; no existing app code changed.

On the Mac (Node24.22.3), TypeScript5.9.3 build exit0 and `node --test 'dist/test/*.test.js'` passed44/44. Read targeted regression tests and changed contracts:
- YR-01: room equivalence now uses the same exact identity as grouping; size/class/smoking differences and known/unknown distinctions separate groups. Tests include20/60m²,20/22/24 chain and186,624pairs.
- YR-02: transitions carry heldFrom and payment/supplier/refund references; hold resumes only the prior state's reachable paths. The original QUOTED→review→CONFIRMED shortcut is rejected, with and without claimed evidence. Evidence authenticity remains the future server's responsibility, not established by strings or tests.
- YR-03: stay dates/count/residency and cancellation schedule identity are part of hotel comparison; missing/malformed terms fail closed. Regression cases cover dates, penalties and missing context.

Disposition: the three reported package-level counterexamples are addressed on the tested synthetic fixtures. This is not an exhaustive security/product approval or permission to merge. Claude's mutation-check report was read, not independently repeated. Exact size identity intentionally reduces grouping recall.

Still open: original Phase0 recovery, application security findings, gateway/web integration/build, future ticket contract gaps, decision numbering, device verification and live gates. No original plan reconstructed, no main/base merge, no paid/live activation. Next: preserve/inspect original Phase0 before any gateway/web integration; keep follow-up checks scoped.

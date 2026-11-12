# YoRight knowledge and continuation record — 12 November 2026

## Source and verification boundary

This is a sanitized semantic handoff, requested by the owner on 12 November. It preserves the useful history of the source conversation from the October supplier research through the November cross-platform development and AI-feasibility discussion. The available local conversation log was reviewed in chronological ranges (October research/email/taxonomy, 1–2 November licensing/mapping, and 2–3 November Claude planning/execution), together with its visible user instructions and linked project records. Some historical assistant/tool output is compacted or truncated; this is not a certified literal transcript or an independent archive of every attachment. The detailed records linked below retain the verified research. Original correspondence, screenshots, credentials and restricted session links stay outside this repository.

At handoff, global guidance was verified on `A-awd/ai-operating-system` main at `c9c9c9b724cb789607e97593d05af805208b828b`. Project baseline was `655f4c24660c69a8aa9c634bc08ed66ba9ee9772` on `migration/one-brain-foundation`. The local canonical checkout was clean and fast-forwarded from `d084467` to that baseline. Newer 9 November ticket research was preserved, not rolled back to Claude's older baseline.

The existing Claude Code browser session “YoRight implementation plan” was reopened read-only on 12 November. Its final Phase 0 report and visible file diffs were inspected. It showed Opus 5.5 Medium and a completed response. No new implementation prompt, retry, push or paid setting was submitted during this handoff.

## Current owner direction and authorization

- Build toward responsive web, iOS and Android, while retaining the actual WhatsApp/concierge business context.
- Accepted D1: existing `apps/gateway` and `apps/web-client` are canonical. Preserve the competing application as a reversible archive, including its Git history. See [decision 0005](../../decisions/0005-canonical-line-and-model-roles.md).
- Phase 0 implementation was explicitly authorized. Phase 1 was excluded from the execution prompt. This handoff does not extend that scope.
- Latest model split, after the owner's subscription downgrade: Fable for planning, Opus 5.5 Medium for execution. Prompts to Claude are in English; owner-facing updates are Arabic. Ultracode was switched off when Opus execution resumed.
- Earlier delegated Claude work was explicitly constrained to session-local commits, without pushes, merges, deployments, production access, purchases or paid-usage changes. Publishing this sanitized handoff does not authorize publishing or merging that feature branch.
- Keep Easy Life stopped. Use current GitHub routing/instructions at startup. Use only the Codex in-app browser for browser work, reusing one working tab.
- Amounts are SAR-first, rounded upward to whole riyals for display, with estimates and exclusions identified. Original accounting amounts retain their precision.

## Freshly observed Phase 0 result

Claude's final report states that it completed Phase 0 on session-local `feat/phase-0-foundation`, with five commits not pushed. It still describes its GitHub baseline as `d084467`; that is historical to the session. Today's verified project remote is newer. A live `git ls-remote` check found no `feat/phase-0-foundation` branch on the remote.

The following are **Claude-reported results**, supported by the visible session report/diff, not independently re-run in this handoff:

- Line B archived under `legacy/next-app/`; 44 files described as byte-identical renames with history and reversal steps. A guard excludes the archive from active workspaces, imports, tests and CI.
- Seven shared package skeletons; lint/typecheck/unit/browser harness; GitHub Actions workflow without deployment; committed Prisma migration baseline.
- Removed fallback JWT secret, protected admin routes, limited/log-redacted OTP behaviour, fail-closed placeholder webhook signatures, explicit CORS origins, and removed card-entry fields.
- Reported checks: 50 gateway tests, 7 package tests, 4 browser tests, 11 built-gateway smoke checks, 5 invalid startup configurations rejected, typecheck across 9 workspaces, lint with 0 errors and 66 pre-existing warnings, legacy/secret checks, migration/drift check, and a fresh-clone reproduction.
- GitHub CI has not run for the unpublished branch. Reported container tests do not establish live deployment readiness or independent review.
- Operational effect if later deployed: a sufficiently strong configured JWT secret is required, and admin access requires authentication. Do not deploy this change as a handoff side effect.

Three material open findings in Claude's report must survive continuation:

1. A booking reference alone can expose guest details.
2. Booking creation still trusts totals supplied by the client.
3. Webhook signatures use a YoRight placeholder scheme; actual providers' schemes must replace it before live connection.

The report says mobile and money/VAT decisions remain deferred, as do Phase 1 and live integrations. Its wording that all of Phase 0 is complete must be read alongside these explicit deferrals.

### Exact artifact preservation gap

The exact feature commits, full plan file and code diff remain in the existing Claude session. This handoff verified their visible existence but did not independently export a Git bundle/patch or obtain their complete immutable commit IDs. A text summary is not a replacement for those bytes. The only earlier abbreviated checkpoint exposed in the conversation was `ba5aeb8`; do not treat it as the final feature HEAD.

The receiver must retrieve the exact branch/working tree from that session through supported read/export facilities before reconstructing code or attempting integration. The restricted local continuation packet contains the session link. If the session's runtime has expired, say precisely what is retrievable before proposing recovery. Never recreate from prose while recoverable original edits may exist.

There is a real decision-number collision to reconcile: Claude's private branch calls its canonical-line record `0003` and planned mobile/money records `0004`/`0005`, while the approved remote now uses `0003` and `0004` for ticketing. Preserve both histories, renumber feature records and update references during an authorized integration. Do not overwrite the newer ticket decisions.

## Final plan and estimates, still proposals where noted

The planning document named in the session is `docs/plans/2026-11-03-cross-platform-implementation-plan.md` (387 lines in the initial displayed file). It is not present on the verified remote baseline. The supplement was delivered in chat and stayed read-only.

| Phase | Planned scope | Engineering hours |
|---|---|---:|
| 0 | Canonical line/archive, package skeleton, CI/testing/migration baseline, insecure-default removal | 20–30 |
| 1 | Two synthetic suppliers, canonical hotel mapping/review, conservative rooms, comparable total prices, web/admin | 170–270 |
| 2 | API v1/client, shared i18n/tokens, accounts, responsive checks | 60–90 |
| 3 | Quotes, repricing, booking state, mock payments, cancellation/refunds | 80–120 |
| 4 | Concierge, mock WhatsApp, administration | 60–90 |
| 5 | Proposed Expo iOS/Android app, builds and device tests | 120–180 |
| 6 | Staging, observability, protection, restore/release checks | 40–60 |
| 7 | Authorized real suppliers/payment/WhatsApp and production gates | Contract/prerequisite dependent |

The 550–840 hour total is a planning assumption for one engineer, not a delivery commitment or an AI session wall-clock forecast. At 40 hours/week it is about 14–21 engineering weeks; Phase 0 plus the first synthetic slice is 190–300 hours, about 5–8 weeks. Earlier mapping-only research quoted 170–270 hours with a smaller prototype substage. These scopes must not be conflated.

Existing web code is React/Vite/Tailwind. The reviewed native directories had README plans rather than buildable projects. Expo/React Native was recommended; it has not been owner-approved. Native applications are scheduled for Phase 5; early mobile demonstration is the responsive website. Device/signing/store prerequisites remain.

Pending decisions from the supplement:

- D1 is now accepted and partially implemented according to Claude's report.
- D2 mobile stack, proposed Expo, must be decided by Phase 2 exit to avoid shared-client rework.
- D3 admin console, proposed separate Vite app, needed for the Phase 1 review screen. This has not been approved.
- D4 numeral presentation needed in Phase 2, proposed Western digits with optional Arabic-Indic digits.
- D5 hosting may wait until Phase 6.
- D6 feature branches off the migration ref was an implementation proposal; its scoped use does not approve merges to main.

The supplement's acceptance design keeps ambiguous hotel/room matches separate, distinguishes same-brand towers, supports merge/split auditing and repeatable imports, compares mandatory totals only for equivalent occupancy/room/board/cancellation terms, isolates supplier timeouts, handles changed/sold-out/expired quotes, preserves supplier-native keys and prevents duplicate booking creation. Cancellation/refund and timeout reconciliation need operational verification. A synthetic banner and passing fixture tests are not supplier certification.

## Material research history and corrections

### Supplier access and independent-AI claims

The owner started with WhatsApp/concierge and existing RateHawk access, later reported existing RezLive access and rejected both as sufficient answers. Repeated lists of famous suppliers, claims of universal usage or an unexplained best company did not meet the request. The accepted buying question is a B2B hotel supplier/bedbank with an agency booking portal, net prices and owner-controlled markup. Host commission-sharing and luxury-network membership were explored but rejected as answering a different buying model. Direct contracts, DMCs, GDS, consortiums and preferred programmes are separate roles rather than a universal hierarchy or one subscription that guarantees best prices.

Use the [main supplier research](../research/2026-10-01-whatsapp-concierge/YoRight-Travel-Research-2026-10-01.md), [global operating brief](../research/2026-10-01-whatsapp-concierge/YoRight-Global-Agency-Operating-Brief.md), [research audit](../research/2026-10-01-whatsapp-concierge/YoRight-AI-Research-Audit.md), [access table](../research/2026-10-01-whatsapp-concierge/YoRight-Supplier-Access.csv), [draft dossier](../research/2026-10-01-whatsapp-concierge/YoRight-Supplier-Dossier-Draft.md) and [blank matched-case pilot](../research/2026-10-01-whatsapp-concierge/YoRight-Quote-Pilot-Blank.csv). These dated candidates are not present account approvals or price rankings.

Research provenance correction: Gemini initially ran on a different account/Flash, then the requested account with Pro/Deep Research; at the final audited check Gemini had not yielded a final report. DeepSeek explicitly lacked live browsing. Manus Max and Kimi later produced reports, with different scopes. Claude's research had corrections including published licence fees and overbroad supplier requirements. Prompts seeded company names, so agreement across platforms was not independent blind corroboration. Do not repeat that all five studies finished or jointly proved a best supplier. AI output required independent primary-source checks.

### Private email review

Email was initially deferred, then expressly authorized. The historical audit reported 64 accessible messages, including 33 sent, from March 2024 through 2 October 2026. It found incomplete Hotelbeds qualification/activation evidence, an automatic WebBeds receipt with a follow-up sent to a no-reply address, historical RateHawk/RezLive accounts/API requests without proving production API approval, and service complaints consistent with the owner's objections. Attachments, deleted mail, other mailboxes and today's supplier account status were not verified. No supplier message was sent. The original report remains in the restricted local outputs folder referenced by the private continuation packet; no correspondence or source URLs are republished here.

### Licensing explanation and corrections

The owner first asked to exclude unsolicited licensing research and later explicitly requested the Ministry/STA inventory, categories, fees and diagrams. That later request authorized the comparison. The commercial-register screenshots were not proof of a current Ministry licence, its category or validity. Do not copy private registration/identity/contact numbers into project files.

Use the dated [licence inventory/fees](../research/2026-11-01-saudi-licensing/YoRight-Saudi-Tourism-Licences-Fees.md), [corrected crosswalk](../research/2026-11-01-saudi-licensing/YoRight-Saudi-Licensing-Crosswalk.md) and [interactive explanation](../research/2026-11-01-saudi-licensing/tourism-licence-explainer.html). Distinguish service scope from invoice format or outsourcing. Earlier invoice examples and ready-made-programme wording were corrected; unresolved customization cases remain unresolved. Separate fees, bank guarantees, main/branch procedures and property classes. The fee examples over ten/thirty years were fixed-rate scenarios, while a single issue/renewal term was at most five years under the reviewed rules. Future-effective amendments and repealed experimental licensing were expressly distinguished. Refresh rules before a new current legal answer rather than treating this handoff as legal verification today.

### Content, mapping and recurring expense

The owner rejected large recurring mapping/content subscription totals. The research distinguished hotel identity mapping, room equivalence, authorized descriptions/photos, suppliers and booking software. [Content/mapping comparison](../research/2026-11-02-content-mapping-comparison.md) and [ready-platform comparison](../research/2026-11-02-ready-platform-comparison.md) compared published starting prices with quote-only modules; bundled mapping did not prove inclusive content rights or total cost. GIATA/Vervotech/Gimmonix and Leonardo/Shiji were candidate layers, not mandatory simultaneous subscriptions or a measured accuracy ranking.

The one-supplier simplification was a proposal, followed by the owner's multi-supplier question and [bounded internal mapping design](../research/2026-11-02-internal-mapping-and-competitor-evidence.md). Supplier IDs map to an owner-controlled hotel identity; unknown room attributes stay separate; supplier-native rate IDs and repricing are preserved. Internal matching trades licence expense for engineering, review and maintenance. [Mapping effort estimate](../research/2026-11-02-internal-mapping-build-estimate.md) is hypothetical scoped engineering effort with separate hosting/labour assumptions, not an invoice. Public competitor evidence supports selected proprietary/external components, not confidential subscription prices or complete stacks.

### Authentication and Claude workflow experiments

The local Claude CLI was installed and showed Fable 5.1, but requests failed on an expired OAuth token. A background-start attempt failed; showing an idle/background identifier was not proof of execution. An isolated local worktree was prepared without changing the canonical application. OAuth code transfer was rejected by automatic approval review, and native Terminal UI was blocked. Do not replay credential handling, copy tokens from old logs or promise permanent sign-in. The owner then explicitly selected Claude Code in the Codex browser; it worked with the GitHub repository and superseded the local-login detour.

Fable first planned in Plan mode. A supplement clarified per-platform deliverables, decisions, tests and estimates. It had called the plan approved too early; the subsequent review prompt expressly corrected that. The owner later approved D1 and Phase 0. Fable started partial edits but hit its usage limit. After the subscription downgrade, the owner changed the model split to Fable planning and Opus 5.5 Medium execution. Opus resumed the existing edits; this handoff newly observed its final report, superseding the earlier merely-running status. Browser sessions can expire; reuse the same in-app profile and do not promise endless authentication.

### Feasibility discussion

The owner challenged whether AI coding could waste time on a dead end. The answer cited bounded engineering usage at Rakuten and mixed METR productivity results, without proof of an AI autonomously operating a peer of Trip.com/Almosafer/almatar. A small employee-facing, authorized-data WhatsApp pricing workflow with measured false merges, total-price correctness, failure handling and time saved was recommended. That was a recommendation, not owner approval to cancel the cross-platform goal or start Phase 1. Preserve human review and booking/payment reconciliation as concrete engineering requirements.

### Newer ticket work already on GitHub

The separate 9 November work is authoritative newer project context. See [ticket skill](../../skills/search-tickets/README.md), [ticket research index](../research/tickets/README.md), [event trial](../research/tickets/2026-11-09-test-result.md), [retry/resale summary](../research/tickets/2026-11-09-browser-retry-and-resale-summary.md) and existing decisions 0003/0004. It added a reusable research skill, registry and validator and recorded incomplete price checks. No definitive cheapest final payable offer, ticket purchase, resale listing or commercial launch was established. Preserve its detailed trial limits and do not silently restart that task from this handoff.

## Next authorized action and delivery gap

The receiving local chat should first read current global/project instructions and this record, then inspect the exact existing Claude feature branch and preserve it through supported export before any reconciliation with the now-newer remote. Verify rather than restart completed Phase 0. Reconcile the decision-number collision and identify the actual diff and remaining findings. Publishing or merging the unpublished code and starting Phase 1 need the applicable owner instruction.

Native fresh-local-chat creation tools were not exposed in this session. The prepared local continuation file and documented desktop draft link are the delivery fallback. No receiving chat has been claimed created. The restricted local receipt records this boundary and draft status; a future retry must check it before making another receiver. No verified project iCloud destination was found, so local saving is not described as an iCloud upload.

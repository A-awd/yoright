## Web, iOS and Android kickoff — 2026-11-03

Continue from the Claude Code browser session “YoRight implementation plan”. Review the phased web, iOS and Android plan before implementation. The local Claude Code OAuth blocker does not apply to the browser session.

After Claude subscription reauthorization, relaunch Fable 5.1 in `work/yoright-fable-platforms` and verify the first model response. Plan web, iOS and Android using the existing code and a shared API. Start with synthetic two-supplier hotel search, hotel crosswalk, review of uncertain matches, conservative room matching and comparison of equivalent total rates. Preserve privacy, security and production gates. No paid mapping or live bookings in the pilot.

## Internal mapping scoped effort estimate — 2026-11-02

Owner asks build cost/time and feasibility inside the existing project. Focused static code review found reusable gateway/front-end scaffolding but RateHawk-specific search and no cross-supplier canonical hotel/room models in either Prisma schema. [Preliminary estimate and candidate scope](docs/research/2026-11-02-internal-mapping-build-estimate.md): bounded two-supplier pilot, 170–270 engineering hours (~4–7 full-time engineering weeks), with 20–30 hour synthetic prototype as first milestone. A hypothetical external labor rate yields a budgeting scenario, not an actual quote or required assistant fee. Verified small pilot VM/backups hosting example is separate from total development/operations cost. Existing architecture/security/privacy gates and mock/live distinction remain. Next: obtain permitted representative property/room catalogues, refine effort and prepare an isolated candidate; no software, schema migration, purchase or live operation changed in this assessment.

## Lower-subscription internal mapping feasibility — 2026-11-02

Owner wants multi-supplier comparison without expensive mapper subscriptions and asks about competitor stacks. See [internal mapping proposal and public evidence](docs/research/2026-11-02-internal-mapping-and-competitor-evidence.md). A bounded hotel-master/supplier-crosswalk with conservative matching and review can support multiple suppliers; unmatched rooms can remain separate rather than requiring a full room-mapping service at launch. No cost-free, global-accuracy or implemented-readiness claim. Public evidence: Trip.com Group proprietary matching plus GIATA content connection; Almosafer Enigma/mapping investment in a dated executive interview; almatar appears as a Featured customer on Gimmonix's LinkedIn product listing. Contract details/prices remain unknown, and supplier-index presence is not subscription evidence. Next: define initial catalogue and approved supplier data, then assess a reviewable internal design before choosing paid mapping. No outreach, software implementation, data ingestion, booking or production changes occurred.

## Ready platform versus separate services comparison — 2026-11-02

Saved [ready-platform cost and inclusion comparison](docs/research/2026-11-02-ready-platform-comparison.md). Juniper's modules require scoped pricing; Gimmonix HSP explicitly bundles mapping/content backend but requires a UI and an undisclosed percent-based quote. Zentrum's minimal indicative base must not be represented as an all-inclusive Engine/Aqua price; its FAQ lists extra mapping-provider costs. Nezasa has published plan prices, plan-specific GIATA obligations, and standard language/currency gaps relevant to Arabic/SAR. Standalone Vervotech mapping is only a partial-cost reference, not an apples-to-apples app total. Next: compare equivalent written scopes before standalone subscriptions; Juniper first complete-site scope to evaluate, Zentrum alternative subject to inclusions, Gimmonix custom-frontend path. No cheapest vendor, contract, quote acceptance, outreach or operational change established.

## Content/mapping cost comparison and provisional stack — 2026-11-02

Saved [current public-source comparison](docs/research/2026-11-02-content-mapping-comparison.md) for GIATA, Vervotech, Gimmonix, Leonardo and Shiji. Vervotech publishes module starting prices and a usage component; others reviewed require quotes. SAR conversions use the verified SAMA USD rate. GIATA current product sheet supersedes older property/supplier totals; mapping properties and image coverage are distinct. Accuracy figures are vendor claims with incompatible scopes, not a measured ranking. Provisional custom-build path: first evaluate GIATA MultiCodes + RTM with licensed supplier content, adding one content product only for measured gaps; use included platform mapping instead when adequate. This is not a cheapest-provider conclusion, vendor award or purchase authorization. Next: define integration route/volume and compare equivalent written quotes and sample performance. No outreach, purchase, private-data upload or production change occurred.

## Content/mapping supplier landscape — 2026-11-02

Added primary-source capability examples and an explicit no-ranking/no-market-count boundary to the [mapping research](docs/research/2026-11-02-hotel-content-and-mapping.md). Shiji Iceportal and Gimmonix supplement GIATA, Leonardo and Vervotech; GIATA also has room mapping, while Travelgate and Juniper illustrate platform-integrated solutions. Distinguish original service capability from packaged/resold integrations before evaluating costs. Multiple alternatives are verified; a universal top ranking or exhaustive market size is not. Next: evaluate coverage and actual sample match quality for the intended suppliers, then compare contractual rights and quotes. No outreach, selection, purchase or implementation occurred.

## Multi-supplier mapping and content architecture — 2026-11-02

The owner clarified that the app plan must cover independent hotel content/media, hotel and room deduplication and comparable-rate selection. See [verified service categories and proposed flow](docs/research/2026-11-02-hotel-content-and-mapping.md). GIATA MultiCodes, Vervotech room mapping, GIATA MHG and Leonardo content products were verified on primary sources; Juniper documents bundled/add-on mapping. These are capability examples, not a provider ranking, coverage guarantee, price quote or owner-specific access approval. Preserve supplier offer identifiers and terms; display one property with comparable room/offer groups, not a single cheapest net number. Next: add these layers and licensing/bundling requirements to the platform/API comparison. Existing implementation readiness and commercial approvals remain unverified; no outreach, procurement, live booking or operational change occurred.

## Customer booking application exploration — 2026-11-02

The owner asked how to build a customer hotel/services application. See [current route comparison](docs/research/2026-11-02-app-options.md). Official supplier/technology sources establish a hosted/white-label route and a custom API route; they do not establish supplier eligibility, net-rate economics, acceptance, price or production access. Existing application/gateway/integration code was observed, not validated as working or safe to launch. Next: assess code reuse and compare written platform/API terms before cost estimates or implementation selection. This exploratory question does not approve a vendor, rewrite the existing WhatsApp decision, authorize outreach/payments/deployment, or clear migration/security/privacy gates. Easy Life remains stopped.

## Agency / General explanation correction — 2026-11-01

The owner rejected invoice examples as failing to establish the real licensing difference. A fresh official regulation/Ministry FAQ review and independent audit confirm that the boundary is permitted service scope, not supplier outsourcing or invoice format. Use the [crosswalk correction](docs/research/2026-11-01-saudi-licensing/YoRight-Saudi-Licensing-Crosswalk.md): independently arranging airport transfers, restaurant/event reservations and personalized concierge requests are General additions, even when providers execute them. Agency also arranges some services, including guides; do not reduce the distinction to all selling versus all arranging. General is not an operator licence for vehicles or venues.

Do not reuse earlier hypothetical invoices as approved legal templates. Agency's right to sell tourism programmes is explicit, but the source does not literally impose the word ready-made, and detailed grey areas involving custom changes or combining hotel/air reservations were not conclusively resolved. Existing category/validity remains unverified. No Ministry outreach or licence/financial/operational change occurred. Next: explain concrete additional service permissions and preserve uncertainty for the unresolved edge cases; keep all prior privacy/security and stopped-runtime gates.

## Private-document fit check — 2026-11-01

The owner supplied commercial-register screenshots and asked for a concise required-action answer. Reviewed privately; no identifiers, contact data or originals are recorded here. Commercial-register activity evidence is not a Ministry tourism licence and does not establish the existing licence category, validity, bank guarantee or premises/electronic-documentation status. Refreshed official Commerce suspension guidance and Ministry activity-code/General-guarantee requirements. Next: reconcile privately observed register indicators through the authorized Commerce workflow, and inspect the actual Ministry licence before deciding issue versus amendment or quoting owner-specific costs. No application, payment, account change or outreach occurred; prior safeguards remain.

## Visual licensing explanation — 2026-11-01

The owner requested a clear visual explanation after the fee tables caused confusion. The [interactive explanation source](docs/research/2026-11-01-saudi-licensing/tourism-licence-explainer.html) separates management categories A/B/C/D from property star/grade classification and from licence costs. All four management categories share the published fee table; category changes permitted scope and required experience, while term, procedure and branch status determine the applicable amount. The calculator also covers travel, guiding, consultancy, private units and current hospitality operation/classification, with unknown fees distinguished from zero and guarantees separated from fees.

Calculator interactions and representative term/branch/classification cases passed a local DOM execution check. The in-app browser reported that local browser use is disabled in Work settings, so visual browser inspection was unavailable; no external browser or settings change was attempted. Source data and temporal limitations remain those of the linked inventory, including the future 1 July 2027 hospitality amendment. No application, payment, licence change or outreach occurred. Next: use the explanation to resolve the owner's questions and reconcile the actual existing licence only when category/expiry are available; do not imply a new payment is due. Easy Life remains stopped and migration/security gates remain in force.

## Current complete licensing inventory handoff — 2026-11-01

Resume from [all Ministry/STA licence families and fees](docs/research/2026-11-01-saudi-licensing/YoRight-Saudi-Tourism-Licences-Fees.md). The report includes conditions, issue/renewal duration tables, hospitality size/classification tables and the owner-specific fit boundary. Do not treat the hospitality amendment effective 1 July 2027 as already effective on 1 November 2026. Do not resurrect the experimental licence framework repealed on 8 May 2026. Distinguish General's guarantee from a licensing fee and avoid adding the Agency fee to General or assuming a fresh issue fee for an existing licence amendment.

Owner category/expiry question is pending; no licence document or current operational licence state has been verified. The relevant next step is reconciling existing category/services/expiry, not submitting new applications. Private numbers/documents remain outside GitHub. Current work is documentation-only and all existing merge/security gates continue. Easy Life remains stopped.

## Current licensing comparison handoff — 2026-11-01

The requested public Saudi licensing crosswalk is saved at [the research note](docs/research/2026-11-01-saudi-licensing/YoRight-Saudi-Licensing-Crosswalk.md). The owner expressly authorized this review; older no-unsolicited-licensing wording below does not prohibit the requested comparison. Current licence inspection is still missing, so do not claim YoRight is authorized for every General service or that an upgrade is necessary. Distinguish resale of an existing programme from programme creation and distinguish buying through a foreign hotel portal from foreign-IATA air-ticket arrangements. Net-rate hotel portals remain the target; host commission-sharing is a rejected detour.

Resume with the actual licence category/services if available through approved private access. A transition mechanism applies to older categories; its owner-specific deadline requires the existing licence expiry. Do not revive Easy Life or use runtime checkpoints: current owner/global startup is GitHub-only. No external submission or operational change has been made. All prior migration/privacy/security gates remain.

## Corrected buying model handoff — 2026-10-02

Current owner requirement: ready agency booking portals with net hotel rates and owner-controlled resale margin, like the buying workflow of the existing supplier accounts. The host-agency/commission-sharing detour was rejected as answering a different question. Resume from the industry taxonomy artifact referenced in STATE.md and the private correspondence report. Distinguish commercial supplier, inventory source, access technology and financial model; do not claim a single platform guarantees all suppliers or lowest prices. No live supplier quote benchmark is complete.

## Current mail review handoff — 2026-10-02

Historical correspondence review is now explicitly authorized and its available message-body inventory has been completed. Resume from the private local report referenced in STATE.md; do not infer present supplier access from historical mail or claim attachment evidence has been verified. Only a sanitized execution checkpoint belongs in GitHub. Original mail and private source links remain outside this repository.

The owner is operating through WhatsApp concierge and has asked to stop unsolicited licensing research. Earlier research proposals and the mail deferral below are historical. Prepare any future supplier follow-up around the current business model and actual correspondence evidence; sending requires owner authorization. Migration/security merge gates remain unchanged.

## Current restart handoff — 2026-10-01

Start from [the WhatsApp concierge research](docs/research/2026-10-01-whatsapp-concierge/YoRight-Travel-Research-2026-10-01.md), [supplier access table](docs/research/2026-10-01-whatsapp-concierge/YoRight-Supplier-Access.csv), [blank 30-case pilot](docs/research/2026-10-01-whatsapp-concierge/YoRight-Quote-Pilot-Blank.csv), and [unsubmitted supplier dossier](docs/research/2026-10-01-whatsapp-concierge/YoRight-Supplier-Dossier-Draft.md).

Owner chose WhatsApp concierge restart and deferred email reading. Do not automatically start email processing. Top initial access candidates are Bedsonline GCC retail and WebBeds, then TBO retail subject to written clarification of its digital B2C restrictions, and Dida or RezLive according to actual destinations; this is an access-fit proposal, not a price ranking. Dida MCP is officially announced; account approval and an actual integration remain unverified. Nuitée settlement documentation is contradictory and needs written resolution before selection.

Next safe action: obtain destinations/hotel segment and complete Kimi review and any remaining Claude corrections. Check current licence scope against the September 2026 regulation and category-specific guarantee decision before selecting the actual service scope. Later, review authorized original travel emails to reconstruct supplier application status and missing documents without guessing refusal reasons. Validate tourism licence and company identity privately before applications. Ask for authorization before supplier outreach, account/contract/payment/booking actions or connecting the customer WhatsApp number. No such action occurred in this research phase.

Keep previous clone reconciliation, insecure-default remediation, privacy review and migration merge gates below. Current research does not make existing code safe or deployed.

## Instruction reconciliation — 2026-09-11

Consolidated duplicated session instructions while preserving project-specific safeguards, current decisions, and implementation history. Preserved the approved migration ref and its unmerged gates.

Owner authorized adoption under the Easy Life standing delegation on 2026-09-11. Prepared through PR #3; effective on the approved ref once that PR is merged. Verify its merge receipt before claiming adoption. This checkpoint changes documentation only. Existing operational evidence and unfinished work below remain valid within their dated scope; refresh live facts before acting. No historical files, platform projects, settings, or production systems were changed.

---

# Handoff

## Resume from

The One Brain operating foundation is defined. The repository still requires a documented choice among competing clones or architecture paths and remediation of insecure default access.

## Next operator action

1. Inventory and compare the known implementation copies without exposing secrets.
2. Select the canonical path through an explicit decision.
3. Remove insecure defaults and verify authentication under separate authorization.
4. Review how traveler, booking, identity, and payment data are handled.
5. Update STATE.md and DECISIONS.md with validated outcomes.

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

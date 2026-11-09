# Future sports and event ticket packages

Date: 2026-11-09 (Asia/Riyadh).
Status: commercial launch and integration deferred; research skill implemented and live-tested on 2026-11-09 (see progress below).
Canonical project: YoRight, `A-awd/yoright`.
Approved ref: `migration/one-brain-foundation`.

## Owner direction

Add a future YoRight capability to source match and event tickets through B2B suppliers and offer them to customers, including travel packages with flights, accommodation and the match/event ticket. Travel Connection and TicketNetwork are explicit supplier examples requested by the owner.

This records future product scope. It does not start development, select a vendor, create or fund accounts, purchase ticket allocations, contact companies, accept terms, or launch sales. The existing app work and earlier operating decisions remain separate.

## Proposed customer products

- Ticket only, where the supplier's contract and event rules permit resale.
- Accommodation plus a match/event ticket.
- Flights plus accommodation and a match/event ticket.
- Optional licensed-provider transfers or other travel services when within the permitted product and operating scope.

Distinguish ordinary admission from official hospitality, premium seating, stadium tours and hotel-inclusive packages. A stadium tour is not a match ticket. Verify the fixture, local date, venue and home/away supporter restrictions against the official organiser before quoting.

## Supplier evaluation queue

These are research candidates, not approved suppliers or proof of account access.

| Candidate | Route to evaluate | Evidence entry point |
| --- | --- | --- |
| Travel Connection | Agent portal and transactional API for sports products; confirm the specific club/product distribution rights | [API getting started](https://docs.travelconnectionleisure.com/docs/getting-started) |
| TicketNetwork Mercury | Secondary-market inventory with broker-wholesale pricing and retailer markup controls; keep its channel classification explicit | [Mercury retail integrations](https://corporate.ticketnetwork.com/products-services/mercury-retail-integrations/) |
| XS2Event | B2B portal/API connecting travel sellers with rights-holder ticket and hospitality inventory | [Platform](https://www.xs2event.com/en/index.html) |
| Sports Events 365 | Agent, white-label, search-referral and full-booking routes; evaluate authorisation for each product | [Partner programme](https://sportsevents365.com/partner) |
| P1 Travel | Ready B2B booking portal and official-partner products where applicable; an API is not established by this note | [Partnerships](https://www.p1travel.com/en-GB/partnerships) |
| Seat Unique | Official premium/hospitality products and eligible trade/API access | [Trade programme](https://www.seatunique.com/blog/seat-unique-launches-new-trade-programme-with-ttg-media/) |
| Victory Live / Ticket Evolution | Optional secondary-market wholesale/API alternative after testing overlap with other suppliers | [Marketplace offerings](https://www.victorylive.com/marketplace-offerings/) |

Refresh published evidence before assessment. The candidates span different supply models. A real company, a marketplace rating, a technical API or a money-back guarantee does not establish organiser authorisation for every ticket. Wholesale pricing does not prove a lower price than the club's box office. No discount percentage, API fee, credit term, Saudi-company acceptance or contract has been verified for YoRight.

## Commercial and operating requirements before selection

1. Verify the legal supplier, event-specific authorisation and permission for YoRight's intended resale, bundling, website/app display and any onward distribution.
2. Compare matched products and final payable totals: seat/category, quantity, adjacency, view restrictions, hospitality inclusions, taxes, platform/payment/delivery charges, currency conversion and any mandatory membership.
3. Record settlement currency, net price versus commission model, YoRight margin, deposits/credit exposure, refund timing, chargebacks and liability allocation. Do not assume a universal commission or unlimited markup.
4. Confirm delivery and mobile-transfer methods, recipient identity requirements, release deadlines, substitution rules and event-day support. Do not treat a screenshot as sufficient for mobile tickets.
5. Confirm the consequences of postponement, cancellation, ticket non-delivery and denied entry. Flight and hotel cancellation exposure must be evaluated separately; a ticket refund alone is not a refund for the entire trip.
6. Reconcile the intended services with the existing licensing assessment and current ticket-distribution rules before launching. This plan makes no new licence or approval claim.
7. Keep customer, booking, identity, payment, credentials and unsanitised supplier responses outside repository documentation.

## Staged future work

1. When the owner resumes this initiative, define target countries/events, ticket-only versus packages, expected demand and service level.
2. Refresh official supplier information and compare the intended distribution rights and commercial terms using published material first.
3. Run a small matched-quote pilot with explicitly permitted access. Report a final total only when checkout/order pricing is verified; otherwise mark it incomplete.
4. Assess a manual B2B-portal pilot before choosing the API or white-label scope. Use synthetic data for development.
5. Prepare a reviewable implementation and operating plan before separately authorised integration, supplier commitments or live sales.

The current individual ticket-price experiment is not a supplier award, a wholesale-price benchmark or authority to buy inventory. Existing clone, security, privacy and production gates remain in force. Easy Life remains stopped.


## Progress after owner resumption — 2026-11-09

The owner resumed published-evidence research and explicitly requested a working ticket-search skill, registry, coverage ledger and real-event trial. This supersedes “wait for resumption” for those bounded research tasks only. Commercial activation, inventory purchase, outreach, registration, contract acceptance, live integration and sales remain deferred.

Existing plan coverage: the original product backlog, candidate routes and commercial safeguards already existed at commit `a946b49ee68936cbf687df1fe0ba2e106ab29f4f`; they were reused. Missing operational skill, auditable platform ledger, formal event check, published supplier comparison, model responsibilities and phased data design have now been added:

- [Runnable skill and installation guide](../../skills/search-tickets/README.md), [method](../../skills/search-tickets/SKILL.md), and a 34-platform registry separating directly read activity from candidates. Source remains in this owner repository; no Uwrite equivalence or relocation was assumed.
- [Actual trial](../research/tickets/2026-11-09-test-result.md): Sporting CP–FC Barcelona, 20 January 2027, verified from UEFA and both clubs; 22 targets, 0 completed final-total checks, 22 unresolved. Incomplete results are visible, not counted as sold out or hidden. Browser errors, a blocked International domain, incomplete fee steps and a venue conflict prevent a cheapest-price conclusion.
- [Published supplier and industry evidence](../research/tickets/2026-11-09-supplier-evidence.md): 11 named supplier/route groups, 9 commercial models, contract-specific responsibilities, currently unpublished fields and unsent questions. Travel Connection, XS2Event and Ticket Evolution demonstrate distinct access-on-demand routes; none establishes Saudi acceptance or a supplier award. Ingresso is separate from TodayTix Group, and Victory's events365 is separate from Sports Events 365.
- [Capabilities and proposed data/operating design](../research/tickets/2026-11-09-capabilities-and-design.md): event aliases, conservative matching, original supplier seats, complete-price timestamps, supplier order/delivery, cancellation exposure per package component and a decision audit. This is a proposed architecture, not a change to the existing travel app or database.

Remaining material gaps: live checkout totals for the trial, exact seat/delivery eligibility, current currency/bank charges, approved B2B access, Saudi onboarding, undisclosed fees/deposits/minimums, event-specific authorisation, bundling and onward-agency rights, and contract allocation of cancellation/non-delivery/full-trip losses. No live wholesale benchmark or profit conclusion is available. Revisited official Saudi sources in the supplier report do not establish the owner's licence or one rule for all countries/events.

Next: recover working interactive access and finish the same trial's unresolved minimum offers and official calendar without fabricating contact data. For the commercial track, define 2–3 products and compare equivalent written/public scopes of on-demand portal routes before any API work or inventory commitment; use the prepared questions, but do not send them without explicit instruction. Begin with manual evidence and measurable unit economics; request private terms/access only through separately authorised onboarding.

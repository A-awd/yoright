# YoRight internal mapping: preliminary scoped build estimate — 2026-11-02

Owner asks cost, time and whether the work can be built in the existing YoRight project. This is a feasibility/effort estimate after a focused static code review, not a fixed-price quote, guaranteed calendar, implementation completion or production authorization.

## Observed code

Reviewed gateway suppliers/hotels services, both Prisma schemas, frontend types and package/TypeScript configuration. `apps/gateway/src/modules/suppliers/suppliers.service.ts` currently calls a RateHawk-specific adapter, includes mock paths and retains supplier prebooking/book references. `apps/gateway/prisma/schema.prisma` and root `prisma/schema.prisma` contain no canonical hotel/room or cross-supplier mapping models. The existing frontend has search/results/details/checkout screens and room/hotel types. These are reusable structures, not verified live supplier connectivity or production readiness. Two schema/application lines and previously documented clone/security/privacy gates remain; do not infer they are reconciled because architecture.md calls the old app production-grade.

## Estimate boundary

Pilot: two approved supplier data formats, at most 1,000 selected properties across three cities as an estimating assumption, property matching and review workflow, conservative room grouping, offer comparison, and integration into a nonproduction branch. No global autonomous mapping, general-purpose neural training, native app rewrite, new full supplier booking connector, financial operations or broad security remediation included. Timetable starts after approved representative property/room data is available; a second full API connector, supplier certification and private-data permissions can add time separately.

Effort estimate (our engineering judgment, not measured market rates):

| Stage | Deliverable | Estimated engineering effort |
|---|---|---|
| Reviewable prototype | Synthetic imports, internal IDs, candidate property matches and simple review results; no live readiness claim | 20–30 hours |
| Property mapping | DB model/import validation, conservative matcher, pending/verified/rejected review and audit, scheduled change detection, deduplicated hotel results | 50–80 hours |
| Conservative room/offer handling | Structured room comparisons, unknowns kept separate, rate-plan separation, provenance and supplier booking IDs, final-total comparisons | 70–110 hours |
| Integration and validation | Pilot sample review, negative cases, regression checks and failure handling on the chosen implementation line | 30–50 hours |
| Total | All four stages | 170–270 hours |

At 40 engineering hours/week this is approximately 4–7 engineering weeks. Prototype alone roughly 3–5 workdays. These are work-effort conversions for planning, not a promise that the assistant requires those exact wall-clock days or that supplier onboarding takes that time. Actual estimates must be revised against sample quality and operational review needs.

## Cost interpretation

The assistant can author the module, migrations, import tools, review workflow and tests in this workspace as part of an authorized implementation. This document is not an agency invoice or a claim of unlimited/free assistant usage. If hiring an external developer, an explicitly hypothetical budgeting rate of 100 SAR/hour produces 17,000–27,000 SAR for the 170–270 hour pilot estimate. This is a sensitivity scenario, not a verified Saudi freelance rate, supplier quote or required payment for the assistant to write code.

A concrete small nonproduction hosting reference: DigitalOcean Regular Basic 4 GiB / 2 vCPU / 80 GiB at 90 SAR/month (24 USD); weekly Droplet backups add 18 SAR/month (4.8 USD), total 108 SAR/month. This example can colocate a small pilot database on the VM and is not a high-availability production sizing recommendation. Sources: https://www.digitalocean.com/pricing/droplets and https://docs.digitalocean.com/products/backups/details/pricing/. Display conversion uses 3.75 SAR/USD previously verified at SAMA: https://www.sama.gov.sa/en-us/pages/default.aspx?lang=english. Excludes taxes, banking FX, excess usage, licensed supplier API/content access, paid AI, operational review labor and ongoing maintenance. Existing hosting may reduce additional expense, but its current capacity/bill was not inspected. No server was selected or purchased.

Recurring mapping subscription can be avoided for this design, but maintenance and review cannot be assumed costless. Content/photo rights and supplier contracts remain independent requirements. Do not compare the 108 SAR hosting example with the whole price of a managed mapping platform as equivalent total cost.

## Concrete implementation target

Proposed module boundary: a framework-independent matching core plus an adapter to the approved gateway line. Suggested records: CanonicalHotel, SupplierHotelIdentity, SupplierPropertySnapshot, PropertyMatchCandidate, MappingReview and MappingAudit; then CanonicalRoom and verified SupplierRoomIdentity. Keep supplier rate keys and search context on offers, separate from room identity. Use decimal/integer minor units for comparison rather than extending the existing Float-based financial model. Optional AI may propose matches; no LLM is required per search or permitted to override unresolved material differences.

Required acceptance cases: same brand/nearby buildings remain distinct; renamed verified property retains identity with audit; ambiguous name-only match requires review; unknown bed/view/occupancy never becomes equal by default; king/queen and full/partial view are distinct; meal/cancellation/payment/mandatory-fee differences remain visible; currency totals compare only with a specified verified rate; original supplier rate identifiers survive display and prebooking; mock results cannot claim live validation. Build can be tested with synthetic data before access; deployment and financial flows require existing gates and an end-to-end supplier-approved pilot.

Next concrete input: representative permitted hotel/room catalogue from the intended two suppliers, without traveler/booking/identity/payment data. Then refine estimate and prepare an isolated reviewable candidate. No implementation, credentials access, live supplier calls, DB migration, purchase, booking, merge to main or production change occurred during this estimate.

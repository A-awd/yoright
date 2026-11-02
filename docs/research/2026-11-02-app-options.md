# YoRight: customer booking application options — 2026-11-02

The owner asked how to create a customer application with hotels and services. This is exploratory planning, not approval to replace the existing WhatsApp direction, select a vendor, deploy, or purchase anything.

## Product components

1. Customer search, property/room detail, truthful cancellation/price display, booking and post-booking screens.
2. Approved supplier inventory and reservation connections for hotels and, separately where needed, transfers/activities.
3. Pricing rules, merchant payment integration and reconciliation with supplier booking status; handle price changes, pending/failing reservations and refunds without claiming success prematurely.
4. Operations console for bookings, margin, cancellations and customer support, with appropriate traveler-data protection.

## Two routes

- A hosted/white-label booking engine can provide customer interfaces, operations and supplier connectors. Juniper documents B2C/white-label and multiple tourism products. This establishes product capability, not a price quote, Saudi acceptance or that every supplier contract is included: https://ejuniper.com/en/products/juniper-booking-engine/ and https://ejuniper.com/en/.
- A custom application uses contracted APIs. Expedia Rapid documents shopping, booking and post-booking capabilities: https://partner.expediagroup.com/en-us/solutions/build-your-travel-experience/rapid-api. An API product being advertised does not establish owner approval, net-markup economics or production access. Each sales-channel and payment/settlement agreement needs verification.

API integration is a booking lifecycle, not only a hotel list. ETG's official guide illustrates search, price/availability precheck, booking submission/status and cancellation, plus certification before production: https://docs.emergingtravel.com/docs/integration-guide/. ETG is an illustrative technical source here, not a reversal of the owner's supplier objections or a cheapest-supplier recommendation.

## Existing project and next gate

Readback confirms a repository with customer web code, gateway code and RateHawk integration-related files. No runtime, supplier access, completeness or security readiness was established. Existing clone reconciliation, insecure-default remediation, privacy review and no-merge/no-production gates remain.

Proposed initial scope: hotel search/booking/payment/management, with additional services clearly marked as a request until an actual confirmation flow exists. A mobile-friendly web release can precede store applications if the owner chooses that route. Native application scope, budget and platform choice remain undecided.

Next: compare written commercial terms for a hosted route versus approved API access and assess reuse of existing code before estimating cost or selecting implementation. No outreach, registration, contracts, payments or production changes were made. The cheapest inventory or platform has not been established.

# Hotel content, mapping and multi-supplier offer comparison — 2026-11-02

The owner identified missing application layers: independent image/content providers, duplicate hotel and room resolution, and selecting the cheapest comparable offer across multiple suppliers. This supplements the app-route note; it does not select providers or approve procurement/implementation.

## Verified service categories

- Property identity/mapping: GIATA MultiCodes maps multiple supplier property identifiers to a GIATA-ID. https://info.giata.com/en/knowledge/what-is-multicodes-mc
- Room mapping: Vervotech groups equivalent supplier rooms using attributes and confidence scores. Documentation includes room name, bed, view, board basis and refundability; unmatched rooms should remain separate. Mapping configuration can suppress material attributes, so configuration must preserve the comparisons intended for customers. https://docs.vervotech.com/getting-started-2432591m0 and https://docs.vervotech.com/room-mapping-customizations-2432588m0
- Content/media: GIATA MHG provides images, facts and multilingual descriptions. Leonardo LUCID MediaConnect supplies hotel-source media/text that can be paired with rates from another source. Actual image licensing, hotel/room coverage, attribution, caching and update rights require contractual verification. https://info.giata.com/en/knowledge/what-data-is-delivered-via-the-multilingual-hotel-guide-web-service and https://www.leonardoworldwide.com/our-solutions/travel-websites/
- Engine bundling: Juniper documents Unique Hotel and a Vervotech add-on. Do not assume standalone subscriptions are needed in addition to an engine package or that every contract includes them. https://ejuniper.com/en/products/juniper-booking-engine/modules/unique-hotel/

## Proposed application flow

Maintain an internal hotel master record with each supplier ID; attach licensed canonical content independently of the rate supplier. Query approved suppliers for a customer's dates and occupancy, join offers to the master property, then map equivalent room types while preserving per-offer terms. A unique hotel result retains supplier offers, rather than discarding them as duplicates. Preserve the supplier's rate/booking identifiers for the selected offer.

Price comparisons must use the same dates, nights, rooms, adults/children and child ages, room/bed/view, meal plan, payment terms, cancellation deadlines and penalties, taxes/mandatory charges and currency conversion. Compare the final customer total after applicable pricing rules, not only the supplier's headline net rate. Distinguish due-at-property charges. Cheapest refundable breakfast offer and cheapest non-refundable room-only offer may both be displayed as different products.

Illustration only, all amounts SAR: supplier A 640 including breakfast/refundable; B 610 same; C 540 room-only/non-refundable; D 600 plus 60 mandatory fee with otherwise equivalent terms. B wins the comparable breakfast/refundable set at 610; C is a different lower-priced alternative, not an equivalent 540 offer. This is not a live quote.

Before placing a reservation, revalidate the selected rate's price/availability and applicable terms using the supplier's required lifecycle. Mapping/content services do not establish access to bookable inventory, guarantee lowest market prices or remove the need for supplier agreements. No public marketing accuracy percentage or subscription price has been treated as a tested fact or procurement quote.

Next: include mapping, media rights, room equivalence, pricing and reservation lifecycle in the platform comparison; check bundled services before requesting separate quotes. No outreach, vendor choice, payment, live supplier calls or production changes occurred.

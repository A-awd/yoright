# صناعة التذاكر ومسارات التوريد لـYoRight — أدلة منشورة

التاريخ: 2026-11-09. المصدر المالك: `A-awd/yoright`، الفرع `migration/one-brain-foundation`.
الحالة: بحث منشور ومقارنة أولية لدعم [الخطة الموجودة](../../plans/2026-11-09-sports-and-event-ticket-packages.md)؛ لم يُختر مورد ولم يُفتح حساب أو يُرسل طلب أو يُشتر مخزون.

أُعيد جلب المصادر أدناه مباشرة عبر Firecrawl مع `maxAge: 0` بين 05:34 و05:38 UTC، باستثناء مقتطف صفحة Victory Live الرئيسية المميز أدناه، ودليل FansPass عبر HTTP المباشر الموثق في سجل المنصات. لا تمثل قراءة وثائق عامة اختبارًا لـAPI بحساب تجاري، ولا تمثل ادعاءات المورد عن حجم مخزونه قياسًا مستقلًا أو توافرًا مضمونًا لمناسبة معينة. «غير منشور» يعني غير منشور في المصادر المحددة المفحوصة، ولا يثبت أنه لا توجد شروط خاصة متاحة بعقد. التاريخ المدون على الوثيقة محفوظ منفصلًا عن تاريخ استرجاعها.

## النتيجة التي يمكن البناء عليها

توجد عمليًا مسارات للوصول إلى مخزون عند الطلب وإضافة هامشنا، دون شراء دفعة مسبقة: Travel Connection يصرح بأسعار wholesale يضيف الوكيل عليها هامشه، وTicketNetwork Mercury يصرح بمخزون محترفي إعادة البيع وبالتحكم في markup، وXS2Event يصف في شروطه شراءه من المورد بناءً على طلب العميل ثم بيعه له. هذه حقائق عن مسارات الخدمة، ولا تثبت قبول YoRight أو أنها الأرخص أو أنها بلا ودائع أو التزامات.

التشابه مع توزيع الفنادق مفيد في فصل المورد عن التقنية عن طريقة التحصيل، لكنه لا يثبت نفس حقوق الإلغاء والائتمان والتسليم. قد يصدر تأكيد حجز التذكرة قبل إتاحة التذكرة نفسها بأيام، وقد يبقى الطلب غير قابل للإلغاء عند تغير موعد المباراة. لا يغطي رد التذكرة تلقائيًا خسارة الفندق والطيران.

## من يفعل ماذا في الصناعة؟

| الدور | وظيفته وحدود الاستنتاج |
| --- | --- |
| المنظم/صاحب الحقوق | يحدد الدخول والسعة والموعد والقواعد؛ قد يعهد بالبيع لأكثر من قناة. |
| مزود تقنية التذاكر/البيع الأولي | يدير الإصدار والبوابة وخريطة المقاعد والدفع نيابة عن المنظم أو بموجب عقد؛ وجود اسمه لا يعني أنه يملك كل المخزون. |
| وكيل أو موزع معتمد | له حق بيع محدد بمنتج/نادٍ/موسم/إقليم؛ التحقق من المنظم أقوى من وصف المنصة لنفسها. |
| وسيط محترف | يدير مخزونًا يعيد بيعه أو حق عرض مخزون آخر؛ يتحدد الملك والتسليم بالعقد. |
| صاحب تذكرة فردي | يعرض تذكرة لديه عند السماح بذلك؛ لا يساوي اعتمادًا تجاريًا من المنظم. |
| سوق إعادة البيع | يجمع البائع والمشتري وقد يحصّل المال ويقدم ضمانًا. لا يلزم أن يشتري المخزون. |
| مجمّع مخزون | يجمع feeds متعددة؛ زيادة المواقع المتصلة لا تثبت تنوع المخزون إذا كانت كلها من البائع نفسه. |
| مزود API | واجهة وصول وحجز؛ لا تحدد وحدها ملكية التذكرة أو جهة الفاتورة والتحصيل. |
| مزود ضيافة رياضية | يبيع دخولًا مع lounges/طعام/خدمات؛ يقارن بمنتج مماثل، ولا يساوى بأرخص مقعد عادي. |
| مزود تذكرة وفندق/سفر | ينسق مكونات لها قواعد مختلفة؛ يحتاج حق bundling وتحديد مسؤول الباقة. |

**StubHub.com:** [اتفاق المستخدم](https://www.stubhub.com/legal/?section=ua)، آخر تحديث ظاهر December 2025، استرجع في 05:36 UTC بلغة يابانية مع بعض البنود بالإنجليزية. البند 3.1 يصف سوقًا لا يملك التذاكر ويحدد البائع السعر، والبند 10.1 يصف تحصيل المال نيابة عن البائع. لا يثبت ذلك نموذج StubHub International أو تطابق الحسابات والرسوم بين النطاقات. **FansPass.sa:** [الشروط الصحيحة](https://fanspass.sa/ar-sa/pages/terms-and-conditions)، تحقق HTTP مباشر موثق في [سجل المنصات](../../../skills/search-tickets/references/platforms.json) عند 05:35:59 UTC؛ البند 1.2 يقول «فانز باس منصة لإعادة بيع التذاكر (سوق ثانوي) تربط البائعين بالمشترين. ليست جهة منظمة أو مُصدِرة للتذاكر»، والأسعار يحددها البائعون. إذن لا يُبنى نموذجنا على افتراض أنه يشتري كل التذاكر. `Fanpass.net` جهة منفصلة. فشل رابط تخميني سابق لم يعد عائقًا بعد التحقق من الرابط الصحيح.

## الموردون: الأدلة والحقول المتاحة

### Travel Connection

المصادر المباشرة: [الموقع](https://www.travelconnectionleisure.com/)، [Getting started](https://docs.travelconnectionleisure.com/docs/getting-started)، [التسعير](https://docs.travelconnectionleisure.com/docs/pricing.md)، [الحجز](https://docs.travelconnectionleisure.com/docs/orders.md)، [إنشاء reservation](https://docs.travelconnectionleisure.com/reference/reservationscreate.md)، [التسليم](https://docs.travelconnectionleisure.com/docs/ticket-supply.md)، [الفواتير والدفع](https://docs.travelconnectionleisure.com/docs/invoices-payment.md). الوثائق تعرض تحديثات June–July 2026.

| المجال | المثبت في المصادر |
| --- | --- |
| الخدمة/المخزون | بوابة لوكلاء السفر وAPI، ومجموعات وضيافة؛ يقول الموقع إن مخزونه من الأندية مباشرة وإن portal وAPI لهما المخزون والأسعار نفسها. هذا ادعاء المورد؛ يلزم تحقق النادي/المنتج قبل البيع. |
| التغطية | كرة قدم: Premier League وLa Liga وSerie A وBundesliga وChampions League وغيرها حسب الموقع؛ شراكات مع أندية مسماة مثل برشلونة. لا يثبت مخزون مباراة خارج ملعب النادي أو كل دولة/موسم. |
| التسعير | «Prices are provided wholesale, meaning you must add your own margin»؛ GBP أو EUR حسب المنتج؛ حتى Bayern Munich مسعر GBP. لا يثبت تحصيل SAR. |
| التسجيل والوصول | الوثائق للـapproved agents؛ live access بعد التزام integration/rate limit، اختبار حمل كامل وwebhooks وطلب تجريبي، ثم تفعيل حساب ضمن agent account. لا يثبت قبول سعوديين تلقائيًا. |
| sandbox | بيئة منفصلة ومفاتيح تختلف عن production؛ لم ندخلها أو ننفذ طلبًا. |
| التحديث | 60 request/min؛ static data يوميًا، product discovery كل 4 hours، inventory-status كل 10–30 minutes في batches. الكمية الكاملة لا تظهر؛ max_purchase_qty يحد الطلب. |
| hold/order | reservation ثم confirm أو create order مباشر؛ الحجز يعيد `price_total/currency/expires_at`. مدة ثابتة للحجز وضمان كل سيناريو تغير سعر **غير منشورين في الصفحات المقروءة**؛ يجب قراءة expiry الفعلي والتحقق قبل الالتزام. |
| المال والفاتورة | invoice PDF عند الحجز؛ لا دفع للفواتير عبر API. standard14days، وإذا المناسبة خلال أقل من14days فالدفع فوري؛ bank transfer أو card من Booking Hub. هذه شروط منشورة عامة وليست ائتمانًا مؤكدًا للمالك. |
| التسليم | PDF أو digital/NFC أو box office لبعض الأندية؛ voucher عند الحجز يحدد الطريقة؛ الأندية غالبًا تطلق التذاكر قبل المباراة بأيام ثم ترسل للوكيل ليعيد إرسالها. |
| دعم/إلغاء/حقوق | توجد booking support، لكن SLA وتعويض الرحلة وسياسة الإلغاء التفصيلية وonward agency distribution **غير منشورة في الصفحات المقروءة**. إمكان groups/hospitality لا يثبت حق توزيع كل منتج لوكالات أخرى. |

**غير منشور/غير مثبت أيضًا:** قبول وكالة سعودية ومستنداتها، رسوم API والتفعيل والدعم، وديعة/حد سنوي/شراء إلزامي، عمولات الدفع والصرف والضريبة، مالك المخزون القانوني لحظة كل مرحلة، قواعد refund وتغير الموعد، bundling وإعادة التوزيع والأقاليم، حق استعمال الصور/المحتوى. لا تُفترض تكلفة 0 لهذه البنود.

### TicketNetwork Mercury

المصدر المباشر: [Mercury Retail Integrations](https://corporate.ticketnetwork.com/products-services/mercury-retail-integrations/)، الصفحة المسترجعة تحمل تعديل 7 February 2024. بحث مخصص لاحق لم يعثر على صفحات web إضافية للشروط؛ هذا نقص تغطية لا دليل على غيابها.

- مخزون secondary market يشمل sports/concerts/theatre؛ عبارة حجم المخزون بالدولار تسويقية ولا تستخدم ميزانية لنا.
- «inventory at broker wholesale price» والعميل يتحكم في markup/service fees/shipping؛ لا يثبت أن السعر الإجمالي دون سعر النادي أو دون سوق آخر.
- API وخاصية secure/lock أثناء تحصيل بطاقات عملاء التاجر، قبول وتأكيد تلقائي خلال ثوانٍ بحسب وصف المورد. مدة hold وprice revalidation وerror/refund contracts **غير منشورة هنا**.
- ضمان معلن «up to 200%, or replacement with equivalent tickets»؛ لا يحول إلى تعويض مؤكد عن طيران أو فندق ولا يتجاوز شروط الضمان الخاصة.
- **غير منشور في الصفحة:** الدول الدقيقة، قبول منشأة سعودية/KYC، deposits/minimums/API fees، settlement/currencies/MoR والفاتورة، sandbox أو التوثيق التفصيلي، delivery deadlines/mobile transfer، إلغاء/تأجيل، SLA، توزيع فرعي وباقات. لا تستخدم شروط TicketNetwork retail consumer أو شروط Victory Live بدل عقد Mercury.

### XS2Event

المصادر: [الموقع](https://www.xs2event.com/en/index.html)، [شروط v1.4 المرتبطة منه](https://cdn.xs2event.com/generalterms/general-terms-XS2Event_v1.4.pdf) بتاريخ 14 June 2023؛ [API](https://docs.xs2event.com/)، [Authentication](https://docs.xs2event.com/authentication.html)، [Booking flow](https://docs.xs2event.com/booking-flow.html)، [FAQ](https://docs.xs2event.com/faq.html)، [التسليم والفواتير](https://docs.xs2event.com/etickets.html)، [التحديث](https://docs.xs2event.com/rate-limits-and-caching.html).

| المجال | المثبت/الحدود |
| --- | --- |
| النموذج | الموقع يصل rights holders بوكالات السفر وOTA/DMC عبر portal/API. الشروط تقول حرفيًا إنه يشتري من المورد بناءً على طلب العميل ثم يبيع له؛ ليس مجرد تقنية بيع ولا يلزم شراء حصة مسبقة. |
| التغطية/الاعتماد | رياضة وضيافة وشراكات مسماة برشلونة/سيلتيك/PSV وغيرها. الصفحة تعرض 1,500+ events وفي جزء آخر1,200+؛ أرقام تسويق غير متسقة لا نتخذها تعدادًا معتمدًا. لا يثبت كل مناسبة أو مخزون لشركة سعودية. |
| التسجيل | الشروط تعرف العميل كشخص/كيان يعمل مهنيًا/تجاريًا. API key عبر account manager؛ test/staging منفصل عن production. عبارة sign up for free لا تثبت مجانية المعاملة أو API أو انعدام الوديعة. |
| السعر والعملة | net_rate وcurrency_code يطابقان ticket detail عند reservation؛ mismatch خطأ. fee ثابت لكل تذكرة على الفاتورة، **مقداره غير منشور**. FAQ: عملات tickets عادةEUR/USD/AED/GBP/SGD؛ الفواتيرEUR دائمًا. |
| التحديث | tickets مباشرة دون cache بسبب سرعة التغير؛ events يوميًا؛ categories أسبوعيًا؛ فرق التحديث عن قواعد Travel Connection مقصود ويجب احترام عقد كل مورد. |
| hold/order | reservation10minutes وvalid_until؛ لا تمديد، يحذف القديم وينشأ جديد. booking يحول إلى شراء، يحتاج guest data حسب pre_checkout/pre_download؛ error عند نفاد/عدم تطابق السعر/expiry. طريقة الدفع بحسب العقد. |
| الدفع | شروط2023: invoice7days ما لم يتفق/يذكر خلافه، ولا تسليم قبل سداد كامل؛ قد يطلب prepayment بعد التحقق المالي. لا تثبت ائتمانًا أو حدًا للمالك. |
| التسليم | logistic_status ثم download PDF/ZIP أو external channel أو external_end_client من المنظم. لا نفترض أن API يحوي PDF لكل منتج. |
| الإلغاء والتأجيل | بنود8.2 و8.8: الشراء ملزم وغير قابل للإلغاء المعتاد. 5.9: تغير الموعد لا يبطل التذكرة. 10.3: refund فقط بقدر ما يعيده المورد مع حسم service charge الذي لا يرد. |
| المسؤولية | الشروط16.4 تحد الضرر المباشر بقيمة الرسوم وبحد أقصى1,000EUR؛16.6 تستبعد خسائر تبعية وأمثلة خسائر بسبب المورد. هذا نص تعاقدي أجنبي للمراجعة وليس مبلغًا مطلوبًا من المالك، ولا يُفهم تغطية لفندق/طيران. |
| الدعم | FAQ يطلب booking_reference/bookingorder_id للتصعيد عند التأخر؛ SLA تعاقدي للمالك غير مثبت. |

**تعارض زمني يلزم حسمه:** شروط2023 تقول delivery قبل24h عند غياب مهلة متفق عليها؛ FAQ الحالي يقول لا قاعدة واحدة X hours بل حسب release للمورد/المكان. لا نعتمد أحدهما وعدًا للعميل؛ تؤخذ مهلة المنتج والعقد الحالي مكتوبة. مدة الشكوى في الشروط7days بعد المناسبة، مع ضرورة إبلاغ العيب خلال24h من الاستلام؛ تُراجع على عقدنا ولا تدمج مع آجال مورد آخر.

**غير منشور/غير مثبت:** أهلية ووثائق سعودية، وديعة وحد حجم أو رسوم API/settlement/FX الفعلية، مقدار fee، موافقة عرض المحتوى والمنتجات والباقات وإعادة التوزيع لوكالات. الشروط14.2 تقيد نشر المحتوى دون موافقة مكتوبة؛ وجود API لا يمنح ترخيص محتوى مفتوحًا.

### Sports Events 365

المصدر: [Partner programme](https://sportsevents365.com/partner). هذا **Sports Events 365** وليس **events365 من Victory Live** أدناه.

- Travel Professionals لوكالات/TMC من جهات صغيرة إلى شبكات حول العالم، tickets ضمن travel package أو ancillary مقابل عمولات.
- affiliate referral لشراء لدى الموقع؛ white label بالعلامة مقابل commission؛ Search API يحيل الدفع إلى الموقع مقابل عمولة؛ Booking API يتم search+booking على موقع الوكيل و«Client will pay directly to you».
- التغطية sports/concerts ومخزون يدعي50K yearly events؛ لا قائمة دول مؤكدة أو جرد مناسبة مستهدف من صفحة الشراكة.
- رابط Travel Professionals `https://tickets.sportsevents365.com/b2b/lp/?lang=en` أعاد في HTTP المباشر `Bot Verification`، لذلك لم نثبت شروط البوابة الإضافية أو مخزون حساب.
- **غير منشور في صفحة الشراكة:** نسبة العمولة/markup وAPI fee/وديعة/حد أدنى، قبول السعودية/KYC، التسوية والعملات والفاتورة بكل مسار، توثيق/sandbox/hold/reprice/order/cancel، release/deadline/transfer، دعم/SLA/فشل تسليم أو تأجيل، onward B2B. إتاحة packages صريحة تسويقيًا؛ الحقوق التفصيلية لكل منتج تبقى تعاقدية.

### P1 Travel

المصادر: [Partnerships](https://www.p1travel.com/en-GB/partnerships)، [Selling event tickets](https://www.p1travel.com/en-GB/partnerships/selling-event-tickets/).

- portal للحجز اليدوي لوكلاء السفر ووكلاء التذاكر، live availability/pricing وinstant bookings؛ login يطلب من فريق المبيعات. affiliate مستقل عبر Partnerize/TradeTracker.
- يدعي العمل مباشرة مع المنظمين وأسعارB2B أدنى من consumer rates؛ هذا **ادعاء المورد** لا benchmark مستقل أو أرخص إجمالي.
- مخزون رياضة وحفلات وتذاكر فقط وضيافة وفنادق؛ الصفحة تظهر شراكات أندية/بطولات مختلفة. يؤكد أن95% من التذاكر e-tickets ومجاورة المقاعد بفضل الشراكات؛ يبقى كل عرض وفئة وجماهيره وموعد تسليمه مرجعًا.
- دعم/account managers معلنان؛ **API أو sandbox لم يثبت في هاتين الصفحتين**، فلا يعد غياب الرابط دليلاً على عدم توفر API خاص.
- **غير منشور/غير مثبت:** قبول سعوديين/KYC، رسوم/حدود/ودائع وعمولة أوnet-price contract، settlement/currencies/MoR/invoice، hold/reprice/cancellation/refund/deadline/SLA، حقوق bundling وonward wholesale. عرض الفنادق لا يمنحنا تلقائيًا حق بيع باقة بعلامتنا.

### Seat Unique

المصدر: [Trade programme](https://www.seatunique.com/blog/seat-unique-launches-new-trade-programme-with-ttg-media/)، نشر ظاهر6 January2026 وتعديل29 October2026؛ استرجاع9 November.

- يعمل مباشرة مع clubs/venues/promoters ويعرض official premium/hospitality/VIP ومنتجات موسيقى ورياضة، بحسب المورد؛ ليس مصدرًا مضمونًا لأرخص مقعد عادي.
- Agent-managed booking لاقتباسات وباقات مخصصة، وAPI integration للـeligible agents/consortia/platforms معreal-time inventory؛ يذكر صراحة packaging بجانبflights/accommodation/ground services.
- **غير منشور في الصفحة:** الدول/المناسبات الدقيقة المتاحة لنا، قبول شركة سعودية والوثائق، fees/net/commissions/deposits/minimums/currencies/settlement/invoice، docs/sandbox/hold/reprice/order/cancel، delivery/transfer/SLA والتعويض والمسؤولية وonward B2B. إتاحة البرنامج الآن لا تثبت قبول حسابنا أو اعتماد كل عرض خارج نطاق شراكاته.

## الموردون الآخرون والمسارات المتميزة

ترد أدلة Ticket Evolution/Victory Live وTixstock وTickitto وIngresso وTodayTix Group في القسم التالي. الارتباط المؤسسي لا يجعل مخزون علامتين مستقلًا، واسم API لا يساوي شراء مخزون مسبق.

## Ticket Evolution وVictory Live: صلة مثبتة، ومسارات تجارية مختلفة

- [Ticket Evolution API](https://developer.ticketevolution.com/) يقول: “buy and sell tickets on the resale market” و“We aggregate inventory from over 1000 professional resellers throughout the world”. هذا دليل تجميع مخزون محترفي إعادة البيع؛ لا يثبت شراء المنصة لكل مخزونها أو اعتماد كل مناسبة لدى المنظم.
- مقتطف بحث من المصدر الأولي [Victory Live](https://www.victorylive.com/) يدرج Ticket Evolution ضمن الدمج الاستراتيجي مع DTI Management وLogitix و1Ticket؛ لم تُستكمل قراءة الصفحة الرئيسية نفسها بعد نفاد أرصدة الأداة. الصلة مدعومة أيضًا بانتقال توثيق Ticket Evolution إلى نطاق Victory Live. لا تعدّ هذه الجهات مصادر مستقلة بالضرورة عند قياس تنوع المخزون.
- [Marketplace offerings](https://www.victorylive.com/marketplace-offerings/) يثبت Wholesale API وRetail/White-label وaffiliate وevents365 Widget دون API، ويقول “Leverage your checkout or ours”. يعلن تغطية فعاليات محلية ودولية، رياضة وموسيقى ومسرح، لكن قائمة الدول والمخزون المتاح للوكالة السعودية غير مثبتة.
- [توثيق API](https://developer.ticketevolution.com/documentation) يقود إلى `victorylive.atlassian.net` ويتضمن Listings وOrders وShipments وTax Quotes وOrder/Inventory Webhooks. وجود الوثائق لا يثبت الوصول أو صلاحية التنفيذ لـYoRight.
- [Orders/Create](https://victorylive.atlassian.net/wiki/spaces/API/pages/9994275/Orders+Create)، آخر تحديث ظاهر 15 October، يميز **Buy/Sell**: بيع لعميل وشراء متزامن من المكتب المالك عند الحاجة؛ **Buy**: شراء لإضافة مخزون إلى مخزونك؛ **Sell**: بيع مخزونك الخاص. هذا إثبات عملي أن الوصول إلى المخزون عند الطلب يختلف عن الشراء المسبق. يدعم `ticket_hold_id` من Hold/Take؛ الإجمالي يحسب من السعر والكمية والشحن والخدمة والمصروف الإضافي والضريبة ناقص الخصم. رفض البائع قد يؤدي إلى auto-cancel أو استبدال حسب إعداد الحساب؛ ليست كل استجابة لإنشاء الطلب ضمان تسليم.
- [Getting Access (Brokers)](https://victorylive.atlassian.net/wiki/spaces/API/pages/342229140) يثبت Sandbox للطلبات التجريبية بلا شراء حقيقي، ثم وصول production منفصل. الصفحة مؤرخة 18 February 2019؛ اشتراط Braintree والتفاصيل المالية القديمة فيها **تاريخية تحتاج تحديثًا مكتوبًا**، ولا تُنقل كاشتراط حديث مطلق.

### عقد events365 المنشور: مثال محدد، وليس شروط API بالجملة

المصدر: [Ticket Services Agreement، Non-Signature Travel Agents، آخر تحديث 20 May 2026](https://www.victorylive.com/wp-content/uploads/2026/05/Events365-Client-Agt-ClickThru-for-Non-Signature-Travel-Agents-last-updated-5-20-26.pdf)، مرتبط من صفحة عروض المورد وقت الفحص.

| المجال | المنشور في هذا العقد |
| --- | --- |
| الاستخدام | تصفح وشراء التذاكر بما يشمل بالنيابة عن عملاء الوكالة؛ ترخيص غير حصري وغير قابل للتحويل أو الترخيص الفرعي. لا يثبت حق توزيع حسابات لوكالات فرعية. |
| السعر | Base Price + Service Fee تختاره الوكالة − Discount لا يتجاوز العمولة. رسوم توصيل يحددها المورد تضاف في checkout، وضرائب عند انطباقها. |
| العمولة | البند 4: 5.5% من Base Price، بالإضافة إلى رسوم الخدمة ناقص الخصومات ضمن Monthly Net Share. ليست هامشًا مضمونًا على جميع مسارات Victory Live. |
| الصرف | خلال 15 days بعد نهاية الشهر عن مناسبات أُقيمت خلاله؛ يؤجل الصرف إن كان صافي الشهر أقل من 250 USD (937.50 SAR بتحويل حسابي 3.75، دون رسوم بنك). مبلغ 250 USD **حد صرف، وليس حد شراء أو وديعة**. |
| تحصيل المال | بطاقة معتمدة وقت الشراء؛ يمكن بطاقة العميل بتفويض كتابي محفوظ، وتبقى الوكالة مسؤولة عن السداد الكامل حتى مع dispute/chargeback. |
| التسليم | المورد يرتب التسليم للوكالة أو العميل مباشرة بصيغة digital أو hard stock حسب التذكرة. |
| الإلغاء/التأجيل | مشتريات مؤكدة من البائع نهائية وغير قابلة للإلغاء المعتاد؛ إذا ألغيت المناسبة يعيد Purchase Price إلى البطاقة عند الطلب؛ إذا أُجلت/أعيد جدولتها فلا refund. |
| عدم التسليم | تحقيق بعد إبلاغ الوكالة ثم refund عند ثبوت عدم التسليم في الوقت؛ عند تعذر تسليم التذاكر المؤكدة يلتزم وفق البند 3.b.iii ببديل من العدد نفسه في section/row مساوية أو أفضل، ثم رد Purchase Price إن تعذر البديل. |
| الدعم | أوامر: 09:30–22:00 Eastern يوميًا؛ تقني: 09:00–18:00 Eastern من Monday–Friday. لا تساوي دعمًا بشريًا على مدار الساعة. |
| التحقق التجاري | قد يطلب ACH وCredit Card وBackground Check وProfessional References Authorizations. |
| المسؤولية | رد قيمة التذكرة وحده لا يغطي الطيران والفندق؛ بنود الحد من المسؤولية تستبعد خسائر تبعية وتضع حدودًا. |

**غير منشور/غير محسوم لهذا العميل:** قبول منشأة سعودية وصرف عمولتها وبوابة دفعها، العملة الفعلية والصرف، وديعة/حد حجم شراء أو رسوم API، شروط wholesale API الحديثة، فترة تثبيت السعر أو الحجز، حقوق الباقات وإعادة توزيع المخزون لوكالات سفر مستقلة، واعتماد كل منتج لدى المنظم. عبارة worldwide licence في العقد لا تثبت قبول onboarding سعودي.

## Tixstock

المصدر المباشر: [tixstock.com](https://tixstock.com/).

- يصف نفسه “Between the businesses that hold supply and the channels that distribute it”؛ يربط suppliers بـmarketplaces وtravel platforms وloyalty وsuper-apps وconcierges.
- يقول “We verify, transfer and deliver every ticket, and carry the risk underneath”؛ هذا وصف تسويقي للخدمة، لا اتفاق تخصيص مسؤولية أو ضمان لخسائر الباقة.
- الأنواع المعروضة: concerts/festivals؛ Premier League وChampions League وWorld Cup وGrands Prix وUS playoffs/Super Bowl؛ West End وBroadway. هذه أمثلة تغطية لا ضمان لكل مباراة.
- يذكر one integration للمخزون والتسعير والتوزيع والتسليم والمدفوعات، dedicated account managers/Customer Success؛ نموذج الاهتمام يعرض API وTX Trade/Pay/Origin/Desk/Network.
- إدراج Saudi Arabia +966 في قائمة الهاتف **ليس قبول وكالة سعودية**. عدادات الصفحة وصور واجهات “Live” لا تعامل كتدقيق مالي أو مخزون حي مستقل.
- **غير منشور في الصفحة المفحوصة:** قبول/وثائق سعودية، رسوم/عمولات، وديعة أو حد أدنى، عملات وتسوية، شروط حقوق الباقات/sub-distribution، API docs/Sandbox أو مدد Hold وضمان السعر، endpoints الطلب/الإلغاء، مهلة التسليم والتصعيد وSLA وحقوق refund. يلزم توضيحها قبل ترشيح المورد نهائيًا.

## Tickitto

المصادر: [الرئيسية](https://www.tickitto.com/) و[Solutions](https://www.tickitto.com/solutions).

- يقول “We’re a marketplace, not a channel manager” ويدرج official supply partners؛ هذا يثبت نموذج سوق/تجميع، ولا يثبت أن كل مخزونه مملوك له أو رسمي لكل مناسبة.
- يعلن curated global inventory، sports/music مع always-on experiences/tours، وRESTful API للوصول في الوقت الحقيقي إلى 90,000+ events (ادعاء المورد وقت القراءة، لا قياس مستقل).
- حلول Web App: full white label، jointly branded، full hand off. يمكن استخدام discovery endpoints ثم punchout للمبيعات والتنفيذ لديه. لوحة متابعة العمولات معلنة، دون نسبة عمولة منشورة في الصفحات المفحوصة.
- يذكر متابعة تسليم التذاكر للعملاء قبل المناسبة؛ لا ينشر SLA أو تعويض باقة في هاتين الصفحتين.
- **غير منشور/غير مثبت:** قبول شركة سعودية، عقد وKYC، رسوم API أو هامش وعمولة، وديعة/حد أدنى، العملة والجهة المحصلة والفاتورة بكل مسار، sandbox/access، hold/change-price/order/cancel specifications، حقوق الباقات أو إعادة التوزيع، وفشل التسليم/التأجيل/refund liability. عبارة “Read the API docs” ظهرت دون رابط مستخرج قابل للتحقق؛ لم نزعم قراءة توثيق غير متاح.

## Ingresso: كيان مستقل عن TodayTix Group

المصادر: [الرئيسية](https://ingresso.co.uk/) و[Distributor Solutions](https://ingresso.co.uk/solutions/distributors). الصفحات تسمي **Ingresso Group Limited** وترتبط بسياسة accesso. [خبر accesso بتاريخ 17 October 2018](https://accesso.com/news/accesso-partners-with-groupon-to-bolster-mobile-capabilities-with-the-companys-ingresso-platform/) يثبت استحواذ accesso في 2017 كتاريخ، وليس سجل ملكية حي جديد.

- قناة API إلى أنظمة تذاكر وattractions وlive entertainment وsport؛ يعلن اتصالات مع أكثر من 300 موقع/جهة وتوزيع عبر أكثر من 100 شريك (ادعاء المورد).
- يعلن live inventory، real-time availability وdynamic pricing، general admission أو date/time/seat-specific، interactive seat maps، وتسليم supplier information/barcodes إلى الأجهزة المحمولة عبر API.
- الدعم المعلن يشمل setup/mapping/API maintenance/reporting/accounting/account management؛ ليست مهل استجابة منشورة.
- **غير منشور في الصفحات المفحوصة:** قبول السعودية/KYC، رسوم وهوامش وعمولات، وديعة/حجم والتسوية والعملات، sandbox أو hold/order/cancel endpoints، تقاسم مخاطر الإلغاء/عدم التسليم، حقوق onward agency redistribution/bundling. Ingresso ليس TodayTix Group، و`ingresso.com` ليس النطاق الذي أثبتناه لخدمة التوزيع المقصودة.

## TodayTix Group: خيار منفصل للثقافة والعروض، لا افتراض مخزون كرة قدم

المصادر: [Developer Portal](https://developers.todaytixgroup.com/)، [v3 Getting Started](https://docs.todaytixgroup.com/guides/getting-started)، [Why v3](https://docs.todaytixgroup.com/migration/why-v3)، [Purchase Flow](https://docs.todaytixgroup.com/guides/purchase-flow).

- API للتصفح والمخزون والحجز، widgets وwhitelabel checkout؛ live entertainment مع أسواق مثل London/New York؛ لا يثبت ملاءمة مباراة Sporting/Barcelona.
- v3 هو مسار التطوير النشط؛ legacy Encore يعمل لكنه frozen. لا تبدأ تكاملًا جديدًا من القديم دون سبب موثق.
- onboarding يوفر Retailer ID وحساب staging أولًا ثم production منفصل؛ لكل مستخدم حساب. مفاتيح test/live منفصلة؛ retailer يحدد التسعير والمخزون المرئي. وجود docs لا يمنحنا حسابًا أو قبولًا.
- Browse نفس مخزون تطبيقاته مع cache قصير “a couple of minutes”؛ ليس صفر تأخر. `sellPrice` شامل fees/tax، لكن إجمالي cart النهائي وreceiptLines مرجع الطلب.
- `POST /carts` يحجز مخزون مناسبة واحدة مع `expiresAt`؛ `DELETE /carts/{id}` يحرره؛ نفاد المخزون أو ترك مقعد منفرد يعطي خطأ. لا تُنشأ holds ضمن البحث العام دون قراءة أثرها وتفويض مناسب.
- `POST /orders` يأخذ `expectedTotal` مطابقًا تمامًا لإجمالي cart، مع idempotency key لتجنب تكرار الشراء؛ mismatch يرفض الطلب.
- طرق الدفع المتاحة تحددها السلة. `INVOICE` مشروط بتهيئة retailer للدفع على الحساب؛ ليس ائتمانًا متاحًا للجميع، وتوجد card/wallet methods حسب التهيئة.
- لا يوجد endpoint لإلغاء/refund في v3؛ يلزم TTG support، ثم قراءة حالة الطلب. barcode قد يبقى null حتى الدفع وإطلاق المكان للتذاكر قرب العرض؛ طريقة التسليم والتعليمات حقلان يجب إظهارهما.
- **غير منشور في الوثائق المقروءة:** قبول وكالة سعودية، متطلبات KYC تجارية وأسعار API/حد حجم/ودائع، حصة العمولة/التسوية/عملات تعاقدنا، الحقوق التعاقدية للباقات أو وكالات فرعية، refund eligibility/SLA والتعويض عن مكونات السفر. اختلاف currencies تقنيًا لا يثبت تحصيل SAR لكل مناسبة.

## مقارنة النماذج الممكنة لنا

الجدول التالي **تصور تعاقدي** للمقارنة، وليس تعيينًا تلقائيًا للمسؤوليات لدى كل مورد. Merchant of record هو الطرف الذي يحصّل عملية البطاقة وتظهر عليه التزامات الدفع؛ لا تحدده العلامة الظاهرة أو API وحدهما. قد يُحصّل المال بصفته وكيل تحصيل بينما يكون بائع التذكرة طرفًا آخر. الفاتورة الضريبية تختلف عن إيصال الدفع أو voucher.

| النموذج | المخزون والمال والفاتورة والتسليم في التصور | رأس المال والمخاطرة |
| --- | --- | --- |
| إحالة بعمولة | البائع/المورد يحتفظ بالمخزون؛ العميل يذهب إليه ويدفع له؛ هو يصدر فاتورة التذكرة وينفذها وفق عقده؛ لنا عمولة. يلزم توضيح دورنا في المساعدة والشكوى. أمثلة منشورة: Sports Events 365 وP1 affiliate. | لا شراء مسبق للتذاكر؛ تكلفة محتوى/استقطاب ودعم، تأخر صرف أو عكس العمولة، وحدود التحكم في تجربة العميل. |
| عرض مخزون ثم إتمام البيع عند المورد | نعرض البحث/السعر مع وقت تحديثه ثم punchout؛ المورد يحصّل ويؤكد السعر ويصدر المستند ويسلّم. مثال Sports Events 365 Search API وTickitto handoff. | لا يلزم تملك مخزون؛ تكلفة تكامل محتملة، خطر سعر قديم/فقد التحويل، وقواعد استخدام المحتوى. |
| البيع لعملائنا مع تنفيذ المورد | نحصّل نحن ونصدر مستند العميل حسب صفتنا؛ نشتري عند الطلب من المورد الذي يفوترنا وينفذ. قد ينفذ مباشرة للعميل أو يرسل لنا. أمثلة: Travel Connection wholesale وSports Events 365 Booking API. | رأس مال تشغيلي وتسويات/chargebacks/refunds، ومخاطر رفض المورد أو تأخره بعد أخذ مال العميل؛ يحتاج سعرًا مؤكدًا وترابط payment/order. |
| واجهة بعلامتنا | يمكن للمورد أن يحصّل ويفوتر ويخدم، أو نحن؛ يجب نص صريح. مثال Sports Events 365 white label وVictory Live. | تصميم/اشتراك أو عمولة وفق العقد، اعتماد على المورد وسمعة علامتنا؛ لا يثبت تغير الشعار انتقال المسؤولية إليه. |
| API | تقنية تصلح للإحالة أو البيع أو wholesale؛ الملك والتحصيل والفاتورة والتسليم يحدده نموذج التجارة الأساسي. | تكلفة تطوير وتشغيل ومراقبة ودعم ومطابقة؛ API لا يزيل التعرض المالي أو الحاجة لحقوق توزيع. |
| شراء مسبق وإعادة بيع | نشتري كمية محددة فنحمل حقها والتزامها بحسب العقد، ثم نحصّل ونفوتر للمشتري؛ التسليم من المنظم/المورد أو عبرنا. مثال تقني: Ticket Evolution Buy منفصل عن Buy/Sell. | أعلى تجميد رأس مال وخطر بقاء مقاعد/تغير طلب/سعر/موعد، مع قيود resale/transfer. لا ينفذ قبل إثبات الطلب والحقوق. |
| حصة/تخصيص | تخصيص قد يكون مدفوعًا وغير مرتجع، أو ضمان حد مبيعات، أو خيار release بتاريخ؛ لا يفترض أنه ملك نهائي لنا. نتفق على التحصيل والفوترة والتسليم. | يتراوح من منخفض إلى مرتفع بحسب الوديعة/الضمان/release؛ حجم الحصة وحده لا يوضح المخاطرة. |
| توزيع بالجملة لوكالات أخرى | نبيع لوكالة فتفوتر عميلها، ونحن نتعاقد ونحاسب المورد؛ التسليم يمر بنا أو يصل للعميل وفق الاتفاق. يحتاج حق sub-distribution صريح وقواعد هوية ودعم. | سيولة وائتمان وديون للوكالات، سلسلة مسؤوليات أطول؛ حساب retail أو ترخيص API غير قابل للترخيص الفرعي قد لا يسمح به. |
| باقة تذكرة وفندق/طيران | ننسق الباقة ونبين بائعها ومسؤول تنفيذها؛ التذكرة/الفندق/الناقل يحتفظ كل منها بقواعده، وقد تصدر فواتير مكونات أو فاتورة باقة حسب الإطار القانوني والعقد. | مخاطر مترابطة: استرجاع التذكرة لا يضمن استرجاع الفندق/الطيران، تغير المباراة قد يفرض إقامة/رحلات إضافية؛ يحتاج reserve وخطة معالجة كاملة. |

| الحالة | التخصيص الذي يجب تثبيته قبل البيع |
| --- | --- |
| إلغاء المناسبة | من يقرر الإلغاء؟ ما المبلغ المسترد وهل يشمل service/delivery/payment/tax؟ هل نرد للعميل قبل استرداد المورد؟ ما أجل الرد؟ |
| تأجيل/تغير موعد أو ملعب | هل التذكرة تبقى صالحة بلا refund؟ من يغطي تعديل الطيران والفندق وفقد حضور العميل؟ يثبت موافقته على السيناريو. |
| عدم تسليم/رفض دخول | من يتلقى بلاغًا يوم المناسبة؟ حق ومهلة البديل المقبول أو الاسترداد ودليل الرفض وحد المسؤولية؛ لا وعد بتعويض رحلة من ضمان تذكرة فقط. |
| تغير السعر قبل التأكيد | لا نحول سعر البحث إلى تأكيد؛ revalidate ثم hold صالح إن أجيز ثم final order. لا نزيد المبلغ على العميل أو نقبل بديلًا مؤثرًا دون موافقته. |
| chargeback/تحويل عملة | الطرف المحصّل وعقد الوكالة قد يتحملان النزاع رغم أن المورد سلّم؛ تسجل كلفة الصرف والدفع وخسارة الرسوم عند refund. |

## التحقق التنظيمي الحالي وحدوده

أُعيدت قراءة [لائحة خدمات السفر والسياحة الرسمية المنشورة 11 September 2026](https://www.uqn.gov.sa/decisions-and-regulations/4001822) و[FAQ الوزارة](https://mt.gov.sa/ar/faq/faq-category-2) في 2026-11-09 نحو 05:36 UTC. المادة 4 تدرج **ترتيب حجوزات وزيارات الفعاليات** و**إعداد البرامج السياحية** ضمن فئة خدمات سفر وسياحة عام، وتدرج تسويق/بيع البرامج ضمن وكالة السفر؛ لا نخلط «تذاكر السفر البري/البحري/الجوي» مع نص مستقل يبيح كل تذاكر المباريات. المادة 17 تشترط تقديم الخدمة بحسب الترخيص والحصول على الموافقات اللازمة للأنشطة الداخلة في اختصاص جهات أخرى. هذا تحقق من النطاق المنشور، ولا يثبت فئة أو صلاحية ترخيص المنشأة ولا يحسم كل تركيب باقة للخارج.

تبقى [المراجعة السعودية الموجودة](../2026-11-01-saudi-licensing/YoRight-Saudi-Licensing-Crosswalk.md) مرجع التفاصيل التي لم يغيرها هذا البحث. لم يُصدر في هذه المذكرة حكم قانوني واحد لجميع الدول أو المباريات. يلزم لكل منتج مختار قبل البيع: بلد المناسبة، قواعد المنظم وبلده لإعادة البيع/التسمية/التحويل/الجماهير، إقليم العميل والجهة البائعة، حق bundling، ونطاق ترخيصنا والإفصاح والضريبة. مصدر مورد يقول «official» ليس بديلًا عن التحقق من حقه لدى صاحب الحقوق. أي قيود غير محسومة تبقى gap تمنع اعتبار المنتج جاهزًا للبيع، ولا تمنع البحث والمقارنة غير الملزمين.

## الأسئلة المحضرة للموردين — لم تُرسل

1. ما الكيان المتعاقد، وهل يقبل وكالة سفر سعودية لعملاء B2C سعوديين؟ ما مستندات الشركة والترخيص المطلوبة؟ لا ترسل بيانات قبل التفويض.
2. ما مصدر المخزون وصاحب حق التوزيع لكل منتج وموسم وإقليم؟ هل يسمح عرض الأسعار والصور والمحتوى، البيع منفردًا وضمن باقة سفر، وبالجملة لوكالات أخرى؟ هل هذه حقوق موحدة أم لكل نادي؟
3. هل نصل لمخزون قابل للطلب أم نشتري allocation/حصة مسبقة؟ هل هناك ودائع/حد أدنى/حجم سنوي/ضمان غير مرتجع/release date؟ فصلوا كل مسار portal/API/white label/affiliate.
4. ما net/base price والرسوم الإلزامية/الضرائب/الشحن/الدفع والصرف، هامشنا/عمولتنا ومواعيد صرفها واسترجاعها؟ ما API/setup/support fees؟ لا يكفي «competitive prices» أو «free signup».
5. من بائع التذكرة ومن merchant of record ومن يصدر فاتورة التذكرة أو الباقة؟ من يحصّل SAR إن أتيح؟ بأي عملة نسدد ولمن ومتى، وهل لدينا credit فعلًا؟
6. ما شروط sandbox/production والـrate limits وcache/TTL؟ ما مدة hold الفعلية، ومدى ثبات السعر والمخزون، وrevalidation/idempotency/error handling وwebhooks/order statuses؟
7. ما طرق التسليم/mobile transfer/NFC ومتطلبات app/recipient وبيانات الزائر؟ متى تسلّم لكل منتج؟ ما دليل الصلاحية والتجاور والرؤية ومكان الجمهور؟
8. عند عدم التسليم أو رفض الدخول: من يتولى التصعيد يوم المناسبة، وما SLA وخطة البديل المقبول/refund/تعويض وحدودها؟ هل يوفر دعمًا في توقيت الوجهة؟
9. ما أثر الإلغاء والتأجيل وتغيير الموعد/الملعب/الخصم على كل رسوم التذكرة وعلى الفندق والطيران؟ هل لدينا التزام برد كامل للعميل لا يغطيه المورد؟
10. ما حماية بيانات الزائر ومدة احتفاظها ومناطق معالجتها وترخيص التخزين؟ هل يمكن تنفيذ الطلب دون تخزين هويات أو تذاكر حساسة في مستودعنا؟

أسئلة خاصة مثبتة بالأدلة:

- **Travel Connection:** مدة reservation وثبات السعر؛ كل الرسوم مقابل wholesale؛ cancellation/fixture-move contract وحقوق bundling/sub-distribution؛ هل payment14days قابل للتطبيق على حساب جديد سعودي؟
- **TicketNetwork Mercury:** وثائق wholesale الحديثة وsandbox/MoR/الدول المقبولة؛ حدود guarantee حتى200%؛ لا نستعير عقد Victory/events365.
- **XS2Event:** نسخة شروط أحدث منv1.4 وتسوية delivery24h مقابل FAQ release؛ مقدار fee وصرف العملة للفواتيرEUR؛ refund service charge ومسؤولية تأجيل الرحلة؛ إمكانpre_download API الحالي.
- **Victory/events365:** هل عمولة5.5% وحد صرف250USD صالحان للشركة السعودية بهذا المسار؟ شروط Wholesale API مختلفة؛ هل يتاحsub-distribution مع ترخيص غير قابل للترخيص الفرعي؟
- **Tixstock/Tickitto/Ingresso:** توثيق API وسوق البداية وحقوق الموردين وMoR وتكاليف الوصول؛ الأوصاف التسويقية لا تحدد العقد.
- **P1/Seat Unique:** تفاصيل eligibility والباقات/وكالات فرعية؛ API لدىP1 لم يثبت علنًا في الصفحات المقروءة، وSeat Unique premium لا يقارن بمقعد عادي.
- **TodayTix Group:** قبول البلد وصلاحيات retailer وrefund process الذي يتطلب support، وإطلاق barcode والتعليمات؛ ملاءمة المسرح/الثقافة مستقلة عن كرة القدم.

## الخطوة التجارية المقترحة والمقياس

**اقتراح، لم يُعتمد مورد نهائي:** ابدأ بمقارنة يدوية لمخزون عند الطلب من مسار رسمي مناسب مثلTravel Connection أوXS2Event أوP1، مقابل مسارsecondary واضح مثلMercury أوTicket Evolution حين تسمح قوانين المناسبة. أضفSeat Unique عندما يكون الطلب premium، وTodayTix/Ingresso/Tickitto للتجارب والعروض التي تطابق جمهورنا. هذه shortlist بحسب **نوع المنتج وسهولة الاختبار** وليست ترتيب أسعار أو موافقة شراكة.

قبل أي حساب أو التزام، استخدم الأدلة العامة الحالية لتحديد 2–3 مناسبات مستهدفة وأكمل مقارنة نطاق الوصول والحقوق والأسعار غير المنشورة. بعد تفويض منفصل للوصول التجاري، يكفي portal/manual matched-quote pilot أولًا؛ لا نشتري دفعة ولا نطور API لإثبات وجود الخدمة.

في الاختبار اللاحق قِس لكل طلب حقيقي مسموح: match/category/quantity/adjacency، total platform بعملته ثمSAR بتحويل موثق، الوقت حتى التأكيد والتسليم، ساعات عمل الدعم، التعارضات والمخزون المتكرر، وصافي المساهمة = تحصيل العميل − تكلفة المورد والرسوم/الضريبة القابلة للتطبيق − الدفع/الصرف − دعم/refund reserve. لا تفترض margin أو تكلفة بنك أو reserve ثابتة قبل الحصول على بيانات.

اختر أتمتة محددة فقط عندما يثبت أنها توفر عملًا أو تقلل خطأ: aliases ومطابقة المناسبات أولًا؛ ثم حفظ وقت quote وشروطه؛ ثم مقارنة الإجمالي؛ ثم إدارة supplier-order والدفع والتسليم دون عرض بيانات خاصة فيGitHub. API ليس شرطًا لتجربة الطلب أو إثبات الربحية.

## قيود الجلسة

المصادر المنشورة أعلاه متاحة للقراءة، لكن لم يُفحص مخزون تجاري خاص لأي مورد، ولم يُثبت قبول YoRight أو سعر API أو اتفاق توزيع. نفدت أرصدةFirecrawl قرب نهاية بحث الموردين، بعد جلب المصادر الأساسية؛ لم يكتمل fetch لصفحةVictory الرئيسية وميزناه كمقتطف. بقيت قراءةHTTP والمتصفح المتاح خيارًا مستقلًا للبحث العام، دون تجاوز تسجيل دخول أو تحقق بشري أو إنشاء التزام. لا تُعد نتيجة مستهلك واحدة benchmark لسعر الجملة.

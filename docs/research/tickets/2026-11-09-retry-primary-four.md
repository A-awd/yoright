# إعادة التجربة: المصدر الرسمي و4 منصات

هذه متابعة لاحقة في اليوم نفسه، لا تعديل بأثر رجعي على [الفحص السابق](2026-11-09-primary-and-four-checks.md). استُخدم Chromium سحابي فعلي مع تفاعل Playwright، دون جلسة المستخدم المحلية، ولم تُملأ بيانات أو تُرسل نماذج طلب أو دفع أو إنشاء حساب.

المناسبة: Sporting CP vs FC Barcelona، 20 January 2027، 20:00 بتوقيت لشبونة، Estádio José Alvalade. العدد المطلوب `1`. [المصادر الرسمية لهوية المباراة](2026-11-09-event-verification.md).

## النتيجة الجديدة

ظهرت تفاصيل إجمالي checkout في FootballTicketNet وGigsberg قبل إدخال البيانات. لذلك لم يعد صحيحًا أن «الإجمالي لم يظهر» لهما في هذه المتابعة. لكن لم تُختبر وسيلة الدفع وما قد يعتمد عليها أو على بلد الفوترة، ولم يثبت موعد تسليم محدد للعرض. **عدد الإجماليات النهائية غير المشروطة المؤكدة في هذه المجموعة يظل `0`**؛ الموجود إجماليان معروضان في checkout ضمن حدود الفحص أدناه.

| المنصة | وقت الرصد UTC | النتيجة الحالية | المقعد والتسليم | ما بقي غير محسوم |
| --- | --- | --- | --- | --- |
| [FootballTicketNet](https://www.footballticketnet.com/champions-league/sporting-lisbon-vs-fc-barcelona-estadio-jose-alvalade-football-tickets/event/134206) | `2026-11-09T12:49:18.676658Z` | **إجمالي checkout ظاهر بشروط الفحص: `231.68 EUR`**؛ التذكرة `168.59 EUR` + الحجز `60.69 EUR` + الخدمة `2.40 EUR` | Category 3، Block B16، Single Seat، Adult Tickets، Clear view، Sporting Lisbon fans، Home Supporters Section، E-Ticket، Quantity `1` | الصفحة عند خطوة بيانات الاتصال. لم تُدخل بيانات ولم تُختبر وسيلة الدفع أو رسومها المحتملة أو موعد تسليم خاص بالعرض. لا صف أو رقم مقعد محدد |
| [Gigsberg](https://www.gigsberg.com/sport-tickets/football/champions-league-tickets/show-268751?quantity=1) | `2026-11-09T12:49:26.699584Z` | **إجمالي checkout ظاهر بشروط الفحص؛ عملة التحصيل المعلنة `227.18 EUR`**. تعرض الواجهة `253.32 USD` كتحويل تقريبي فقط، من `183.76 USD` للتذكرة و`69.56 USD` للخدمة | Category 3، B18، E-Ticket، Home Fans Section، تذكرة `1`، Clear view في العرض. checkout أكد أخيرًا اسمي Sporting Lisbon وFC Barcelona والتاريخ والملعب | التبرع الاختياري `0.68 USD` غير مضاف. البلد الافتراضي United States لم يُغير. Confirm & Pay غير متاح قبل بيانات الحساب والفوترة وقبول الشروط؛ لم يُضغط Continue. التسليم في الحساب عندما تتاح الملفات، دون موعد صريح محدد |
| [Sporting CP ticket portal](https://tickets.sporting.pt/pt) | `2026-11-09T12:49:16.371480Z`؛ إعادة محاولة `12:50–12:53Z` | أعادت الصفحة `200` وعرضت November 2026 ومباراة Manchester United فقط في الشاشة الافتراضية | لا عرض أو سعر لبرشلونة ضمن الجزء الذي اكتمل فحصه | عناصر التقويم القياسية Next Month وChoose Month وChoose Year موجودة في DOM لكنها مخفية وغير قابلة للاستهداف عبر الأدوار المرئية. محاولة تشخيص أدوات التقويم المرئية في جلب لاحق رجعت `503 remote connection failure`. لم يكتمل البحث في January، ولا استنتاج نفاد أو عدم بيع |
| [TicketNetwork](https://www.ticketnetwork.com/tickets/8242383) | `2026-11-09T12:49:19.198737Z`؛ متابعة نحو `12:51Z` | عرض B21، Row GA، eTickets، تذكرة `1`، `173 USD` قبل إجمالي checkout، كما في الجولة الأولى | لا موعد تسليم خاص بالعرض مثبت | نقر Continue اعترضته نافذة `Inventory is limited` وطبقتها `sea-notice-modal-backdrop`، لا تسجيل دخول أو تحقق بشري. محاولة جديدة لمعالجة النافذة لم تبلغ checkout؛ لم يُؤكد الإجمالي. لا يُستبدل بها العرض التالي الأغلى ويُسمى أرخص المنصة |
| [SportsEvents365](https://sportsevents365.com/event/402457) | `2026-11-09T12:49:16.353901Z`؛ متابعة نحو `12:51Z` | العرض الأول Short Side B16، العدد `1`، `208 USD`، All Together، Immediate Confirmation، E-Ticket | لا موعد تسليم محدد | لم يكتمل التنقل إلى checkout. المحاولة باسم الزر Buy لم تطابق اسمه الميسر الكامل؛ إعادة المحاولة بالاسم الكامل بعد جلب جديد تعذرت مع عدم تحميل الأزرار. هذا عائق تفاعل/اتصال، لا دليل نفاد أو حاجة حساب. لا إجمالي نهائي |

لا يوجد سعر EUR/SAR حي موثق في هذه الجولة. احتُفظ بعملة التحصيل الأصلية بدل حساب قيمة ريال غير مثبتة. خصوصًا **لا يُعرض `253.32 USD` في Gigsberg بوصفه عملة المبلغ الذي ستخصمه المنصة**؛ الصفحة تقول صراحة إنها ستحصل EUR. ولا يدخل أي تبرع أو تأمين اختياري في الإجمالي الأساسي.

## المقتطفات التي تغير النتيجة

### FootballTicketNet

من صفحة checkout للعرض العام `1677816` والعدد `1`، دون نشر رابط الدفع:

> Subtotal €168.59 — Booking Fee €60.69 — Service Fee €2.40 — Total €231.68

أوصاف أزرار شرح الرسوم:

> Booking fee: a fee that covers securing your seats and processing your order.
>
> Service fee: a fee for our secure booking platform, customer support and order handling.

تطلب الخطوة نفسها First name وLast name وEmail. لم تُملأ. ضمان التسليم العام يقول «just on time»، ولا يحدد موعد الإصدار لهذا العرض. ملاحظات التسليم العامة المتعارضة التي سبق رصدها لا تصبح وعدًا خاصًا بالمقعد.

### Gigsberg

بعد Select ثم Checkout ظهرت أسماء الفريقين، وحُسمت فجوة الهوية التي بقيت في الجولة الأولى:

> Sporting Lisbon vs FC Barcelona — Wed Jan 20, 2027 • 8:00 PM — Jose Alvalade Stadium, Lisbon, Portugal

> Total Charge US$253.32
>
> This is an approximate conversion. These tickets are listed in EUR. You will pay €227.18

> E-tickets will be available as soon as possible in your private account on Gigsberg. You will be notified by email as soon as they are downloadable.

النموذج يتضمن اسمًا وبريدًا وكلمة مرور وهاتفًا وعنوان فوترة. يظهر النص بأن الضغط على Continue يوافق على Terms of Use وPrivacy Policy؛ لذلك لم يُضغط، ولم يُنشأ حساب. قسم Confirm & Pay غير مفعّل. وجود عناصر بطاقة دفع مخفية في DOM لا يساوي معاينة وسيلة دفع أو فحص رسومها.

### إشارة إعادة البيع في العرض نفسه

Gigsberg يعرض في checkout:

> Resell Anytime — Not sure if you can make it to this event? No worries! You can resell your ticket on Gigsberg at any time.

ورابطًا عامًا لبدء مسار بيع تذكرة للمناسبة. هذه قرينة منشورة على إمكانية إعادة العرض عبر المنصة وفق شروطها، **وليست إثباتًا عامًا لحق إعادة البيع لدى المنظم أو قانون البلد أو قابلية نقل هذا المقعد بعينه أو ضمان وجود مشترٍ أو ربح**. لم يُفتح إعلان بيع أو ينشر شيء. يلزم ربط الحكم بشروط المصدر والمنظم ونوع التذكرة قبل أي شراء بغرض إعادة البيع.

## حدود السجل والخطوة التالية

لقطات الصفحات ونسخ الفحص المؤقتة موجودة خارج GitHub في `/workspace/scratch/ticket-browser/retry-*.json` و`retry-*.png`. تتضمن بعض النسخ الخام روابط checkout موقعة؛ لم تُنقل إلى هذه الوثيقة أو المستودع. الأدلة المنقحة أعلاه هي مرجع المتابعة.

الخطوة التالية عند الحاجة إلى عرض قابل للاعتماد: التحقق من وسائل الدفع والرسوم التابعة لها بآلية مأذون بها دون شراء، الحصول على موعد تسليم وشروط نقل خاصين بالعرض، وإكمال التقويم الرسمي والنافذة التي تعترض TicketNetwork ثم checkout SportsEvents365. لا تعني النتائج الحالية أن أي شراء أو إعادة بيع تجارية قد أُجيزت.

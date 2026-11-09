# اختبار المصدر الرسمي و4 منصات: سبورتينغ وبرشلونة

تاريخ الاختبار: 9 November 2026. النطاق: تذكرة واحدة، مباراة Sporting CP vs FC Barcelona، 20 January 2027، Estádio José Alvalade، لشبونة. [تثبيت الهوية من UEFA والناديين](2026-11-09-event-verification.md).

النتيجة: **لا يوجد إجمالي دفع نهائي مؤكد ضمن هذه المجموعة**. عرض صفحات الأسعار واختيار تذكرة لا يساوي إكمال فحص الرسوم. القيم التالية أسعار عروض غير نهائية؛ لا تدخل في ترتيب «أرخص إجمالي مؤكد».

## سجل التغطية

| المصدر / رابط عام | آخر فحص UTC | ما تحقق بالفعل | السعر المرصود غير النهائي | الحالة والعائق |
| --- | --- | --- | --- | --- |
| [Sporting CP official tickets](https://tickets.sporting.pt/pt) | `2026-11-09T05:39Z` | صفحة البوابة الرسمية عرضت November 2026 ومباراة Manchester United. رُصدت أزرار `Next Month` و`Choose Month` و`Choose Year` | لا سعر لمباراة برشلونة | **عطل تقني محدد** عند استكمال التقويم: المحاولة الجديدة أعادت HTTP `503` و`upstream connect error or disconnect/reset before headers. reset reason: remote connection failure`. لم يكتمل الانتقال إلى January؛ لا حكم على وجود عروض برشلونة أو نفادها |
| [TicketNetwork](https://www.ticketnetwork.com/tickets/8242383) | `2026-11-09T05:37:25Z`؛ متابعة نحو `05:39Z` | أسماء الفريقين، 20 January 2027، الملعب والمدينة؛ عرض B21، Row GA، تذكرة واحدة، eTickets، `US$173 each` | `173 USD` ≈ `648.75 SAR` | **عرض موجود والرسوم غير مؤكدة**. الصفحة الأولى كانت محتوى مختصرًا ثم ظهرت العروض بعد الانتظار. محاولة اختيار `Continue` اللاحقة لم تصل إلى العرض بسبب عدم تحميل الواجهة/مهلة `30000ms`؛ لا إجمالي أو موعد تسليم مؤكد. ساعة المنصة `9:00PM` تختلف عن المصدر الرسمي المحلي `20:00`؛ يعتمد التوقيت الرسمي |
| [Gigsberg](https://www.gigsberg.com/sport-tickets/football/champions-league-tickets/show-268751?quantity=1) | `2026-11-09T05:37:23Z`؛ متابعة نحو `05:39Z` | ضُبط العدد `1`، ثم فُتح أول `Select`: Category 3، Block B18، Clear view، Home Fans Section، E-Ticket | `183.76 USD` ≈ `689.10 SAR` | **عرض موجود والرسوم غير مؤكدة؛ مطابقة الهوية غير مكتملة**. عنوان الصفحة عام `Champions League 2026-27 Football Tickets` ويعرض التاريخ والملعب دون اسمي الفريقين في النص. نافذة العرض تصرح باستثناء taxes/booking/delivery. متابعة checkout لم تكتمل عند إعادة تحميل الواجهة/مهلة التحكم؛ لا موعد تسليم |
| [FootballTicketNet](https://www.footballticketnet.com/champions-league/sporting-lisbon-vs-fc-barcelona-estadio-jose-alvalade-football-tickets/event/134206) | `2026-11-09T05:36Z` إلى `2026-11-09T05:38:31Z` | مطابقة المناسبة؛ ترتيب `Lowest price`؛ العرض `1677816` يقبل `qty=1`، Category 3، Block B16، Clear view، Home Supporters Section، E-Ticket | `187.96 USD` ≈ `704.85 SAR` في Firecrawl؛ Chromium عرض `168.59 EUR` في عملته الافتراضية | **عرض موجود والرسوم غير مؤكدة**. فُتح رابط checkout العام المستخرج من العرض بتذكرة واحدة؛ يعرض `Checkout · Identify 1/3` و`First name / Last name / Email` قبل إظهار إجمالي. لم تُدخل بيانات. محاولة Chromium لاحقة أعادت `remote connection failure`. لا ضمان أن السعرين بعملتين من جلسات مختلفة يمثلان سعر صرف قابلًا للتحصيل |
| [SportsEvents365](https://sportsevents365.com/event/402457) | `2026-11-09T05:38:28Z`؛ متابعة `2026-11-09T05:40:07Z` | مطابقة الفريقين والتاريخ والملعب؛ Short Side B16، عدد `1`، All Together، Immediate Confirmation، E-Ticket. السعر الأدنى المعروض ضمن أول 10 بطاقات متساوٍ | `208 USD` ≈ `780 SAR` | **عرض موجود والرسوم غير مؤكدة**. نُقر `See important notes` ثم `Buy` للبطاقة الأولى؛ بقي التبويب الحالي على صفحة الحدث ولم يظهر إجمالي. لم يُثبت ما إذا فُتح تبويب آخر في هذه المحاولة. محاولة تحقق لاحقة أعادت HTTP `503` و`remote connection failure`؛ لذلك لا تُسجل هذه المنصة مكتملة الفحص |

التحويلات إلى SAR للمقارنة الحسابية فقط باستخدام `1 USD = 3.75 SAR` كما في بيانات التسليم؛ لم يُتحقق هنا من سعر تحصيل بطاقة أو رسوم البنك أو سعر FX حي. لا تستخدم هذه التحويلات لإثبات مبلغ الدفع النهائي. لم تُحوّل قيمة EUR دون مصدر صرف حديث. جميع القيم ليست نتائج تاريخية معاد تقديمها: هي عروض رُصدت في هذه الجولة، لكنها غير نهائية.

## مقتطفات الإثبات

### المصدر الرسمي

Chromium حمّل البوابة فعليًا بتاريخ `2026-11-09T05:37:23Z` بعد انتظار تحميل التطبيق. النص: `Quarta-feira, 25 de Novembro`، `Exclusivo Sócios`، `SPORTING CP`، `MANCHESTER UNITED FC`، `Novembro 2026`. تقييد العضوية هذا يخص المباراة الظاهرة فقط؛ لا ينقل إلى برشلونة. أزرار التقويم المرصودة هي `Previous Month / Choose Month / Choose Year / Next Month`. متابعة January تعذرت بسبب HTTP `503` من جلب جديد، وليست نتيجة بحث فارغة. يلزم إعادة فتح البوابة عندما يعمل الاتصال، الانتقال مرتين إلى January ثم فحص 20 January وتوافر البيع العام.

### TicketNetwork

صفحة الحدث عبر Firecrawl وعبر Chromium بعد اكتمال تحميل التطبيق تعرض `UEFA Champions League: Sporting CP vs. FC Barcelona`، `JAN 20, 2027`، `Estadio Jose De Alvalade`، والبطاقة الأولى `Section B21 / Row GA / 1 Ticket available / eTickets / US$173 each`. النص العام يقول `TicketNetwork is a resale marketplace, not a box office or venue` و`Your seats are together unless otherwise noted`. لم تُختبر تفاصيل هذا العرض إلى إجمالي الدفع؛ النصوص الافتراضية المخفية مثل `Lower Bleachers 36 / $40` ومتغيرات `{{...}}` في استخراج الصفحة لا تُعامل كعروض حقيقية.

### Gigsberg

بعد اختيار `1` وفَتح العرض ظهرت العبارة حرفيًا: `Prices do not include taxes, booking fees and delivery charges`، ثم `E-Ticket / Home Fans Section / 1 / Checkout`. لذلك `183.76 USD` ليس إجماليًا نهائيًا. أسماء الفريقين لم تظهر في عنوان الصفحة أو نافذة العرض المسترجعة؛ التاريخ والملعب والرابط التاريخي لا يغلقان فجوة المطابقة بمفردها. يلزم تثبيتها في سياق الحدث أو checkout قبل مقارنة السعر.

### FootballTicketNet

صفحة العروض تعرض `Sort: Lowest price` و`Category 3 / Block B16 / Sporting Lisbon fans / E-Ticket / Clear view / Home Supporters Section` وأرخص `187.96 USD` في جلب Firecrawl. اختير رابط العرض العام `listing_id=1677816` مع `qty=1` وفُتحت صفحة تحديد بيانات المتصل دون إرسالها. المقتطف: `Your contact details / First name / Last name / Email / Continue`، ولا يوجد إجمالي في المحتوى المسترجع. لا تنشر رابط دفع خاص؛ الرابط العام للحدث كافٍ للوصول مجددًا إلى العرض.

توجد مؤشرات متعارضة لتوقيت التسليم في صفحة الحدث نفسها: FAQ تسوّق `Most tickets ... within 24 hours of purchase` بينما «Remarks You Must Read» تقول عادة `3-7 days prior` وقد تصل `1-2 days before ... or ... on the day itself`. لم يُحسم الموعد الخاص بالعرض. كما تقول الملاحظات إن فئات المنصة لا تطابق دائمًا فئات المنظم وإن أرقام الصف/المقعد الدقيقة قد لا تُعرف مسبقًا؛ لا توحّد Category 3 مع فئة بائع آخر دون حفظ وصفه الأصلي.

### SportsEvents365

الصفحة تعرض `Sporting Club Portugal (Lisbon) vs FC Barcelona`، `Wed, 20 Jan 2027 • 20:00`، `Short Side (B16) / All Together / Immediate Confirmation / USD $ 208`، والكمية `1`. وُجد زر `Delivery method E-Ticket` في DOM. لا يثبت ذلك الرسوم النهائية أو الموعد الأقصى للتسليم. نقر `Buy` وحده ليس دليل وصول إلى checkout. عائق الاستكمال المثبت في إعادة المحاولة: `503` مع `upstream connect error or disconnect/reset before headers. reset reason: remote connection failure`.

## الأدوات وحدود التنفيذ

- جرى جلب صفحات المصادر نفسها مباشرة عبر Firecrawl `maxAge: 0`، ثم التفاعل عبر Chromium سحابي مستقل باستخدام Playwright، لا جلسة المستخدم المحلية.
- نفدت أرصدة Firecrawl عند محاولة تشغيل التفاعل في بوابة النادي، ولم تُنفذ تلك المحاولة. لم يُشترَ رصيد أو اشتراك ولم يُكرر الطلب بمعاملات أخرى. استمر العمل المستقل عبر المتصفح السحابي المتاح.
- لم يُنشأ حساب، ولم تُدخل هوية أو بريد، ولم يُقبل عقد، ولم يُنشأ طلب مدفوع أو يتم شراء أو إرسال تواصل. نقرات اختيار العرض والتنقل لا تمثل حجزًا أو ضمان مخزون.
- الأدلة المنقحة هنا هي السجل الدائم. لقطات وتشخيصات المتصفح الخام بقيت مؤقتًا خارج المستودع في `/workspace/scratch/ticket-browser/`؛ لا تُرفع روابط دفع أو معرفات جلسات.

الخطوة التالية المحددة: استكمال تقويم المصدر الرسمي، ثم إعادة فتح العروض الأدنى نفسها وتفقد جميع تبويبات checkout، وحسم أسماء حدث Gigsberg. FootballTicketNet يحتاج آلية مأذونًا بها لبيانات المتصل إذا كان الإجمالي محجوبًا خلفها؛ لا تُنشئ بيانات وهمية ولا تستخدم بيانات المالك دون التفويض المناسب.

# تثبيت مناسبة اختبار «البحث عن تذكرة»

وقت الفحص: `2026-11-09T05:34:02Z` إلى `2026-11-09T05:34:57Z`، بتوقيت UTC. الطريقة: جلب صفحات المصادر الرسمية مباشرة عبر Firecrawl مع `maxAge: 0`؛ هذا فحص محتوى، وليس إكمال شراء أو التحقق من مخزون بائع.

## المناسبة المعتمدة

| الحقل | القيمة المثبتة |
| --- | --- |
| الفريق المضيف | Sporting CP / Sporting Lisbon / سبورتينغ لشبونة |
| الفريق الضيف | FC Barcelona / برشلونة |
| البطولة | UEFA Champions League 2026/27، مرحلة الدوري، الجولة 7 |
| التاريخ المحلي | Wednesday, 20 January 2027 |
| الوقت المحلي | 20:00 GMT في لشبونة، وفق وصف صفحة برشلونة وموقع سبورتينغ |
| الملعب | Estádio José Alvalade |
| المدينة والدولة | Lisbon (POR)، لشبونة، البرتغال |
| معرف UEFA | `2049670` |

هذه المباراة ليست بنفيكا ضد برشلونة. لا تنقل إليها أسعارًا أو شروطًا من مباراة بنفيكا أو من مناسبة أخرى. وقت السعودية الموافق للجدول الحالي هو 23:00 يوم 20 January 2027؛ يبقى الجدول قابلًا لتغيير المنظم ويعاد فحصه قبل الاعتماد على رحلة أو شراء.

## الأدلة المباشرة

1. [صفحة المباراة لدى UEFA](https://www.uefa.com/uefachampionsleague/match/2049670--sporting-cp-vs-barcelona/)، أعادت HTTP `200`، والعنوان `Sporting CP vs Barcelona | UEFA Champions League 2026/27 | UEFA.com`. المقتطف: `Estádio José Alvalade` ثم `Lisbon (POR)` ثم `League phase` ثم `Wednesday, 20 Jan 2027 • 15:00`. بيانات الجلب تشير إلى منطقة عرض `America/New_York`؛ لذلك لا تفسّر `15:00` بوصفها ساعة لشبونة.
2. [جدول UEFA لكل فريق](https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-and-results-by-team/)، أعاد HTTP `200`، وتاريخ تحديث منشور `2026-11-04T21:30:00`. تحت Sporting CP ورد النص `20/01/2027 Sporting CP vs Barcelona` مع الرابط نفسه أعلاه.
3. [موقع Sporting CP](https://sporting.pt/)، أعيد التوجيه إليه عند فتح `https://www.sporting.pt/en/tickets`، وأعاد HTTP `200`. في قسم المباريات المقبلة: `UEFA Champions League · Jornada 7` ثم `Sporting CP vs FC Barcelona` ثم `20 jan · 20:00` ثم `Estádio José Alvalade`. وفي قسم موقع الملعب يظهر عنوانه بمدينة `Lisboa`.
4. [صفحة برشلونة الرسمية للمباراة](https://www.fcbarcelona.com/en/matches/141570/sporting-lisbon-fc-barcelona-uefa-champions-league-2026-2027)، أعادت HTTP `200`. وصف الصفحة المنشور حرفيًا: `Buy your tickets here for the UEFA Champions League match between Sporting Lisbon - FC Barcelona, on Wed 20 Jan 2027, 20:00 GMT.` وفي محتواها `Estádio José Alvalade`. عبارة الموقع العامة عن شراء التذاكر ليست إثباتًا لوصولنا إلى عرض قابل للشراء.
5. [جدول برشلونة الرسمي](https://www.fcbarcelona.com/en/football/first-team/schedule)، أعاد HTTP `200`؛ في قسم `January 2027` ورد `Wed 20 Jan`، `Sporting Lisbon`، `FC Barcelona`، مع الرابط المباشر للمباراة أعلاه.

## منفذ البيع الرسمي وحدود المخزون

[الموقع الرسمي للنادي](https://sporting.pt/) يربط «Comprar bilhetes» إلى [tickets.sporting.pt/pt](https://tickets.sporting.pt/pt). فُتحت بوابة التذاكر نفسها مباشرة وأعادت HTTP `200`، ولكن المحتوى المسترجع عرض تقويم `Novembro 2026` ومباراة Manchester United يوم 25 November 2026 مع عبارة `Exclusivo Sócios` فقط.

لم يظهر عرض لبرشلونة ضمن محتوى هذه الصفحة المسترجع. هذه نتيجة فحص الصفحة الافتراضية فقط: لم يجر التنقل إلى January 2027 داخل التقويم ولم يكتمل بحث البوابة الداخلي في هذا التحقق. لذلك **لا يثبت ذلك عدم بيع المباراة أو نفادها**. استكمال تقويم January 2027 هو إجراء المتابعة المطلوب. لا يوجد هنا سعر نهائي رسمي أو تحقق من رسوم أو عضوية لمباراة برشلونة.

## صلاحية الاختبار

هوية المباراة وتاريخها وملعبها مثبتة من UEFA والناديين ويمكن استعمالها في اختبار المهارة لتذكرة واحدة. لم يجر تأكيد توفر تذكرة أو سعرها النهائي بهذا العمل المستقل. تستقل حالة كل بائع عن ثبوت هوية المناسبة.

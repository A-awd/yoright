# سجل منصات «البحث عن تذكرة»

تحديث 2026-11-09، بقراءة صفحات الجهات مباشرة عبر HTTP من البيئة السحابية. التفاصيل القابلة للمعالجة في [platforms.json](platforms.json). هذا سجل هوية ونشاط منشور، وليس سجل أسعار أو مخزون أو اعتماد لكل مناسبة.

- `confirmed`: قُرئ محتوى نشاط ذي صلة من نطاق الجهة؛ لا يعني أن بحث التذاكر اكتمل أو أن الجهة بائع رسمي للمناسبة.
- `candidate`: لم يتأكد النشاط من المحتوى المسترجع الحالي، بسبب حظر أو عطل أو صفحة لا تعطي إلا عنوانًا أو نصًا فارغًا. يبقى مرشحًا للفحص بالمتصفح؛ لا يُحذف ولا تُعامل حالته كنفاد.
- يجب إعادة التحقق عند كل بحث مهم من النطاق وموقع البلد وربط المنظم، ثم إنشاء سجل تغطية مستقل لكل منصة مناسبة.

## الجهات ذات المحتوى المقروء

| المنصة | النطاق | التصنيف المنشور/الوصفي |
| --- | --- | --- |
| StubHub.com | [stubhub.com](https://www.stubhub.com/) | سوق إعادة بيع؛ محتوى المباراة مقروء بالمتصفح |
| Viagogo | [viagogo.at](https://www.viagogo.at/) | سوق إعادة بيع؛ محتوى المباراة مقروء بالمتصفح |
| Ticombo | [ticombo.com](https://www.ticombo.com/) | سوق تذاكر |
| TicketNetwork | [ticketnetwork.com](https://www.ticketnetwork.com/) | سوق إعادة بيع |
| TickPick | [tickpick.com](https://www.tickpick.com/) | شراء وبيع تذاكر |
| SeatGeek | [seatgeek.com](https://seatgeek.com/) | منصة تذاكر متعددة القنوات |
| Vivid Seats | [vividseats.com](https://www.vividseats.com/) | شراء وبيع تذاكر |
| Gametime | [gametime.co](https://gametime.co/company/about/) | سوق تذاكر اللحظة الأخيرة |
| Gigsberg | [gigsberg.com](https://www.gigsberg.com/) | سوق إعادة بيع |
| LiveFootballTickets | [livefootballtickets.com](https://www.livefootballtickets.com/) | سوق تذاكر كرة قدم |
| FootballTicketNet | [footballticketnet.com](https://www.footballticketnet.com/) | سوق ثانوي لكرة القدم |
| SportsEvents365 | [sportsevents365.com](https://sportsevents365.com/) | بائع وموزع تذاكر فعاليات |
| TicketKosta | [ticketkosta.com](https://www.ticketkosta.com/ara) | بائع إعادة بيع |
| 1BoxOffice | [1boxoffice.com](https://www.1boxoffice.com/en) | سوق إعادة بيع |
| Hellotickets | [hellotickets.com](https://www.hellotickets.com/) | منصة فعاليات وتجارب |
| Fanpass.net | [fanpass.net](https://www.fanpass.net/) | سوق إعادة بيع |
| P1 Travel | [p1travel.com](https://www.p1travel.com/en) | توزيع تذاكر وباقات وضيافة |
| Seat Unique | [seatunique.com](https://www.seatunique.com/) | ضيافة وتذاكر VIP |
| FansPass السعودية | [fanspass.sa](https://fanspass.sa/ar-sa/pages/terms-and-conditions) | سوق إعادة بيع |
| GrintaHub | [grintahub.com](https://grintahub.com/) | سوق إعادة بيع |
| Ticketmaster | [ticketmaster.com](https://www.ticketmaster.com/) | تذاكر أولية وإعادة بيع بحسب المناسبة |
| AXS | [axs.com](https://www.axs.com/) | تذاكر وAXS Marketplace |
| DICE | [dice.fm](https://dice.fm/) | تذاكر حفلات وفعاليات |
| Ticketline | [ticketline.pt](https://www.ticketline.pt/) | كتالوج تذاكر برتغالي |
| BOL | [bol.pt](https://www.bol.pt/) | كتالوج بيع تذاكر برتغالي |
| TicketMX | [ticketmx.com](https://www.ticketmx.com/ar) | منصة فعاليات محلية |
| Klook | [klook.com](https://www.klook.com/) | سوق تجارب وخدمات سفر |
| Tiqets | [tiqets.com](https://www.tiqets.com/en/) | تذاكر معالم وتجارب |
| Headout | [headout.com](https://www.headout.com/) | منصة تجارب وتذاكر |

## مرشحون يحتاجون تحققًا إضافيًا

| المنصة | العائق المرصود مباشرة |
| --- | --- |
| [StubHub International](https://www.stubhub.ie/) | access_denied: Access Denied |
| [EVENTIM](https://www.eventim.com/) | technical_error: upstream connect error or disconnect/reset before headers. reset reason: remote reset |
| [See Tickets](https://www.seetickets.com/) | access_denied: Unusual Traffic Detected |
| [webook](https://webook.com/) | empty_response: عنوان أو استجابة فارغة؛ المحتوى التشغيلي لم يُثبت. |
| [Platinumlist](https://platinumlist.net/) | access_denied: Cloudflare: Please enable cookies / blocked |

## بناء نطاق البحث

ابدأ دائمًا بالموقع الرسمي للمنظم أو النادي أو الفنان أو القاعة، ثم صفحة البيع التي يربطها. هذه مصادر ديناميكية تضاف باسمها وروابطها بعد تثبيت المناسبة؛ لم تُنشأ لها نطاقات عامة وهمية في JSON. أضف مواقع البلد المناسبة، وأي مورد تكشفه المصادر، مع تفسير الإدراج والاستبعاد. لا يكفي أن المنصة تبيع رياضة أو موجودة في Google.

Ticketmaster وAXS وSeatGeek قد يعرضون قنوات مختلفة بحسب المناسبة؛ لا يُستنتج نوع المخزون من الاسم فقط. P1 Travel وSeat Unique قد يعرضان ضيافة أو باقات؛ قارنهما ضمن فئة مستقلة. Klook وTiqets وHeadout وHellotickets لا تجعل جولة الملعب تذكرة مباراة.

Fanpass.net وFansPass.sa مدخلان مستقلان. StubHub.com وStubHub International مدخلان مستقلان؛ لم تُثبت مشاركة الحساب أو المخزون أو الرسوم. لم ينجح فتح StubHub International في هذه الجولة.

## ما لا يثبته هذا السجل

لا يثبت توفر المناسبة أو صلاحية عرض أو رسومًا نهائية أو قبول شركة سعودية أو حقوق إعادة التوزيع. ادعاءات الضمان والحجم والشراكات على المواقع تُنسب إلى الجهات نفسها ولا تتحول إلى اعتماد شامل. جهات B2B وتقييم التعاقد محفوظان في بحث الموردين، ولا يُفترض امتلاك حساب لديها.

يوجد 34 منصة: 29 ذات محتوى مقروء و5 تحتاج تحققًا إضافيًا. تحقق Ticketline من `ticketline.pt` بعد إخفاق `ticketline.sapo.pt`، ولا يُعمم فشل النطاق القديم على الشركة.

تحديث تكميلي: بعد جلب HTTP الأول، أثبت Chromium محتوى مناسبة StubHub.com وViagogo مباشرة؛ حدثت إعادة فتح503 لاحقًا، لا تلغي ما قُرئ ولا تثبت استمرار الوصول.

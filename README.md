# منصة مسابقة — الإصدار الاحترافي (SPA + PWA + Roles)

**جاهزة للنشر على GitHub Pages** ضمن المسار: `https://<user>.github.io/Musabaqa_Pro/`

## المزايا
- واجهة RTL عربية، نظيفة مع **Dark Mode**
- هيكل **SPA** مع Router بسيط
- **أدوار** (مشارك/محكّم/مدير) وواجهات لكل دور
- تقديم مشاركات مع رفع ملف (وصفًا — الملف لا يُرفع فعليًا في هذه النسخة)
- **لوحة تحكيم** بمعايير موزونة وتخزين محلي للتقييم
- **منطقة إدارة**: إنشاء مسابقات، وتصدير CSV (مسابقات/مشاركات/نتائج)
- **PWA**: تثبيت كتطبيق + Service Worker
- سهلة الربط بأي Backend (Node/Express أو Firebase)

## تشغيل محلي
```bash
python3 -m http.server 8080
# ثم افتح: http://localhost:8080/Musabaqa_Pro/
```

> ملاحظة: لضمان عمل PWA بشكل صحيح، شغّل عبر خادم محلي أو GitHub Pages.

## النشر على GitHub Pages
- ارفع مجلد `Musabaqa_Pro/` كما هو إلى المستودع `hasseef/hasseef.github.io`.
- تأكد من أن `start_url` في `manifest.webmanifest` يشير إلى `/Musabaqa_Pro/index.html` (مضبوط هنا).
- لا حاجة لبناء/Compile — كل شيء Vanilla ES Modules.

## ربط Backend لاحقًا
- استبدل طبقة التخزين المحلي بوصلات API (تسجيل الدخول، إنشاء المسابقات، رفع الملفات، التحكيم).
- سنوفر مخططات REST + أمثلة جاهزة إذا رغبت.

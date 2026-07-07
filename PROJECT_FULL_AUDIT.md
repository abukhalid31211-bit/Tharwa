# 📋 PROJECT_FULL_AUDIT.md — المهام المتبقية فقط

> **آخر تحديث:** 7 يوليو 2026
> **الحالة:** يعكس فقط ما لم يكتمل بعد — كل ما أُنجز حُذف من هذه الوثيقة.

---

## ما أُنجز حتى الآن (مرجع سريع)

| الدفعة | الالتزام | ملخص |
|--------|---------|------|
| الأولى | `abc5e16` | حذف ADMIN_CREDENTIALS، تقييد CORS، إضافة 5 endpoints (articles/faqs/services/testimonials/audit-logs)، ربط Notifications/Content/FAQManager/ServicesManager/TestimonialsManager/PrivacyPolicyManager/Settings |
| الثانية | `439007e` | HeroManager/AboutManager/SiteDesign/MarketsManager تحمّل وتحفظ من API، تعديل المحافظ (edit portfolio)، logAudit في create/update/delete client وtransaction |

---

## 1. مكوّنات لا تزال واجهة فقط (UI-Only)

### 1.1 Security.tsx — كامل المكوّن وهمي

| العنصر | المشكلة |
|--------|---------|
| تبويب "سجلات النشاط" | يستخدم `mockLogs` من `adminData.ts` — يجب استبداله بـ `getAuditLogs()` → `GET /api/v1/audit-logs` |
| تبويب "الجلسات النشطة" | مصفوفة `sessions[]` مكتوبة يدوياً داخل الملف |
| تبويب "التهديدات" | مصفوفة `threats[]` مكتوبة يدوياً داخل الملف |
| إعدادات الأمان (toggles) | `toggleItem()` يغيّر local state فقط بلا أي API call أو حفظ |

**المطلوب:** استدعاء `getAuditLogs()` في `useEffect`، وحفظ إعدادات الأمان عبر `saveSettings`.

---

### 1.2 Reports.tsx — جميع الأرقام والرسوم وهمية

| العنصر | المشكلة |
|--------|---------|
| رسم Revenue | يستخدم `chartRevenue` من `adminData.ts` |
| رسم AUM | يستخدم `chartAUM` من `adminData.ts` |
| رسم New Clients | يستخدم `chartNewClients` من `adminData.ts` |
| KPIs (+18.3%، $94K...) | أرقام ثابتة hardcoded داخل الملف |
| أفضل العملاء (topPerformers) | مصفوفة hardcoded داخل الملف |
| أداء المستشارين (advisorPerf) | مصفوفة hardcoded داخل الملف |
| فلاتر الفترة (أسبوع/شهر/ربع/سنة) | `setPeriod` state موجود لكن الرسوم لا تتغير — البيانات لا تتأثر بالفترة المختارة |
| زر "تصدير PDF" | بلا handler |

**المطلوب:** إضافة endpoint `GET /api/v1/reports?period=month` يحسب KPIs من قاعدة البيانات، أو ربط الرسوم بـ `getTransactions` و`getClients` الموجودين.

---

### 1.3 Team.tsx — قائمة الأعضاء لا تزال mock

| العنصر | المشكلة |
|--------|---------|
| قائمة الأعضاء المعروضة | تقرأ من `mockTeam` في `adminData.ts` — لا `useEffect` يجلب البيانات الحقيقية |
| إحصائيات الأدوار (Super Admin/Admin...) | تُحسب من `mockTeam.filter(...)` لا من بيانات حقيقية |
| إضافة عضو | **تعمل** عبر `createSubAdmin` ✅ لكن القائمة لا تُحدَّث بعد الإضافة |

**المطلوب:** إضافة `useEffect` يستدعي `getSubAdmins()` عند تحميل المكوّن وبعد كل إضافة ناجحة.

---

### 1.4 Messages.tsx — تبويب المراسلات المباشرة mock

| العنصر | المشكلة |
|--------|---------|
| قائمة المحادثات | تستخدم `mockMessages` من `adminData.ts` |
| إرسال رد | `sendMsg()` تعيد `setInput('')` فقط — لا API call |
| عداد الرسائل غير المقروءة | يعتمد على `mockMessages.reduce(...)` |

*(تبويب "رسائل التواصل" يعمل بالكامل ✅)*

**المطلوب:** إما بناء نظام chat حقيقي أو إزالة تبويب المراسلات المباشرة.

---

### 1.5 Overview.tsx — الرسوم البيانية والإجراءات السريعة

| العنصر | المشكلة |
|--------|---------|
| رسم AUM | يستخدم `chartAUM` من `adminData.ts` |
| رسم Revenue | يستخدم `chartRevenue` من `adminData.ts` |
| الإجراءات السريعة (Quick Actions) | أزرار ديكورية بلا تنقل أو وظيفة |

*(KPIs الرئيسية من `getOverview()` تعمل بالكامل ✅)*

---

### 1.6 Notifications.tsx — الحذف وقواعد الإشعارات غير مستمرة

| العنصر | المشكلة |
|--------|---------|
| حذف إشعار | `deleteNotif(id)` → `setNotifs(filter...)` فقط — لا API call |
| تعليم الكل مقروء | `markAllRead()` → local state فقط — لا API call جماعي |
| قواعد الإشعارات (rules[]) | مصفوفة ثابتة hardcoded، الـ toggle لا يغيّر state ولا يرسل لـ API |

*(تحميل الإشعارات وتعليم الواحدة مقروءة يعملان ✅)*

---

## 2. ثغرات أمنية لم تُعالَج

| الثغرة | الخطورة | التفاصيل |
|--------|---------|---------|
| CORS لا يزال مفتوحاً في الإنتاج | 🟠 عالية | الكود صحيح (`process.env.ALLOWED_ORIGIN \|\| '*'`) لكن متغير البيئة `ALLOWED_ORIGIN` غير مضبوط في Vercel — يجب تعيينه في لوحة Vercel بقيمة دومين الإنتاج |
| JWT في localStorage | 🟠 عالية | يُخزَّن في `localStorage` عُرضة لـ XSS — الأفضل httpOnly cookies |
| لا rate limiting في الباك-إند | 🟠 عالية | قفل 5 محاولات client-side فقط — يمكن تجاوزه بطلبات مباشرة للـ API |
| صلاحيات المشرف الفرعي غير محقّقة | 🟡 متوسطة | الباك-إند يقبل أي admin token صالح بصرف النظر عن قائمة `permissions[]` المخصصة له |

---

## 3. ميزات مفقودة جوهرية

| الميزة | الأهمية |
|-------|---------|
| نسيت كلمة المرور (عملاء + مشرفون) | 🔴 عالية — رابط موجود في الواجهة بلا أي وظيفة |
| إشعارات بريد إلكتروني / SMS حقيقية | 🔴 عالية — النظام الحالي واجهة فقط |
| تقارير ديناميكية من قاعدة البيانات | 🟡 متوسطة |
| تصدير PDF/Excel للتقارير | 🟡 متوسطة |
| نظام دردشة حقيقي بين الإدارة والعملاء | 🟡 متوسطة |
| KYC — التحقق من الوثائق | 🟡 متوسطة — الحقل في DB موجود لكن لا workflow |

---

## 4. ملاحظات تقنية

| الملاحظة | الملف |
|---------|-------|
| `api/_lib/db.js` (PostgreSQL pool مباشر) غير مستخدم — يمكن حذفه | `api/_lib/db.js` |
| اسم المشروع متضارب: `package.json` يحتوي `golden-horizon-investments` بينما الواجهة تعرض "ثروة كابيتال" | `package.json` |

---

*هذه الوثيقة تُحدَّث بعد كل دفعة إصلاحات. عند إنجاز أي بند يُحذف من هنا.*

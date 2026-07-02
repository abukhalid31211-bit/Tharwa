# 📋 PROJECT_FULL_AUDIT.md — التدقيق الشامل لمشروع ثروة كابيتال

> **تاريخ التدقيق:** 2 يوليو 2026  
> **المدقق:** AI Technical Audit Agent  
> **المستودع:** https://github.com/abukhalid31211-bit/tharwahcapital.git  
> **الفرع:** main  

---

## 📌 الفهرس

1. [ملخص احترافي للمشروع](#1-ملخص-احترافي-للمشروع)
2. [البنية المعمارية والتقنيات المستخدمة](#2-البنية-المعمارية-والتقنيات-المستخدمة)
3. [جدول تحليل لوحة الإدارة (المكوّن بمكوّن)](#3-جدول-تحليل-لوحة-الإدارة)
4. [مقارنة لوحة الإدارة vs لوحة العميل](#4-مقارنة-لوحة-الإدارة-vs-لوحة-العميل)
5. [قائمة الميزات الوهمية (UI-Only بلا باك-إند)](#5-قائمة-الميزات-الوهمية)
6. [خريطة تدفق البيانات](#6-خريطة-تدفق-البيانات)
7. [التحقق من اتصال API بالباك-إند](#7-التحقق-من-اتصال-api-بالباك-إند)
8. [التقرير الأمني التفصيلي](#8-التقرير-الأمني-التفصيلي)
9. [تقرير الأخطاء والميزات المفقودة](#9-تقرير-الأخطاء-والميزات-المفقودة)
10. [الخلاصة والتوصيات](#10-الخلاصة-والتوصيات)

---

## 1. ملخص احترافي للمشروع

### نظرة عامة

**ثروة كابيتال** (Golden Horizon Investments) هو تطبيق ويب لشركة استثمار مالي يوفر:

- **موقع ترويجي عام** للشركة (صفحات تعريفية، خدمات، أسواق، أخبار، تواصل)
- **لوحة تحكم إدارية** (Admin Dashboard) للمشرفين لإدارة العملاء والمحافظ والمعاملات والمحتوى
- **بوابة العملاء** (Client Portal) يتمكن فيها كل عميل من رؤية محفظته ومعاملاته وملفه الشخصي

### الحالة الحالية للمشروع

المشروع في **مرحلة انتقالية**: تم بناء البنية التحتية للباك-إند (API + قاعدة بيانات Supabase)، لكن معظم وظائف **لوحة الإدارة لا تزال وهمية** (تعمل على بيانات mock محلية فقط دون اتصال حقيقي بالباك-إند). في المقابل، لوحة العميل **تعمل بالكامل** مع الباك-إند.

---

## 2. البنية المعمارية والتقنيات المستخدمة

### Stack التقني

| الطبقة | التقنية | الإصدار | الملاحظات |
|--------|---------|---------|-----------|
| **Frontend Framework** | React | 19.2.0 | مع Vite 8 |
| **Language** | TypeScript | 5.8.3 | strict mode |
| **Routing** | TanStack Router | 1.168.25 | File-based routing |
| **State Management** | React useState/useEffect | — | بدون Redux أو Zustand |
| **UI Components** | Radix UI + shadcn/ui | — | مع Tailwind CSS 4 |
| **Charts** | Recharts | 2.15.4 | في التقارير والـ Overview |
| **Forms** | React Hook Form + Zod | — | للتحقق من المدخلات |
| **HTTP Client** | Native fetch() | — | في `src/lib/api.ts` |
| **Backend** | Vercel Serverless Functions | — | ملف وحيد: `api/index.js` |
| **Database** | Supabase (PostgreSQL) | — | مع supabase-js 2.49 |
| **Auth** | JWT (jsonwebtoken) + bcryptjs | — | توكن في localStorage |
| **Build Tool** | Vite | 8.0.16 | |
| **Package Manager** | Bun | — | bunfig.toml |
| **Deployment** | Vercel | — | vercel.json موجود |

### هيكل الملفات الرئيسي

```
tharwahcapital/
├── api/
│   ├── index.js              ← الباك-إند الكامل (Vercel Serverless)
│   └── _lib/
│       ├── auth.js           ← JWT helpers
│       ├── db.js             ← PostgreSQL pool (غير مستخدم فعلياً)
│       ├── supabase.js       ← Supabase client
│       ├── cors.js           ← CORS middleware
│       └── logger.js         ← Winston logger
├── src/
│   ├── routes/               ← صفحات الموقع (TanStack Router)
│   │   ├── index.tsx         ← الصفحة الرئيسية
│   │   ├── login.tsx         ← بوابة العملاء
│   │   ├── dashboard.tsx     ← لوحة العميل
│   │   └── Akadmin.tsx       ← مدخل لوحة الإدارة
│   ├── components/
│   │   ├── admin/            ← لوحة الإدارة
│   │   │   ├── adminData.ts  ← ⚠️ بيانات Mock + بيانات دخول مكشوفة!
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── pages/        ← 19 صفحة إدارية
│   │   └── site/             ← مكونات الموقع العام
│   ├── lib/
│   │   ├── api.ts            ← دوال استدعاء API
│   │   ├── auth.ts           ← إدارة جلسات localStorage
│   │   └── store.ts          ← ⚠️ تخزين localStorage (بديل وهمي للقاعدة)
│   └── contexts/
│       └── SiteSettingsContext.tsx ← يجلب إعدادات الموقع من API
├── supabase/
│   ├── schema.sql            ← مخطط قاعدة البيانات الكامل
│   └── seed.sql              ← بيانات تجريبية
└── vercel.json               ← إعدادات النشر
```

### قاعدة البيانات (Supabase PostgreSQL)

الجداول المعرّفة في `supabase/schema.sql`:

| الجدول | الغرض | الحالة |
|--------|-------|--------|
| `admins` | حسابات المشرفين الرئيسيين | ✅ موجود |
| `sub_admins` | المشرفون الفرعيون | ✅ موجود |
| `clients` | بيانات العملاء | ✅ موجود |
| `portfolios` | المحافظ الاستثمارية | ✅ موجود |
| `transactions` | المعاملات المالية | ✅ موجود |
| `contact_messages` | رسائل التواصل | ✅ موجود |
| `site_settings` | إعدادات الموقع (key/value) | ✅ موجود |
| `articles` | المقالات والأخبار | ✅ موجود (لكن API غير متصل) |
| `notifications` | الإشعارات | ✅ موجود (لكن API جزئي) |
| `audit_logs` | سجلات التدقيق | ✅ موجود (لكن غير مستخدم) |

---

## 3. جدول تحليل لوحة الإدارة

> **مفتاح الحالات:**
> - ✅ **يعمل بالكامل** — متصل بالباك-إند والقاعدة وبيانات حقيقية
> - ⚠️ **يعمل جزئياً** — بعض العمليات حقيقية وبعضها وهمي
> - ❌ **مجرد واجهة (UI-Only)** — لا اتصال بباك-إند، بيانات Mock فقط

---

### 3.1 Overview (الصفحة الرئيسية للوحة)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| عرض KPIs (إجمالي العملاء، الإيداعات، الرسائل...) | ✅ | يستدعي `getOverview()` → `/api/v1/overview` → Supabase |
| عرض آخر المعاملات | ✅ | جزء من استجابة `/api/v1/overview` |
| شريط الأسعار السريع (أرامكو، BTC...) | ❌ | بيانات ثابتة hardcoded داخل الملف |
| الرسوم البيانية (AUM، Revenue) | ❌ | تستخدم `chartAUM`, `chartRevenue` من `adminData.ts` |
| الإجراءات السريعة (Quick Actions) | ❌ | أزرار زخرفية فقط بلا وظيفة |

**الحكم: ⚠️ يعمل جزئياً** — الأرقام الحقيقية تُجلب من API، لكن الرسوم البيانية وشريط الأسعار بيانات مزيفة.

---

### 3.2 Clients (إدارة العملاء)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض قائمة العملاء** | ✅ | `getClients()` → `GET /api/v1/clients` → Supabase |
| **إضافة عميل جديد** | ✅ | `createClient()` → `POST /api/v1/clients` → Supabase |
| **تعديل بيانات عميل** | ✅ | `updateClient()` → `PATCH /api/v1/clients` → Supabase |
| **حذف عميل** | ✅ | `deleteClient()` → `DELETE /api/v1/clients?id=...` → Supabase |
| **البحث والتصفية** | ✅ | يرسل params للـ API |
| **توليد كلمة مرور عشوائية** | ✅ | يُرسلها مع POST للباك-إند |

**الحكم: ✅ يعمل بالكامل** — إدارة العملاء CRUD حقيقية بالكامل.

---

### 3.3 Transactions (المعاملات المالية)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض المعاملات** | ✅ | `getTransactions()` → `GET /api/v1/transactions` → Supabase |
| **إضافة معاملة جديدة** | ✅ | `createTransaction()` → `POST /api/v1/transactions` → Supabase |
| **الموافقة على معاملة** | ✅ | `updateTransaction(id, {status:'completed'})` → `PATCH /api/v1/transactions` |
| **رفض معاملة** | ✅ | `updateTransaction(id, {status:'rejected'})` → `PATCH /api/v1/transactions` |
| **البحث والتصفية** | ✅ | client-side filtering بعد جلب البيانات |

**الحكم: ✅ يعمل بالكامل** — عمليات المعاملات حقيقية بالكامل.

---

### 3.4 Portfolios (المحافظ الاستثمارية)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض المحافظ** | ✅ | `getPortfolios()` → `GET /api/v1/portfolios` → Supabase |
| **جلب قائمة العملاء** | ✅ | `getClients()` → API |
| **إنشاء محفظة** | ✅ | `createPortfolio()` → `POST /api/v1/portfolios` → Supabase |
| **حذف محفظة** | ✅ | `deletePortfolio()` → `DELETE /api/v1/portfolios?id=...` |
| **تعديل محفظة** | ❌ | واجهة تعديل موجودة لكن تستدعي `createPortfolio` للإنشاء فقط، لا `updatePortfolio` |
| **حقول رؤية العميل (Visibility Toggles)** | ⚠️ | تُحفظ ضمن `portfolio_data` كـ JSON لكن التفعيل غير موثق |

**الحكم: ⚠️ يعمل جزئياً** — الإنشاء والحذف حقيقيان، لكن التعديل يفتقر لـ API endpoint مخصص.

---

### 3.5 Messages (الرسائل)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض رسائل التواصل** | ✅ | `getMessages()` → `GET /api/v1/messages` → Supabase |
| **تغيير حالة الرسالة** | ✅ | `updateMessageStatus()` → `PATCH /api/v1/messages` |
| **حذف رسالة** | ✅ | `deleteMessage()` → `DELETE /api/v1/messages?id=...` |
| **تبويب المراسلات المباشرة (Direct Chat)** | ❌ | يستخدم `mockMessages` من `adminData.ts` — بيانات مزيفة |
| **إرسال رد مباشر** | ❌ | زر "إرسال" بلا API call |

**الحكم: ⚠️ يعمل جزئياً** — رسائل التواصل حقيقية، المراسلات المباشرة وهمية.

---

### 3.6 Settings (إعدادات المنصة)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **تحميل اسم الموقع** | ✅ | `getSettings()` → `GET /api/v1/settings` → Supabase |
| **حفظ اسم الموقع (عربي/إنجليزي)** | ✅ | `saveSettings()` → `POST /api/v1/settings` → Supabase |
| **إعدادات المظهر** | ❌ | واجهة فقط، الزر يعرض "✓ تم الحفظ" بدون أي API call |
| **إعدادات البريد** | ❌ | واجهة فقط (قسم "coming soon") |
| **إعدادات المالية** | ❌ | جدول hardcoded (عادي/بريميوم/VIP) |
| **مفاتيح API** | ❌ | قيم مزيفة مثل `gh_prod_••••••••` hardcoded |
| **النسخ الاحتياطي** | ❌ | واجهة فقط |

**الحكم: ⚠️ يعمل جزئياً** — اسم الموقع فقط يُحفظ حقيقياً، باقي الإعدادات وهمية.

---

### 3.7 SubAdmins (المشرفون الفرعيون)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض قائمة المشرفين** | ✅ | `getSubAdmins()` → `GET /api/v1/sub-admins` → Supabase |
| **إضافة مشرف فرعي** | ✅ | `createSubAdmin()` → `POST /api/v1/sub-admins` → Supabase |
| **تعديل مشرف** | ✅ | `updateSubAdmin()` → `PATCH /api/v1/sub-admins` → Supabase |
| **حذف مشرف** | ✅ | `deleteSubAdmin()` → `DELETE /api/v1/sub-admins?id=...` |
| **تعيين صلاحيات** | ✅ | يُرسل `permissions[]` مع PATCH |

**الحكم: ✅ يعمل بالكامل** — إدارة المشرفين الفرعيين حقيقية بالكامل.

---

### 3.8 HeroManager (إدارة القسم الرئيسي)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض بيانات Hero** | ❌ | تستخدم `mockHeroData` من `adminData.ts` |
| **تعديل عنوان Hero** | ❌ | يعدّل local state فقط، لا يُرسل لـ API |
| **إضافة/تعديل شارات الثقة** | ❌ | `mockTrustBadges` محلي فقط |
| **تعديل الإحصائيات** | ❌ | `mockSiteStats` محلي فقط |
| **زر "حفظ"** | ❌ | `const save = () => { setSaved(true); ... }` — لا يستدعي أي API |

**الحكم: ❌ مجرد واجهة** — كل شيء وهمي، التعديلات تختفي عند تحديث الصفحة.

---

### 3.9 ServicesManager (إدارة الخدمات)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض الخدمات** | ❌ | `mockServices` من `adminData.ts` |
| **إضافة خدمة** | ❌ | يضيف لـ local state فقط |
| **تعديل خدمة** | ❌ | local state فقط |
| **حذف خدمة** | ❌ | `del = (id) => setServices(prev=>prev.filter(...))` — local فقط |
| **إخفاء/إظهار خدمة** | ❌ | local state toggle |
| **الموقع العام يعرض الخدمات** | ❌ | الموقع يقرأ من `mockServices` أيضاً، لا يتأثر بلوحة الإدارة |

**الحكم: ❌ مجرد واجهة** — أي تعديل يختفي فور تحديث الصفحة.

---

### 3.10 FAQManager (الأسئلة الشائعة)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض الأسئلة** | ❌ | `mockFAQs` من `adminData.ts` |
| **إضافة سؤال** | ❌ | local state فقط |
| **تعديل سؤال** | ❌ | local state فقط |
| **حذف سؤال** | ❌ | local state فقط |
| **إدارة الأقسام** | ❌ | local state فقط |

**الحكم: ❌ مجرد واجهة** — لا يوجد API endpoint للـ FAQ في الباك-إند.

---

### 3.11 AboutManager (إدارة صفحة "من نحن")

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض المحتوى** | ❌ | `mockTimelineEvents`, `mockCoreValues`, `mockWhyChooseUs`, `mockHowItWorks`, `mockAboutHeroStats` |
| **تعديل الجدول الزمني** | ❌ | local state فقط |
| **تعديل القيم الجوهرية** | ❌ | local state فقط |
| **زر "حفظ"** | ❌ | `const save = () => { setSaved(true); ... }` — لا API call |

**الحكم: ❌ مجرد واجهة** — كامل المحتوى وهمي.

---

### 3.12 Content (إدارة المقالات والأخبار)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض المقالات** | ❌ | `mockArticles` من `adminData.ts` |
| **إنشاء مقال جديد** | ❌ | نافذة محرر تفتح وتغلق بلا إرسال |
| **نشر مقال** | ❌ | زر "🚀 نشر الآن" بلا API call |
| **حفظ مسودة** | ❌ | زر "💾 حفظ كمسودة" بلا API call |
| **حذف مقال** | ❌ | `setMockArticles` أو مجرد filter على local state |
| **تبويب الأخبار والإعلانات** | ❌ | يعرض نفس `mockArticles` |

> **ملاحظة:** جدول `articles` موجود في قاعدة البيانات لكن **لا يوجد API endpoint** للمقالات في `api/index.js`.

**الحكم: ❌ مجرد واجهة** — لا اتصال بقاعدة البيانات رغم وجود الجدول.

---

### 3.13 Team (إدارة الفريق)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض أعضاء الفريق** | ❌ | `mockTeam` من `adminData.ts` |
| **إضافة عضو** | ❌ | نافذة إضافة تفتح لكن زر "إضافة العضو" بلا `onClick` handler |
| **عرض صلاحيات الأدوار** | ❌ | جدول hardcoded |

**الحكم: ❌ مجرد واجهة** — الفريق المعروض هو نفس `mockTeam` لا يتغير.

---

### 3.14 Reports (التقارير والإحصائيات)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **KPIs الرئيسية** | ❌ | قيم hardcoded: `+18.3%`, `$94K`, `67`, `$12.4M` |
| **أفضل العملاء أداءً** | ❌ | `topPerformers` array hardcoded |
| **أداء المستشارين** | ❌ | `advisorPerf` array hardcoded |
| **رسم بياني الإيرادات** | ❌ | `chartRevenue` من `adminData.ts` |
| **رسم بياني العملاء الجدد** | ❌ | `chartNewClients` من `adminData.ts` |
| **زر تصدير PDF** | ❌ | زر بلا وظيفة |
| **أزرار تصفية الفترة** | ❌ | أزرار بلا state تغيير |

**الحكم: ❌ مجرد واجهة** — كل الأرقام مزيفة ومكتوبة يدوياً في الكود.

---

### 3.15 Security (الأمان والسجلات)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **سجلات النشاط** | ❌ | `mockLogs` من `adminData.ts` |
| **الجلسات النشطة** | ❌ | `sessions` array hardcoded في الملف |
| **التهديدات** | ❌ | `threats` array hardcoded |
| **إعدادات الأمان (Toggles)** | ❌ | `item.on` ثابت، الـ onClick لا يغير state |
| **حظر IP** | ❌ | زر "حظر دائم" بلا API call |
| **عداد "جلسات نشطة: 8"** | ❌ | hardcoded |

> **ملاحظة:** جدول `audit_logs` موجود في قاعدة البيانات لكن **لا يُكتب إليه أي شيء** من الباك-إند ولا يُقرأ في الواجهة.

**الحكم: ❌ مجرد واجهة** — لا اتصال حقيقي.

---

### 3.16 Notifications (الإشعارات)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض الإشعارات** | ❌ | `mockNotifications` من `adminData.ts` |
| **تعليم مقروء** | ⚠️ | يعمل لكن في local state فقط (يُفقد عند تحديث) |
| **حذف إشعار** | ⚠️ | يعمل لكن في local state فقط |
| **قواعد الإشعارات (Toggles)** | ❌ | toggles بلا state — `onClick={()=>{}}` فارغ |

> **ملاحظة:** `handleNotifications` في `api/index.js` موجود لكن الواجهة لا تستدعيه.

**الحكم: ❌ مجرد واجهة** — رغم وجود API endpoint للإشعارات في الباك-إند.

---

### 3.17 MarketsManager (إدارة الأسواق)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض الأصول** | ❌ | `mockMarketAssets` من `adminData.ts` |
| **إضافة/تعديل/حذف أصل** | ❌ | local state فقط |
| **شريط المؤشرات (Ticker)** | ❌ | `mockTickerItems` من `adminData.ts` |
| **إدارة الفئات** | ❌ | `mockMarketCategories` محلي |
| **الموقع العام (صفحة Ticker)** | ❌ | يقرأ بيانات hardcoded منفصلة |

**الحكم: ❌ مجرد واجهة** — لا API endpoint لإدارة الأسواق في الباك-إند.

---

### 3.18 TestimonialsManager (الشهادات والتقييمات)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض الشهادات** | ❌ | `mockTestimonials` من `adminData.ts` |
| **إضافة شهادة** | ❌ | local state فقط |
| **تعديل/حذف** | ❌ | local state فقط |

**الحكم: ❌ مجرد واجهة** — لا API endpoint للتقييمات.

---

### 3.19 SiteDesign (تصميم الموقع والتنقل)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **إدارة روابط القائمة** | ❌ | `mockNavLinks` من `adminData.ts` |
| **إدارة الفوتر** | ❌ | `mockFooterData` من `adminData.ts` |
| **إعدادات الأزرار العائمة** | ❌ | local state فقط |
| **زر "حفظ"** | ❌ | `const save = () => { setSaved(true); ... }` — لا API call |

**الحكم: ❌ مجرد واجهة** — لا اتصال بقاعدة البيانات.

---

### 3.20 PrivacyPolicyManager (سياسة الخصوصية)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **عرض النص** | ⚠️ | يقرأ من `localStorage` عبر `store.ts` |
| **حفظ النص** | ⚠️ | يحفظ في `localStorage` فقط (ليس قاعدة البيانات) |
| **إعادة التعيين** | ⚠️ | يعيد للنص الافتراضي في `localStorage` |

**الحكم: ⚠️ يعمل جزئياً** — يعمل لكن البيانات تُخزَّن في المتصفح لا في قاعدة البيانات، تختفي عند تغيير جهاز أو متصفح.

---

### 3.21 AdminLogin (تسجيل دخول المشرف)

| العملية | الحالة | التفاصيل |
|--------|--------|----------|
| **تسجيل الدخول** | ✅ | `adminLogin()` → `POST /api/v1/auth/admin-login` → Supabase |
| **تأمين بعد 5 محاولات** | ⚠️ | client-side فقط، يمكن تجاوزه |
| **حفظ الجلسة** | ✅ | JWT token في `localStorage` |

**الحكم: ✅ يعمل بالكامل** — المصادقة حقيقية.

---

### ملخص جدول لوحة الإدارة

| المكوّن | الحالة | نوع البيانات |
|--------|--------|-------------|
| Overview | ⚠️ جزئي | KPIs حقيقية + رسوم بيانية وهمية |
| Clients | ✅ كامل | Supabase |
| Transactions | ✅ كامل | Supabase |
| Portfolios | ⚠️ جزئي | Supabase (إنشاء/حذف) |
| Messages | ⚠️ جزئي | رسائل التواصل حقيقية، الدردشة وهمية |
| Settings | ⚠️ جزئي | اسم الموقع فقط |
| SubAdmins | ✅ كامل | Supabase |
| HeroManager | ❌ وهمي | adminData.ts |
| ServicesManager | ❌ وهمي | adminData.ts |
| FAQManager | ❌ وهمي | adminData.ts |
| AboutManager | ❌ وهمي | adminData.ts |
| Content | ❌ وهمي | adminData.ts |
| Team | ❌ وهمي | adminData.ts |
| Reports | ❌ وهمي | hardcoded |
| Security | ❌ وهمي | adminData.ts + hardcoded |
| Notifications | ❌ وهمي | adminData.ts |
| MarketsManager | ❌ وهمي | adminData.ts |
| TestimonialsManager | ❌ وهمي | adminData.ts |
| SiteDesign | ❌ وهمي | adminData.ts |
| PrivacyPolicyManager | ⚠️ جزئي | localStorage |
| AdminLogin | ✅ كامل | Supabase JWT |

**الإحصاء النهائي:**
- ✅ يعمل بالكامل: **3 مكونات** (14%)
- ⚠️ يعمل جزئياً: **6 مكونات** (29%)
- ❌ مجرد واجهة: **12 مكوناً** (57%)

---

## 4. مقارنة لوحة الإدارة vs لوحة العميل

### لوحة العميل (`/dashboard`) — الحالة الكاملة

| الوظيفة | الحالة | التفاصيل |
|--------|--------|----------|
| **تسجيل الدخول** | ✅ | `clientLogin()` → `POST /api/v1/auth/client-login` → Supabase |
| **عرض الملف الشخصي** | ✅ | `getMyProfile()` → `GET /api/v1/client/profile` → Supabase |
| **عرض المحفظة** | ✅ | `getMyPortfolio()` → `GET /api/v1/client/portfolio` → Supabase |
| **عرض المعاملات** | ✅ | `getMyTransactions()` → `GET /api/v1/client/transactions` → Supabase |
| **حقول المحفظة (fields visibility)** | ✅ | يحترم `portfolio_data.investments.visible` المضبوط من الإدارة |
| **إرسال رسالة دعم** | ✅ | `submitContactMessage()` → `POST /api/v1/messages` |
| **تسجيل الخروج** | ✅ | يمسح localStorage + redirect |

**نتيجة المقارنة:**

| الجانب | لوحة الإدارة | لوحة العميل |
|--------|-------------|-------------|
| نسبة الاتصال بالباك-إند | ~30% | ~95% |
| تخزين البيانات | localStorage + Supabase (مختلط) | Supabase فقط |
| موثوقية البيانات | منخفضة (معظمها Mock) | عالية (كلها حقيقية) |
| تأثير الأعطال | غير محسوس (بيانات Mock تبقى) | تأثير مباشر |

**الخلاصة:** لوحة العميل أكثر اكتمالاً وموثوقية من لوحة الإدارة رغم أن الأخيرة أضخم ظاهرياً.

---

## 5. قائمة الميزات الوهمية

الميزات التالية تبدو وظيفية في الواجهة لكنها **لا تحفظ أي بيانات حقيقية**:

### أ. إدارة المحتوى الوهمية (CMS)
1. **تعديل عناوين وأزرار القسم الرئيسي (Hero)** — تختفي عند تحديث الصفحة
2. **إضافة/تعديل/حذف الخدمات** — لا تنعكس على الموقع العام
3. **إدارة شارات الثقة (Trust Badges)** — local state فقط
4. **إدارة الإحصائيات الرقمية** — local state فقط
5. **إضافة/تعديل الأسئلة الشائعة (FAQ)** — لا تنعكس على صفحة `/faq`
6. **تعديل صفحة "من نحن"** (Timeline، قيم الشركة، خطوات العمل) — وهمي
7. **إنشاء/نشر/حفظ مسودة المقالات** — لا يصل لقاعدة البيانات
8. **إضافة/تعديل التقييمات والشهادات** — لا تنعكس على الصفحة الرئيسية
9. **تعديل روابط القائمة والفوتر** — لا تنعكس على الموقع
10. **إعدادات الأزرار العائمة (WhatsApp/BackToTop)** — بلا تأثير

### ب. التقارير الوهمية
11. **جميع أرقام التقارير** — مزيفة ومكتوبة يدوياً في الكود
12. **زر "تصدير PDF"** — بلا وظيفة
13. **رسوم بيانية الإيرادات والعملاء** — بيانات mock لا تعكس الواقع
14. **قائمة "أفضل العملاء أداءً"** — أسماء وأرقام مكتوبة يدوياً

### ج. الأمان الوهمي
15. **سجلات النشاط** — `mockLogs` لا علاقة لها بالعمليات الحقيقية
16. **الجلسات النشطة** — أجهزة مكتوبة يدوياً بلا وجود حقيقي
17. **التهديدات وحظر IP** — بيانات decorative
18. **إعدادات الأمان (2FA، سياسة كلمة المرور، إلخ)** — toggles جمالية بلا تأثير
19. **"تلقي 8 جلسات نشطة"** — رقم hardcoded

### د. الإدارة الوهمية
20. **إضافة عضو للفريق** — زر الإضافة بلا `onClick` handler
21. **إضافة أصول مالية للأسواق** — local state فقط
22. **إدارة شريط الأسعار المتحرك (Ticker)** — لا تنعكس على الموقع
23. **قواعد الإشعارات (toggles)** — `onClick={()=>{}}` فارغ
24. **إرسال رد مباشر للعميل (Chat)** — بلا API call
25. **مفاتيح API في الإعدادات** — قيم مزيفة `gh_prod_••••••••`

---

## 6. خريطة تدفق البيانات

### تدفق البيانات الحقيقي (Real Data Flow)

```
                    ┌─────────────────────┐
                    │   SUPABASE (DB)      │
                    │  PostgreSQL          │
                    └──────────┬──────────┘
                               │
                               │ SQL via supabase-js
                               │
                    ┌──────────▼──────────┐
                    │  api/index.js        │
                    │  Vercel Serverless   │
                    │                      │
                    │  Routes disponibles: │
                    │  /auth/admin-login   │
                    │  /auth/client-login  │
                    │  /auth/verify        │
                    │  /clients            │
                    │  /transactions       │
                    │  /portfolios         │
                    │  /settings           │
                    │  /messages           │
                    │  /sub-admins         │
                    │  /notifications*     │
                    │  /overview           │
                    │  /client/profile     │
                    │  /client/portfolio   │
                    │  /client/transactions│
                    └──────────┬──────────┘
                               │ JWT Bearer Token
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐  ┌──────▼──────┐  ┌─────▼────────┐
    │  Admin Panel    │  │ Client Panel│  │  Public Site  │
    │  /Akadmin       │  │ /dashboard  │  │  /           │
    │                 │  │             │  │  (Hardcoded  │
    │  ✅ Overview    │  │  ✅ Profile │  │   content)   │
    │  ✅ Clients     │  │  ✅ Portfolio│  └──────────────┘
    │  ✅ Transactions│  │  ✅ Tx List │
    │  ✅ Portfolios  │  │  ✅ Support │
    │  ✅ Messages*   │  │  ✅ Logout  │
    │  ✅ SubAdmins   │  └─────────────┘
    │  ⚠️ Settings   │
    │  ❌ 12 others  │
    └────────────────┘
```

### تدفق البيانات الوهمي (Mock Data Flow)

```
    adminData.ts  ──────────────►  HeroManager
    (Local File)  ──────────────►  ServicesManager
                  ──────────────►  FAQManager
                  ──────────────►  AboutManager
                  ──────────────►  Content
                  ──────────────►  Team
                  ──────────────►  Reports
                  ──────────────►  Security
                  ──────────────►  Notifications
                  ──────────────►  MarketsManager
                  ──────────────►  TestimonialsManager
                  ──────────────►  SiteDesign
                  
    localStorage  ──────────────►  PrivacyPolicyManager
    (Browser)     ──────────────►  SiteSettings (Fallback)
```

### تدفق رسالة التواصل (Contact Form)

```
    الزائر يملأ النموذج
         │
         ▼
    contact.tsx (صفحة التواصل)
         │ submitContactMessage()
         ▼
    POST /api/v1/messages (بدون Auth)
         │
         ▼
    supabase.from('contact_messages').insert()
         │
         ▼
    يظهر في لوحة الإدارة → Messages → رسائل التواصل ✅
```

---

## 7. التحقق من اتصال API بالباك-إند

### نقاط API الموجودة في `api/index.js`

| Endpoint | Method | وظيفة | موجود في DB؟ | تستدعيه الواجهة؟ |
|----------|--------|--------|-------------|-----------------|
| `GET /api/v1/health` | GET | فحص حالة الاتصال | - | ❌ لا |
| `POST /api/v1/auth/admin-login` | POST | تسجيل دخول المشرف | ✅ admins | ✅ نعم |
| `POST /api/v1/auth/client-login` | POST | تسجيل دخول العميل | ✅ clients | ✅ نعم |
| `GET /api/v1/auth/verify` | GET | التحقق من الجلسة | ✅ sub_admins | ⚠️ جزئي |
| `GET/POST/PATCH/DELETE /api/v1/clients` | ALL | CRUD عملاء | ✅ clients | ✅ نعم |
| `GET/POST/PATCH/DELETE /api/v1/transactions` | ALL | CRUD معاملات | ✅ transactions | ✅ نعم |
| `GET/POST/DELETE /api/v1/portfolios` | ALL | CRUD محافظ | ✅ portfolios | ✅ نعم |
| `GET/POST /api/v1/settings` | GET/POST | إعدادات الموقع | ✅ site_settings | ⚠️ جزئي |
| `GET/PATCH/DELETE /api/v1/messages` | ALL | رسائل التواصل | ✅ contact_messages | ✅ نعم |
| `GET/POST/PATCH/DELETE /api/v1/sub-admins` | ALL | إدارة مشرفين فرعيين | ✅ sub_admins | ✅ نعم |
| `GET/POST/DELETE /api/v1/notifications` | ALL | الإشعارات | ✅ notifications | ❌ لا |
| `GET /api/v1/overview` | GET | إحصائيات عامة | ✅ clients+transactions+messages | ✅ نعم |
| `GET /api/v1/client/profile` | GET | ملف العميل | ✅ clients | ✅ نعم |
| `GET /api/v1/client/portfolio` | GET | محفظة العميل | ✅ portfolios | ✅ نعم |
| `GET /api/v1/client/transactions` | GET | معاملات العميل | ✅ transactions | ✅ نعم |

### Endpoints مفقودة (موجودة في الواجهة لكن غير موجودة في API)

| الوظيفة | ملاحظة |
|--------|--------|
| إدارة المقالات والأخبار | جدول `articles` موجود لكن لا API |
| إدارة الأسئلة الشائعة | لا جدول ولا API |
| إدارة خدمات الموقع | لا جدول ولا API |
| إدارة محتوى صفحة "من نحن" | لا جدول ولا API |
| إدارة شارات الثقة والإحصائيات | لا جدول ولا API |
| إدارة التقييمات والشهادات | لا جدول ولا API |
| إدارة روابط القائمة | لا جدول ولا API |
| إدارة الشريط المتحرك للأسعار | لا جدول ولا API |
| تعديل محفظة (PATCH Portfolio) | endpoint ناقص (POST فقط) |
| التقارير المالية الحقيقية | لا endpoint |

---

## 8. التقرير الأمني التفصيلي

### 🔴 ثغرات حرجة (Critical)

#### 1. بيانات دخول المشرف مكشوفة في الكود المصدري

**الملف:** `src/components/admin/adminData.ts` — السطر 1-3

```typescript
export const ADMIN_CREDENTIALS = {
  email: 'akramhaig120@gmail.com',
  password: '0545',  // ← كلمة مرور بطول 4 أحرف فقط!
}
```

**الخطر:**
- بيانات دخول حقيقية مكتوبة في كود مصدري منشور على GitHub العام
- كلمة المرور `0545` ضعيفة جداً (4 أرقام فقط)
- البريد الإلكتروني الشخصي للمطوّر مكشوف
- يمكن لأي شخص يقرأ هذا المستودع الوصول للوحة الإدارة

**الحل الفوري المطلوب:**
1. تغيير كلمة مرور الحساب فوراً
2. حذف `ADMIN_CREDENTIALS` من الكود نهائياً
3. عدم تخزين أي بيانات دخول في الكود

---

#### 2. معرّف لوحة الإدارة في الكود

**الملف:** `src/routes/Akadmin.tsx`

```typescript
export const Route = createFileRoute('/Akadmin')
```

لوحة الإدارة متاحة على `/Akadmin` — المسار قصير وسهل التخمين نسبياً ومكشوف في كود مفتوح المصدر.

---

### 🟠 ثغرات عالية (High)

#### 3. CORS مفتوح بالكامل

**الملف:** `api/index.js`

```javascript
res.setHeader('Access-Control-Allow-Origin', '*')
```

يقبل الباك-إند طلبات من **أي مصدر** بما فيها مواقع ضارة. يجب تقييده لدومين الإنتاج فقط.

---

#### 4. JWT Tokens في localStorage (عرضة لـ XSS)

**الملف:** `src/lib/auth.ts`

```typescript
localStorage.setItem('admin_token', token)
localStorage.setItem('client_token', token)
```

تخزين JWT في `localStorage` يعرّضه لسرقة عبر هجمات XSS. الأفضل استخدام `httpOnly cookies`.

---

#### 5. لا rate limiting حقيقي على API

قفل حساب المشرف بعد 5 محاولات هو **client-side فقط** — يمكن تجاوزه بإرسال طلبات مباشرة للـ API. الباك-إند لا يطبّق أي rate limiting.

---

#### 6. عدم وجود HTTPS enforcement في الكود

لا يوجد redirect إجباري من HTTP إلى HTTPS في الكود (يعتمد كلياً على إعدادات Vercel).

---

### 🟡 ثغرات متوسطة (Medium)

#### 7. JWT Secret غير موثوق

**الملف:** `api/index.js`

```javascript
const getSecret = () => process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || null
```

إذا لم تكن المتغيرات مضبوطة، الدالة ترجع `null` وتفشل المصادقة. لا fallback آمن.

---

#### 8. لا تحقق من صلاحيات المشرف الفرعي

الباك-إند يستقبل طلبات من أي admin token صالح دون التحقق هل المشرف الفرعي لديه صلاحية للعملية المحددة. مثلاً: مشرف بصلاحية `messages` فقط يستطيع حذف عملاء.

---

#### 9. كلمات مرور العملاء مرئية في واجهة الإدارة

عند إنشاء عميل جديد، تُعرض كلمة المرور المولّدة بشكل واضح في الواجهة (وإن كان هذا سلوكاً متعمداً للنقل اليدوي، إلا أنه يستوجب التوثيق).

---

#### 10. بريد إلكتروني شخصي في بيانات التكوين

**الملف:** `src/components/admin/adminData.ts`

```typescript
{ email: 'akramhaig120@gmail.com', role: 'SUPER_ADMIN', ... }
```

البريد الشخصي للمطوّر يظهر في بيانات mock المنشورة في كود عام.

---

### 🟢 جوانب أمنية إيجابية

- ✅ bcryptjs لتشفير كلمات المرور في قاعدة البيانات
- ✅ JWT بصلاحية 8 ساعات فقط
- ✅ كشف التوكن من Authorization header فقط (لا query params)
- ✅ `Content-Type: application/json` مطلوب في طلبات الكتابة
- ✅ `rejectUnauthorized: false` في SSL لـ PostgreSQL (قابل للمراجعة)
- ✅ متغيرات البيئة الحساسة في `.env.example` (الملف الفعلي `.env` في `.gitignore`)

---

## 9. تقرير الأخطاء والميزات المفقودة

### أ. تناقضات البيانات

| المشكلة | التفاصيل |
|--------|----------|
| **اسم المشروع متضارب** | `package.json`: `golden-horizon-investments` — الواجهة: "ثروة كابيتال" — النطاق: `tharwahcapital` |
| **إعدادات الشركة hardcoded** | معلومات مثل `info@tharwahcapital.com`, `+966 11 234 5678` مكتوبة في `SiteSettingsContext.tsx` كـ defaults بدلاً من قاعدة البيانات |
| **الموقع العام لا يقرأ من لوحة الإدارة** | تعديلات ServicesManager/HeroManager لا تنعكس على الموقع أبداً |

---

### ب. Endpoints مفقودة في الباك-إند

| الـ Endpoint | الأثر |
|-------------|-------|
| `PATCH /api/v1/portfolios` | لا يمكن تعديل محفظة قائمة |
| `GET/POST/DELETE /api/v1/articles` | المقالات لا تصل قاعدة البيانات |
| `GET/POST/DELETE /api/v1/faqs` | الأسئلة الشائعة ليست في قاعدة البيانات |
| `GET/POST /api/v1/services` | الخدمات hardcoded |
| `GET/POST /api/v1/testimonials` | الشهادات hardcoded |
| `GET/POST /api/v1/reports` | لا تقارير ديناميكية |

---

### ج. أخطاء تقنية وتصميمية

| الخطأ | الملف | التفاصيل |
|------|-------|----------|
| **زر "إضافة عضو" بلا handler** | `Team.tsx` | `<button>إضافة العضو</button>` بلا `onClick` |
| **Toggles الأمان بلا state** | `Security.tsx` | `onClick` موجود لكن لا `useState` للـ toggles |
| **قواعد الإشعارات بلا تأثير** | `Notifications.tsx` | `onClick={()=>{}}` — فارغ بالكامل |
| **زر تصدير PDF بلا وظيفة** | `Reports.tsx` | button بلا handler |
| **أزرار فترة التقارير بلا state** | `Reports.tsx` | أزرار أسبوع/شهر/ربع/سنة ديكور فقط |
| **`lib/api.ts` يحتوي أسطر بـ `...`** | `api.ts` | truncated output يشير لوجود كود مقطوع في الملف |
| **`_lib/db.js` غير مستخدم** | `api/_lib/db.js` | تم إنشاؤه لـ PostgreSQL مباشر لكن الباك-إند يستخدم Supabase |

---

### د. ميزات مفقودة جوهرية

| الميزة | الأهمية | الحالة |
|-------|--------|--------|
| نسيت كلمة المرور (للعملاء) | عالية | `<a href="#">` بلا وظيفة |
| نسيت كلمة المرور (للمشرفين) | عالية | "تواصل مع المشرف الرئيسي" فقط |
| إشعارات حقيقية (Email/SMS) | عالية | واجهة وهمية |
| نظام CMS حقيقي | عالية | 80% من وظائف الإدارة وهمية |
| Audit Logs حقيقية | متوسطة | الجدول موجود لكن لا يُكتب إليه |
| تصدير تقارير PDF/Excel | متوسطة | زر ديكور |
| تحقق KYC من الوثائق | متوسطة | حقل `kyc_status` في DB فقط |
| نظام دردشة حقيقي | متوسطة | Mock data |
| إدارة الإشعارات من API | منخفضة | endpoint موجود لكن غير مستخدم |

---

## 10. الخلاصة والتوصيات

### الحالة الإجمالية للمشروع

المشروع يملك **أساساً تقنياً جيداً** في باك-إند API وقاعدة البيانات، وجزء المستخدم (Client Portal) **يعمل بشكل كامل وموثوق**. لكن لوحة الإدارة بحاجة ماسة لاستكمال اتصالها بالباك-إند إذ أن **57% من وظائفها وهمية**.

### الأولويات الفورية

#### 🚨 أمني — فوري (اليوم)
1. **حذف `ADMIN_CREDENTIALS` من `adminData.ts` فوراً**
2. **تغيير كلمة مرور الحساب `akramhaig120@gmail.com`**
3. **تقييد CORS** لقبول الطلبات من دومين الإنتاج فقط

#### 🔴 تطوير — عاجل (أسبوع)
4. **ربط إدارة المقالات** بـ `articles` table في قاعدة البيانات
5. **إنشاء endpoint** `PATCH /api/v1/portfolios` للتعديل الكامل
6. **إضافة rate limiting** حقيقي على الباك-إند

#### 🟡 تطوير — متوسط الأمد (شهر)
7. **بناء CMS حقيقي** لإدارة: الخدمات، FAQ، التقييمات، القائمة، الفوتر، Hero
8. **ربط نظام الإشعارات** بـ API الموجود بالفعل
9. **تطبيق Audit Logging** حقيقي لكل عمليات الإدارة
10. **تفعيل وظيفة نسيت كلمة المرور**

#### 🟢 تحسينات (ربع سنوي)
11. **نقل JWT** من localStorage إلى httpOnly cookies
12. **تطبيق permissions** حقيقي للمشرفين الفرعيين
13. **بناء نظام تقارير ديناميكي** من قاعدة البيانات
14. **توحيد اسم المشروع** في package.json والكود

---

> **ملاحظة ختامية:** الكود المصدري منظّم ونظيف بشكل عام، والبنية المعمارية مدروسة. الإشكالية الرئيسية ليست في جودة الكود بل في **اكتمال التنفيذ**. باك-إند جيد موجود لكن لوحة الإدارة لم تُوصَّل به بالكامل بعد.

---

*تم إنشاء هذا التقرير بواسطة تحليل ذكاء اصطناعي شامل لجميع ملفات المستودع.*

# دليل النشر — Tharwah Capital

## الخطوات المطلوبة بعد استنساخ المستودع

---

### 1. إعداد قاعدة البيانات في Supabase

1. اذهب إلى [supabase.com](https://supabase.com) وافتح مشروعك
2. اذهب إلى **SQL Editor** → **New query**
3. انسخ محتوى `supabase/schema.sql` والصقه، ثم اضغط **Run**
4. بعد نجاح الأولى، افتح query جديد وانسخ `supabase/seed.sql` والصقه، ثم **Run**

**النتيجة:** سيتم إنشاء 10 جداول مع بيانات أولية بما فيها:
- حساب الأدمن: `akramhaig120@gmail.com` / `0545`
- 6 حسابات عملاء جاهزة

---

### 2. متغيرات البيئة المطلوبة

#### في Replit Secrets (للتطوير):
```
SUPABASE_URL              = https://xxxx.supabase.co
SUPABASE_ANON_KEY         = eyJhbGc... (المفتاح العام)
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc... (مفتاح الخادم — النسخة الصحيحة)
JWT_SECRET                = any-long-random-string-at-least-32-chars
```

#### في Vercel → Settings → Environment Variables:
نفس المتغيرات أعلاه بالضبط. ملاحظة مهمة:
- `SUPABASE_SERVICE_ROLE_KEY` → Environment: **Production + Preview** (ليس Expose to browser)
- `JWT_SECRET` → Environment: **Production + Preview**

---

### 3. ربط Vercel بـ GitHub

1. اذهب إلى [vercel.com](https://vercel.com)
2. **New Project** → Import `tharwahcapital` من GitHub
3. Framework Preset: **Vite**
4. أضف متغيرات البيئة قبل الضغط على Deploy

---

### 4. التحقق من الخدمات الجاهزة (Stubs)

الملفات التالية جاهزة للتكامل مستقبلاً:
- **Resend (email)**: تعليق في `api/v1/messages.js` — أضف `RESEND_API_KEY`
- **TwelveData**: إضافة `TWELVE_DATA_API_KEY` في متغيرات Vercel
- **Alpha Vantage**: إضافة `ALPHA_VANTAGE_KEY`
- **SMS/WhatsApp**: إضافة `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN`

---

### 5. بنية API Endpoints

| Endpoint | Method | Auth | الوصف |
|----------|--------|------|-------|
| `/api/v1/auth/admin-login` | POST | ❌ | دخول الأدمن |
| `/api/v1/auth/client-login` | POST | ❌ | دخول العميل |
| `/api/v1/settings` | GET | ❌ | إعدادات الموقع |
| `/api/v1/messages` | POST | ❌ | إرسال رسالة تواصل |
| `/api/v1/clients` | GET/POST/PATCH/DELETE | ✅ JWT | إدارة العملاء |
| `/api/v1/transactions` | GET/POST/PATCH/DELETE | ✅ JWT | المعاملات |
| `/api/v1/portfolios` | GET/POST/PATCH/DELETE | ✅ JWT | المحافظ |
| `/api/v1/messages` | GET/PATCH/DELETE | ✅ JWT | الرسائل (أدمن) |
| `/api/v1/sub-admins` | GET/POST/DELETE | ✅ JWT (super) | المشرفون |
| `/api/v1/notifications` | GET/PATCH | ✅ JWT | الإشعارات |
| `/api/v1/overview` | GET | ✅ JWT | KPIs لوحة التحكم |

---

### 6. مشكلة `SUPABASE_SERVICE_ROLE_KEY` الحالية

المفتاح الموجود في Replit Secrets حالياً يعطي 401. لإصلاحه:
1. اذهب إلى Supabase Dashboard → **Settings** → **API**
2. انسخ **service_role key** بعناية (هو أسفل `anon/public key`)
3. في Replit: اضغط على `SUPABASE_SERVICE_ROLE_KEY` → Edit → الصق القيمة الجديدة

---

### 7. هيكل الملفات المضافة

```
api/
  _lib/
    supabase.js     ← Supabase client (service role)
    auth.js         ← JWT sign/verify
    cors.js         ← CORS headers
  v1/
    auth/
      admin-login.js
      client-login.js
    clients.js
    transactions.js
    portfolios.js
    settings.js
    messages.js
    sub-admins.js
    notifications.js
    overview.js
supabase/
  schema.sql       ← تشغيله أولاً
  seed.sql         ← تشغيله ثانياً
src/
  lib/
    api.ts         ← كل API calls
    auth.ts        ← token management
  contexts/
    SiteSettingsContext.tsx ← إعدادات الموقع ديناميكية
```

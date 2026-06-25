-- ============================================================
-- Tharwah Capital — Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- MAIN ADMIN (email: akramhaig120@gmail.com  password: 0545)
-- ============================================================
INSERT INTO admins (name, email, password_hash, role, status)
VALUES (
  'أكرم هايج',
  'akramhaig120@gmail.com',
  crypt('0545', gen_salt('bf', 10)),
  'super',
  'active'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- CLIENT ACCOUNTS
-- ============================================================
INSERT INTO clients (name, email, password_hash, portfolio_code, category, status, kyc_status, initial, phone)
VALUES
  ('محمد الأحمد',    'mohammed@tharwah.com', crypt('Tharwah@2024',  gen_salt('bf', 10)), 'PF-001', 'VIP',      'active', 'approved', 'م', '+966501111001'),
  ('سارة العمري',    'sara@tharwah.com',     crypt('Sara@2024!',    gen_salt('bf', 10)), 'PF-002', 'premium',  'active', 'approved', 'س', '+966501111002'),
  ('طارق القحطاني',  'tariq@tharwah.com',    crypt('Tariq@2024!',   gen_salt('bf', 10)), 'PF-003', 'standard', 'active', 'approved', 'ط', '+966501111003'),
  ('نورة الشمري',    'noura@tharwah.com',    crypt('Noura@2024!',   gen_salt('bf', 10)), 'PF-004', 'premium',  'active', 'approved', 'ن', '+966501111004'),
  ('عبدالله السالم', 'abdullah@tharwah.com', crypt('Abdullah@2024', gen_salt('bf', 10)), 'PF-005', 'VIP',      'active', 'approved', 'ع', '+966501111005'),
  ('فاطمة الزهراني', 'fatima@tharwah.com',   crypt('Fatima@2024',   gen_salt('bf', 10)), 'PF-006', 'standard', 'active', 'approved', 'ف', '+966501111006')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SITE SETTINGS (defaults)
-- ============================================================
INSERT INTO site_settings (key, value, type, label) VALUES
  ('site_name_ar',       'ثروة كابيتال',                             'text',  'اسم الموقع بالعربية'),
  ('site_name_en',       'Tharwah Capital',                          'text',  'Site Name English'),
  ('platform_name',      'Golden Horizon Investments',               'text',  'اسم المنصة'),
  ('company_email',      'info@tharwahcapital.com',                  'email', 'البريد الرسمي'),
  ('company_phone',      '+966 11 234 5678',                         'text',  'رقم الهاتف'),
  ('company_whatsapp',   '+966501234567',                            'text',  'واتساب'),
  ('company_address_ar', 'طريق الملك فهد، حي العليا، الرياض 12211', 'text',  'العنوان بالعربية'),
  ('company_address_en', 'King Fahd Road, Al Olaya, Riyadh 12211',  'text',  'Address English'),
  ('company_location',   'الرياض، المملكة العربية السعودية',         'text',  'الموقع الجغرافي'),
  ('maintenance_mode',   'false',                                     'bool',  'وضع الصيانة'),
  ('open_registration',  'false',                                     'bool',  'التسجيل مفتوح'),
  ('show_live_markets',  'true',                                      'bool',  'أسعار السوق الحية'),
  ('min_investment',     '10000',                                     'number','الحد الأدنى للاستثمار ($)'),
  ('max_daily_withdraw', '500000',                                    'number','الحد الأقصى للسحب اليومي ($)'),
  ('mgmt_fee_pct',       '1.5',                                       'number','رسوم الإدارة %'),
  ('perf_fee_pct',       '20',                                        'number','رسوم الأداء %'),
  ('default_currency',   'USD',                                       'text',  'عملة النظام'),
  ('footer_text_ar',     'جميع الحقوق محفوظة لثروة كابيتال',         'text',  'نص الفوتر بالعربية'),
  ('footer_text_en',     'All rights reserved Tharwah Capital',      'text',  'Footer text English')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- ============================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================
INSERT INTO notifications (title, message, type, read, target) VALUES
  ('عميل جديد بانتظار الموافقة',  '3 طلبات تسجيل جديدة تحتاج مراجعة', 'warning', false, 'admin'),
  ('رسائل غير مقروءة',           'لديك 7 رسائل جديدة من العملاء',      'info',    false, 'admin'),
  ('تم إكمال صفقة ناجحة',        'صفقة شراء أرامكو بقيمة $12,400',    'success', true,  'admin')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Tharwah Capital — PostgreSQL Schema
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. ADMINS
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'admin'
                            CHECK (role IN ('super', 'admin', 'advisor', 'content_manager')),
  status        TEXT        NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'inactive')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. SUB_ADMINS
-- ============================================================
CREATE TABLE IF NOT EXISTS sub_admins (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  status        TEXT        DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by    UUID        REFERENCES admins(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. CLIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL,
  email            TEXT        UNIQUE NOT NULL,
  phone            TEXT,
  nationality      TEXT,
  id_number        TEXT,
  category         TEXT        DEFAULT 'standard'
                               CHECK (category IN ('VIP', 'premium', 'standard')),
  status           TEXT        DEFAULT 'pending'
                               CHECK (status IN ('active', 'pending', 'frozen', 'inactive', 'suspended')),
  portfolio_code   TEXT        UNIQUE,
  risk_profile     TEXT,
  investment_goal  TEXT,
  kyc_status       TEXT        DEFAULT 'pending'
                               CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  password_hash    TEXT,
  notes            TEXT,
  initial          TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. PORTFOLIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolios (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id          UUID        REFERENCES clients(id) ON DELETE CASCADE,
  name               TEXT        NOT NULL,
  type               TEXT,
  total_value        NUMERIC     DEFAULT 0,
  initial_investment NUMERIC     DEFAULT 0,
  profit_loss        NUMERIC     DEFAULT 0,
  profit_loss_pct    NUMERIC     DEFAULT 0,
  currency           TEXT        DEFAULT 'USD',
  status             TEXT        DEFAULT 'active',
  assets             JSONB       DEFAULT '[]',
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID        REFERENCES clients(id) ON DELETE SET NULL,
  portfolio_id UUID        REFERENCES portfolios(id) ON DELETE SET NULL,
  client_name  TEXT,
  type         TEXT        NOT NULL
               CHECK (type IN ('buy', 'sell', 'transfer', 'deposit', 'withdraw')),
  asset        TEXT        NOT NULL,
  quantity     NUMERIC,
  price        NUMERIC,
  total        NUMERIC,
  status       TEXT        DEFAULT 'pending'
               CHECK (status IN ('completed', 'pending', 'rejected')),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGSERIAL   PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT,
  service    TEXT,
  message    TEXT        NOT NULL,
  source     TEXT        DEFAULT 'contact',
  status     TEXT        DEFAULT 'new'
             CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. SITE SETTINGS (key/value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT        PRIMARY KEY,
  value      TEXT,
  type       TEXT        DEFAULT 'text',
  label      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. ARTICLES / NEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar   TEXT,
  title_en   TEXT,
  content_ar TEXT,
  content_en TEXT,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  category   TEXT,
  status     TEXT        DEFAULT 'draft'
             CHECK (status IN ('published', 'draft')),
  author     TEXT,
  image_url  TEXT,
  views      INT         DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT        NOT NULL,
  message    TEXT,
  type       TEXT        DEFAULT 'info'
             CHECK (type IN ('info', 'warning', 'error', 'success')),
  read       BOOLEAN     DEFAULT FALSE,
  target     TEXT        DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     UUID,
  actor_type   TEXT,
  actor_email  TEXT,
  action       TEXT        NOT NULL,
  target_table TEXT,
  target_id    TEXT,
  details      JSONB,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clients_email        ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status       ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_code         ON clients(portfolio_code);
CREATE INDEX IF NOT EXISTS idx_portfolios_client    ON portfolios(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client  ON transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status  ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status      ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_articles_status      ON articles(status);
CREATE INDEX IF NOT EXISTS idx_audit_actor          ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_created        ON audit_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE admins           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_admins       ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios       ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs       ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used in Vercel serverless functions)
-- Anon can only read public settings and published articles

CREATE POLICY "service_role_all_admins"    ON admins           FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_sub"       ON sub_admins       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_clients"   ON clients          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_portfolios" ON portfolios      FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_tx"        ON transactions     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_messages"  ON contact_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_settings"  ON site_settings    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_articles"  ON articles         FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_notifs"    ON notifications    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_audit"     ON audit_logs       FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Public read for site settings (anon frontend reads these)
CREATE POLICY "anon_read_settings"  ON site_settings    FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_articles"  ON articles         FOR SELECT TO anon USING (status = 'published');
-- Allow anon to insert contact messages (contact form)
CREATE POLICY "anon_insert_messages" ON contact_messages FOR INSERT TO anon WITH CHECK (true);

-- RegCompass ASEAN — Full Database Schema
-- Run against Supabase (PostgreSQL + pgvector)

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Reference Tables ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS countries (
  id          SERIAL PRIMARY KEY,
  code        CHAR(2)      NOT NULL UNIQUE,
  name        TEXT         NOT NULL,
  flag_emoji  TEXT,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS regulators (
  id          SERIAL PRIMARY KEY,
  country_id  INT          REFERENCES countries(id) ON DELETE CASCADE,
  name        TEXT         NOT NULL,
  acronym     TEXT         NOT NULL,
  website_url TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_verticals (
  id          SERIAL PRIMARY KEY,
  slug        TEXT         NOT NULL UNIQUE,
  name        TEXT         NOT NULL,
  description TEXT,
  icon        TEXT
);

-- ── Core Table ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS regulatory_requirements (
  id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id            INT          REFERENCES countries(id)           NOT NULL,
  product_vertical_id   INT          REFERENCES product_verticals(id)   NOT NULL,
  regulator_id          INT          REFERENCES regulators(id)          NOT NULL,

  risk_level            TEXT         NOT NULL CHECK (risk_level IN ('HIGH', 'MODERATE', 'LOW', 'UNKNOWN')),
  risk_reason           TEXT,

  title                 TEXT         NOT NULL,
  summary               TEXT         NOT NULL,
  citation              TEXT,
  source_url            TEXT,

  effective_date        DATE,
  compliance_deadline   DATE,

  last_verified_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_changed_at       TIMESTAMPTZ,
  is_stale              BOOLEAN      DEFAULT FALSE,

  -- nvidia/nv-embed-v2 produces 4096-dim embeddings
  embedding             vector(4096),

  created_at            TIMESTAMPTZ  DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  DEFAULT NOW(),

  UNIQUE (country_id, product_vertical_id, regulator_id)
);

-- Structured query index (main dossier path)
CREATE INDEX IF NOT EXISTS idx_req_country_product
  ON regulatory_requirements (country_id, product_vertical_id);

CREATE INDEX IF NOT EXISTS idx_req_risk_level
  ON regulatory_requirements (risk_level);

CREATE INDEX IF NOT EXISTS idx_req_is_stale
  ON regulatory_requirements (is_stale) WHERE is_stale = TRUE;

-- Semantic search index (IVFFlat — build after seeding data)
CREATE INDEX IF NOT EXISTS idx_req_embedding
  ON regulatory_requirements USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ── Changelog ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS changelogs (
  id              UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id  UUID   REFERENCES regulatory_requirements(id) ON DELETE CASCADE NOT NULL,
  change_type     TEXT   NOT NULL CHECK (change_type IN ('ADDED', 'UPDATED', 'RISK_CHANGED', 'REMOVED')),
  old_value       JSONB,
  new_value       JSONB,
  change_summary  TEXT,
  detected_at     TIMESTAMPTZ DEFAULT NOW(),
  source_url      TEXT
);

CREATE INDEX IF NOT EXISTS idx_changelog_requirement
  ON changelogs (requirement_id);

CREATE INDEX IF NOT EXISTS idx_changelog_detected
  ON changelogs (detected_at DESC);

-- ── Scan Logs ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS scan_logs (
  id                UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id        INT    REFERENCES countries(id),
  started_at        TIMESTAMPTZ NOT NULL,
  completed_at      TIMESTAMPTZ,
  status            TEXT   CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED')),
  pages_scraped     INT    DEFAULT 0,
  changes_detected  INT    DEFAULT 0,
  error_message     TEXT
);

-- ── Auto-update updated_at ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_req_updated_at
  BEFORE UPDATE ON regulatory_requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Staleness check (run daily) ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION mark_stale_requirements()
RETURNS void LANGUAGE SQL AS $$
  UPDATE regulatory_requirements
  SET is_stale = TRUE
  WHERE last_verified_at < NOW() - INTERVAL '90 days'
    AND is_stale = FALSE;
$$;

-- ── Semantic Search RPC ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION search_requirements(
  query_embedding vector(4096),
  match_count     INT DEFAULT 10
)
RETURNS TABLE (
  id           UUID,
  country_code TEXT,
  product_slug TEXT,
  risk_level   TEXT,
  title        TEXT,
  summary      TEXT,
  similarity   FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    rr.id,
    c.code         AS country_code,
    pv.slug        AS product_slug,
    rr.risk_level,
    rr.title,
    rr.summary,
    1 - (rr.embedding <=> query_embedding) AS similarity
  FROM regulatory_requirements rr
  JOIN countries        c  ON rr.country_id = c.id
  JOIN product_verticals pv ON rr.product_vertical_id = pv.id
  WHERE rr.embedding IS NOT NULL
  ORDER BY rr.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Grant public read access to anon role (Supabase RLS will further restrict)
GRANT SELECT ON countries            TO anon, authenticated;
GRANT SELECT ON regulators           TO anon, authenticated;
GRANT SELECT ON product_verticals    TO anon, authenticated;
GRANT SELECT ON regulatory_requirements TO anon, authenticated;
GRANT SELECT ON changelogs           TO anon, authenticated;
GRANT SELECT ON scan_logs            TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_requirements TO anon, authenticated;

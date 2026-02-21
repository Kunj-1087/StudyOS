-- ============================================================
-- studyOS Database Schema for Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT,
    name            TEXT NOT NULL,
    avatar_url      TEXT,
    role            TEXT NOT NULL DEFAULT 'student',
    auth_provider   TEXT NOT NULL DEFAULT 'email',
    skill_index     FLOAT NOT NULL DEFAULT 0.0,
    reputation_score INTEGER NOT NULL DEFAULT 0,
    contribution_count INTEGER NOT NULL DEFAULT 0,
    execution_score FLOAT NOT NULL DEFAULT 0.0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON public.users(role);

-- ── Domains ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.domains (
    id                    TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug                  TEXT UNIQUE NOT NULL,
    name                  TEXT NOT NULL,
    description           TEXT,
    icon                  TEXT,
    image_url             TEXT,
    market_demand         INTEGER NOT NULL DEFAULT 0,
    difficulty_index      INTEGER NOT NULL DEFAULT 0,
    time_to_competency    TEXT,
    avg_salary_min        INTEGER,
    avg_salary_max        INTEGER,
    salary_currency       TEXT NOT NULL DEFAULT 'USD',
    overview              TEXT,
    why_it_matters        TEXT,
    core_concepts         JSONB,
    required_skills       JSONB,
    tool_stack            JSONB,
    industry_applications JSONB,
    execution_strategy    JSONB,
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    display_order         INTEGER NOT NULL DEFAULT 0,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domains_slug         ON public.domains(slug);
CREATE INDEX IF NOT EXISTS idx_domains_is_active    ON public.domains(is_active);
CREATE INDEX IF NOT EXISTS idx_domains_display_order ON public.domains(display_order);

-- ── Resources ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resources (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    domain_id     TEXT NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT,
    url           TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    category      TEXT NOT NULL,
    difficulty    TEXT NOT NULL DEFAULT 'beginner',
    provider      TEXT,
    duration      TEXT,
    is_free       BOOLEAN NOT NULL DEFAULT TRUE,
    thumbnail_url TEXT,
    upvotes       INTEGER NOT NULL DEFAULT 0,
    view_count    INTEGER NOT NULL DEFAULT 0,
    is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_domain_id ON public.resources(domain_id);
CREATE INDEX IF NOT EXISTS idx_resources_category  ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_is_active ON public.resources(is_active);

-- ── User Progress ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_progress (
    id                   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id              TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    domain_id            TEXT NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
    completion_percentage FLOAT NOT NULL DEFAULT 0.0,
    resources_completed  JSONB NOT NULL DEFAULT '[]',
    current_section      TEXT,
    started_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at         TIMESTAMPTZ,
    UNIQUE(user_id, domain_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id   ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_domain_id ON public.user_progress(domain_id);

-- ── Personal Plan Items ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.personal_plan_items (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id     TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes       TEXT,
    priority    INTEGER NOT NULL DEFAULT 0,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_plan_user_id ON public.personal_plan_items(user_id);

-- ── Disable Row-Level Security (backend uses service key) ─────────────────────
ALTER TABLE public.users               DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains             DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources           DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress       DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_plan_items DISABLE ROW LEVEL SECURITY;

-- Done!
SELECT 'studyOS schema created successfully 🎉' AS status;

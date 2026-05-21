-- ============================================================
--  SMART EVENT AI OS — DATABASE SCHEMA
--  Version  : 1.0.0
--  Engine   : PostgreSQL 15+
--  Encoding : UTF-8
--  Author   : Smart Event AI OS — Engineering Team
-- ============================================================

-- ────────────────────────────────────────────────────────────
--  EXTENSIONS
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────────
--  ENUMS
-- ────────────────────────────────────────────────────────────

CREATE TYPE event_type_enum AS ENUM (
  'wedding',
  'birthday',
  'conference',
  'gala',
  'other'
);

CREATE TYPE admin_status_enum AS ENUM (
  'active',
  'blocked'
);

CREATE TYPE event_status_enum AS ENUM (
  'draft',
  'active',
  'completed',
  'archived'
);

CREATE TYPE language_enum AS ENUM (
  'fr',
  'en'
);

CREATE TYPE rsvp_status_enum AS ENUM (
  'pending',
  'confirmed',
  'declined'
);

CREATE TYPE checkin_status_enum AS ENUM (
  'not_arrived',
  'arrived'
);

CREATE TYPE qr_type_enum AS ENUM (
  'check_in',
  'info'
);

CREATE TYPE typography_enum AS ENUM (
  'serif',
  'sans',
  'mono'
);

CREATE TYPE decoration_style_enum AS ENUM (
  'floral',
  'stars',
  'confetti',
  'minimal',
  'corporate'
);

CREATE TYPE spacing_enum AS ENUM (
  'compact',
  'normal',
  'spacious'
);

CREATE TYPE border_radius_enum AS ENUM (
  'sharp',
  'soft',
  'rounded',
  'pill'
);

CREATE TYPE palette_type_enum AS ENUM (
  'predefined',
  'custom'
);

CREATE TYPE log_action_enum AS ENUM (
  'admin:created',
  'admin:blocked',
  'admin:unblocked',
  'admin:deleted',
  'admin:password_reset',
  'event:created',
  'event:updated',
  'event:deleted',
  'event:finalized',
  'guest:created',
  'guest:updated',
  'guest:deleted',
  'guest:imported',
  'guest:rsvp_updated',
  'guest:checked_in',
  'guest:checkin_cancelled',
  'table:created',
  'table:updated',
  'table:deleted',
  'table:guest_assigned',
  'table:guest_removed',
  'session:created',
  'session:updated',
  'session:deleted',
  'asset:downloaded',
  'setup:step_saved',
  'setup:finalized'
);

CREATE TYPE upload_type_enum AS ENUM (
  'logo',
  'background',
  'gallery'
);

CREATE TYPE checkin_source_enum AS ENUM (
  'qr_scan',
  'manual',
  'offline_sync'
);

-- ────────────────────────────────────────────────────────────
--  TABLE 1 : super_admins
--  Administrateurs globaux de la plateforme
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS super_admins (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(255)  NOT NULL UNIQUE,
  password_hash   TEXT          NOT NULL,
  totp_secret     TEXT,              -- Secret TOTP chiffré
  name            VARCHAR(150)  NOT NULL,
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
--  TABLE 2 : admins
--  Organisateurs d'événements (tenants)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id                  UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id            VARCHAR(30)       NOT NULL UNIQUE,
  password_hash       TEXT              NOT NULL,
  name                VARCHAR(150)      NOT NULL,
  email               VARCHAR(255)      UNIQUE,
  phone               VARCHAR(30),
  status              admin_status_enum NOT NULL DEFAULT 'active',
  blocked_reason      TEXT,
  blocked_at          TIMESTAMPTZ,
  blocked_by          UUID              REFERENCES super_admins(id) ON DELETE SET NULL,
  last_login_at       TIMESTAMPTZ,
  created_by          UUID              REFERENCES super_admins(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
--  TABLE 3 : admin_sessions
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_sessions (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id        UUID        NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash      TEXT        NOT NULL UNIQUE,
  ip_address      INET,
  user_agent      TEXT,
  expires_at      TIMESTAMPTZ NOT NULL,
  last_active_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
--  TABLE 4 : events
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                    UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id              UUID               NOT NULL UNIQUE REFERENCES admins(id) ON DELETE CASCADE,
  name                  VARCHAR(120)       NOT NULL,
  event_type            event_type_enum    NOT NULL,
  description           VARCHAR(500),
  date                  DATE               NOT NULL,
  start_time            TIME               NOT NULL,
  city                  VARCHAR(100)       NOT NULL,
  country               VARCHAR(100)       NOT NULL DEFAULT 'Cameroun',
  venue                 VARCHAR(255)       NOT NULL,
  programme_text        TEXT,
  status                event_status_enum  NOT NULL DEFAULT 'draft',
  language              language_enum      NOT NULL DEFAULT 'fr',
  union_title           VARCHAR(100),
  birthday_age          SMALLINT,
  birthday_person_name  VARCHAR(100),
  speaker_names         VARCHAR(300),
  video_link            VARCHAR(500),
  setup_completed       BOOLEAN         NOT NULL DEFAULT FALSE,
  setup_step            SMALLINT        NOT NULL DEFAULT 1 CHECK (setup_step BETWEEN 1 AND 5),
  finalized_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
--  TABLE 7 : uploads (Nécessaire avant event_design)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS uploads (
  id            UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id      UUID              NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  event_id      UUID              REFERENCES events(id) ON DELETE CASCADE,
  upload_type   upload_type_enum  NOT NULL,
  file_name     VARCHAR(255)      NOT NULL,
  mime_type     VARCHAR(100)      NOT NULL,
  size_bytes    INTEGER           NOT NULL,
  storage_url   TEXT              NOT NULL,
  storage_key   TEXT              NOT NULL,
  created_at    TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
--  TABLE 5 : event_design
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_design (
  id                      UUID                   PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id                UUID                   NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  palette_type            palette_type_enum      NOT NULL DEFAULT 'predefined',
  palette_id              VARCHAR(80),
  color_accent            CHAR(7),
  color_background        CHAR(7),
  color_button            CHAR(7),
  color_text              CHAR(7),
  decoration_style        decoration_style_enum  NOT NULL DEFAULT 'minimal',
  logo_file_id            UUID                   REFERENCES uploads(id) ON DELETE SET NULL,
  background_file_id      UUID                   REFERENCES uploads(id) ON DELETE SET NULL,
  typography              typography_enum        NOT NULL DEFAULT 'sans',
  font_size_base          SMALLINT               NOT NULL DEFAULT 15 CHECK (font_size_base BETWEEN 13 AND 18),
  font_size_title         SMALLINT               NOT NULL DEFAULT 28 CHECK (font_size_title BETWEEN 20 AND 36),
  spacing                 spacing_enum           NOT NULL DEFAULT 'normal',
  border_radius           border_radius_enum     NOT NULL DEFAULT 'rounded',
  glassmorphism           BOOLEAN                NOT NULL DEFAULT FALSE,
  host_initials           VARCHAR(4),
  welcome_fr              VARCHAR(200),
  welcome_en              VARCHAR(200),
  quote_fr                VARCHAR(150),
  quote_en                VARCHAR(150),
  seating_label_fr        VARCHAR(50)            NOT NULL DEFAULT 'Votre Table',
  seating_label_en        VARCHAR(50)            NOT NULL DEFAULT 'Your Table',
  created_at              TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ            NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
--  TABLE 6 : event_settings
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_settings (
  id                          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id                    UUID            NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  qr_enabled                  BOOLEAN         NOT NULL DEFAULT TRUE,
  qr_type                     qr_type_enum    NOT NULL DEFAULT 'check_in',
  rsvp_enabled                BOOLEAN         NOT NULL DEFAULT TRUE,
  seating_plan_enabled        BOOLEAN         NOT NULL DEFAULT TRUE,
  max_guests_per_table        SMALLINT        NOT NULL DEFAULT 10 CHECK (max_guests_per_table BETWEEN 1 AND 50),
  show_guest_name_on_card     BOOLEAN         NOT NULL DEFAULT TRUE,
  show_table_number_on_card   BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
--  AUTRES TABLES (Galerie, Assets, Sessions, Tables, Guests)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery_photos (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  file_id     UUID        NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  position    SMALLINT    NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, position)
);

CREATE TABLE IF NOT EXISTS event_assets (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id        UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  asset_type      VARCHAR(50) NOT NULL,
  storage_url     TEXT        NOT NULL,
  storage_key     TEXT        NOT NULL,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_size_bytes INTEGER,
  UNIQUE (event_id, asset_type)
);

CREATE TABLE IF NOT EXISTS sessions (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name        VARCHAR(120) NOT NULL,
  venue       VARCHAR(255),
  start_time  TIME        NOT NULL,
  details     VARCHAR(300),
  position    SMALLINT    NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tables (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  capacity    SMALLINT    NOT NULL CHECK (capacity BETWEEN 1 AND 50),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, name)
);

CREATE TABLE IF NOT EXISTS guests (
  id              UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id        UUID               NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  table_id        UUID               REFERENCES tables(id) ON DELETE SET NULL,
  name            VARCHAR(150)       NOT NULL,
  phone           VARCHAR(30),
  email           VARCHAR(255),
  language        language_enum      NOT NULL DEFAULT 'fr',
  notes           VARCHAR(300),
  token           TEXT               NOT NULL UNIQUE,
  token_expires_at TIMESTAMPTZ       NOT NULL,
  invitation_url  TEXT               NOT NULL,
  short_url       VARCHAR(30)        UNIQUE,
  rsvp_status     rsvp_status_enum   NOT NULL DEFAULT 'pending',
  rsvp_updated_at TIMESTAMPTZ,
  checkin_status  checkin_status_enum NOT NULL DEFAULT 'not_arrived',
  checked_in_at   TIMESTAMPTZ,
  checkin_source  checkin_source_enum,
  created_at      TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- [Triggers, Views et RLS omis ici pour la brièveté, mais inclus dans le fichier final]

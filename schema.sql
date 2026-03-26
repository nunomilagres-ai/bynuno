-- byNuno Hub — Cloudflare D1 Schema
-- Executar: wrangler d1 execute bynuno-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  google_id    TEXT UNIQUE,
  avatar_url   TEXT,
  bio          TEXT,
  created_date TEXT NOT NULL,
  updated_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at   TEXT NOT NULL,
  created_date TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

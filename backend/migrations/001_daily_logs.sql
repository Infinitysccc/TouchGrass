-- backend/migrations/001_daily_logs.sql
-- Run this once against your PostgreSQL database to create the daily log table.
--
-- Each row = one user's data for one calendar day.
-- ON CONFLICT DO UPDATE means saving is always an "upsert" — safe to call
-- on every change without worrying about duplicates.

CREATE TABLE IF NOT EXISTS daily_logs (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date        DATE    NOT NULL,                     -- calendar day "YYYY-MM-DD"
    supp_iu     INTEGER NOT NULL DEFAULT 0,           -- supplement IU logged
    food_iu     INTEGER NOT NULL DEFAULT 0,           -- dietary IU logged
    sun_iu      INTEGER NOT NULL DEFAULT 0,           -- estimated sunlight IU
    uv_index    NUMERIC(4,1) NOT NULL DEFAULT 0.0,   -- last UV index of the day
    bracelet_status TEXT NOT NULL DEFAULT 'Disconnected',
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT daily_logs_user_date_unique UNIQUE (user_id, date)
);

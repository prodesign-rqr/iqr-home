/*
  # IQR Home — Core Schema v1

  ## Overview
  Creates the foundational data model for the IQR Home property stewardship platform.
  The property is the permanent center of gravity. All records flow from it.

  ## New Tables

  ### properties
  - `id` (uuid, pk) — canonical property identifier
  - `nickname` (text) — display name / property nickname
  - `street_address` (text) — physical address
  - `city`, `state`, `zip` (text) — location fields
  - `parcel_apn` (text) — assessor parcel number
  - `status` (enum: draft | active | needs_review | archived)
  - `created_at`, `updated_at` (timestamptz)

  ### floors
  - `id` (uuid, pk)
  - `property_id` (uuid, fk → properties)
  - `label` (text) — e.g. "Main Floor", "Second Level"
  - `level_order` (int) — sort order, 0 = basement, 1 = main, 2 = upper
  - `created_at`, `updated_at` (timestamptz)

  ### rooms
  - `id` (uuid, pk)
  - `floor_id` (uuid, fk → floors)
  - `property_id` (uuid, fk → properties) — denormalized for efficient queries
  - `name` (text) — primary room name (required before closure)
  - `area_type` (enum: room | zone | exterior | mechanical)
  - `status` (enum: pending | open | closed | needs_revisit)
  - `notes` (text) — optional field notes
  - `closed_at` (timestamptz) — set when room is explicitly closed
  - `created_at`, `updated_at` (timestamptz)

  ### walkthrough_sessions
  - `id` (uuid, pk)
  - `property_id` (uuid, fk → properties)
  - `status` (enum: active | paused | completed | abandoned)
  - `started_at` (timestamptz)
  - `resumed_at` (timestamptz) — last resume timestamp
  - `completed_at` (timestamptz)
  - `current_room_id` (uuid, fk → rooms) — tracks resume position
  - `total_rooms` (int) — snapshot at session start
  - `closed_rooms` (int) — running count
  - `notes` (text)
  - `created_at`, `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read/write policies for MVP (no auth required yet — this is a TIS field tool)
  - Policies scoped by anon role to enable field use without sign-in overhead

  ## Notes
  1. Room closure requires explicit action — status must be set to 'closed' with closed_at timestamp
  2. The walkthrough session tracks position for resume capability
  3. property_id is denormalized on rooms for efficient property-level queries
*/

-- Enums
CREATE TYPE property_status AS ENUM ('draft', 'active', 'needs_review', 'archived');
CREATE TYPE room_area_type AS ENUM ('room', 'zone', 'exterior', 'mechanical');
CREATE TYPE room_status AS ENUM ('pending', 'open', 'closed', 'needs_revisit');
CREATE TYPE walkthrough_status AS ENUM ('active', 'paused', 'completed', 'abandoned');

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL DEFAULT '',
  street_address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  zip text NOT NULL DEFAULT '',
  parcel_apn text NOT NULL DEFAULT '',
  status property_status NOT NULL DEFAULT 'draft',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select on properties"
  ON properties FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on properties"
  ON properties FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on properties"
  ON properties FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Floors table
CREATE TABLE IF NOT EXISTS floors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT '',
  level_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS floors_property_id_idx ON floors(property_id);

ALTER TABLE floors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select on floors"
  ON floors FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on floors"
  ON floors FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on floors"
  ON floors FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_id uuid NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  area_type room_area_type NOT NULL DEFAULT 'room',
  status room_status NOT NULL DEFAULT 'pending',
  notes text NOT NULL DEFAULT '',
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rooms_property_id_idx ON rooms(property_id);
CREATE INDEX IF NOT EXISTS rooms_floor_id_idx ON rooms(floor_id);
CREATE INDEX IF NOT EXISTS rooms_status_idx ON rooms(status);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select on rooms"
  ON rooms FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on rooms"
  ON rooms FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on rooms"
  ON rooms FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Walkthrough sessions table
CREATE TABLE IF NOT EXISTS walkthrough_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  status walkthrough_status NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  resumed_at timestamptz,
  completed_at timestamptz,
  current_room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  total_rooms integer NOT NULL DEFAULT 0,
  closed_rooms integer NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS walkthrough_sessions_property_id_idx ON walkthrough_sessions(property_id);
CREATE INDEX IF NOT EXISTS walkthrough_sessions_status_idx ON walkthrough_sessions(status);

ALTER TABLE walkthrough_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select on walkthrough_sessions"
  ON walkthrough_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on walkthrough_sessions"
  ON walkthrough_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on walkthrough_sessions"
  ON walkthrough_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

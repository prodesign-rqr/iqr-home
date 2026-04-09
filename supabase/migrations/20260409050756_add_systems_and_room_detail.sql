/*
  # Add Systems Table

  ## Overview
  Adds the property systems table to support the Systems module — the first major
  record layer that sits on top of the spatial walkthrough baseline.

  ## New Tables

  ### systems
  - `id` (uuid, pk)
  - `property_id` (uuid, fk → properties) — the owning property
  - `name` (text) — primary system name, e.g. "Main HVAC"
  - `category` (enum) — hvac | water_heater | electrical | plumbing | roof | appliance | pool | security | network | av | other
  - `manufacturer` (text)
  - `model` (text)
  - `serial_number` (text)
  - `install_date` (date)
  - `location` (text) — spatial reference, e.g. "Garage mechanical wall"
  - `status` (enum) — active | inactive | unknown | decommissioned
  - `verification` (enum) — verified | unverified | needs_review
  - `notes` (text)
  - `created_at`, `updated_at` (timestamptz)

  ## Security
  - RLS enabled with anon read/write (field tool, no auth in MVP)

  ## Notes
  1. systems.property_id is the canonical anchor — systems own all associated records
  2. install_date stored as date (not timestamptz) — day precision is sufficient
  3. status and verification are separate concerns: a system can be active but unverified
*/

CREATE TYPE system_category AS ENUM (
  'hvac', 'water_heater', 'electrical', 'plumbing', 'roof',
  'appliance', 'pool', 'security', 'network', 'av', 'other'
);

CREATE TYPE system_status AS ENUM ('active', 'inactive', 'unknown', 'decommissioned');
CREATE TYPE verification_status AS ENUM ('verified', 'unverified', 'needs_review');

CREATE TABLE IF NOT EXISTS systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  category system_category NOT NULL DEFAULT 'other',
  manufacturer text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  serial_number text NOT NULL DEFAULT '',
  install_date date,
  location text NOT NULL DEFAULT '',
  status system_status NOT NULL DEFAULT 'unknown',
  verification verification_status NOT NULL DEFAULT 'unverified',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS systems_property_id_idx ON systems(property_id);
CREATE INDEX IF NOT EXISTS systems_category_idx ON systems(category);

ALTER TABLE systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select on systems"
  ON systems FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on systems"
  ON systems FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on systems"
  ON systems FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete on systems"
  ON systems FOR DELETE
  TO anon
  USING (true);

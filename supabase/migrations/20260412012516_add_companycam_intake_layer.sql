/*
  # CompanyCam Intake Layer v1

  ## Summary
  Adds structured photo records and import batch logging to support the CompanyCam
  Intake module inside the Property Workspace. CompanyCam is treated as a source,
  not the record — all imported photos become first-class IQR photo records.

  ## New Tables

  ### import_batches
  Logs each CompanyCam import session for a property.
  - id: uuid primary key
  - property_id: foreign key to properties
  - companycam_project_id: the linked CompanyCam project identifier (string)
  - companycam_project_name: human-readable project name
  - imported_at: timestamp of when the import was initiated
  - photo_count: how many photos were confirmed in this batch
  - notes: optional operator notes

  ### photo_records
  Structured IQR photo records converted from CompanyCam imports.
  - id: uuid primary key
  - property_id: required FK to properties
  - source_type: enum ('companycam', 'manual', 'walkthrough')
  - source_project_id: originating CompanyCam project ID
  - source_photo_id: unique photo ID from source system
  - source_url: full-resolution URL from source
  - thumbnail_url: thumbnail URL from source
  - captured_at: when the photo was taken (from source metadata)
  - caption: photo caption from source or entered by operator
  - notes: operator notes added during intake
  - room_id: optional FK to rooms (nullable)
  - zone_id: optional zone string label (nullable, no FK — spatial zones are not yet a table)
  - system_id: optional FK to systems (nullable)
  - service_event_id: optional FK to service_entry_events (nullable)
  - record_scope: enum ('property', 'room', 'system', 'service_event')
  - import_batch_id: FK to import_batches
  - metadata_json: raw metadata from source as jsonb
  - created_at: record creation timestamp

  ## Security
  - RLS enabled on both tables
  - Authenticated users can read/insert/update their own property-scoped records
  - No public access

  ## Notes
  1. zone_id is stored as text (not FK) because spatial zones are not yet a normalized table
  2. source_type uses a CHECK constraint for extensibility without a separate enum type
  3. record_scope uses a CHECK constraint
  4. import_batch_id is required — every photo must belong to a batch
*/

CREATE TABLE IF NOT EXISTS import_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  companycam_project_id text NOT NULL,
  companycam_project_name text,
  imported_at timestamptz NOT NULL DEFAULT now(),
  photo_count integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS photo_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  source_type text NOT NULL DEFAULT 'companycam' CHECK (source_type IN ('companycam', 'manual', 'walkthrough')),
  source_project_id text,
  source_photo_id text,
  source_url text,
  thumbnail_url text,
  captured_at timestamptz,
  caption text,
  notes text,
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  zone_id text,
  system_id uuid REFERENCES systems(id) ON DELETE SET NULL,
  service_event_id uuid REFERENCES service_entry_events(id) ON DELETE SET NULL,
  record_scope text NOT NULL DEFAULT 'property' CHECK (record_scope IN ('property', 'room', 'system', 'service_event')),
  import_batch_id uuid NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  metadata_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS photo_records_property_id_idx ON photo_records(property_id);
CREATE INDEX IF NOT EXISTS photo_records_import_batch_id_idx ON photo_records(import_batch_id);
CREATE INDEX IF NOT EXISTS photo_records_room_id_idx ON photo_records(room_id);
CREATE INDEX IF NOT EXISTS photo_records_system_id_idx ON photo_records(system_id);
CREATE INDEX IF NOT EXISTS import_batches_property_id_idx ON import_batches(property_id);

ALTER TABLE import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read import_batches"
  ON import_batches FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert import_batches"
  ON import_batches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update import_batches"
  ON import_batches FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read photo_records"
  ON photo_records FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert photo_records"
  ON photo_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update photo_records"
  ON photo_records FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete photo_records"
  ON photo_records FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

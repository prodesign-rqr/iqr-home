/*
  # Add Service Entry Nodes and Service Entry Events

  ## Summary
  Creates the foundational schema for managed service-provider entry at a property.
  This is a structural-only implementation: data model and placeholder surfaces.
  No live lock integrations, QR generation, or Hubitat/Yale/August control is included.

  ## Doctrine
  - Each property may have one designated managed service-entry point.
  - IQR records only managed QR-based service-provider entry events by default.
  - Homeowner/private lock usage is NOT tracked in this feature unless explicitly enabled.
  - The lock is treated as an actuator endpoint for future integration, not as a source of truth.

  ## New Tables

  ### entry_nodes
  Represents a property-level managed service-entry point.
  - `id` — UUID primary key
  - `property_id` — FK to properties
  - `label` — human label (e.g., "Front Door")
  - `entry_type` — enum: front_door, rear_door, side_door, garage, other
  - `location_description` — free-text description of physical location
  - `is_primary_service_entry` — boolean; only one per property should be true
  - `qr_enabled` — whether QR workflow is active (false until integration is live)
  - `service_entry_enabled` — whether managed service entry is active overall
  - `lock_planned_type` — planned lock hardware type
  - `lock_planned_brand` — planned lock brand (e.g., Yale, August)
  - `middleware_planned_type` — planned middleware (e.g., Hubitat, Home Assistant)
  - `integration_status` — enum: not_configured, planned, partial, configured
  - `notes` — free-text notes
  - `created_at`, `updated_at`

  ### service_entry_events
  Records a managed QR-based service-provider entry event.
  - `id` — UUID primary key
  - `property_id` — FK to properties
  - `entry_node_id` — FK to entry_nodes
  - `timestamp` — when the event occurred
  - `actor_role` — enum: service_provider, partner_steward, homeowner, system
  - `workflow_type` — fixed: 'QR Service Entry'
  - `result` — enum: requested, approved, completed, denied, planned
  - `linked_visit_id` — optional reference to a future visit/work-order record
  - `source` — enum: qr_scan, manual, planned
  - `notes` — free-text notes
  - `created_at`

  ## Security
  - RLS enabled on both tables
  - Authenticated users can view and manage records
  - Future: scope policies to property ownership/membership

  ## Important Notes
  1. This migration is additive only — no existing tables are modified.
  2. `is_primary_service_entry` uniqueness is enforced at the application layer for now.
  3. All integration fields (`qr_enabled`, `service_entry_enabled`, lock/middleware) default
     to their "not yet active" state — no live integrations are enabled by this migration.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entry_type_enum') THEN
    CREATE TYPE entry_type_enum AS ENUM (
      'front_door', 'rear_door', 'side_door', 'garage', 'other'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entry_integration_status_enum') THEN
    CREATE TYPE entry_integration_status_enum AS ENUM (
      'not_configured', 'planned', 'partial', 'configured'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entry_lock_type_enum') THEN
    CREATE TYPE entry_lock_type_enum AS ENUM (
      'smart_deadbolt', 'smart_lever', 'keypad', 'other', 'none'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entry_middleware_type_enum') THEN
    CREATE TYPE entry_middleware_type_enum AS ENUM (
      'hubitat', 'home_assistant', 'control4', 'direct_api', 'none'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_entry_actor_role_enum') THEN
    CREATE TYPE service_entry_actor_role_enum AS ENUM (
      'service_provider', 'partner_steward', 'homeowner', 'system'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_entry_result_enum') THEN
    CREATE TYPE service_entry_result_enum AS ENUM (
      'requested', 'approved', 'completed', 'denied', 'planned'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_entry_source_enum') THEN
    CREATE TYPE service_entry_source_enum AS ENUM (
      'qr_scan', 'manual', 'planned'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS entry_nodes (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id              uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  label                    text NOT NULL DEFAULT '',
  entry_type               entry_type_enum NOT NULL DEFAULT 'front_door',
  location_description     text DEFAULT '',
  is_primary_service_entry boolean NOT NULL DEFAULT false,
  qr_enabled               boolean NOT NULL DEFAULT false,
  service_entry_enabled    boolean NOT NULL DEFAULT false,
  lock_planned_type        entry_lock_type_enum DEFAULT 'none',
  lock_planned_brand       text DEFAULT '',
  middleware_planned_type  entry_middleware_type_enum DEFAULT 'none',
  integration_status       entry_integration_status_enum NOT NULL DEFAULT 'not_configured',
  notes                    text DEFAULT '',
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE entry_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view entry nodes"
  ON entry_nodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert entry nodes"
  ON entry_nodes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update entry nodes"
  ON entry_nodes FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete entry nodes"
  ON entry_nodes FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS service_entry_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  entry_node_id   uuid NOT NULL REFERENCES entry_nodes(id) ON DELETE CASCADE,
  timestamp       timestamptz NOT NULL DEFAULT now(),
  actor_role      service_entry_actor_role_enum NOT NULL DEFAULT 'service_provider',
  workflow_type   text NOT NULL DEFAULT 'QR Service Entry',
  result          service_entry_result_enum NOT NULL DEFAULT 'planned',
  linked_visit_id uuid DEFAULT NULL,
  source          service_entry_source_enum NOT NULL DEFAULT 'manual',
  notes           text DEFAULT '',
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE service_entry_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view service entry events"
  ON service_entry_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert service entry events"
  ON service_entry_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update service entry events"
  ON service_entry_events FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete service entry events"
  ON service_entry_events FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS entry_nodes_property_id_idx ON entry_nodes(property_id);
CREATE INDEX IF NOT EXISTS service_entry_events_property_id_idx ON service_entry_events(property_id);
CREATE INDEX IF NOT EXISTS service_entry_events_entry_node_id_idx ON service_entry_events(entry_node_id);

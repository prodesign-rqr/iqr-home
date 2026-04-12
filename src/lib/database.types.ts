export type PropertyStatus = "draft" | "active" | "needs_review" | "archived";
export type EntryTypeEnum = "front_door" | "rear_door" | "side_door" | "garage" | "other";
export type EntryIntegrationStatusEnum = "not_configured" | "planned" | "partial" | "configured";
export type EntryLockTypeEnum = "smart_deadbolt" | "smart_lever" | "keypad" | "other" | "none";
export type EntryMiddlewareTypeEnum = "hubitat" | "home_assistant" | "control4" | "direct_api" | "none";
export type ServiceEntryActorRoleEnum = "service_provider" | "partner_steward" | "homeowner" | "system";
export type ServiceEntryResultEnum = "requested" | "approved" | "completed" | "denied" | "planned";
export type ServiceEntrySourceEnum = "qr_scan" | "manual" | "planned";

export interface EntryNode {
  id: string;
  property_id: string;
  label: string;
  entry_type: EntryTypeEnum;
  location_description: string;
  is_primary_service_entry: boolean;
  qr_enabled: boolean;
  service_entry_enabled: boolean;
  lock_planned_type: EntryLockTypeEnum | null;
  lock_planned_brand: string;
  middleware_planned_type: EntryMiddlewareTypeEnum | null;
  integration_status: EntryIntegrationStatusEnum;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceEntryEvent {
  id: string;
  property_id: string;
  entry_node_id: string;
  timestamp: string;
  actor_role: ServiceEntryActorRoleEnum;
  workflow_type: string;
  result: ServiceEntryResultEnum;
  linked_visit_id: string | null;
  source: ServiceEntrySourceEnum;
  notes: string;
  created_at: string;
}
export type RoomAreaType = "room" | "zone" | "exterior" | "mechanical";
export type RoomStatus = "pending" | "open" | "closed" | "needs_revisit";
export type WalkthroughStatus = "active" | "paused" | "completed" | "abandoned";
export type SystemCategory =
  | "hvac" | "water_heater" | "electrical" | "plumbing" | "roof"
  | "appliance" | "pool" | "security" | "network" | "av" | "other";
export type SystemStatus = "active" | "inactive" | "unknown" | "decommissioned";
export type VerificationStatus = "verified" | "unverified" | "needs_review";

export interface System {
  id: string;
  property_id: string;
  name: string;
  category: SystemCategory;
  manufacturer: string;
  model: string;
  serial_number: string;
  install_date: string | null;
  location: string;
  status: SystemStatus;
  verification: VerificationStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  nickname: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  parcel_apn: string;
  status: PropertyStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Floor {
  id: string;
  property_id: string;
  label: string;
  level_order: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  floor_id: string;
  property_id: string;
  name: string;
  area_type: RoomAreaType;
  status: RoomStatus;
  notes: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalkthroughSession {
  id: string;
  property_id: string;
  status: WalkthroughStatus;
  started_at: string;
  resumed_at: string | null;
  completed_at: string | null;
  current_room_id: string | null;
  total_rooms: number;
  closed_rooms: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type PhotoSourceType = "companycam" | "manual" | "walkthrough";
export type PhotoRecordScope = "property" | "room" | "system" | "service_event";

export interface ImportBatch {
  id: string;
  property_id: string;
  companycam_project_id: string;
  companycam_project_name: string | null;
  imported_at: string;
  photo_count: number;
  notes: string | null;
  created_at: string;
}

export interface PhotoRecord {
  id: string;
  property_id: string;
  source_type: PhotoSourceType;
  source_project_id: string | null;
  source_photo_id: string | null;
  source_url: string | null;
  thumbnail_url: string | null;
  captured_at: string | null;
  caption: string | null;
  notes: string | null;
  room_id: string | null;
  zone_id: string | null;
  system_id: string | null;
  service_event_id: string | null;
  record_scope: PhotoRecordScope;
  import_batch_id: string;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: Property;
        Insert: {
          id?: string;
          nickname?: string;
          street_address?: string;
          city?: string;
          state?: string;
          zip?: string;
          parcel_apn?: string;
          status?: PropertyStatus;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          street_address?: string;
          city?: string;
          state?: string;
          zip?: string;
          parcel_apn?: string;
          status?: PropertyStatus;
          notes?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      floors: {
        Row: Floor;
        Insert: {
          id?: string;
          property_id: string;
          label?: string;
          level_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          label?: string;
          level_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      rooms: {
        Row: Room;
        Insert: {
          id?: string;
          floor_id: string;
          property_id: string;
          name?: string;
          area_type?: RoomAreaType;
          status?: RoomStatus;
          notes?: string;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          floor_id?: string;
          property_id?: string;
          name?: string;
          area_type?: RoomAreaType;
          status?: RoomStatus;
          notes?: string;
          closed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      walkthrough_sessions: {
        Row: WalkthroughSession;
        Insert: {
          id?: string;
          property_id: string;
          status?: WalkthroughStatus;
          started_at?: string;
          resumed_at?: string | null;
          completed_at?: string | null;
          current_room_id?: string | null;
          total_rooms?: number;
          closed_rooms?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          status?: WalkthroughStatus;
          started_at?: string;
          resumed_at?: string | null;
          completed_at?: string | null;
          current_room_id?: string | null;
          total_rooms?: number;
          closed_rooms?: number;
          notes?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

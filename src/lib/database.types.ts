export type PropertyStatus = "draft" | "active" | "needs_review" | "archived";
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

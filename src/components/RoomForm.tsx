"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { Floor } from "../lib/database.types";

type RoomFormProps = {
  propertyId: string;
  floors: Floor[];
  defaultFloorId?: string;
};

const ROOM_PRESETS = [
  "Kitchen",
  "Great Room",
  "Living Room",
  "Dining Room",
  "Primary Suite",
  "Primary Bath",
  "Bedroom",
  "Bathroom",
  "Office",
  "Laundry Room",
  "Garage",
  "Pantry",
  "Mudroom",
  "Wine Room",
  "Theater",
  "Gym",
  "Pool House",
  "Utility Room",
  "Mechanical Room",
  "Attic",
  "Courtyard",
  "Covered Patio",
  "Pool Deck",
];

const AREA_TYPES = [
  { value: "room", label: "Room" },
  { value: "zone", label: "Zone" },
  { value: "exterior", label: "Exterior Area" },
  { value: "mechanical", label: "Mechanical Space" },
];

export default function RoomForm({ propertyId, floors, defaultFloorId }: RoomFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [floorId, setFloorId] = useState(defaultFloorId ?? floors[0]?.id ?? "");
  const [areaType, setAreaType] = useState<"room" | "zone" | "exterior" | "mechanical">("room");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }
    if (!floorId) {
      setError("A floor must be selected. Add a floor first.");
      return;
    }
    setSaving(true);
    setError(null);

    const { error: dbError } = await supabase.from("rooms").insert({
      property_id: propertyId,
      floor_id: floorId,
      name: name.trim(),
      area_type: areaType,
      notes: notes.trim(),
      status: "pending",
    });

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    router.push(`/workspace/${propertyId}`);
    router.refresh();
  }

  if (floors.length === 0) {
    return (
      <div
        style={{
          padding: "32px 24px",
          borderRadius: 12,
          border: "1px dashed rgba(255,139,139,0.3)",
          background: "rgba(255,139,139,0.05)",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#ff8b8b", fontWeight: 600, marginBottom: 8 }}>
          No floors found
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: 16 }}>
          A room must live on a floor. Add a floor to this property first.
        </div>
        <button
          onClick={() => router.push(`/workspace/${propertyId}/add-floor`)}
          className="btn-primary"
        >
          Add a Floor
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
      <div className="form-section">
        <div className="form-row">
          <label className="form-label">Quick Select</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ROOM_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setName(preset)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  background: name === preset ? "rgba(109,211,255,0.15)" : "rgba(255,255,255,0.04)",
                  border: name === preset ? "1px solid rgba(109,211,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: name === preset ? "#6dd3ff" : "rgba(255,255,255,0.6)",
                  transition: "all 0.15s",
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">
            Room Name <span style={{ color: "#ff8b8b" }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Primary name for this space"
            className="form-input"
            autoComplete="off"
          />
          <div className="form-hint">
            A room must have a primary name before it can be closed in a walkthrough.
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Floor</label>
          <select
            value={floorId}
            onChange={(e) => setFloorId(e.target.value)}
            className="form-select"
          >
            {floors.map((floor) => (
              <option key={floor.id} value={floor.id}>
                {floor.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Area Type</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {AREA_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setAreaType(type.value as "room" | "zone" | "exterior" | "mechanical")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: areaType === type.value ? "rgba(127,226,150,0.15)" : "rgba(255,255,255,0.04)",
                  border: areaType === type.value ? "1px solid rgba(127,226,150,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: areaType === type.value ? "#7fe296" : "rgba(255,255,255,0.6)",
                  transition: "all 0.15s",
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Field Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Access notes, hazards, key observations..."
            className="form-input"
            rows={2}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: "rgba(255,139,139,0.12)",
            border: "1px solid rgba(255,139,139,0.3)",
            color: "#ff8b8b",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
          disabled={saving}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Adding..." : "Add Room"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { Room, Floor, RoomAreaType, RoomStatus } from "../lib/database.types";

type RoomEditFormProps = {
  room: Room;
  floors: Floor[];
};

const AREA_TYPES: { value: RoomAreaType; label: string }[] = [
  { value: "room", label: "Room" },
  { value: "zone", label: "Zone" },
  { value: "exterior", label: "Exterior Area" },
  { value: "mechanical", label: "Mechanical Space" },
];

const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "open", label: "Open" },
  { value: "needs_revisit", label: "Needs Revisit" },
  { value: "closed", label: "Closed" },
];

export default function RoomEditForm({ room, floors }: RoomEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(room.name);
  const [floorId, setFloorId] = useState(room.floor_id);
  const [areaType, setAreaType] = useState<RoomAreaType>(room.area_type);
  const [status, setStatus] = useState<RoomStatus>(room.status);
  const [notes, setNotes] = useState(room.notes);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      name: name.trim(),
      floor_id: floorId,
      area_type: areaType,
      status,
      notes: notes.trim(),
      updated_at: now,
    };

    if (status === "closed" && room.status !== "closed") {
      updates.closed_at = now;
    } else if (status !== "closed" && room.status === "closed") {
      updates.closed_at = null;
    }

    const { error: dbError } = await supabase
      .from("rooms")
      .update(updates)
      .eq("id", room.id);

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    router.push(`/workspace/${room.property_id}/room/${room.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
      <div className="form-section">
        <div className="form-row">
          <label className="form-label">
            Room Name <span style={{ color: "#ff8b8b" }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Floor</label>
          <select
            value={floorId}
            onChange={(e) => setFloorId(e.target.value)}
            className="form-select"
          >
            {floors.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Area Type</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {AREA_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setAreaType(t.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: areaType === t.value ? "rgba(127,226,150,0.15)" : "rgba(255,255,255,0.04)",
                  border: areaType === t.value ? "1px solid rgba(127,226,150,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: areaType === t.value ? "#7fe296" : "rgba(255,255,255,0.6)",
                  transition: "all 0.15s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Status</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: status === s.value ? "rgba(109,211,255,0.15)" : "rgba(255,255,255,0.04)",
                  border: status === s.value ? "1px solid rgba(109,211,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: status === s.value ? "#6dd3ff" : "rgba(255,255,255,0.6)",
                  transition: "all 0.15s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          {status === "closed" && room.status !== "closed" && (
            <div style={{ fontSize: "0.78rem", color: "#f59e0b", marginTop: 4 }}>
              Saving as closed will set the closure timestamp to now.
            </div>
          )}
        </div>

        <div className="form-row">
          <label className="form-label">Field Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input"
            rows={3}
            placeholder="Access notes, observations, items requiring follow-up..."
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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

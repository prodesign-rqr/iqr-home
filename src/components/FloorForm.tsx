"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type FloorFormProps = {
  propertyId: string;
};

const FLOOR_PRESETS = [
  { label: "Basement", order: 0 },
  { label: "Main Floor", order: 1 },
  { label: "Second Level", order: 2 },
  { label: "Third Level", order: 3 },
  { label: "Attic / Roof Level", order: 4 },
  { label: "Garage Level", order: 1 },
];

export default function FloorForm({ propertyId }: FloorFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [levelOrder, setLevelOrder] = useState(1);

  function applyPreset(preset: { label: string; order: number }) {
    setLabel(preset.label);
    setLevelOrder(preset.order);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) {
      setError("Floor label is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const { error: dbError } = await supabase.from("floors").insert({
      property_id: propertyId,
      label: label.trim(),
      level_order: levelOrder,
    });

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    router.push(`/workspace/${propertyId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
      <div className="form-section">
        <div className="form-row">
          <label className="form-label">Quick Select</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FLOOR_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: label === preset.label ? "rgba(109,211,255,0.15)" : "rgba(255,255,255,0.05)",
                  border: label === preset.label ? "1px solid rgba(109,211,255,0.5)" : "1px solid rgba(255,255,255,0.12)",
                  color: label === preset.label ? "#6dd3ff" : "rgba(255,255,255,0.7)",
                  transition: "all 0.15s",
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">
            Floor Label <span style={{ color: "#ff8b8b" }}>*</span>
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Main Floor, Upper Level"
            className="form-input"
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Level Order</label>
          <input
            type="number"
            value={levelOrder}
            onChange={(e) => setLevelOrder(parseInt(e.target.value) || 0)}
            className="form-input"
            min={0}
            max={10}
            style={{ maxWidth: 120 }}
          />
          <div className="form-hint">
            0 = Basement, 1 = Main Floor, 2 = Upper Level. Used for spatial ordering.
          </div>
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
          {saving ? "Adding..." : "Add Floor"}
        </button>
      </div>
    </form>
  );
}

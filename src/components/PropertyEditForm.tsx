"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { Property, PropertyStatus } from "../lib/database.types";

type PropertyEditFormProps = {
  property: Property;
};

const STATUS_OPTIONS: { value: PropertyStatus; label: string; desc: string }[] = [
  { value: "draft", label: "Draft", desc: "Record is incomplete or in intake" },
  { value: "active", label: "Active", desc: "Record is commissioned and live" },
  { value: "needs_review", label: "Needs Review", desc: "Flagged for integrity review" },
  { value: "archived", label: "Archived", desc: "Property is no longer active" },
];

export default function PropertyEditForm({ property }: PropertyEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nickname, setNickname] = useState(property.nickname);
  const [streetAddress, setStreetAddress] = useState(property.street_address);
  const [city, setCity] = useState(property.city);
  const [state, setState] = useState(property.state);
  const [zip, setZip] = useState(property.zip);
  const [parcelApn, setParcelApn] = useState(property.parcel_apn);
  const [status, setStatus] = useState<PropertyStatus>(property.status);
  const [notes, setNotes] = useState(property.notes);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("Property nickname is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const { error: dbError } = await supabase
      .from("properties")
      .update({
        nickname: nickname.trim(),
        street_address: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        parcel_apn: parcelApn.trim(),
        status,
        notes: notes.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", property.id);

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    router.push(`/workspace/${property.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
      <div className="form-section">
        <div className="form-row">
          <label className="form-label">
            Property Nickname <span style={{ color: "#ff8b8b" }}>*</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="form-input"
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Street Address</label>
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            className="form-input"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px", gap: 12 }}>
          <div className="form-row">
            <label className="form-label">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label className="form-label">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="form-input"
              maxLength={2}
            />
          </div>
          <div className="form-row">
            <label className="form-label">ZIP</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Parcel / APN</label>
          <input
            type="text"
            value={parcelApn}
            onChange={(e) => setParcelApn(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Record Status</label>
          <div style={{ display: "grid", gap: 8 }}>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  textAlign: "left",
                  cursor: "pointer",
                  background: status === opt.value ? "rgba(109,211,255,0.08)" : "rgba(255,255,255,0.03)",
                  border: status === opt.value ? "1px solid rgba(109,211,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.15s",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "10px 14px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: status === opt.value ? "#6dd3ff" : "rgba(255,255,255,0.2)",
                    border: status === opt.value ? "none" : "1px solid rgba(255,255,255,0.15)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color: status === opt.value ? "#6dd3ff" : "rgba(255,255,255,0.75)",
                    }}
                  >
                    {opt.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input"
            rows={3}
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

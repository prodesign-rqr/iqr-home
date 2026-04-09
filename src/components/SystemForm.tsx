"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { SystemCategory, SystemStatus, VerificationStatus } from "../lib/database.types";

type SystemFormProps = {
  propertyId: string;
};

const CATEGORIES: { value: SystemCategory; label: string }[] = [
  { value: "hvac", label: "HVAC" },
  { value: "water_heater", label: "Water Heater" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "roof", label: "Roof" },
  { value: "appliance", label: "Appliance" },
  { value: "pool", label: "Pool / Spa" },
  { value: "security", label: "Security" },
  { value: "network", label: "Network" },
  { value: "av", label: "A/V" },
  { value: "other", label: "Other" },
];

const SYSTEM_STATUSES: { value: SystemStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "unknown", label: "Unknown" },
  { value: "decommissioned", label: "Decommissioned" },
];

const VERIFICATIONS: { value: VerificationStatus; label: string }[] = [
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
  { value: "needs_review", label: "Needs Review" },
];

export default function SystemForm({ propertyId }: SystemFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SystemCategory>("other");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [installDate, setInstallDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<SystemStatus>("unknown");
  const [verification, setVerification] = useState<VerificationStatus>("unverified");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("System name is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const { error: dbError } = await supabase.from("systems").insert({
      property_id: propertyId,
      name: name.trim(),
      category,
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      serial_number: serialNumber.trim(),
      install_date: installDate || null,
      location: location.trim(),
      status,
      verification,
      notes: notes.trim(),
    });

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    router.push(`/workspace/${propertyId}/systems`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
      <div className="form-section">
        <div className="form-row">
          <label className="form-label">
            System Name <span style={{ color: "#ff8b8b" }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Main HVAC, Garage Water Heater, Sub-Zero Refrigerator"
            className="form-input"
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Category</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: category === c.value ? "rgba(109,211,255,0.15)" : "rgba(255,255,255,0.04)",
                  border: category === c.value ? "1px solid rgba(109,211,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: category === c.value ? "#6dd3ff" : "rgba(255,255,255,0.6)",
                  transition: "all 0.15s",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-row">
            <label className="form-label">Manufacturer</label>
            <input
              type="text"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="e.g. Trane, Rheem, Sub-Zero"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model number"
              className="form-input"
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-row">
            <label className="form-label">Serial Number</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Serial / unit number"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Install Date</label>
            <input
              type="date"
              value={installDate}
              onChange={(e) => setInstallDate(e.target.value)}
              className="form-input"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Garage mechanical wall, Attic air handler, Side yard"
            className="form-input"
          />
          <div className="form-hint">
            Spatial reference — where can a technician find this system?
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="form-row">
            <label className="form-label">Status</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SYSTEM_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: status === s.value ? "rgba(127,226,150,0.15)" : "rgba(255,255,255,0.04)",
                    border: status === s.value ? "1px solid rgba(127,226,150,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    color: status === s.value ? "#7fe296" : "rgba(255,255,255,0.55)",
                    transition: "all 0.15s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Verification</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {VERIFICATIONS.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setVerification(v.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: verification === v.value ? "rgba(245,190,103,0.15)" : "rgba(255,255,255,0.04)",
                    border: verification === v.value ? "1px solid rgba(245,190,103,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    color: verification === v.value ? "#f5be67" : "rgba(255,255,255,0.55)",
                    transition: "all 0.15s",
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input"
            rows={2}
            placeholder="Service history, known issues, access notes..."
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
          {saving ? "Adding..." : "Add System"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import StatusBadge from "./StatusBadge";
import type { System, SystemCategory, SystemStatus, VerificationStatus } from "../lib/database.types";

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

const CATEGORY_LABEL: Record<string, string> = {
  hvac: "HVAC",
  water_heater: "Water Heater",
  electrical: "Electrical",
  plumbing: "Plumbing",
  roof: "Roof",
  appliance: "Appliance",
  pool: "Pool / Spa",
  security: "Security",
  network: "Network",
  av: "A/V",
  other: "Other",
};

type Props = {
  system: System;
  propertyId: string;
  propertyNickname: string;
};

export default function SystemDetailClient({ system: initialSystem, propertyId, propertyNickname }: Props) {
  const router = useRouter();
  const [system, setSystem] = useState<System>(initialSystem);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(system.name);
  const [category, setCategory] = useState<SystemCategory>(system.category);
  const [manufacturer, setManufacturer] = useState(system.manufacturer ?? "");
  const [model, setModel] = useState(system.model ?? "");
  const [serialNumber, setSerialNumber] = useState(system.serial_number ?? "");
  const [installDate, setInstallDate] = useState(system.install_date ?? "");
  const [location, setLocation] = useState(system.location ?? "");
  const [status, setStatus] = useState<SystemStatus>(system.status);
  const [verification, setVerification] = useState<VerificationStatus>(system.verification);
  const [notes, setNotes] = useState(system.notes ?? "");

  function enterEdit() {
    setName(system.name);
    setCategory(system.category);
    setManufacturer(system.manufacturer ?? "");
    setModel(system.model ?? "");
    setSerialNumber(system.serial_number ?? "");
    setInstallDate(system.install_date ?? "");
    setLocation(system.location ?? "");
    setStatus(system.status);
    setVerification(system.verification);
    setNotes(system.notes ?? "");
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  async function saveChanges() {
    if (!name.trim()) {
      setError("System name is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const updates = {
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
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase
      .from("systems")
      .update(updates)
      .eq("id", system.id)
      .eq("property_id", propertyId);

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    setSystem({ ...system, ...updates });
    setEditing(false);
    router.refresh();
  }

  const viewFields = [
    { label: "Category", value: CATEGORY_LABEL[system.category] ?? system.category },
    { label: "Manufacturer", value: system.manufacturer || "—" },
    { label: "Model", value: system.model || "—" },
    { label: "Serial Number", value: system.serial_number || "—" },
    {
      label: "Install Date",
      value: system.install_date
        ? new Date(system.install_date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "—",
    },
    { label: "Location", value: system.location || "—" },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 13px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ecf3fb",
    fontSize: "0.9rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    marginBottom: 6,
    display: "block",
  };

  return (
    <main>
      <div style={{ background: "#00aa44", color: "#fff", fontWeight: 900, fontSize: "1rem", padding: "10px 20px", letterSpacing: "0.1em" }}>
        REAL_ROUTE_MARKER
      </div>
      <section className="hero">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>{system.name}</h1>
          <StatusBadge status={system.status} />
        </div>
        <p>
          {CATEGORY_LABEL[system.category] ?? system.category}
          {system.location ? ` — ${system.location}` : ""}
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${propertyId}/systems`} className="subpage-nav-home">
            Systems
          </Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${propertyId}`} className="subnav-pill">
              {propertyNickname || "Property"}
            </Link>
            {!editing && (
              <button
                className="subnav-pill"
                style={{ cursor: "pointer", border: "none", background: "transparent" }}
                onClick={enterEdit}
              >
                Edit System
              </button>
            )}
          </div>
        </div>
      </section>

      <div style={{ padding: "0 24px 48px", display: "grid", gap: 24 }}>

        {editing ? (
          <>
            <div
              style={{
                padding: "20px 22px",
                borderRadius: 12,
                border: "1px solid rgba(109,211,255,0.2)",
                background: "rgba(109,211,255,0.03)",
                display: "grid",
                gap: 18,
              }}
            >
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6dd3ff", marginBottom: 2 }}>
                Editing System Record
              </div>

              <div className="form-row">
                <label style={labelStyle}>System Name <span style={{ color: "#ff8b8b" }}>*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  autoComplete="off"
                  placeholder="e.g. Main HVAC"
                />
              </div>

              <div className="form-row">
                <label style={labelStyle}>Category</label>
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
                  <label style={labelStyle}>Manufacturer</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Trane, Rheem"
                    style={inputStyle}
                  />
                </div>
                <div className="form-row">
                  <label style={labelStyle}>Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Model number"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-row">
                  <label style={labelStyle}>Serial Number</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Serial / unit number"
                    style={inputStyle}
                  />
                </div>
                <div className="form-row">
                  <label style={labelStyle}>Install Date</label>
                  <input
                    type="date"
                    value={installDate}
                    onChange={(e) => setInstallDate(e.target.value)}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div className="form-row">
                <label style={labelStyle}>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Garage mechanical wall"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-row">
                  <label style={labelStyle}>Status</label>
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
                  <label style={labelStyle}>Verification</label>
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
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Service history, known issues, access notes..."
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
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

            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn-primary"
                onClick={saveChanges}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="btn-secondary"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
              }}
            >
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
                  Status
                </div>
                <StatusBadge status={system.status} />
              </div>
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
                  Verification
                </div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color:
                      system.verification === "verified"
                        ? "#7fe296"
                        : system.verification === "needs_review"
                        ? "#f59e0b"
                        : "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {system.verification.replace("_", " ")}
                </span>
              </div>
            </div>

            <div
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              {viewFields.map((field, i) => (
                <div
                  key={field.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    gap: 16,
                    padding: "13px 20px",
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.35)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      alignSelf: "center",
                    }}
                  >
                    {field.label}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: field.value === "—" ? "rgba(255,255,255,0.25)" : "#ecf3fb" }}>
                    {field.value}
                  </div>
                </div>
              ))}
            </div>

            {system.notes && (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: 10,
                  }}
                >
                  Notes
                </div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  {system.notes}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <Link href={`/workspace/${propertyId}/systems`}>
                <button className="btn-secondary">Back to Systems</button>
              </Link>
              <button className="btn-primary" onClick={enterEdit}>
                Edit System
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

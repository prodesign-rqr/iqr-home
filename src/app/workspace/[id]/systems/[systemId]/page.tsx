"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../../lib/supabase";

type SystemCategory = "hvac" | "water_heater" | "electrical" | "plumbing" | "roof" | "appliance" | "pool" | "security" | "network" | "av" | "other";
type SystemStatus = "active" | "inactive" | "unknown" | "decommissioned";
type VerificationStatus = "verified" | "unverified" | "needs_review";

interface System {
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
  hvac: "HVAC", water_heater: "Water Heater", electrical: "Electrical",
  plumbing: "Plumbing", roof: "Roof", appliance: "Appliance",
  pool: "Pool / Spa", security: "Security", network: "Network", av: "A/V", other: "Other",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 13px", borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)",
  color: "#ecf3fb", fontSize: "0.9rem", outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6, display: "block",
};

export default function SystemDetailPage() {
  const params = useParams<{ id: string; systemId: string }>();
  const router = useRouter();
  const propertyId = params.id;
  const systemId = params.systemId;

  const [system, setSystem] = useState<System | null>(null);
  const [propertyNickname, setPropertyNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<SystemCategory>("other");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [installDate, setInstallDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<SystemStatus>("active");
  const [verification, setVerification] = useState<VerificationStatus>("unverified");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      const [propRes, sysRes] = await Promise.all([
        supabase.from("properties").select("id, nickname").eq("id", propertyId).maybeSingle(),
        supabase.from("systems").select("*").eq("id", systemId).eq("property_id", propertyId).maybeSingle(),
      ]);
      if (propRes.data) setPropertyNickname(propRes.data.nickname ?? "");
      if (sysRes.data) setSystem(sysRes.data as System);
      setLoading(false);
    }
    load();
  }, [propertyId, systemId]);

  function enterEdit() {
    if (!system) return;
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
    if (!system) return;
    if (!name.trim()) { setError("System name is required."); return; }
    setSaving(true);
    setError(null);

    const updates = {
      name: name.trim(), category,
      manufacturer: manufacturer.trim(), model: model.trim(),
      serial_number: serialNumber.trim(), install_date: installDate || null,
      location: location.trim(), status, verification,
      notes: notes.trim(), updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase
      .from("systems").update(updates).eq("id", system.id).eq("property_id", propertyId);

    setSaving(false);
    if (dbError) { setError(dbError.message); return; }
    setSystem({ ...system, ...updates });
    setEditing(false);
  }

  if (loading) {
    return (
      <main>
        <section className="hero">
          <h1 style={{ margin: 0, color: "rgba(255,255,255,0.3)" }}>Loading...</h1>
        </section>
      </main>
    );
  }

  if (!system) {
    return (
      <main>
        <section className="hero">
          <h1>System not found</h1>
          <Link href={`/workspace/${propertyId}/systems`} className="btn-secondary">Back to Systems</Link>
        </section>
      </main>
    );
  }

  const viewFields = [
    { label: "Category", value: CATEGORY_LABEL[system.category] ?? system.category },
    { label: "Manufacturer", value: system.manufacturer || "—" },
    { label: "Model", value: system.model || "—" },
    { label: "Serial Number", value: system.serial_number || "—" },
    {
      label: "Install Date",
      value: system.install_date
        ? new Date(system.install_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "—",
    },
    { label: "Location", value: system.location || "—" },
  ];

  return (
    <main>
      <section className="hero">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>{system.name}</h1>
          <span style={{
            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "3px 10px", borderRadius: 6,
            background: system.status === "active" ? "rgba(127,226,150,0.15)" : "rgba(255,255,255,0.07)",
            color: system.status === "active" ? "#7fe296" : "rgba(255,255,255,0.45)",
            border: system.status === "active" ? "1px solid rgba(127,226,150,0.3)" : "1px solid rgba(255,255,255,0.1)",
          }}>
            {system.status}
          </span>
        </div>
        <p>{CATEGORY_LABEL[system.category] ?? system.category}{system.location ? ` — ${system.location}` : ""}</p>
        <div className="subpage-nav">
          <Link href={`/workspace/${propertyId}/systems`} className="subpage-nav-home">Systems</Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${propertyId}`} className="subnav-pill">{propertyNickname || "Property"}</Link>
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
            <div style={{
              padding: "20px 22px", borderRadius: 12,
              border: "1px solid rgba(109,211,255,0.2)", background: "rgba(109,211,255,0.03)",
              display: "grid", gap: 18,
            }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6dd3ff" }}>
                Editing System Record
              </div>

              <div>
                <label style={labelStyle}>System Name <span style={{ color: "#ff8b8b" }}>*</span></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="e.g. Main HVAC" />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CATEGORIES.map((c) => (
                    <button key={c.value} type="button" onClick={() => setCategory(c.value)} style={{
                      padding: "6px 14px", borderRadius: 6, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                      background: category === c.value ? "rgba(109,211,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: category === c.value ? "1px solid rgba(109,211,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      color: category === c.value ? "#6dd3ff" : "rgba(255,255,255,0.6)", transition: "all 0.15s",
                    }}>{c.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Manufacturer</label>
                  <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="e.g. Trane, Rheem" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Model</label>
                  <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model number" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Serial Number</label>
                  <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Serial / unit number" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Install Date</label>
                  <input type="date" value={installDate} onChange={(e) => setInstallDate(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Garage mechanical wall" style={inputStyle} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SYSTEM_STATUSES.map((s) => (
                      <button key={s.value} type="button" onClick={() => setStatus(s.value)} style={{
                        padding: "6px 12px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                        background: status === s.value ? "rgba(127,226,150,0.15)" : "rgba(255,255,255,0.04)",
                        border: status === s.value ? "1px solid rgba(127,226,150,0.5)" : "1px solid rgba(255,255,255,0.1)",
                        color: status === s.value ? "#7fe296" : "rgba(255,255,255,0.55)", transition: "all 0.15s",
                      }}>{s.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Verification</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {VERIFICATIONS.map((v) => (
                      <button key={v.value} type="button" onClick={() => setVerification(v.value)} style={{
                        padding: "6px 12px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                        background: verification === v.value ? "rgba(245,190,103,0.15)" : "rgba(255,255,255,0.04)",
                        border: verification === v.value ? "1px solid rgba(245,190,103,0.5)" : "1px solid rgba(255,255,255,0.1)",
                        color: verification === v.value ? "#f5be67" : "rgba(255,255,255,0.55)", transition: "all 0.15s",
                      }}>{v.label}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  placeholder="Service history, known issues, access notes..."
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
              </div>
            </div>

            {error && (
              <div style={{
                padding: "12px 16px", borderRadius: 8, background: "rgba(255,139,139,0.12)",
                border: "1px solid rgba(255,139,139,0.3)", color: "#ff8b8b", fontSize: "0.875rem",
              }}>{error}</div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-primary" onClick={saveChanges} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="btn-secondary" onClick={cancelEdit} disabled={saving}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              <div style={{ padding: "14px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Status</div>
                <span style={{
                  fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                  color: system.status === "active" ? "#7fe296" : "rgba(255,255,255,0.4)",
                }}>{system.status}</span>
              </div>
              <div style={{ padding: "14px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Verification</div>
                <span style={{
                  fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                  color: system.verification === "verified" ? "#7fe296" : system.verification === "needs_review" ? "#f59e0b" : "rgba(255,255,255,0.4)",
                }}>{system.verification.replace("_", " ")}</span>
              </div>
            </div>

            <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
              {viewFields.map((field, i) => (
                <div key={field.label} style={{
                  display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, padding: "13px 20px",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", alignSelf: "center" }}>
                    {field.label}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: field.value === "—" ? "rgba(255,255,255,0.25)" : "#ecf3fb" }}>
                    {field.value}
                  </div>
                </div>
              ))}
            </div>

            {system.notes && (
              <div style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>Notes</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{system.notes}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <Link href={`/workspace/${propertyId}/systems`}>
                <button className="btn-secondary">Back to Systems</button>
              </Link>
              <button className="btn-primary" onClick={enterEdit}>Edit System</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

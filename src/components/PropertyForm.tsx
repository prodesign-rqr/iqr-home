"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type PropertyFormData = {
  nickname: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  parcel_apn: string;
  notes: string;
};

export default function PropertyForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyFormData>({
    nickname: "",
    street_address: "",
    city: "",
    state: "",
    zip: "",
    parcel_apn: "",
    notes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nickname.trim()) {
      setError("Property nickname is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data, error: dbError } = await supabase
      .from("properties")
      .insert({
        nickname: form.nickname.trim(),
        street_address: form.street_address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
        parcel_apn: form.parcel_apn.trim(),
        notes: form.notes.trim(),
        status: "draft",
      })
      .select()
      .single();

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    router.push(`/workspace/${data.id}`);
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
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="e.g. Desert Residence, Lake House"
            className="form-input"
            autoComplete="off"
          />
          <div className="form-hint">
            Used internally. Client name is held in the canonical record.
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Street Address</label>
          <input
            type="text"
            name="street_address"
            value={form.street_address}
            onChange={handleChange}
            placeholder="Physical address"
            className="form-input"
            autoComplete="off"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px", gap: 12 }}>
          <div className="form-row">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="AZ"
              className="form-input"
              maxLength={2}
            />
          </div>
          <div className="form-row">
            <label className="form-label">ZIP</label>
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="85255"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Parcel / APN</label>
          <input
            type="text"
            name="parcel_apn"
            value={form.parcel_apn}
            onChange={handleChange}
            placeholder="Assessor Parcel Number"
            className="form-input"
          />
          <div className="form-hint">
            The APN is the permanent anchor. Street addresses change; parcels don&apos;t.
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Initial Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Property type, occupancy notes, intake context..."
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
          {saving ? "Creating..." : "Create Property Record"}
        </button>
      </div>
    </form>
  );
}

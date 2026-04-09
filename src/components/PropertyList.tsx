"use client";

import Link from "next/link";
import type { Property } from "../lib/database.types";
import StatusBadge from "./StatusBadge";

type PropertyListProps = {
  properties: Property[];
};

export default function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div
        style={{
          padding: "48px 32px",
          textAlign: "center",
          border: "1px dashed rgba(255,255,255,0.12)",
          borderRadius: 12,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        <div style={{ fontSize: "1.1rem", marginBottom: 8, fontWeight: 600 }}>
          No properties yet
        </div>
        <div style={{ fontSize: "0.9rem" }}>
          Most houses are data-rich but memory-poor. Start a property record to change that.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/workspace/${property.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            className="property-list-item"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 16,
              padding: "18px 24px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              background: "rgba(255,255,255,0.025)",
              cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>
                {property.nickname || "Unnamed Property"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
                {[property.street_address, property.city, property.state].filter(Boolean).join(", ") || "Address not recorded"}
              </div>
              {property.parcel_apn && (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginTop: 2 }}>
                  APN: {property.parcel_apn}
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <StatusBadge status={property.status} size="sm" />
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
                {new Date(property.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

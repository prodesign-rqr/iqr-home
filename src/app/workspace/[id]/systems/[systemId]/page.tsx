import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import type { Property, System } from "../../../../../lib/database.types";
import StatusBadge from "../../../../../components/StatusBadge";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string; systemId: string }>;
};

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

export default async function SystemDetailPage({ params }: Props) {
  const { id, systemId } = await params;

  const [propertyRes, systemRes] = await Promise.all([
    supabase.from("properties").select("id, nickname").eq("id", id).maybeSingle(),
    supabase.from("systems").select("*").eq("id", systemId).eq("property_id", id).maybeSingle(),
  ]);

  const property = propertyRes.data as Pick<Property, "id" | "nickname"> | null;
  const system = systemRes.data as System | null;

  if (!property || !system) notFound();

  const fields = [
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
          <StatusBadge status={system.status} />
        </div>
        <p>
          {CATEGORY_LABEL[system.category] ?? system.category}
          {system.location ? ` — ${system.location}` : ""}
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}/systems`} className="subpage-nav-home">
            Systems
          </Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${id}`} className="subnav-pill">
              {property.nickname || "Property"}
            </Link>
          </div>
        </div>
      </section>

      <div style={{ padding: "0 24px 48px", display: "grid", gap: 24 }}>

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
          {fields.map((field, i) => (
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
          <Link href={`/workspace/${id}/systems`}>
            <button className="btn-secondary">Back to Systems</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

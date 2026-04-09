import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import type { Property, System } from "../../../../lib/database.types";
import StatusBadge from "../../../../components/StatusBadge";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
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

const VERIFICATION_COLOR: Record<string, string> = {
  verified: "#7fe296",
  unverified: "#6b7280",
  needs_review: "#f59e0b",
};

export default async function SystemsPage({ params }: Props) {
  const { id } = await params;

  const [propertyRes, systemsRes] = await Promise.all([
    supabase.from("properties").select("id, nickname, status").eq("id", id).maybeSingle(),
    supabase.from("systems").select("*").eq("property_id", id).order("category").order("name"),
  ]);

  const property = propertyRes.data as Pick<Property, "id" | "nickname" | "status"> | null;
  const systems = (systemsRes.data as System[] | null) ?? [];

  if (!property) notFound();

  const verifiedCount = systems.filter((s) => s.verification === "verified").length;
  const activeCount = systems.filter((s) => s.status === "active").length;

  const grouped = systems.reduce<Record<string, System[]>>((acc, sys) => {
    const key = sys.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(sys);
    return acc;
  }, {});

  return (
    <main>
      <section className="hero">
        <h1>Systems</h1>
        <p>
          {property.nickname || "Property"} — Major systems, appliances, and infrastructure.
          Each record anchors to the property and becomes part of the permanent memory.
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}`} className="subpage-nav-home">
            {property.nickname || "Property"}
          </Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${id}/systems/new`} className="subnav-pill">
              + Add System
            </Link>
            <Link href={`/workspace/${id}/qr-tags`} className="subnav-pill">
              QR Tag Plan
            </Link>
          </div>
        </div>
      </section>

      <div style={{ padding: "0 24px 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {[
            { label: "Total Systems", value: systems.length },
            { label: "Verified", value: verifiedCount },
            { label: "Active", value: activeCount },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "16px 20px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ecf3fb", letterSpacing: "-0.03em" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {systems.length === 0 ? (
          <div
            style={{
              padding: "56px 32px",
              textAlign: "center",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: 14,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>
              No systems recorded yet
            </div>
            <div style={{ fontSize: "0.875rem", marginBottom: 20 }}>
              Systems are the mechanical and infrastructure backbone of the property record.
              HVAC, water heaters, appliances, network — every major system belongs here.
            </div>
            <Link href={`/workspace/${id}/systems/new`}>
              <button className="btn-primary">Add First System</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 24 }}>
            {Object.entries(grouped).map(([category, catSystems]) => (
              <div key={category}>
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
                  {CATEGORY_LABEL[category] ?? category} ({catSystems.length})
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {catSystems.map((sys) => (
                    <Link
                      key={sys.id}
                      href={`/workspace/${id}/systems/${sys.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          padding: "16px 20px",
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.025)",
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: 16,
                          alignItems: "center",
                          cursor: "pointer",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        className="property-list-item"
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 3 }}>
                            {sys.name}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                            {[sys.manufacturer, sys.model].filter(Boolean).join(" ") || "No make/model recorded"}
                          </div>
                          {sys.location && (
                            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
                              {sys.location}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                          <StatusBadge status={sys.status} size="sm" />
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              color: VERIFICATION_COLOR[sys.verification] ?? "#6b7280",
                            }}
                          >
                            {sys.verification.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Link href={`/workspace/${id}/systems/new`}>
            <button className="btn-primary">+ Add System</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

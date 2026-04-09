import Link from "next/link";
import { supabase } from "../../lib/supabase";
import type { Property } from "../../lib/database.types";
import PropertyList from "../../components/PropertyList";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const { data: propertiesData } = await supabase
    .from("properties")
    .select("*")
    .order("updated_at", { ascending: false });

  const list = (propertiesData as Property[] | null) ?? [];
  const active = list.filter((p) => p.status === "active").length;
  const draft = list.filter((p) => p.status === "draft").length;

  return (
    <main>
      <section className="hero">
        <h1>Partner Workspace</h1>
        <p>
          Most houses are data-rich but memory-poor. Each property record here is a structured,
          spatially anchored memory of the house. The property is the permanent center of gravity.
        </p>
        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">
            Home
          </Link>
          <div className="subpage-nav-links">
            <Link href="/workspace/new" className="subnav-pill">
              + New Property
            </Link>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 32,
          padding: "0 24px",
        }}
      >
        {[
          { label: "Total Properties", value: list.length },
          { label: "Active Records", value: active },
          { label: "In Draft", value: draft },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: "20px 24px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#ecf3fb",
                letterSpacing: "-0.03em",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 4,
            }}
          >
            Property Records
          </div>
        </div>
        <Link href="/workspace/new">
          <button className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.875rem" }}>
            + New Property
          </button>
        </Link>
      </div>

      <div style={{ padding: "0 24px 48px" }}>
        <PropertyList properties={list} />
      </div>

      <div
        style={{
          padding: "32px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {[
          { label: "Systems", href: "/systems", note: "Planned" },
          { label: "QR Tags", href: "/qr-tags", note: "Planned" },
          { label: "Floor Plans", href: "/floor-plans", note: "Planned" },
          { label: "Integrity", href: "/integrity", note: "Available" },
          { label: "Timeline", href: "/service-events", note: "Available" },
          { label: "Documents", href: "/documents", note: "Planned" },
        ].map((mod) => (
          <div
            key={mod.label}
            style={{
              padding: "16px 18px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.015)",
              opacity: mod.note === "Planned" ? 0.5 : 1,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 3 }}>
              {mod.label}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{mod.note}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import type { Property, Room, System } from "../../../../lib/database.types";
import CompanyCamIntakeWrapper from "../../../../components/companycam/CompanyCamIntakeWrapper";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CompanyCamIntakePage({ params }: Props) {
  const { id } = await params;

  const { data: propertyData } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const property = propertyData as Property | null;
  if (!property) notFound();

  const { data: roomsData } = await supabase
    .from("rooms")
    .select("*")
    .eq("property_id", id)
    .order("name", { ascending: true });

  const { data: systemsData } = await supabase
    .from("systems")
    .select("*")
    .eq("property_id", id)
    .order("name", { ascending: true });

  const { data: batchesData } = await supabase
    .from("import_batches")
    .select("*")
    .eq("property_id", id)
    .order("imported_at", { ascending: false });

  const rooms = (roomsData as Room[] | null) ?? [];
  const systems = (systemsData as System[] | null) ?? [];
  const batches = batchesData ?? [];

  return (
    <main>
      <section className="hero">
        <h1>CompanyCam Intake</h1>
        <p>
          {[property.street_address, property.city, property.state]
            .filter(Boolean)
            .join(", ") || property.nickname || "Property"}
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}`} className="subpage-nav-home">
            ← Workspace
          </Link>
        </div>
      </section>

      <div style={{ padding: "0 24px", maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            border: "1px solid rgba(109,211,255,0.12)",
            background: "rgba(109,211,255,0.03)",
            marginBottom: 28,
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.6,
          }}
        >
          CompanyCam is a source, not the record. Each imported photo becomes a structured IQR photo
          record linked to this property. You control how each photo is scoped and assigned.
        </div>

        {batches.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 12,
              }}
            >
              Import History ({batches.length})
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.015)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#ecf3fb", marginBottom: 2 }}>
                      {batch.companycam_project_name || batch.companycam_project_id}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
                      {new Date(batch.imported_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {batch.notes ? ` — ${batch.notes}` : ""}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#7fe296",
                      padding: "3px 10px",
                      borderRadius: 8,
                      background: "rgba(127,226,150,0.08)",
                      border: "1px solid rgba(127,226,150,0.15)",
                    }}
                  >
                    {batch.photo_count} photos
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
                    {String(batch.id).slice(-8)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 16,
          }}
        >
          New Import Session
        </div>

        <CompanyCamIntakeWrapper
          propertyId={id}
          rooms={rooms}
          systems={systems}
        />
      </div>
    </main>
  );
}

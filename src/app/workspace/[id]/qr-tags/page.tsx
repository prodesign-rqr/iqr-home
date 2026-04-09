import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import type { Property, Floor, Room, System } from "../../../../lib/database.types";
import StatusBadge from "../../../../components/StatusBadge";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

const AREA_TYPE_LABEL: Record<string, string> = {
  room: "Room",
  zone: "Zone",
  exterior: "Exterior",
  mechanical: "Mechanical",
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

export default async function QrTagPlanPage({ params }: Props) {
  const { id } = await params;

  const [propertyRes, floorsRes, roomsRes, systemsRes] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).maybeSingle(),
    supabase.from("floors").select("*").eq("property_id", id).order("level_order", { ascending: true }),
    supabase.from("rooms").select("*").eq("property_id", id).order("created_at", { ascending: true }),
    supabase.from("systems").select("*").eq("property_id", id).order("category").order("name"),
  ]);

  const property = propertyRes.data as Property | null;
  const floors = (floorsRes.data as Floor[] | null) ?? [];
  const rooms = (roomsRes.data as Room[] | null) ?? [];
  const systems = (systemsRes.data as System[] | null) ?? [];

  if (!property) notFound();

  const totalTags = rooms.length + systems.length;
  const tagIndex: Array<{
    tagNum: number;
    type: "room" | "system";
    label: string;
    sublabel: string;
    status: string;
    id: string;
  }> = [];

  let tagNum = 1;
  for (const room of rooms) {
    const floor = floors.find((f) => f.id === room.floor_id);
    tagIndex.push({
      tagNum: tagNum++,
      type: "room",
      label: room.name,
      sublabel: `${AREA_TYPE_LABEL[room.area_type] ?? room.area_type}${floor ? ` — ${floor.label}` : ""}`,
      status: room.status,
      id: room.id,
    });
  }
  for (const sys of systems) {
    tagIndex.push({
      tagNum: tagNum++,
      type: "system",
      label: sys.name,
      sublabel: `${CATEGORY_LABEL[sys.category] ?? sys.category}${sys.location ? ` — ${sys.location}` : ""}`,
      status: sys.status,
      id: sys.id,
    });
  }

  return (
    <main>
      <section className="hero">
        <h1>QR Tag Plan</h1>
        <p>
          {property.nickname || "Property"} — Every room and system gets a tag. This is the
          physical anchor layer that connects the house to its record. Tags are assigned in
          walkthrough order.
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}`} className="subpage-nav-home">
            {property.nickname || "Property"}
          </Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${id}/systems`} className="subnav-pill">
              Systems
            </Link>
            <Link href={`/workspace/${id}/add-room`} className="subnav-pill">
              + Add Room
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
            { label: "Total Tags", value: totalTags },
            { label: "Room Tags", value: rooms.length },
            { label: "System Tags", value: systems.length },
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

        {totalTags === 0 ? (
          <div
            style={{
              padding: "56px 32px",
              textAlign: "center",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: 14,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 8 }}>
              No rooms or systems yet
            </div>
            <div style={{ fontSize: "0.875rem", marginBottom: 20 }}>
              Add rooms and systems to generate the QR tag plan. Tags are assigned automatically
              in walkthrough order.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={`/workspace/${id}/add-room`}>
                <button className="btn-primary">Add Room</button>
              </Link>
              <Link href={`/workspace/${id}/systems/new`}>
                <button className="btn-secondary">Add System</button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                padding: "12px 20px",
                borderRadius: 8,
                background: "rgba(109,211,255,0.06)",
                border: "1px solid rgba(109,211,255,0.2)",
                marginBottom: 20,
                fontSize: "0.82rem",
                color: "rgba(109,211,255,0.8)",
                lineHeight: 1.5,
              }}
            >
              This is the field install plan. Tag numbers are assigned in order: rooms first (walkthrough sequence),
              then systems. Print this list and work room-by-room.
            </div>

            <div
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: 16,
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.04)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                  Tag #
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                  Location / System
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                  Status
                </div>
              </div>
              {tagIndex.map((tag, i) => (
                <div
                  key={tag.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr auto",
                    gap: 16,
                    padding: "14px 20px",
                    alignItems: "center",
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    background: tag.type === "system" ? "rgba(245,190,103,0.02)" : "transparent",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: tag.type === "room" ? "#6dd3ff" : "#f5be67",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(tag.tagNum).padStart(2, "0")}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 2 }}>
                      {tag.label}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
                      {tag.sublabel}
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: tag.type === "room" ? "rgba(109,211,255,0.5)" : "rgba(245,190,103,0.5)",
                        }}
                      >
                        {tag.type}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={tag.status} size="sm" />
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                padding: "16px 20px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.01)",
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.6,
              }}
            >
              QR tag generation, label printing, and physical tag assignment will be available
              in a future release. This plan is the structured source of truth for the field install.
            </div>
          </>
        )}
      </div>
    </main>
  );
}

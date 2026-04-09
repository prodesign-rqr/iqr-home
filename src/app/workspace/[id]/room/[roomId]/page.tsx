import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import type { Room, Floor, Property } from "../../../../../lib/database.types";
import StatusBadge from "../../../../../components/StatusBadge";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string; roomId: string }>;
};

const AREA_TYPE_LABEL: Record<string, string> = {
  room: "Room",
  zone: "Zone",
  exterior: "Exterior Area",
  mechanical: "Mechanical Space",
};

export default async function RoomDetailPage({ params }: Props) {
  const { id, roomId } = await params;

  const [propertyRes, roomRes, floorsRes] = await Promise.all([
    supabase.from("properties").select("id, nickname, status").eq("id", id).maybeSingle(),
    supabase.from("rooms").select("*").eq("id", roomId).eq("property_id", id).maybeSingle(),
    supabase.from("floors").select("*").eq("property_id", id).order("level_order", { ascending: true }),
  ]);

  const property = propertyRes.data as Pick<Property, "id" | "nickname" | "status"> | null;
  const room = roomRes.data as Room | null;
  const floors = (floorsRes.data as Floor[] | null) ?? [];

  if (!property || !room) notFound();

  const floor = floors.find((f) => f.id === room.floor_id);

  const sessionRes = await supabase
    .from("walkthrough_sessions")
    .select("id, status, started_at, closed_rooms, total_rooms")
    .eq("property_id", id)
    .order("created_at", { ascending: false });

  const sessions = (sessionRes.data as Array<{
    id: string;
    status: string;
    started_at: string;
    closed_rooms: number;
    total_rooms: number;
  }> | null) ?? [];

  return (
    <main>
      <section className="hero">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>{room.name}</h1>
          <StatusBadge status={room.status} />
        </div>
        <p>
          {floor?.label ?? "No floor assigned"} — {AREA_TYPE_LABEL[room.area_type] ?? room.area_type}
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}`} className="subpage-nav-home">
            {property.nickname || "Property"}
          </Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${id}/room/${roomId}/edit`} className="subnav-pill">
              Edit Room
            </Link>
            <Link href={`/workspace/${id}/systems`} className="subnav-pill">
              Systems
            </Link>
          </div>
        </div>
      </section>

      <div style={{ padding: "0 24px 48px", display: "grid", gap: 24 }}>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {[
            { label: "Status", value: <StatusBadge status={room.status} /> },
            {
              label: "Closed",
              value: room.closed_at
                ? new Date(room.closed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—",
            },
            {
              label: "Added",
              value: new Date(room.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            },
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
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ecf3fb", marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {room.notes && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
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
              Field Notes
            </div>
            <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              {room.notes}
            </div>
          </div>
        )}

        <div
          style={{
            padding: "20px 24px",
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
              marginBottom: 16,
            }}
          >
            Walkthrough History
          </div>
          {sessions.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem" }}>
              No walkthrough sessions on this property yet.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {sessions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 14,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      {new Date(s.started_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                      {s.closed_rooms} of {s.total_rooms} rooms closed
                    </div>
                  </div>
                  <StatusBadge status={s.status} size="sm" />
                  {(s.status === "active" || s.status === "paused") && (
                    <Link href={`/workspace/${id}/walkthrough/${s.id}`}>
                      <button className="btn-secondary" style={{ padding: "5px 12px", fontSize: "0.78rem" }}>
                        Resume
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
          }}
        >
          {[
            { label: "Systems", note: "Attach systems to this room", href: `/workspace/${id}/systems` },
            { label: "QR Tag", note: "Planned", href: null },
            { label: "Documents", note: "Planned", href: null },
            { label: "Finishes", note: "Planned", href: null },
          ].map((mod) => (
            <div
              key={mod.label}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.01)",
                opacity: mod.href ? 1 : 0.45,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: 3 }}>
                {mod.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{mod.note}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href={`/workspace/${id}/room/${roomId}/edit`}>
            <button className="btn-primary">Edit Room</button>
          </Link>
          <Link href={`/workspace/${id}`}>
            <button className="btn-secondary">Back to Property</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

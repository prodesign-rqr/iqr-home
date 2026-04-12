import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import type { Property, Floor, Room, WalkthroughSession, EntryNode, ServiceEntryEvent } from "../../../lib/database.types";
import StatusBadge from "../../../components/StatusBadge";
import ServiceEntrySection from "../../../components/ServiceEntrySection";
import type { ServiceEntryNodeRecord, ServiceEntryEventRecord } from "../../../lib/schema";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PropertyWorkspacePage({ params }: Props) {
  const { id } = await params;

  const { data: propertyData } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const property = propertyData as Property | null;
  if (!property) notFound();

  const { data: floorsData } = await supabase
    .from("floors")
    .select("*")
    .eq("property_id", id)
    .order("level_order", { ascending: true });

  const { data: roomsData } = await supabase
    .from("rooms")
    .select("*")
    .eq("property_id", id)
    .order("created_at", { ascending: true });

  const { data: sessionsData } = await supabase
    .from("walkthrough_sessions")
    .select("*")
    .eq("property_id", id)
    .order("created_at", { ascending: false });

  const { data: entryNodesData } = await supabase
    .from("entry_nodes")
    .select("*")
    .eq("property_id", id)
    .order("created_at", { ascending: true });

  const { data: serviceEntryEventsData } = await supabase
    .from("service_entry_events")
    .select("*")
    .eq("property_id", id)
    .order("timestamp", { ascending: false });

  const floorList = (floorsData as Floor[] | null) ?? [];
  const roomList = (roomsData as Room[] | null) ?? [];
  const sessionList = (sessionsData as WalkthroughSession[] | null) ?? [];
  const entryNodeList = (entryNodesData as EntryNode[] | null) ?? [];
  const serviceEntryEventList = (serviceEntryEventsData as ServiceEntryEvent[] | null) ?? [];

  const entryNodesForSection: ServiceEntryNodeRecord[] = entryNodeList.map((n) => ({
    id: n.id,
    propertyId: n.property_id,
    label: n.label,
    entryType: n.entry_type,
    locationDescription: n.location_description,
    isPrimaryServiceEntry: n.is_primary_service_entry,
    qrEnabled: n.qr_enabled,
    serviceEntryEnabled: n.service_entry_enabled,
    lockPlannedType: n.lock_planned_type ?? undefined,
    lockPlannedBrand: n.lock_planned_brand,
    middlewarePlannedType: n.middleware_planned_type ?? undefined,
    integrationStatus: n.integration_status,
    notes: n.notes,
  }));

  const serviceEntryEventsForSection: ServiceEntryEventRecord[] = serviceEntryEventList.map((e) => ({
    id: e.id,
    propertyId: e.property_id,
    entryNodeId: e.entry_node_id,
    timestamp: e.timestamp,
    actorRole: e.actor_role,
    workflowType: "QR Service Entry",
    result: e.result,
    linkedVisitId: e.linked_visit_id ?? undefined,
    source: e.source,
    notes: e.notes,
  }));
  const activeSession = sessionList.find(
    (s) => s.status === "active" || s.status === "paused"
  );

  const closedRooms = roomList.filter((r) => r.status === "closed").length;

  return (
    <main>
      <section className="hero">
        <h1>{property.nickname || "Unnamed Property"}</h1>
        <p>
          {[property.street_address, property.city, property.state, property.zip]
            .filter(Boolean)
            .join(", ") || "Address not recorded"}
        </p>
        <div className="subpage-nav">
          <Link href="/workspace" className="subpage-nav-home">
            Workspace
          </Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${id}/edit`} className="subnav-pill">
              Edit Property
            </Link>
            <Link href={`/workspace/${id}/systems`} className="subnav-pill">
              Systems
            </Link>
            <Link href={`/workspace/${id}/add-floor`} className="subnav-pill">
              + Add Floor
            </Link>
            <Link href={`/workspace/${id}/add-room`} className="subnav-pill">
              + Add Room
            </Link>
            <Link href={`/workspace/${id}/companycam`} className="subnav-pill">
              CompanyCam Intake
            </Link>
            {activeSession ? (
              <Link href={`/workspace/${id}/walkthrough/${activeSession.id}`} className="subnav-pill">
                Resume Walkthrough
              </Link>
            ) : (
              <Link href={`/workspace/${id}/walkthrough/new`} className="subnav-pill">
                Start Walkthrough
              </Link>
            )}
          </div>
        </div>
      </section>

      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {[
            { label: "Status", value: <StatusBadge status={property.status} /> },
            { label: "Floors", value: floorList.length },
            { label: "Rooms", value: roomList.length },
            { label: "Rooms Closed", value: `${closedRooms} / ${roomList.length}` },
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
              <div
                style={{
                  fontSize: typeof stat.value === "number" || typeof stat.value === "string" ? "1.6rem" : "1rem",
                  fontWeight: 800,
                  color: "#ecf3fb",
                  letterSpacing: "-0.02em",
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {activeSession && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 12,
              border: "1px solid rgba(109,211,255,0.3)",
              background: "rgba(109,211,255,0.05)",
              marginBottom: 24,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                Walkthrough {activeSession.status === "paused" ? "Paused" : "In Progress"}
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                {activeSession.closed_rooms} of {activeSession.total_rooms} rooms closed
              </div>
            </div>
            <Link href={`/workspace/${id}/walkthrough/${activeSession.id}`}>
              <button className="btn-primary">Resume Walkthrough</button>
            </Link>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 12,
              }}
            >
              Floors ({floorList.length})
            </div>
            {floorList.length === 0 ? (
              <div
                style={{
                  padding: "24px 20px",
                  borderRadius: 10,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.875rem",
                }}
              >
                No floors yet.{" "}
                <Link href={`/workspace/${id}/add-floor`} style={{ color: "#6dd3ff" }}>
                  Add a floor
                </Link>{" "}
                to structure the walkthrough.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {floorList.map((floor) => {
                  const floorRooms = roomList.filter((r) => r.floor_id === floor.id);
                  const floorClosed = floorRooms.filter((r) => r.status === "closed").length;
                  return (
                    <div
                      key={floor.id}
                      style={{
                        padding: "14px 18px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.025)",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 2 }}>
                          {floor.label}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>
                          Level {floor.level_order} — {floorRooms.length} room
                          {floorRooms.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                        {floorClosed}/{floorRooms.length} closed
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <Link href={`/workspace/${id}/add-floor`}>
                <button className="btn-secondary" style={{ width: "100%", padding: "10px" }}>
                  + Add Floor
                </button>
              </Link>
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 12,
              }}
            >
              Rooms ({roomList.length})
            </div>
            {roomList.length === 0 ? (
              <div
                style={{
                  padding: "24px 20px",
                  borderRadius: 10,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.875rem",
                }}
              >
                No rooms yet.{" "}
                <Link href={`/workspace/${id}/add-room`} style={{ color: "#6dd3ff" }}>
                  Add rooms
                </Link>{" "}
                to enable the walkthrough flow.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {roomList.map((room) => {
                  const floor = floorList.find((f) => f.id === room.floor_id);
                  return (
                    <Link
                      key={room.id}
                      href={`/workspace/${id}/room/${room.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: 10,
                          border:
                            room.status === "closed"
                              ? "1px solid rgba(127,226,150,0.2)"
                              : "1px solid rgba(255,255,255,0.07)",
                          background:
                            room.status === "closed"
                              ? "rgba(127,226,150,0.03)"
                              : "rgba(255,255,255,0.02)",
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          transition: "border-color 0.15s ease",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.88rem",
                              color: room.status === "closed" ? "rgba(255,255,255,0.45)" : "#ecf3fb",
                              textDecoration: room.status === "closed" ? "line-through" : "none",
                              marginBottom: 2,
                            }}
                          >
                            {room.name}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.28)" }}>
                            {floor?.label ?? "No floor"} — {room.area_type}
                          </div>
                        </div>
                        <StatusBadge status={room.status} size="sm" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <Link href={`/workspace/${id}/add-room`}>
                <button className="btn-secondary" style={{ width: "100%", padding: "10px" }}>
                  + Add Room
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.015)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 14,
            }}
          >
            Walkthrough Sessions ({sessionList.length})
          </div>
          {sessionList.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem" }}>
              No walkthrough sessions yet. Start a session to begin the room-by-room commissioning
              walk.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {sessionList.map((session) => (
                <div
                  key={session.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 2 }}>
                      Session —{" "}
                      {new Date(session.started_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>
                      {session.closed_rooms} of {session.total_rooms} rooms closed
                    </div>
                  </div>
                  <StatusBadge status={session.status} size="sm" />
                  {(session.status === "active" || session.status === "paused") && (
                    <Link href={`/workspace/${id}/walkthrough/${session.id}`}>
                      <button
                        className="btn-secondary"
                        style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                      >
                        Resume
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
          {roomList.length > 0 && !activeSession && (
            <div style={{ marginTop: 16 }}>
              <Link href={`/workspace/${id}/walkthrough/new`}>
                <button className="btn-primary">Start Walkthrough Session</button>
              </Link>
            </div>
          )}
        </div>

        {property.parcel_apn && (
          <div style={{ padding: "0 0 8px", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>
            APN: {property.parcel_apn}
          </div>
        )}
        {property.notes && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.01)",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.875rem",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            {property.notes}
          </div>
        )}
      </div>

      <div style={{ padding: "0 24px" }}>
        <ServiceEntrySection
          entryNodes={entryNodesForSection}
          events={serviceEntryEventsForSection}
        />
      </div>

      <div
        style={{
          padding: "24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
          marginTop: 24,
        }}
      >
        {[
          { label: "Systems", href: `/workspace/${id}/systems`, note: "Available" },
          { label: "QR Tags", href: `/workspace/${id}/qr-tags`, note: "Available" },
          { label: "CompanyCam Intake", href: `/workspace/${id}/companycam`, note: "Available" },
          { label: "Floor Plans", note: "Planned" },
          { label: "Integrity", href: "/integrity", note: "Available" },
          { label: "Timeline", href: "/service-events", note: "Available" },
          { label: "Documents", note: "Planned" },
        ].map((mod) =>
          mod.href ? (
            <Link key={mod.label} href={mod.href} style={{ textDecoration: "none", color: "inherit" }}>
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                  opacity: 0.85,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 2 }}>
                  {mod.label}
                </div>
                <div style={{ fontSize: "0.72rem", color: "rgba(109,211,255,0.5)" }}>{mod.note}</div>
              </div>
            </Link>
          ) : (
            <div
              key={mod.label}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.05)",
                opacity: 0.35,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 2 }}>
                {mod.label}
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>{mod.note}</div>
            </div>
          )
        )}
      </div>
    </main>
  );
}

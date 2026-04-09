import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import type { Property, Room, WalkthroughSession } from "../../../../../lib/database.types";
import WalkthroughUI from "../../../../../components/WalkthroughUI";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string; sessionId: string }>;
};

export default async function WalkthroughPage({ params }: Props) {
  const { id, sessionId } = await params;

  const { data: propertyData } = await supabase
    .from("properties")
    .select("id, nickname")
    .eq("id", id)
    .maybeSingle();

  const property = propertyData as Pick<Property, "id" | "nickname"> | null;
  if (!property) notFound();

  const { data: sessionData } = await supabase
    .from("walkthrough_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("property_id", id)
    .maybeSingle();

  const session = sessionData as WalkthroughSession | null;
  if (!session) notFound();

  const { data: roomsData } = await supabase
    .from("rooms")
    .select("*")
    .eq("property_id", id)
    .order("created_at", { ascending: true });

  const roomList = (roomsData as Room[] | null) ?? [];

  if (session.status === "paused") {
    await supabase
      .from("walkthrough_sessions")
      .update({ status: "active", resumed_at: new Date().toISOString() })
      .eq("id", sessionId);

    session.status = "active";
  }

  const closedCount = roomList.filter((r) => r.status === "closed").length;

  return (
    <main>
      <section className="hero">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 16,
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
            <h1 style={{ margin: "0 0 8px" }}>Walkthrough Session</h1>
            <p style={{ margin: 0 }}>
              {property.nickname || "Property"} — This is a capture event, not a demo.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#6dd3ff",
                letterSpacing: "-0.03em",
              }}
            >
              {closedCount}/{roomList.length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
              rooms closed
            </div>
          </div>
        </div>
        <div className="subpage-nav" style={{ marginTop: 16 }}>
          <Link href={`/workspace/${id}`} className="subpage-nav-home">
            {property.nickname || "Property Workspace"}
          </Link>
          <div className="subpage-nav-links">
            <Link href="/workspace" className="subnav-pill">
              All Properties
            </Link>
          </div>
        </div>
      </section>

      <div style={{ padding: "0 24px 48px" }}>
        <WalkthroughUI
          session={session}
          rooms={roomList}
          propertyId={id}
          propertyNickname={property.nickname || "Property"}
        />
      </div>
    </main>
  );
}

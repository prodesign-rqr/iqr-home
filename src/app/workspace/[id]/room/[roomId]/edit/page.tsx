import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../../../lib/supabase";
import type { Room, Floor, Property } from "../../../../../../lib/database.types";
import RoomEditForm from "../../../../../../components/RoomEditForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string; roomId: string }>;
};

export default async function RoomEditPage({ params }: Props) {
  const { id, roomId } = await params;

  const [propertyRes, roomRes, floorsRes] = await Promise.all([
    supabase.from("properties").select("id, nickname").eq("id", id).maybeSingle(),
    supabase.from("rooms").select("*").eq("id", roomId).eq("property_id", id).maybeSingle(),
    supabase.from("floors").select("*").eq("property_id", id).order("level_order", { ascending: true }),
  ]);

  const property = propertyRes.data as Pick<Property, "id" | "nickname"> | null;
  const room = roomRes.data as Room | null;
  const floors = (floorsRes.data as Floor[] | null) ?? [];

  if (!property || !room) notFound();

  return (
    <main>
      <section className="hero">
        <h1>Edit Room</h1>
        <p>{room.name} — {property.nickname || "Property"}</p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}/room/${roomId}`} className="subpage-nav-home">
            {room.name}
          </Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${id}`} className="subnav-pill">
              {property.nickname || "Property"}
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 48px" }}>
        <RoomEditForm room={room} floors={floors} />
      </div>
    </main>
  );
}

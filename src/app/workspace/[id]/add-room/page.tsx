import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import type { Property, Floor } from "../../../../lib/database.types";
import RoomForm from "../../../../components/RoomForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AddRoomPage({ params }: Props) {
  const { id } = await params;

  const { data: propertyData } = await supabase
    .from("properties")
    .select("id, nickname")
    .eq("id", id)
    .maybeSingle();

  const property = propertyData as Pick<Property, "id" | "nickname"> | null;
  if (!property) notFound();

  const { data: floorsData } = await supabase
    .from("floors")
    .select("*")
    .eq("property_id", id)
    .order("level_order", { ascending: true });

  const floorList = (floorsData as Floor[] | null) ?? [];

  return (
    <main>
      <section className="hero">
        <h1>Add Room</h1>
        <p>
          Rooms are the granular unit of a walkthrough. A room must have a primary name before
          it can be explicitly closed. Every room is a capture point.
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}`} className="subpage-nav-home">
            {property.nickname || "Property Workspace"}
          </Link>
        </div>
      </section>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 48px" }}>
        <RoomForm propertyId={id} floors={floorList} defaultFloorId={floorList[0]?.id} />
      </div>
    </main>
  );
}

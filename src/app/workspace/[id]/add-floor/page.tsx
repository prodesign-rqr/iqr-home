import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import type { Property } from "../../../../lib/database.types";
import FloorForm from "../../../../components/FloorForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AddFloorPage({ params }: Props) {
  const { id } = await params;

  const { data: propertyData } = await supabase
    .from("properties")
    .select("id, nickname")
    .eq("id", id)
    .maybeSingle();

  const property = propertyData as Pick<Property, "id" | "nickname"> | null;
  if (!property) notFound();

  return (
    <main>
      <section className="hero">
        <h1>Add Floor</h1>
        <p>
          Floors structure the spatial walkthrough. Each floor becomes a navigation layer that
          rooms are anchored to.
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}`} className="subpage-nav-home">
            {property.nickname || "Property Workspace"}
          </Link>
        </div>
      </section>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 48px" }}>
        <FloorForm propertyId={id} />
      </div>
    </main>
  );
}

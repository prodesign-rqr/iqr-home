import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import type { Property } from "../../../../lib/database.types";
import PropertyEditForm from "../../../../components/PropertyEditForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PropertyEditPage({ params }: Props) {
  const { id } = await params;

  const { data: propertyData } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const property = propertyData as Property | null;
  if (!property) notFound();

  return (
    <main>
      <section className="hero">
        <h1>Edit Property</h1>
        <p>{property.nickname || "Unnamed Property"} — Update record details, address, and status.</p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}`} className="subpage-nav-home">
            {property.nickname || "Property Workspace"}
          </Link>
        </div>
      </section>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 48px" }}>
        <PropertyEditForm property={property} />
      </div>
    </main>
  );
}

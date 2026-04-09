import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import type { Property } from "../../../../../lib/database.types";
import SystemForm from "../../../../../components/SystemForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewSystemPage({ params }: Props) {
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
        <h1>Add System</h1>
        <p>
          Systems are the mechanical and infrastructure backbone of the property record.
          Every entry here becomes a permanent, spatially anchored record.
        </p>
        <div className="subpage-nav">
          <Link href={`/workspace/${id}/systems`} className="subpage-nav-home">
            Systems
          </Link>
          <div className="subpage-nav-links">
            <Link href={`/workspace/${id}`} className="subnav-pill">
              {property.nickname || "Property"}
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 48px" }}>
        <SystemForm propertyId={id} />
      </div>
    </main>
  );
}

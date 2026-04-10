import { notFound } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import type { Property, System } from "../../../../../lib/database.types";
import SystemDetailClient from "../../../../../components/SystemDetailClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string; systemId: string }>;
};

export default async function SystemDetailPage({ params }: Props) {
  const { id, systemId } = await params;

  const [propertyRes, systemRes] = await Promise.all([
    supabase.from("properties").select("id, nickname").eq("id", id).maybeSingle(),
    supabase.from("systems").select("*").eq("id", systemId).eq("property_id", id).maybeSingle(),
  ]);

  const property = propertyRes.data as Pick<Property, "id" | "nickname"> | null;
  const system = systemRes.data as System | null;

  if (!property || !system) notFound();

  return (
    <SystemDetailClient
      system={system}
      propertyId={id}
      propertyNickname={property.nickname}
    />
  );
}

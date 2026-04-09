import { redirect, notFound } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import type { WalkthroughSession } from "../../../../../lib/database.types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewWalkthroughPage({ params }: Props) {
  const { id } = await params;

  const { data: propertyData } = await supabase
    .from("properties")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  const property = propertyData as { id: string } | null;
  if (!property) notFound();

  const { data: roomsData } = await supabase
    .from("rooms")
    .select("id, status")
    .eq("property_id", id)
    .order("created_at", { ascending: true });

  const roomList = (roomsData as Array<{ id: string; status: string }> | null) ?? [];

  if (roomList.length === 0) {
    redirect(`/workspace/${id}`);
  }

  const pendingRooms = roomList.filter((r) => r.status !== "closed");
  const firstRoom = pendingRooms[0] ?? roomList[0];

  const { data: sessionData, error } = await supabase
    .from("walkthrough_sessions")
    .insert({
      property_id: id,
      status: "active" as const,
      current_room_id: firstRoom.id,
      total_rooms: roomList.length,
      closed_rooms: roomList.filter((r) => r.status === "closed").length,
    })
    .select()
    .single();

  const session = sessionData as WalkthroughSession | null;

  if (error || !session) {
    redirect(`/workspace/${id}`);
  }

  redirect(`/workspace/${id}/walkthrough/${session.id}`);
}

"use client";

import { useRouter } from "next/navigation";
import CompanyCamIntake from "./CompanyCamIntake";
import type { Room, System } from "../../lib/database.types";

interface Props {
  propertyId: string;
  rooms: Room[];
  systems: System[];
}

export default function CompanyCamIntakeWrapper({ propertyId, rooms, systems }: Props) {
  const router = useRouter();

  return (
    <CompanyCamIntake
      propertyId={propertyId}
      rooms={rooms}
      systems={systems}
      onImportComplete={() => router.refresh()}
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import CompanyCamIntake from "./CompanyCamIntake";
import type { Room, System } from "../../lib/database.types";

interface Props {
  propertyId: string;
  rooms: Room[];
  systems: System[];
  existingProjectId?: string | null;
  existingProjectName?: string | null;
}

export default function CompanyCamIntakeWrapper({
  propertyId,
  rooms,
  systems,
  existingProjectId = null,
  existingProjectName = null,
}: Props) {
  const router = useRouter();

  const handleImportComplete = () => {
    router.refresh();
  };

  return (
    <CompanyCamIntake
      propertyId={propertyId}
      rooms={rooms}
      systems={systems}
      existingProjectId={existingProjectId}
      existingProjectName={existingProjectName}
      onImportComplete={handleImportComplete}
    />
  );
}

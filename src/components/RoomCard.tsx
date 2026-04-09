"use client";

import type { Room } from "../lib/database.types";
import StatusBadge from "./StatusBadge";

type RoomCardProps = {
  room: Room;
  isCurrent: boolean;
  isCompleted: boolean;
};

const areaTypeLabel: Record<string, string> = {
  room: "Room",
  zone: "Zone",
  exterior: "Exterior",
  mechanical: "Mechanical",
};

export default function RoomCard({ room, isCurrent, isCompleted }: RoomCardProps) {
  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 10,
        border: isCurrent
          ? "1px solid rgba(109,211,255,0.4)"
          : isCompleted
          ? "1px solid rgba(127,226,150,0.25)"
          : "1px solid rgba(255,255,255,0.08)",
        background: isCurrent
          ? "rgba(109,211,255,0.07)"
          : isCompleted
          ? "rgba(127,226,150,0.04)"
          : "rgba(255,255,255,0.02)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 12,
        alignItems: "center",
        transition: "all 0.15s",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: isCompleted ? "rgba(255,255,255,0.5)" : "#ecf3fb",
            marginBottom: 3,
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {room.name}
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {areaTypeLabel[room.area_type] ?? room.area_type}
          {room.notes && ` — ${room.notes}`}
        </div>
      </div>
      <StatusBadge status={room.status} size="sm" />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { Room, WalkthroughSession } from "../lib/database.types";
import WalkthroughProgress from "./WalkthroughProgress";
import RoomCard from "./RoomCard";

type WalkthroughUIProps = {
  session: WalkthroughSession;
  rooms: Room[];
  propertyId: string;
  propertyNickname: string;
};

export default function WalkthroughUI({
  session,
  rooms,
  propertyId,
  propertyNickname,
}: WalkthroughUIProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [roomNotes, setRoomNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const closedRooms = rooms.filter((r) => r.status === "closed");
  const pendingRooms = rooms.filter((r) => r.status !== "closed");

  const currentRoomId = session.current_room_id ?? pendingRooms[0]?.id ?? null;
  const currentRoom = rooms.find((r) => r.id === currentRoomId) ?? pendingRooms[0] ?? null;
  const currentIndex = currentRoom ? rooms.findIndex((r) => r.id === currentRoom.id) : 0;

  const isSessionComplete = pendingRooms.length === 0;

  async function handleCloseRoom() {
    if (!currentRoom) return;
    if (!currentRoom.name.trim()) {
      setError("This room must have a name before it can be closed.");
      return;
    }
    if (!confirmClose) {
      setConfirmClose(true);
      return;
    }

    setSaving(true);
    setError(null);

    const now = new Date().toISOString();

    const { error: roomError } = await supabase
      .from("rooms")
      .update({ status: "closed", closed_at: now, notes: roomNotes || currentRoom.notes, updated_at: now })
      .eq("id", currentRoom.id);

    if (roomError) {
      setError(roomError.message);
      setSaving(false);
      return;
    }

    const nextRoom = pendingRooms.find((r) => r.id !== currentRoom.id);
    const newClosedCount = session.closed_rooms + 1;
    const allDone = !nextRoom;

    await supabase
      .from("walkthrough_sessions")
      .update({
        current_room_id: nextRoom?.id ?? null,
        closed_rooms: newClosedCount,
        status: allDone ? "completed" : "active",
        completed_at: allDone ? now : null,
        updated_at: now,
      })
      .eq("id", session.id);

    setSaving(false);
    setConfirmClose(false);
    setRoomNotes("");
    router.refresh();
  }

  async function handleMarkNeedsRevisit() {
    if (!currentRoom) return;
    setSaving(true);

    const now = new Date().toISOString();
    await supabase
      .from("rooms")
      .update({ status: "needs_revisit", updated_at: now })
      .eq("id", currentRoom.id);

    const nextRoom = pendingRooms.find((r) => r.id !== currentRoom.id);
    await supabase
      .from("walkthrough_sessions")
      .update({ current_room_id: nextRoom?.id ?? null, updated_at: now })
      .eq("id", session.id);

    setSaving(false);
    setConfirmClose(false);
    router.refresh();
  }

  async function handlePauseSession() {
    setSaving(true);
    const now = new Date().toISOString();
    await supabase
      .from("walkthrough_sessions")
      .update({ status: "paused", updated_at: now })
      .eq("id", session.id);
    setSaving(false);
    router.push(`/workspace/${propertyId}`);
  }

  if (isSessionComplete || session.status === "completed") {
    return (
      <div style={{ display: "grid", gap: 24 }}>
        <div
          style={{
            padding: "48px 32px",
            borderRadius: 16,
            border: "1px solid rgba(127,226,150,0.35)",
            background: "rgba(127,226,150,0.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#7fe296",
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Walkthrough Complete
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", marginBottom: 8 }}>
            {rooms.length} room{rooms.length !== 1 ? "s" : ""} verified and closed.
          </div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem" }}>
            A house that can explain itself. This is a capture event, not a demo.
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => router.push(`/workspace/${propertyId}`)}
            className="btn-primary"
          >
            Return to Property Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
      <div style={{ display: "grid", gap: 16 }}>
        <WalkthroughProgress
          total={rooms.length}
          closed={closedRooms.length}
          currentIndex={currentIndex}
        />

        {currentRoom ? (
          <div
            style={{
              padding: "28px 28px 24px",
              borderRadius: 14,
              border: "1px solid rgba(109,211,255,0.3)",
              background: "rgba(109,211,255,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(109,211,255,0.7)",
                marginBottom: 8,
              }}
            >
              Current Room
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#ecf3fb",
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              {currentRoom.name}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 20,
              }}
            >
              {currentRoom.area_type.charAt(0).toUpperCase() + currentRoom.area_type.slice(1)}
              {currentRoom.notes && ` — ${currentRoom.notes}`}
            </div>

            <div className="form-row" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ fontSize: "0.8rem" }}>
                Field Notes for This Room
              </label>
              <textarea
                value={roomNotes}
                onChange={(e) => setRoomNotes(e.target.value)}
                placeholder="Observations, access notes, items requiring follow-up..."
                className="form-input"
                rows={2}
                style={{ fontSize: "0.875rem" }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(255,139,139,0.1)",
                  border: "1px solid rgba(255,139,139,0.25)",
                  color: "#ff8b8b",
                  fontSize: "0.82rem",
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            {confirmClose ? (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 10,
                  border: "1px solid rgba(127,226,150,0.35)",
                  background: "rgba(127,226,150,0.06)",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "#7fe296",
                    marginBottom: 6,
                    fontSize: "0.9rem",
                  }}
                >
                  Confirm Room Closure
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", marginBottom: 14 }}>
                  Closure is explicit and permanent for this session. Confirm that{" "}
                  <strong style={{ color: "#ecf3fb" }}>{currentRoom.name}</strong> has been
                  walked and documented.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleCloseRoom}
                    className="btn-primary"
                    disabled={saving}
                    style={{ flex: 1 }}
                  >
                    {saving ? "Closing..." : "Confirm — Close Room"}
                  </button>
                  <button
                    onClick={() => setConfirmClose(false)}
                    className="btn-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={handleCloseRoom}
                  className="btn-primary"
                  disabled={saving}
                  style={{ flex: 1, minWidth: 160 }}
                >
                  Close Room
                </button>
                <button
                  onClick={handleMarkNeedsRevisit}
                  className="btn-secondary"
                  disabled={saving}
                >
                  Needs Revisit
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: "32px 24px",
              borderRadius: 14,
              border: "1px dashed rgba(255,255,255,0.12)",
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            No current room selected.
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handlePauseSession}
            className="btn-secondary"
            disabled={saving}
          >
            Pause Walkthrough
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            padding: "0 2px",
            marginBottom: 4,
          }}
        >
          All Rooms — {propertyNickname}
        </div>
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isCurrent={room.id === currentRoom?.id}
            isCompleted={room.status === "closed"}
          />
        ))}
      </div>
    </div>
  );
}

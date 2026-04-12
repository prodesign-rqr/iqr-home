"use client";

import { useState } from "react";
import type { Room, System } from "../../lib/database.types";
import type { PhotoRecordScope } from "../../lib/database.types";
import { DEMO_PHOTOS, DEMO_PROJECT_ID, DEMO_PROJECT_NAME } from "../../lib/companycam-mock";

export interface CompanyCamPhoto {
  id: string;
  uri: string;
  thumbnail_url: string;
  captured_at: string | null;
  caption: string | null;
}

interface PhotoAssignment {
  record_scope: PhotoRecordScope;
  room_id: string | null;
  zone_id: string | null;
  system_id: string | null;
  service_event_id: string | null;
  notes: string;
  caption: string;
}

interface PhotoDraft extends CompanyCamPhoto {
  selected: boolean;
  assignment: PhotoAssignment;
}

type IntakeMode = "demo" | "live";
type IntakeStep = "select" | "preview" | "map" | "confirm" | "done";

interface Props {
  propertyId: string;
  rooms: Room[];
  systems: System[];
  onImportComplete: () => void;
}

const defaultAssignment = (): PhotoAssignment => ({
  record_scope: "property",
  room_id: null,
  zone_id: null,
  system_id: null,
  service_event_id: null,
  notes: "",
  caption: "",
});

export default function CompanyCamIntake({ propertyId, rooms, systems, onImportComplete }: Props) {
  const [step, setStep] = useState<IntakeStep>("select");
  const [mode, setMode] = useState<IntakeMode | null>(null);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulkScope, setBulkScope] = useState<PhotoRecordScope>("property");
  const [bulkRoomId, setBulkRoomId] = useState("");
  const [bulkSystemId, setBulkSystemId] = useState("");
  const [importBatchNotes, setImportBatchNotes] = useState("");
  const [importedBatchId, setImportedBatchId] = useState<string | null>(null);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  const loadDemoPhotos = () => {
    setMode("demo");
    setProjectId(DEMO_PROJECT_ID);
    setProjectName(DEMO_PROJECT_NAME);
    setPhotos(
      DEMO_PHOTOS.map((p) => ({
        ...p,
        selected: true,
        assignment: { ...defaultAssignment(), caption: p.caption ?? "" },
      }))
    );
    setStep("preview");
  };

  const loadLivePhotos = async (pid: string, pname: string) => {
    if (!pid.trim()) {
      setError("Project ID is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/companycam/photos?project_id=${encodeURIComponent(pid)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed to fetch photos (${res.status})`);
      }
      const data: CompanyCamPhoto[] = await res.json();
      setMode("live");
      setProjectId(pid);
      setProjectName(pname || pid);
      setPhotos(
        data.map((p) => ({
          ...p,
          selected: true,
          assignment: { ...defaultAssignment(), caption: p.caption ?? "" },
        }))
      );
      setStep("preview");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error fetching photos.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));

  const toggleAll = (val: boolean) =>
    setPhotos((prev) => prev.map((p) => ({ ...p, selected: val })));

  const updateAssignment = (id: string, patch: Partial<PhotoAssignment>) =>
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, assignment: { ...p.assignment, ...patch } } : p))
    );

  const applyBulkAssignment = () =>
    setPhotos((prev) =>
      prev.map((p) => {
        if (!p.selected) return p;
        return {
          ...p,
          assignment: {
            ...p.assignment,
            record_scope: bulkScope,
            room_id: bulkScope === "room" ? bulkRoomId || null : null,
            zone_id: null,
            system_id: bulkScope === "system" ? bulkSystemId || null : null,
            service_event_id: null,
          },
        };
      })
    );

  const selectedPhotos = photos.filter((p) => p.selected);

  const confirmImport = async () => {
    if (selectedPhotos.length === 0) {
      setError("Select at least one photo to import.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/companycam/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: propertyId,
          project_id: projectId,
          project_name: projectName,
          notes: importBatchNotes,
          is_demo: mode === "demo",
          photos: selectedPhotos.map((p) => ({
            source_photo_id: p.id,
            source_url: p.uri,
            thumbnail_url: p.thumbnail_url,
            captured_at: p.captured_at,
            caption: p.assignment.caption || p.caption,
            notes: p.assignment.notes,
            room_id: p.assignment.room_id,
            zone_id: p.assignment.zone_id,
            system_id: p.assignment.system_id,
            service_event_id: p.assignment.service_event_id,
            record_scope: p.assignment.record_scope,
            metadata_json: { original_caption: p.caption, source_mode: mode },
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Import failed (${res.status})`);
      }
      const result = await res.json();
      setImportedBatchId(result.batch_id);
      setStep("done");
      onImportComplete();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error during import.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("select");
    setMode(null);
    setProjectId("");
    setProjectName("");
    setPhotos([]);
    setError(null);
    setImportedBatchId(null);
    setImportBatchNotes("");
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <StepBar current={step} />

      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: "rgba(255,80,80,0.08)",
            border: "1px solid rgba(255,80,80,0.25)",
            color: "#ff6b6b",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {step === "select" && (
        <SelectStep
          loading={loading}
          onDemoMode={loadDemoPhotos}
          onLiveMode={loadLivePhotos}
        />
      )}

      {step === "preview" && (
        <PreviewStep
          photos={photos}
          projectId={projectId}
          projectName={projectName}
          isDemo={mode === "demo"}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
          onBack={reset}
          onNext={() => setStep("map")}
        />
      )}

      {step === "map" && (
        <MapStep
          photos={photos}
          rooms={rooms}
          systems={systems}
          bulkScope={bulkScope}
          bulkRoomId={bulkRoomId}
          bulkSystemId={bulkSystemId}
          expandedPhoto={expandedPhoto}
          onBulkScopeChange={setBulkScope}
          onBulkRoomChange={setBulkRoomId}
          onBulkSystemChange={setBulkSystemId}
          onApplyBulk={applyBulkAssignment}
          onUpdateAssignment={updateAssignment}
          onToggleExpand={(id) => setExpandedPhoto((prev) => (prev === id ? null : id))}
          onBack={() => setStep("preview")}
          onNext={() => setStep("confirm")}
        />
      )}

      {step === "confirm" && (
        <ConfirmStep
          photos={photos}
          projectId={projectId}
          projectName={projectName}
          isDemo={mode === "demo"}
          importBatchNotes={importBatchNotes}
          loading={loading}
          rooms={rooms}
          systems={systems}
          onNotesChange={setImportBatchNotes}
          onBack={() => setStep("map")}
          onConfirm={confirmImport}
        />
      )}

      {step === "done" && (
        <DoneStep
          batchId={importedBatchId}
          count={selectedPhotos.length}
          isDemo={mode === "demo"}
          onReset={reset}
        />
      )}
    </div>
  );
}

function StepBar({ current }: { current: IntakeStep }) {
  const steps: { key: IntakeStep; label: string }[] = [
    { key: "select", label: "Select Source" },
    { key: "preview", label: "Preview Photos" },
    { key: "map", label: "Map Photos" },
    { key: "confirm", label: "Confirm Import" },
  ];
  const order: IntakeStep[] = ["select", "preview", "map", "confirm", "done"];
  const currentIdx = order.indexOf(current);

  return (
    <div style={{ display: "flex", gap: 0, alignItems: "center", marginBottom: 8 }}>
      {steps.map((s, i) => {
        const idx = order.indexOf(s.key);
        const isActive = s.key === current;
        const isDone = currentIdx > idx;
        return (
          <div
            key={s.key}
            style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : undefined }}
          >
            <div
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: "0.75rem",
                fontWeight: isActive ? 700 : 500,
                background: isActive
                  ? "rgba(109,211,255,0.15)"
                  : isDone
                  ? "rgba(127,226,150,0.1)"
                  : "rgba(255,255,255,0.04)",
                color: isActive
                  ? "#6dd3ff"
                  : isDone
                  ? "#7fe296"
                  : "rgba(255,255,255,0.3)",
                border: isActive
                  ? "1px solid rgba(109,211,255,0.3)"
                  : isDone
                  ? "1px solid rgba(127,226,150,0.2)"
                  : "1px solid rgba(255,255,255,0.06)",
                whiteSpace: "nowrap",
              }}
            >
              {isDone ? "✓ " : ""}
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: isDone ? "rgba(127,226,150,0.2)" : "rgba(255,255,255,0.06)",
                  margin: "0 8px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SelectStep({
  loading,
  onDemoMode,
  onLiveMode,
}: {
  loading: boolean;
  onDemoMode: () => void;
  onLiveMode: (projectId: string, projectName: string) => void;
}) {
  const [liveProjectId, setLiveProjectId] = useState("");
  const [liveProjectName, setLiveProjectName] = useState("");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          padding: "24px",
          borderRadius: 12,
          border: "2px solid rgba(109,211,255,0.2)",
          background: "rgba(109,211,255,0.03)",
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6dd3ff",
              marginBottom: 6,
            }}
          >
            Demo Mode
          </div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ecf3fb", marginBottom: 6 }}>
            Sample Import — No CompanyCam Account Required
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
            Load 6 representative sample photos and walk the full intake flow end-to-end. Real
            structured records will be written to Supabase — this is a full functional test, not a
            simulation.
          </p>
        </div>
        <div>
          <button className="btn-primary" onClick={onDemoMode} disabled={loading}>
            Load Demo Photos
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "24px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.015)",
          display: "grid",
          gap: 16,
          opacity: 0.7,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 6,
            }}
          >
            Live CompanyCam Integration
          </div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ecf3fb", marginBottom: 6 }}>
            Connect a Real Project
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
            Enter your CompanyCam project ID. Credentials are managed server-side via environment
            variables — no API key entry required in the UI.
          </p>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={labelStyle}>CompanyCam Project ID</span>
            <input
              value={liveProjectId}
              onChange={(e) => setLiveProjectId(e.target.value)}
              placeholder="e.g. 123456"
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={labelStyle}>Project Name (optional)</span>
            <input
              value={liveProjectName}
              onChange={(e) => setLiveProjectName(e.target.value)}
              placeholder="e.g. 123 Oak St — Initial Inspection"
              style={inputStyle}
            />
          </label>
        </div>

        <div>
          <button
            className="btn-secondary"
            onClick={() => onLiveMode(liveProjectId, liveProjectName)}
            disabled={loading || !liveProjectId.trim()}
          >
            {loading ? "Fetching Photos..." : "Fetch Photos"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoBanner() {
  return (
    <div
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        background: "rgba(109,211,255,0.07)",
        border: "1px solid rgba(109,211,255,0.2)",
        fontSize: "0.78rem",
        color: "#6dd3ff",
        marginBottom: 4,
      }}
    >
      Demo Mode — Sample photos. Real Supabase records will be created on confirm.
    </div>
  );
}

function PreviewStep({
  photos,
  projectId,
  projectName,
  isDemo,
  onToggleSelect,
  onToggleAll,
  onBack,
  onNext,
}: {
  photos: PhotoDraft[];
  projectId: string;
  projectName: string;
  isDemo: boolean;
  onToggleSelect: (id: string) => void;
  onToggleAll: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const selected = photos.filter((p) => p.selected).length;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {isDemo && <DemoBanner />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ecf3fb", marginBottom: 2 }}>
            {projectName || projectId}
          </div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
            {photos.length} photos — {selected} selected
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-secondary"
            style={{ fontSize: "0.8rem", padding: "6px 12px" }}
            onClick={() => onToggleAll(true)}
          >
            Select All
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: "0.8rem", padding: "6px 12px" }}
            onClick={() => onToggleAll(false)}
          >
            Deselect All
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 10,
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onToggleSelect(photo.id)}
            style={{
              borderRadius: 10,
              border: photo.selected
                ? "2px solid rgba(109,211,255,0.5)"
                : "2px solid rgba(255,255,255,0.06)",
              background: photo.selected ? "rgba(109,211,255,0.04)" : "rgba(255,255,255,0.02)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "border-color 0.15s ease",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "relative",
                paddingTop: "75%",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              {photo.thumbnail_url ? (
                <img
                  src={photo.thumbnail_url}
                  alt={photo.caption ?? "Photo"}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "0.75rem",
                  }}
                >
                  No preview
                </div>
              )}
              {photo.selected && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#6dd3ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    color: "#000",
                    fontWeight: 800,
                  }}
                >
                  ✓
                </div>
              )}
            </div>
            <div style={{ padding: "8px 10px" }}>
              {photo.caption && (
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.4)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {photo.caption}
                </div>
              )}
              {photo.captured_at && (
                <div
                  style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", marginTop: 2 }}
                >
                  {new Date(photo.captured_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Change Source
        </button>
        <button className="btn-primary" onClick={onNext} disabled={selected === 0}>
          Map {selected} Photo{selected !== 1 ? "s" : ""} →
        </button>
      </div>
    </div>
  );
}

function MapStep({
  photos,
  rooms,
  systems,
  bulkScope,
  bulkRoomId,
  bulkSystemId,
  expandedPhoto,
  onBulkScopeChange,
  onBulkRoomChange,
  onBulkSystemChange,
  onApplyBulk,
  onUpdateAssignment,
  onToggleExpand,
  onBack,
  onNext,
}: {
  photos: PhotoDraft[];
  rooms: Room[];
  systems: System[];
  bulkScope: PhotoRecordScope;
  bulkRoomId: string;
  bulkSystemId: string;
  expandedPhoto: string | null;
  onBulkScopeChange: (v: PhotoRecordScope) => void;
  onBulkRoomChange: (v: string) => void;
  onBulkSystemChange: (v: string) => void;
  onApplyBulk: () => void;
  onUpdateAssignment: (id: string, patch: Partial<PhotoAssignment>) => void;
  onToggleExpand: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const selected = photos.filter((p) => p.selected);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          padding: "20px 24px",
          borderRadius: 12,
          border: "1px solid rgba(109,211,255,0.15)",
          background: "rgba(109,211,255,0.03)",
        }}
      >
        <div
          style={{ fontWeight: 700, fontSize: "0.85rem", color: "#6dd3ff", marginBottom: 14 }}
        >
          Bulk Assignment — Apply to All Selected Photos
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr 1fr auto",
            gap: 12,
            alignItems: "end",
          }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span style={labelStyle}>Scope</span>
            <select
              value={bulkScope}
              onChange={(e) => onBulkScopeChange(e.target.value as PhotoRecordScope)}
              style={inputStyle}
            >
              <option value="property">Property</option>
              <option value="room">Room</option>
              <option value="system">System</option>
              <option value="service_event">Service Event</option>
            </select>
          </label>

          {bulkScope === "room" && (
            <label style={{ display: "grid", gap: 6 }}>
              <span style={labelStyle}>Room</span>
              <select
                value={bulkRoomId}
                onChange={(e) => onBulkRoomChange(e.target.value)}
                style={inputStyle}
              >
                <option value="">— Select Room —</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {bulkScope === "system" && (
            <label style={{ display: "grid", gap: 6 }}>
              <span style={labelStyle}>System</span>
              <select
                value={bulkSystemId}
                onChange={(e) => onBulkSystemChange(e.target.value)}
                style={inputStyle}
              >
                <option value="">— Select System —</option>
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div style={{ alignSelf: "end" }}>
            <button
              className="btn-secondary"
              style={{ padding: "9px 18px", fontSize: "0.82rem" }}
              onClick={onApplyBulk}
            >
              Apply to Selected
            </button>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Individual Photo Assignments ({selected.length})
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {selected.map((photo) => (
            <div
              key={photo.id}
              style={{
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.015)",
                overflow: "hidden",
              }}
            >
              <div
                onClick={() => onToggleExpand(photo.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 14px",
                  cursor: "pointer",
                }}
              >
                {photo.thumbnail_url ? (
                  <img
                    src={photo.thumbnail_url}
                    alt=""
                    style={{
                      width: 48,
                      height: 36,
                      objectFit: "cover",
                      borderRadius: 6,
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 36,
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.06)",
                    }}
                  />
                )}
                <div>
                  <div
                    style={{
                      fontSize: "0.83rem",
                      fontWeight: 600,
                      color: "#ecf3fb",
                      marginBottom: 2,
                    }}
                  >
                    {photo.assignment.caption || photo.caption || `Photo ${photo.id.slice(-6)}`}
                  </div>
                  <ScopeChip assignment={photo.assignment} rooms={rooms} systems={systems} />
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
                  {expandedPhoto === photo.id ? "▲" : "▼"}
                </div>
              </div>

              {expandedPhoto === photo.id && (
                <div
                  style={{
                    padding: "14px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={labelStyle}>Scope</span>
                      <select
                        value={photo.assignment.record_scope}
                        onChange={(e) =>
                          onUpdateAssignment(photo.id, {
                            record_scope: e.target.value as PhotoRecordScope,
                            room_id: null,
                            system_id: null,
                          })
                        }
                        style={inputStyle}
                      >
                        <option value="property">Property</option>
                        <option value="room">Room</option>
                        <option value="system">System</option>
                        <option value="service_event">Service Event</option>
                      </select>
                    </label>

                    {photo.assignment.record_scope === "room" && (
                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={labelStyle}>Room</span>
                        <select
                          value={photo.assignment.room_id ?? ""}
                          onChange={(e) =>
                            onUpdateAssignment(photo.id, { room_id: e.target.value || null })
                          }
                          style={inputStyle}
                        >
                          <option value="">— Select Room —</option>
                          {rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {photo.assignment.record_scope === "system" && (
                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={labelStyle}>System</span>
                        <select
                          value={photo.assignment.system_id ?? ""}
                          onChange={(e) =>
                            onUpdateAssignment(photo.id, { system_id: e.target.value || null })
                          }
                          style={inputStyle}
                        >
                          <option value="">— Select System —</option>
                          {systems.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>

                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={labelStyle}>Caption</span>
                    <input
                      value={photo.assignment.caption}
                      onChange={(e) => onUpdateAssignment(photo.id, { caption: e.target.value })}
                      placeholder={photo.caption ?? "Photo caption"}
                      style={inputStyle}
                    />
                  </label>

                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={labelStyle}>Operator Notes</span>
                    <input
                      value={photo.assignment.notes}
                      onChange={(e) => onUpdateAssignment(photo.id, { notes: e.target.value })}
                      placeholder="Optional notes for this photo"
                      style={inputStyle}
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-primary" onClick={onNext}>
          Review Import →
        </button>
      </div>
    </div>
  );
}

function ScopeChip({
  assignment,
  rooms,
  systems,
}: {
  assignment: PhotoAssignment;
  rooms: Room[];
  systems: System[];
}) {
  let label = "Property";
  if (assignment.record_scope === "room") {
    const r = rooms.find((x) => x.id === assignment.room_id);
    label = r ? `Room: ${r.name}` : "Room: —";
  } else if (assignment.record_scope === "system") {
    const s = systems.find((x) => x.id === assignment.system_id);
    label = s ? `System: ${s.name}` : "System: —";
  } else if (assignment.record_scope === "service_event") {
    label = "Service Event";
  }
  return (
    <span
      style={{
        fontSize: "0.72rem",
        padding: "2px 8px",
        borderRadius: 10,
        background: "rgba(109,211,255,0.08)",
        border: "1px solid rgba(109,211,255,0.15)",
        color: "#6dd3ff",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function ConfirmStep({
  photos,
  projectId,
  projectName,
  isDemo,
  importBatchNotes,
  loading,
  rooms,
  systems,
  onNotesChange,
  onBack,
  onConfirm,
}: {
  photos: PhotoDraft[];
  projectId: string;
  projectName: string;
  isDemo: boolean;
  importBatchNotes: string;
  loading: boolean;
  rooms: Room[];
  systems: System[];
  onNotesChange: (v: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const selected = photos.filter((p) => p.selected);
  const scopeCounts = selected.reduce<Record<string, number>>((acc, p) => {
    acc[p.assignment.record_scope] = (acc[p.assignment.record_scope] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {isDemo && <DemoBanner />}

      <div
        style={{
          padding: "24px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.015)",
          display: "grid",
          gap: 16,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1rem", color: "#ecf3fb" }}>Import Summary</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Photos", value: selected.length },
            { label: "Project", value: projectName || projectId },
            { label: "Source", value: isDemo ? "Demo / Sample" : "CompanyCam" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#ecf3fb",
                  marginBottom: 4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Scope Breakdown
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(scopeCounts).map(([scope, count]) => (
              <span
                key={scope}
                style={{
                  padding: "4px 12px",
                  borderRadius: 12,
                  fontSize: "0.78rem",
                  background: "rgba(109,211,255,0.08)",
                  border: "1px solid rgba(109,211,255,0.15)",
                  color: "#6dd3ff",
                }}
              >
                {count} {scope.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.6,
          }}
        >
          CompanyCam is the source. IQR owns the structured record. Each confirmed photo becomes a
          first-class IQR photo record in Supabase, linked to this property.
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={labelStyle}>Batch Notes (optional)</span>
          <textarea
            value={importBatchNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Notes about this import batch..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>
      </div>

      <div>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Photos ({selected.length})
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {selected.map((photo) => (
            <div
              key={photo.id}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr auto",
                gap: 10,
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.01)",
              }}
            >
              {photo.thumbnail_url ? (
                <img
                  src={photo.thumbnail_url}
                  alt=""
                  style={{ width: 36, height: 28, objectFit: "cover", borderRadius: 4 }}
                />
              ) : (
                <div
                  style={{
                    width: 36,
                    height: 28,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.6)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {photo.assignment.caption || photo.caption || `Photo ${photo.id.slice(-6)}`}
              </div>
              <ScopeChip assignment={photo.assignment} rooms={rooms} systems={systems} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn-secondary" onClick={onBack} disabled={loading}>
          ← Back
        </button>
        <button className="btn-primary" onClick={onConfirm} disabled={loading}>
          {loading ? "Importing..." : `Confirm Import (${selected.length} photos)`}
        </button>
      </div>
    </div>
  );
}

function DoneStep({
  batchId,
  count,
  isDemo,
  onReset,
}: {
  batchId: string | null;
  count: number;
  isDemo: boolean;
  onReset: () => void;
}) {
  return (
    <div
      style={{
        padding: "40px 32px",
        borderRadius: 16,
        border: "1px solid rgba(127,226,150,0.2)",
        background: "rgba(127,226,150,0.04)",
        textAlign: "center",
        display: "grid",
        gap: 16,
      }}
    >
      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#7fe296" }}>{count}</div>
      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ecf3fb" }}>
        {isDemo ? "Demo Import Complete" : "Photos Imported Successfully"}
      </div>
      <div
        style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}
      >
        {isDemo
          ? "All sample photos were written as real structured IQR photo records in Supabase. The full flow is verified end-to-end."
          : "All selected photos have been converted to structured IQR photo records and linked to this property."}
        {" "}
        CompanyCam is the source — IQR is the record of authority.
      </div>
      {batchId && (
        <div
          style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}
        >
          Batch ID: {batchId}
        </div>
      )}
      <div>
        <button className="btn-secondary" onClick={onReset}>
          Start New Import
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "#ecf3fb",
  fontSize: "0.875rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.35)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

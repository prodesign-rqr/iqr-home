import Image from "next/image";
import Link from "next/link";
import SectionCard from "../../../components/SectionCard";
import { mockRecord } from "../../../lib/mock-record";
import { buildPropertyWorkspace, buildSpatialPropertyShell } from "../../../lib/property-workspace-v1";

export default function PartnerWorkspacePage() {
  const workspace = buildPropertyWorkspace({
    propertyBasics: {
      propertyNickname: "Anonymized Desert Residence",
      streetAddress: mockRecord.property.streetAddress,
      parcelApn: mockRecord.property.parcelApn,
      city: mockRecord.property.city ?? "",
      state: mockRecord.property.state ?? "",
      zip: mockRecord.property.zip ?? "",
    },
    peopleRoles: {
      clientOwner: "Client / owner held privately",
      propertyManager: "Property manager assigned",
      tisOwner: "Integrator owner assigned",
    },
  } as any);

  const shell = buildSpatialPropertyShell(mockRecord);
  const selected = shell.selectedAreaContext;

  return (
    <main>
      <section className="hero">
        <div className="subpage-logo-wrap">
          <Image
            src="/iqr-home-logo-tight-WonB.png"
            alt="IQR Home"
            width={140}
            height={98}
            className="subpage-logo"
            priority
          />
        </div>
        <h1>Partner Spatial Workspace</h1>
        <p>
          The partner workspace now carries a map-first property baseline while preserving the existing
          prompts, participants, and startup-output posture.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">
            Back to Home
          </Link>
          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">Partner Entry</Link>
            <Link href="/partner/questionnaire" className="subnav-pill">Questionnaire</Link>
            <Link href="/partner/outputs/property-record-shell" className="subnav-pill">Property Record Shell</Link>
            <Link href="/telemetry" className="subnav-pill">System Index</Link>
          </div>
        </div>
      </section>

      <SectionCard title="Workspace Status" subtitle="Compatibility-safe bridge between the current workspace and the spatial shell.">
        <div className="bullet-list">
          <div className="list-card">
            <strong>{workspace.propertyName}</strong>
            <div>{workspace.streetAddress}</div>
            <div className="muted small">{workspace.parcelApn}</div>
            <div className="muted small">Status: {workspace.currentStatus}</div>
            <div className="muted small">Next: {workspace.nextAction}</div>
          </div>
          <div className="list-card">
            <strong>Startup output posture</strong>
            <div className="muted small">QR plan items: {workspace.qrPlanCount}</div>
            <div className="muted small">Startup kit count: {workspace.startupKitCount}</div>
            <div className="muted small">Property shell count: {workspace.propertyShellCount}</div>
            <div className="muted small">Checklist count: {workspace.checklistCount}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Spatial Property Baseline" subtitle="Map-first shell layered under the existing partner workspace.">
        <div className="bullet-list">
          <div className="list-card">
            <strong>Mapped floors</strong>
            {shell.property.floors.map((floor) => (
              <div className="muted small" key={floor.id}>
                {floor.label} • {floor.areas.length} areas
              </div>
            ))}
          </div>
          <div className="list-card">
            <strong>Floor plan documents</strong>
            <div className="muted small">Master plans: {shell.masterFloorPlans.length}</div>
            <div className="muted small">Derived copies: {shell.derivedFloorPlans.length}</div>
          </div>
          <div className="list-card">
            <strong>Selected area</strong>
            {selected ? (
              <>
                <div>{selected.label}</div>
                <div className="muted small">{selected.detailSummary}</div>
              </>
            ) : (
              <div className="muted small">No selected area context yet.</div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Participants and Prompts" subtitle="Existing workspace contract remains intact.">
        <div className="bullet-list">
          {workspace.participants.map((participant) => (
            <div className="list-card" key={participant.role}>
              <strong>{participant.role}</strong>
              <div>{participant.name}</div>
              <div className="muted small">{participant.status}</div>
            </div>
          ))}
          {workspace.prompts.map((prompt) => (
            <div className="list-card" key={prompt.title}>
              <strong>{prompt.title}</strong>
              <div>{prompt.detail}</div>
              <div className="muted small">{prompt.owner} • {prompt.status}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import SectionCard from "../../components/SectionCard";
import { mockRecord } from "../../lib/mock-record";
import { buildSpatialPropertyShell } from "../../lib/property-workspace-v1";

export default function PartnerEntryPage() {
  const shell = buildSpatialPropertyShell(mockRecord);

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
        <h1>Partner Entry</h1>
        <p>
          Partner entry now routes toward the spatial workspace as the primary property front door.
          Questionnaire and outputs remain available as supporting paths.
        </p>

        <div className="subpage-nav">
          <Link href="/partner/workspace" className="subpage-nav-home">
            Open Spatial Workspace
          </Link>
          <div className="subpage-nav-links">
            <Link href="/partner/questionnaire" className="subnav-pill">Questionnaire</Link>
            <Link href="/partner/outputs" className="subnav-pill">Outputs</Link>
            <Link href="/telemetry" className="subnav-pill">System Index</Link>
            <Link href="/" className="subnav-pill">Home</Link>
          </div>
        </div>
      </section>

      <SectionCard title="Primary Route" subtitle="Spatial workspace is now the preferred partner-side entry.">
        <div className="bullet-list">
          <div className="list-card">
            <strong>{shell.propertyName}</strong>
            <div>{shell.streetAddress}</div>
            <div className="muted small">{shell.parcelApn}</div>
            <div className="muted small">Current status: {shell.currentStatus}</div>
            <div className="muted small">Next: {shell.nextAction}</div>
          </div>
          <div className="list-card">
            <strong>Floor plan posture</strong>
            <div className="muted small">Master floor plans: {shell.masterFloorPlans.length}</div>
            <div className="muted small">Derived copies: {shell.derivedFloorPlans.length}</div>
            <div className="muted small">System Index path: {shell.systemIndexPath}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Secondary Paths" subtitle="Legacy posture remains available as secondary reference.">
        <div className="bullet-list">
          <div className="list-card">
            <strong>Questionnaire</strong>
            <div className="muted small">Continue intake and assignment workflows.</div>
          </div>
          <div className="list-card">
            <strong>Outputs</strong>
            <div className="muted small">Review generated property shell, checklist, startup kit, and QR plan outputs.</div>
          </div>
          <div className="list-card">
            <strong>System Index</strong>
            <div className="muted small">Telemetry, prevention, service events, and integrity remain available while the map-first shell grows in.</div>
          </div>
        </div>
      </SectionCard>
    </main>
  );
}

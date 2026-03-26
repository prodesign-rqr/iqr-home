import Image from "next/image";
import Link from "next/link";
import SectionCard from "../components/SectionCard";
import { mockRecord } from "../lib/mock-record";
import { buildSpatialPropertyShell } from "../lib/property-workspace-v1";

export default function HomePage() {
  const shell = buildSpatialPropertyShell(mockRecord);
  const selected = shell.selectedAreaContext;
  const floors = shell.property.floors;
  const exteriorAreas = shell.property.exteriorAreas;

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
        <h1>Spatial Property Record</h1>
        <p>
          IQR now opens through a property-map-first shell that preserves the house as a
          spatial record. The old section-first views remain available as secondary reference paths.
        </p>

        <div className="subpage-nav">
          <Link href="/partner/workspace" className="subpage-nav-home">
            Open Spatial Workspace
          </Link>
          <div className="subpage-nav-links">
            <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
            <Link href="/prevention" className="subnav-pill">Prevention</Link>
            <Link href="/service-events" className="subnav-pill">Service Events</Link>
            <Link href="/integrity" className="subnav-pill">Integrity</Link>
            <Link href="/partner" className="subnav-pill">Partner Entry</Link>
          </div>
        </div>
      </section>

      <SectionCard
        title={shell.propertyName}
        subtitle="Floor-plan-first shell for the canonical property record."
        right={<span className="status-pill">Status: {shell.currentStatus}</span>}
      >
        <div className="bullet-list">
          <div className="list-card">
            <strong>Property anchor</strong>
            <div>{shell.streetAddress}</div>
            <div className="muted small">{shell.parcelApn}</div>
            <div className="muted small">Next: {shell.nextAction}</div>
          </div>
          <div className="list-card">
            <strong>Floor plan documents</strong>
            <div>{shell.masterFloorPlans.length} master / {shell.derivedFloorPlans.length} derived</div>
            <div className="muted small">System Index remains available at {shell.systemIndexPath}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Mapped Floors" subtitle="Primary property navigation is now spatially anchored.">
        <div className="bullet-list">
          {floors.map((floor) => (
            <div className="list-card" key={floor.id}>
              <strong>{floor.label}</strong>
              <div className="muted small">{floor.areas.length} mapped rooms / zones</div>
              <div className="detail-card-grid">
                {floor.areas.map((area) => (
                  <div className="detail-card" key={area.id}>
                    <div className="detail-card-top">
                      <strong>{area.label}</strong>
                      <span className="status-pill">{area.areaType}</span>
                    </div>
                    <div className="muted small">
                      Docs {area.recordCounts.documents} • Finishes {area.recordCounts.finishes} • Equipment {area.recordCounts.equipment}
                    </div>
                    <div className="muted small">
                      Protection {area.recordCounts.protectionPoints} • Visits {area.recordCounts.visits} • Incidents {area.recordCounts.incidents}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Exterior Areas" subtitle="Exterior and service areas are first-class mapped areas.">
        <div className="detail-card-grid">
          {exteriorAreas.map((area) => (
            <div className="detail-card" key={area.id}>
              <div className="detail-card-top">
                <strong>{area.label}</strong>
                <span className="status-pill">{area.areaType}</span>
              </div>
              <div className="muted small">
                Docs {area.recordCounts.documents} • Finishes {area.recordCounts.finishes} • Equipment {area.recordCounts.equipment}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Selected Area Detail" subtitle="Compatibility-safe detail panel foundation for the map shell.">
        {selected ? (
          <div className="bullet-list">
            <div className="list-card">
              <div className="detail-card-top">
                <strong>{selected.label}</strong>
                <span className="status-pill">{selected.areaType}</span>
              </div>
              <div className="muted small">{selected.floorLabel ?? "Exterior area"}</div>
              <div className="muted small">{selected.detailSummary}</div>
            </div>

            <div className="list-card">
              <strong>Floor plan documents</strong>
              {selected.groupedRecords.documents.length ? (
                selected.groupedRecords.documents.map((doc) => (
                  <div className="muted small" key={doc.id}>
                    {doc.title} • {doc.kind} • {doc.versionLabel}
                  </div>
                ))
              ) : (
                <div className="muted small">No documents attached yet.</div>
              )}
            </div>

            <div className="list-card">
              <strong>Finish history</strong>
              {selected.groupedRecords.finishes.length ? (
                selected.groupedRecords.finishes.map((finish) => (
                  <div className="muted small" key={finish.id}>
                    {finish.brand} {finish.colorName} • Surface {finish.surfaceId} {finish.current ? "• current" : ""}
                  </div>
                ))
              ) : (
                <div className="muted small">No finish history attached yet.</div>
              )}
            </div>

            <div className="list-card">
              <strong>Equipment and protection context</strong>
              <div className="muted small">Equipment: {selected.groupedRecords.equipment.length}</div>
              <div className="muted small">Protection points: {selected.groupedRecords.protectionPoints.length}</div>
              <div className="muted small">Incidents: {selected.groupedRecords.incidents.length}</div>
              <div className="muted small">Visits: {selected.groupedRecords.visits.length}</div>
            </div>
          </div>
        ) : (
          <div className="list-card">
            <strong>No selected area yet</strong>
            <div className="muted small">Spatial shell is present but no mapped area has been promoted into detail context.</div>
          </div>
        )}
      </SectionCard>
    </main>
  );
}

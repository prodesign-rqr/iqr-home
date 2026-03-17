import Image from "next/image";
import Link from "next/link";
import { mockRecord } from "../lib/mock-record";

export default function HomePage() {
  const { property, meta, avItInfrastructure, monitoring, prevention, service, integrity } = mockRecord;

  return (
    <main>
      <section className="hero">
        <div className="hero-logo-wrap">
          <Image
            src="/iqr-home-logo-tight-WonB.png"
            alt="IQR Home"
            width={220}
            height={154}
            className="hero-logo"
            priority
          />
        </div>

        <h1 className="hero-title">Know Your Home. It can explain itself.</h1>

        <p>
          IQR Home preserves the property record, history, and continuity across monitoring, service,
          and handoff.
        </p>

        <p className="muted">
          {property.streetAddress}, {property.city}, {property.state} {property.zip}
        </p>

        <div className="hero-badges">
          <span className="badge">Parcel/APN {property.parcelApn}</span>
          <span className="badge">Status {meta.recordStatus}</span>
          <span className="badge">Schema v{meta.schemaVersion}</span>
          <span className="badge">Integrity Score {integrity.integrityScore ?? "N/A"}</span>
        </div>

        <div className="hero-badges">
          <Link href="/telemetry" className="badge">Telemetry</Link>
          <Link href="/prevention" className="badge">Prevention</Link>
          <Link href="/voice" className="badge">Voice</Link>
          <Link href="/service-events" className="badge">Service Events</Link>
          <Link href="/integrity" className="badge">Integrity</Link>
        </div>
      </section>

      <div className="grid two-col">
        <section className="section-card">
          <div className="section-header">
            <div>
              <h2>Record Summary</h2>
              <p className="muted">Structured house record anchored to the property.</p>
            </div>
            <div className="status-pill">{meta.recordStatus}</div>
          </div>

          <div className="grid two-col">
            <div className="metric-card">
              <div className="metric-label">Rack / AV-IT devices</div>
              <div className="metric-value">{avItInfrastructure.rackDevices.length}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Monitored conditions</div>
              <div className="metric-value">{monitoring.monitoredConditions.length}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Protection points</div>
              <div className="metric-value">{prevention.riskProtectionPoints.length}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Open integrity issues</div>
              <div className="metric-value">{integrity.issues.length}</div>
            </div>
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <h2>Continuity Snapshot</h2>
              <p className="muted">Current operational posture for the property record.</p>
            </div>
          </div>

          <div className="bullet-list">
            <div className="list-card">
              <strong>Baseline date</strong>
              <div>{meta.baselineDate ?? "N/A"}</div>
            </div>

            <div className="list-card">
              <strong>Yearly update</strong>
              <div>{meta.yearlyUpdateDate ?? "N/A"}</div>
            </div>

            <div className="list-card">
              <strong>Continuity owner</strong>
              <div>{meta.continuityOwner ?? "N/A"}</div>
            </div>

            <div className="list-card">
              <strong>Unresolved service issues</strong>
              <div>{service.unresolvedIssues.length}</div>
            </div>
          </div>
        </section>
      </div>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>What this build phase covers</h2>
            <p className="muted">Structured clarity first. Feature expansion later.</p>
          </div>
        </div>

        <div className="bullet-list">
          <div className="list-card">
            <strong>AV / IT infrastructure</strong>
            <div className="muted small">
              Rack, network, AV, control, and associated continuity data.
            </div>
          </div>

          <div className="list-card">
            <strong>YoLink monitoring and event history</strong>
            <div className="muted small">
              Sensors, meaningful events, and service-relevant continuity records.
            </div>
          </div>

          <div className="list-card">
            <strong>Major home systems and appliances</strong>
            <div className="muted small">
              House systems remain in scope as part of the property record.
            </div>
          </div>

          <div className="list-card">
            <strong>Record integrity</strong>
            <div className="muted small">
              Missing fields, missing verification, orphaned events, and unresolved issues.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


import Image from "next/image";
import Link from "next/link";
import { mockRecord } from "../../lib/mock-record";

export default function IntegrityPage() {
  const { property, integrity, service } = mockRecord;

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

  <h1>Integrity</h1>
  <p>
    Integrity surfaces record confidence by flagging missing fields, unresolved
    issues, and inconsistencies that weaken continuity across the property record.
  </p>

  <div className="subpage-nav">
    <Link href="/" className="subpage-nav-home">Back to Home</Link>

    <div className="subpage-nav-links">
      <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
      <Link href="/prevention" className="subnav-pill">Prevention</Link>
      <Link href="/voice" className="subnav-pill">Voice</Link>
      <Link href="/service-events" className="subnav-pill">Service Events</Link>
      <span  className="subnav-current-dot"  aria-hidden="true">&bull;</span>
    </div>
  </div>
</section>


      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Integrity Summary</h2>
            <p className="muted">
              {property.streetAddress}, {property.city}, {property.state} {property.zip}
            </p>
          </div>
          <div className="status-pill">
            Score: {integrity.integrityScore ?? "N/A"}
          </div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Open integrity issues</div>
            <div className="metric-value">{integrity.issues.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Unresolved service issues</div>
            <div className="metric-value">{service.unresolvedIssues.length}</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Integrity Issues</h2>
            <p className="muted">Issues generated from the structured house record.</p>
          </div>
        </div>

        <div className="bullet-list">
          {integrity.issues.map((issue) => (
            <div className="list-card" key={issue.id}>
              <strong>{issue.message}</strong>
              <div>{issue.category}</div>
              <div className="muted small">
                Severity: {issue.severity} | Object type: {issue.objectType ?? "N/A"} | Object ID: {issue.objectId ?? "N/A"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Unresolved Service Issues</h2>
            <p className="muted">Continuity problems still open or under watch.</p>
          </div>
        </div>

        <div className="bullet-list">
          {service.unresolvedIssues.map((issue) => (
            <div className="list-card" key={issue.id}>
              <strong>{issue.title}</strong>
              <div>{issue.description}</div>
              <div className="muted small">
                Severity: {issue.severity} | Status: {issue.status} | Identified: {issue.identifiedAt}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


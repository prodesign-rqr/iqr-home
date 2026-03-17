import Image from "next/image";
import Link from "next/link";

import { mockRecord } from "../../lib/mock-record";

export default function ServiceEventsPage() {
  const { property, service } = mockRecord;

  const latestEvent = [...service.timeline].sort((a, b) =>
    b.eventAt.localeCompare(a.eventAt)
  )[0];

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

  <h1>Service Events</h1>
  <p>
    Service Events preserves visit history, findings, actions, and continuity so the
    record shows what happened, when it happened, and what changed.
  </p>

  <div className="subpage-nav">
    <Link href="/" className="subpage-nav-home">Back to Home</Link>

    <div className="subpage-nav-links">
      <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
      <Link href="/prevention" className="subnav-pill">Prevention</Link>
      <Link href="/voice" className="subnav-pill">Voice</Link>
      <span  className="subnav-current-dot"  aria-hidden="true">&bull;</span>
      <Link href="/integrity" className="subnav-pill">Integrity</Link>
    </div>
  </div>
</section>


      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Service Summary</h2>
            <p className="muted">
              {property.streetAddress}, {property.city}, {property.state} {property.zip}
            </p>
          </div>
          <div className="status-pill">
            Timeline events: {service.timeline.length}
          </div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Latest recorded event</div>
            <div className="metric-value small-value">
              {latestEvent ? latestEvent.title : "No event recorded"}
            </div>
            <div className="muted small">
              {latestEvent ? latestEvent.eventAt : "N/A"}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Open unresolved issues</div>
            <div className="metric-value">
              {service.unresolvedIssues.length}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Service Timeline</h2>
            <p className="muted">
              Chronological continuity for inspections, repairs, updates, and review events.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {[...service.timeline]
            .sort((a, b) => b.eventAt.localeCompare(a.eventAt))
            .map((event) => (
              <div className="list-card" key={event.id}>
                <strong>{event.title}</strong>
                <div>{event.description}</div>
                <div className="muted small">
                  {event.eventAt} | Source: {event.source} | Related object: {event.relatedObjectId ?? "N/A"}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Unresolved Issues</h2>
            <p className="muted">
              Items that still need action, verification, or follow-through.
            </p>
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

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Yearly Updates</h2>
            <p className="muted">
              Recorded annual review and update checkpoints.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {service.yearlyUpdates.map((update) => (
            <div className="list-card" key={update.id}>
              <strong>{update.title}</strong>
              <div>{update.description}</div>
              <div className="muted small">
                {update.eventAt} | Source: {update.source}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


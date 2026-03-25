import Image from "next/image";
import Link from "next/link";
import SectionCard from "../../components/SectionCard";
import { mockRecord } from "../../lib/mock-record";
import {
  buildSectionIntegrityRollup,
  resolveTruth,
} from "../../lib/property-workspace-v1";
import type { TruthListItem } from "../../lib/types";

export default function ServiceEventsPage() {
  const { property, service } = mockRecord;

  const timelineItems: TruthListItem[] = [...(service?.timeline ?? [])]
    .sort((a: any, b: any) => String(b.eventAt).localeCompare(String(a.eventAt)))
    .map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      meta: `${event.eventAt} | Source: ${event.source} | Related object: ${event.relatedObjectIds ?? "N/A"}`,
      truth: resolveTruth({
        status: event.status ?? "reported",
        hasEvidence: Boolean(event.eventAt || event.source),
        reported: true,
      }),
    }));

  const unresolvedItems: TruthListItem[] = (service?.unresolvedIssues ?? []).map((issue: any) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    meta: `Severity: ${issue.severity} | Status: ${issue.status} | Identified: ${issue.identifiedAt}`,
    truth: resolveTruth({
      status: issue.status,
      hasEvidence: Boolean(issue.identifiedAt),
      blockerType:
        String(issue.status ?? "").toLowerCase() !== "resolved"
          ? "missing_verification"
          : undefined,
      blockerReason:
        String(issue.status ?? "").toLowerCase() !== "resolved"
          ? "Issue remains open or under review."
          : undefined,
      nextActionText:
        String(issue.status ?? "").toLowerCase() !== "resolved"
          ? "Confirm resolution or update issue state."
          : undefined,
    }),
  }));

  const yearlyUpdateItems: TruthListItem[] = (service?.yearlyUpdates ?? []).map((update: any) => ({
    id: update.id,
    title: update.title,
    description: update.description,
    meta: `${update.eventAt} | Source: ${update.source}`,
    truth: resolveTruth({
      status: "reported",
      hasEvidence: Boolean(update.eventAt || update.source),
      reported: true,
    }),
  }));

  const latestEvent = timelineItems[0];

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
          Service Events now surfaces which continuity items are verified, which remain reported only, and which unresolved items still block trust in the record.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>
          <div className="subpage-nav-links">
            <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
            <Link href="/prevention" className="subnav-pill">Prevention</Link>
            <Link href="/voice" className="subnav-pill">Voice</Link>
            <span className="subnav-current-dot" aria-hidden="true">&bull;</span>
            <Link href="/integrity" className="subnav-pill">Integrity</Link>
          </div>
        </div>
      </section>

      <SectionCard
        title="Service Summary"
        subtitle={`${property.streetAddress}, ${property.city}, ${property.state} ${property.zip}`}
        right={<span className="status-pill">Timeline events: {timelineItems.length}</span>}
        rollup={buildSectionIntegrityRollup([
          ...timelineItems.map((item) => item.truth),
          ...unresolvedItems.map((item) => item.truth),
          ...yearlyUpdateItems.map((item) => item.truth),
        ])}
      >
        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Latest recorded event</div>
            <div className="metric-value small-value">
              {latestEvent ? latestEvent.title : "No event recorded"}
            </div>
            <div className="muted small">{latestEvent ? latestEvent.meta : "N/A"}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Open unresolved issues</div>
            <div className="metric-value">{unresolvedItems.length}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Service Timeline"
        subtitle="Chronological continuity for inspections, repairs, updates, and review events."
        rollup={buildSectionIntegrityRollup(timelineItems.map((item) => item.truth))}
      >
        <div className="bullet-list">
          {timelineItems.map((item) => (
            <div className="list-card" key={item.id}>
              <div className="detail-card-top">
                <strong>{item.title}</strong>
                <span className="status-pill">{item.truth.truthStatus}</span>
              </div>
              <div>{item.description}</div>
              <div className="muted small">{item.meta}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Unresolved Issues"
        subtitle="Items that still need action, verification, or follow-through."
        rollup={buildSectionIntegrityRollup(unresolvedItems.map((item) => item.truth))}
      >
        <div className="bullet-list">
          {unresolvedItems.length ? (
            unresolvedItems.map((item) => (
              <div className="list-card" key={item.id}>
                <div className="detail-card-top">
                  <strong>{item.title}</strong>
                  <span className="status-pill">{item.truth.truthStatus}</span>
                </div>
                <div>{item.description}</div>
                <div className="muted small">{item.meta}</div>
                {item.truth.blockerReason ? (
                  <div className="muted small">Blocker: {item.truth.blockerReason}</div>
                ) : null}
                {item.truth.nextActionText ? (
                  <div className="muted small">Next: {item.truth.nextActionText}</div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="list-card">
              <strong>No unresolved issues</strong>
              <div className="muted small">No blockers currently surfaced.</div>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Yearly Updates"
        subtitle="Recorded annual review and update checkpoints."
        rollup={buildSectionIntegrityRollup(yearlyUpdateItems.map((item) => item.truth))}
      >
        <div className="bullet-list">
          {yearlyUpdateItems.map((item) => (
            <div className="list-card" key={item.id}>
              <div className="detail-card-top">
                <strong>{item.title}</strong>
                <span className="status-pill">{item.truth.truthStatus}</span>
              </div>
              <div>{item.description}</div>
              <div className="muted small">{item.meta}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </main>
  );
}

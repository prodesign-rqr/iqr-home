import Image from "next/image";
import Link from "next/link";
import SectionCard from "../../components/SectionCard";
import { mockRecord } from "../../lib/mock-record";
import {
  buildSectionIntegrityRollup,
  resolveTruth,
} from "../../lib/property-workspace-v1";
import type { TruthListItem } from "../../lib/types";

export default function IntegrityPage() {
  const { property, integrity, service } = mockRecord;

  const integrityItems: TruthListItem[] = (integrity?.issues ?? []).map((issue: any) => ({
    id: issue.id,
    title: issue.message,
    description: issue.category,
    meta: `Severity: ${issue.severity} | Object type: ${issue.objectType ?? "N/A"} | Object ID: ${issue.objectId ?? "N/A"}`,
    truth: resolveTruth({
      status: issue.status ?? "open",
      hasEvidence: Boolean(issue.objectId || issue.objectType),
      blockerType: "missing_context",
      blockerReason: "Structured house record still has unresolved integrity gaps.",
      nextActionText: "Resolve missing or inconsistent record details.",
    }),
  }));

  const serviceIssueItems: TruthListItem[] = (service?.unresolvedIssues ?? []).map((issue: any) => ({
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
          ? "Continuity problem is still open or under watch."
          : undefined,
      nextActionText:
        String(issue.status ?? "").toLowerCase() !== "resolved"
          ? "Confirm resolution or update issue state."
          : undefined,
    }),
  }));

  const summaryRollup = buildSectionIntegrityRollup([
    ...integrityItems.map((item) => item.truth),
    ...serviceIssueItems.map((item) => item.truth),
  ]);

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
          Integrity now separates missing record context, unresolved continuity problems, and items that are merely present but not yet trustworthy.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>
          <div className="subpage-nav-links">
            <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
            <Link href="/prevention" className="subnav-pill">Prevention</Link>
            <Link href="/voice" className="subnav-pill">Voice</Link>
            <Link href="/service-events" className="subnav-pill">Service Events</Link>
            <span className="subnav-current-dot" aria-hidden="true">&bull;</span>
          </div>
        </div>
      </section>

      <SectionCard
        title="Integrity Summary"
        subtitle={`${property.streetAddress}, ${property.city}, ${property.state} ${property.zip}`}
        right={<span className="status-pill">Record status: {mockRecord.meta.recordStatus}</span>}
        rollup={summaryRollup}
      >
        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Structured record issues</div>
            <div className="metric-value">{integrityItems.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Continuity issues</div>
            <div className="metric-value">{serviceIssueItems.length}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Structured Record Issues"
        subtitle="Issues generated from the structured house record."
        rollup={buildSectionIntegrityRollup(integrityItems.map((item) => item.truth))}
      >
        <div className="bullet-list">
          {integrityItems.length ? (
            integrityItems.map((item) => (
              <div className="list-card" key={item.id}>
                <div className="detail-card-top">
                  <strong>{item.title}</strong>
                  <span className="status-pill">{item.truth.truthStatus}</span>
                </div>
                <div>{item.description}</div>
                <div className="muted small">{item.meta}</div>
                <div className="muted small">Blocker: {item.truth.blockerReason}</div>
                <div className="muted small">Next: {item.truth.nextActionText}</div>
              </div>
            ))
          ) : (
            <div className="list-card">
              <strong>No structured record issues</strong>
              <div className="muted small">No data yet</div>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Unresolved Service Issues"
        subtitle="Continuity problems still open or under watch."
        rollup={buildSectionIntegrityRollup(serviceIssueItems.map((item) => item.truth))}
      >
        <div className="bullet-list">
          {serviceIssueItems.length ? (
            serviceIssueItems.map((item) => (
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
              <strong>No unresolved service issues</strong>
              <div className="muted small">No blockers currently surfaced.</div>
            </div>
          )}
        </div>
      </SectionCard>
    </main>
  );
}

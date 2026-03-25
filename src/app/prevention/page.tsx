import Image from "next/image";
import Link from "next/link";
import ProofOfPreventionCard from "../../components/ProofOfPreventionCard";
import SectionCard from "../../components/SectionCard";
import { mockRecord } from "../../lib/mock-record";
import {
  buildSectionIntegrityRollup,
  resolveTruth,
} from "../../lib/property-workspace-v1";
import type { PreventionCardItem } from "../../lib/types";

export default function PreventionPage() {
  const { property, meta, prevention } = mockRecord;

  const items: PreventionCardItem[] = (prevention?.riskProtectionPoints ?? []).map((point: any) => {
    const truth = resolveTruth({
      verification: point.verification,
      status: point.localShutoffPresent ? "protected" : point.verification,
      hasEvidence: Boolean(point.protectedAsset || point.location),
      lastVerifiedAt: point.lastVerified ?? point.verifiedAt,
      blockerType:
        point.verification !== "verified" ? "missing_verification" : undefined,
      blockerReason:
        point.verification !== "verified"
          ? "Protection point still needs follow-up or confirmation."
          : undefined,
      nextActionText:
        point.verification !== "verified" ? "Verify protection point." : undefined,
    });

    return {
      title: point.protectedAsset,
      location: point.location,
      details: [
        { label: "Verification", value: point.verification },
        { label: "Local shutoff", value: point.localShutoffPresent ? "Yes" : "No" },
        { label: "Notes", value: point.notes ?? "None" },
      ],
      truth,
    };
  });

  const reviewItems = items.filter((item) => item.truth.truthStatus !== "Verified");
  const rollup = buildSectionIntegrityRollup(items.map((item) => item.truth));

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

        <h1>Proof of Prevention</h1>
        <p>
          Prevention now shows which protection points are verified, which are merely reported, and which are still blocked by missing verification.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>
          <div className="subpage-nav-links">
            <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
            <span className="subnav-current-dot" aria-hidden="true">&bull;</span>
            <Link href="/voice" className="subnav-pill">Voice</Link>
            <Link href="/service-events" className="subnav-pill">Service Events</Link>
            <Link href="/integrity" className="subnav-pill">Integrity</Link>
          </div>
        </div>
      </section>

      <SectionCard
        title="Prevention Summary"
        subtitle="Structured mitigation posture for the property record."
        right={<span className="status-pill">Status: {meta.recordStatus}</span>}
        rollup={rollup}
      >
        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Street Address</div>
            <div className="metric-value small-value">{property.streetAddress}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Protection points</div>
            <div className="metric-value">{items.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Verified</div>
            <div className="metric-value">{rollup.verifiedCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Needs review</div>
            <div className="metric-value">{reviewItems.length}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Protected Risk Points"
        subtitle="Structured protection points tied to water and equipment risk."
        rollup={rollup}
      >
        <div className="bullet-list">
          {items.map((item) => (
            <ProofOfPreventionCard key={`${item.title}-${item.location}`} item={item} />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Review Flags"
        subtitle="Protection points that still need follow-up or confirmation."
        rollup={buildSectionIntegrityRollup(reviewItems.map((item) => item.truth))}
      >
        <div className="bullet-list">
          {reviewItems.length ? (
            reviewItems.map((item) => (
              <ProofOfPreventionCard key={`review-${item.title}-${item.location}`} item={item} />
            ))
          ) : (
            <div className="list-card">
              <strong>No review flags</strong>
              <div className="muted small">All surfaced protection points are currently verified.</div>
            </div>
          )}
        </div>
      </SectionCard>
    </main>
  );
}

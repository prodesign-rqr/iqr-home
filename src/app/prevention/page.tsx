import Image from "next/image";
import Link from "next/link";
import { mockRecord } from "../../lib/mock-record";
 
export default function PreventionPage() {
  const { property, meta, prevention } = mockRecord;
 
  const needsReviewCount = prevention.riskProtectionPoints.filter(
    (point) => point.verification !== "verified"
  ).length;
 
  const withShutoffCount = prevention.riskProtectionPoints.filter(
    (point) => point.localShutoffPresent
  ).length;
 
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
          Prevention makes the insurance and continuity story tangible by showing what is
          protected, what mitigation is in place, and what still needs verification.
        </p>
 
        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>
 
          <div className="subpage-nav-links">
            <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
            <span  className="subnav-current-dot"  aria-hidden="true">&bull;</span>
            <Link href="/voice" className="subnav-pill">Voice</Link>
            <Link href="/service-events" className="subnav-pill">Service Events</Link>
            <Link href="/integrity" className="subnav-pill">Integrity</Link>
          </div>
        </div>
      </section>
 
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Prevention Summary</h2>
            <p className="muted">Structured mitigation posture for the property record.</p>
          </div>
          <div className="status-pill">Status: {meta.recordStatus}</div>
        </div>
 
        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Street Address</div>
            <div className="metric-value small-value">{property.streetAddress}</div>
          </div>
 
          <div className="metric-card">
            <div className="metric-label">Protection points</div>
            <div className="metric-value">{prevention.riskProtectionPoints.length}</div>
          </div>
 
          <div className="metric-card">
            <div className="metric-label">Local shutoffs confirmed</div>
            <div className="metric-value">{withShutoffCount}</div>
          </div>
 
          <div className="metric-card">
            <div className="metric-label">Needs review</div>
            <div className="metric-value">{needsReviewCount}</div>
          </div>
        </div>
      </section>
 
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Protected Risk Points</h2>
            <p className="muted">
              Structured protection points tied to water and equipment risk.
            </p>
          </div>
        </div>
 
        <div className="bullet-list">
          {prevention.riskProtectionPoints.map((point) => (
            <div className="list-card" key={point.id}>
              <strong>{point.protectedAsset}</strong>
              <div>{point.location}</div>
              <div className="muted small">
                Verification: {point.verification} | Local shutoff:{" "}
                {point.localShutoffPresent ? "Yes" : "No"}
              </div>
              {point.notes ? (
                <div className="muted small">Notes: {point.notes}</div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
 
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Review Flags</h2>
            <p className="muted">
              Protection points that still need follow-up or confirmation.
            </p>
          </div>
        </div>
 
        <div className="bullet-list">
          {prevention.riskProtectionPoints
            .filter((point) => point.verification !== "verified")
            .map((point) => (
              <div className="list-card" key={`review-${point.id}`}>
                <strong>{point.protectedAsset}</strong>
                <div>{point.location}</div>
                <div className="muted small">
                  Verification: {point.verification} | Local shutoff:{" "}
                  {point.localShutoffPresent ? "Yes" : "No"}
                </div>
                {point.notes ? (
                  <div className="muted small">Notes: {point.notes}</div>
                ) : null}
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  onboardingFlow,
  onboardingProperties,
  onboardingStatuses,
} from "../../lib/onboarding-pipeline-v1";

function countByStatus(status: string) {
  return onboardingProperties.filter((property) => property.currentStatus === status).length;
}

export default function HQPage() {
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

        <h1>HQ Admin</h1>
        <p>
          IQR HQ oversight for onboarding review, status control, record correction,
          and startup release decisions. This is the admin side of workflow support v1.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">
            Back to Home
          </Link>
          <div className="subpage-nav-links">
            <Link href="/partner" className="subpage-nav-link">
              Partner Entry
            </Link>
            <Link href="/partner/questionnaire" className="subpage-nav-link">
              Questionnaire v1
            </Link>
            <Link href="/partner/outputs" className="subpage-nav-link">
              Outputs
            </Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Onboarding Pipeline</h2>
            <p className="muted">Status buckets required for HQ review visibility and control.</p>
          </div>
          <div className="status-pill">HQ Protected</div>
        </div>

        <div className="summary-grid five-up">
          {onboardingStatuses.map((status) => (
            <div className="summary-card compact" key={status}>
              <div className="status-pill">{status}</div>
              <h3>{countByStatus(status)}</h3>
              <p>{status} properties</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Workflow Control Rail</h2>
            <p className="muted">The same flow, seen from HQ with review responsibility attached.</p>
          </div>
        </div>

        <div className="workflow-rail">
          {onboardingFlow.map((step, index) => (
            <div className="workflow-step" key={step}>
              <div className="workflow-index">{index + 1}</div>
              <div>
                <strong>{step}</strong>
                <div className="muted small">HQ review stays attached to this stage.</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Property Onboarding Queue</h2>
            <p className="muted">Mock queue for status history, next action control, and setup review.</p>
          </div>
        </div>

        <div className="pipeline-board">
          {onboardingProperties.map((property) => (
            <div className="pipeline-card" key={property.id}>
              <div className="pipeline-card-top">
                <div>
                  <h3>{property.propertyName}</h3>
                  <p className="muted">{property.streetAddress}</p>
                </div>
                <div className="status-pill">{property.currentStatus}</div>
              </div>

              <div className="meta-grid">
                <div>
                  <strong>Property ID</strong>
                  <div>{property.id}</div>
                </div>
                <div>
                  <strong>Parcel/APN</strong>
                  <div>{property.parcelApn}</div>
                </div>
                <div>
                  <strong>Partner</strong>
                  <div>{property.partnerName}</div>
                </div>
                <div>
                  <strong>Continuity owner</strong>
                  <div>{property.continuityOwner}</div>
                </div>
              </div>

              <p>
                <strong>Next action:</strong> {property.nextAction}
              </p>
              <p className="muted">{property.notes}</p>

              <div className="badge-row">
                {property.startupOutputs.map((item) => (
                  <span className="mini-badge" key={item}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="history-table">
                <div className="history-row history-head">
                  <div>Status</div>
                  <div>Timestamp</div>
                  <div>Changed by</div>
                  <div>Notes</div>
                </div>
                {property.statusHistory.map((entry, index) => (
                  <div className="history-row" key={`${property.id}-${index}`}>
                    <div>{entry.status}</div>
                    <div>{entry.timestamp}</div>
                    <div>{entry.changedBy}</div>
                    <div>{entry.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


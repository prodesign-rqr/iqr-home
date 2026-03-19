import Image from "next/image";
import Link from "next/link";

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

        <h1>IQR HQ Admin</h1>
        <p>
          Separate HQ entry for partner management, configurator review, record correction,
          onboarding pipeline control, and support functions.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>

          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">Partner Entry</Link>
            <Link href="/partner/questionnaire" className="subnav-pill">Questionnaire v1</Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Onboarding Pipeline</h2>
            <p className="muted">HQ receives new-property alerts and controls setup review.</p>
          </div>
          <div className="status-pill">HQ Protected</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card"><div className="metric-label">New</div><div className="metric-value">3</div></div>
          <div className="metric-card"><div className="metric-label">In Process</div><div className="metric-value">5</div></div>
          <div className="metric-card"><div className="metric-label">Needs Additional Information</div><div className="metric-value">2</div></div>
          <div className="metric-card"><div className="metric-label">Ready to Ship</div><div className="metric-value">4</div></div>
          <div className="metric-card"><div className="metric-label">Completed</div><div className="metric-value">18</div></div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Status History Requirements</h2>
            <p className="muted">Every property must preserve onboarding history as part of continuity.</p>
          </div>
        </div>

        <div className="bullet-list">
          <div className="list-card"><strong>Status</strong><div>New, In Process, Needs Additional Information, Ready to Ship, Completed.</div></div>
          <div className="list-card"><strong>Timestamp</strong><div>Every status change must include the exact recorded time.</div></div>
          <div className="list-card"><strong>Changed by</strong><div>Partner or HQ user identity must be preserved.</div></div>
          <div className="list-card"><strong>Notes</strong><div>Short explanation of what changed or what is blocking progress.</div></div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>HQ Functions in Scope</h2>
            <p className="muted">This phase supports workflow control before deeper automation.</p>
          </div>
        </div>

        <div className="bullet-list">
          <div className="list-card"><strong>Partner management</strong><div>Review and support partner submissions without exposing HQ controls publicly.</div></div>
          <div className="list-card"><strong>Property oversight</strong><div>Watch onboarding progress, startup outputs, and record completion.</div></div>
          <div className="list-card"><strong>Record correction</strong><div>Correct structured data when uploads, OCR, or intake answers need adjustment.</div></div>
          <div className="list-card"><strong>Configurator review</strong><div>Validate startup outputs before release to partner operations and field install.</div></div>
        </div>
      </section>
    </main>
  );
}


import Image from "next/image";
import Link from "next/link";

export default function PartnerPage() {
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

        <h1>Partner Entry</h1>
        <p>
          Partner-protected workspace for TIS owners, salespeople, project managers,
          and field technicians. This is where Questionnaire v1, the configurator,
          startup outputs, and property setup flow live.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>

          <div className="subpage-nav-links">
            <Link href="/partner/questionnaire" className="subnav-pill">Questionnaire v1</Link>
            <Link href="/hq" className="subnav-pill">HQ Admin</Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Partner Workspace</h2>
            <p className="muted">
              First buyer: Technology Integration Specialist owner.
            </p>
          </div>
          <div className="status-pill">Partner Protected</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Primary use case</div>
            <div className="metric-value small-value">Managed-services continuity</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Record focus</div>
            <div className="metric-value small-value">Rack, network, AV, control, YoLink</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Output path</div>
            <div className="metric-value small-value">Questionnaire → Configurator</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Current phase</div>
            <div className="metric-value small-value">Questionnaire v1 scaffold</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>What Starts Here</h2>
            <p className="muted">
              The Design Sales Questionnaire is the first structured step in building the house’s memory.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          <div className="list-card">
            <strong>Design Sales Questionnaire</strong>
            <div>Structured intake for property basics, people, AV / IT, systems, monitoring, Counter Card, and stewardship preferences.</div>
          </div>

          <div className="list-card">
            <strong>System Design Configurator</strong>
            <div>Transforms questionnaire answers into bounded startup outputs and a structured property record shell.</div>
          </div>

          <div className="list-card">
            <strong>Startup Outputs</strong>
            <div>QR tag plan, Counter Card config, startup kit list, field install checklist, and property setup shell.</div>
          </div>
        </div>
      </section>
    </main>
  );
}


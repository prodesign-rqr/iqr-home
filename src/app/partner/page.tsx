import Image from "next/image";
import Link from "next/link";
import { onboardingFlow } from "../../lib/onboarding-pipeline-v1";

const modules = [
  {
    title: "Design Sales Questionnaire v1",
    href: "/partner/questionnaire",
    status: "Active",
    body: "Structured intake for property basics, AV / IT, monitoring, and service preferences.",
  },
  {
    title: "Configurator Outputs v1",
    href: "/partner/outputs",
    status: "Active",
    body: "Review QR tags, counter card, startup kit, property shell, and field install checklist.",
  },
  {
    title: "HQ Admin Pipeline",
    href: "/hq",
    status: "Review",
    body: "Shared visibility into onboarding status, handoff history, and next action owners.",
  },
];

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
          <Link href="/" className="subpage-nav-home">
            Back to Home
          </Link>
          <div className="subpage-nav-links">
            <Link href="/partner/questionnaire" className="subpage-nav-link is-active">
              Questionnaire v1
            </Link>
            <Link href="/partner/outputs" className="subpage-nav-link">
              Outputs
            </Link>
            <Link href="/hq" className="subpage-nav-link">
              HQ Admin
            </Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Required Platform Flow</h2>
            <p className="muted">Partner workflow support v1 inside the current app.</p>
          </div>
          <div className="status-pill">Partner Protected</div>
        </div>

        <div className="workflow-rail">
          {onboardingFlow.map((step, index) => (
            <div className="workflow-step" key={step}>
              <div className="workflow-index">{index + 1}</div>
              <div>
                <strong>{step}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Active Modules</h2>
            <p className="muted">Use these as the working doors into the intake and setup flow.</p>
          </div>
        </div>

        <div className="summary-grid">
          {modules.map((module) => (
            <div className="summary-card" key={module.title}>
              <div className="status-pill">{module.status}</div>
              <h3>{module.title}</h3>
              <p>{module.body}</p>
              <Link href={module.href} className="button-secondary inline-button">
                Open module
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Role Coverage</h2>
            <p className="muted">Partner entry stays focused on structured intake and startup preparation.</p>
          </div>
        </div>

        <div className="spec-table">
          <div className="spec-table-head four-col">
            <div>Role</div>
            <div>Primary use</div>
            <div>What they touch</div>
            <div>Outcome</div>
          </div>
          <div className="spec-table-row four-col">
            <div>TIS Owner</div>
            <div>Commercial decision + scope control</div>
            <div>Questionnaire, outputs, HQ review</div>
            <div>Approves startup package</div>
          </div>
          <div className="spec-table-row four-col">
            <div>Salesperson</div>
            <div>Initial intake</div>
            <div>Property basics, people / roles, service preferences</div>
            <div>Creates structured starting record</div>
          </div>
          <div className="spec-table-row four-col">
            <div>Project Manager</div>
            <div>Workflow coordination</div>
            <div>Outputs review, startup kit, install plan</div>
            <div>Moves property toward ship / install</div>
          </div>
          <div className="spec-table-row four-col">
            <div>Field Technician</div>
            <div>Install execution</div>
            <div>Checklist, labels, property shell confirmation</div>
            <div>Builds the house memory in the field</div>
          </div>
        </div>
      </section>
    </main>
  );
}


import Image from "next/image";
import Link from "next/link";

const primaryRoutes = [
  {
    title: "Partner Entry",
    href: "/partner",
    tag: "Workspace",
    detail:
      "Partner-side intake, startup-packet readiness, and operational handoff into the property workflow.",
    cta: "Open Partner Entry",
    buttonClass: "button-primary",
  },
  {
    title: "Questionnaire",
    href: "/partner/questionnaire",
    tag: "Intake",
    detail:
      "Structured sales intake that builds the house record through mapped answers, controlled inputs, and saved draft flow.",
    cta: "Open Questionnaire",
    buttonClass: "button-primary",
  },
  {
    title: "Startup Outputs",
    href: "/partner/outputs",
    tag: "Outputs",
    detail:
      "Review QR tag planning, startup kit contents, property shell blocks, field checklist items, and Counter Card readiness.",
    cta: "Open Startup Outputs",
    buttonClass: "button-primary",
  },
  {
    title: "HQ Admin",
    href: "/hq",
    tag: "Oversight",
    detail:
      "HQ-side onboarding visibility, status buckets, startup release decisions, and continuity oversight.",
    cta: "Open HQ Admin",
    buttonClass: "button-secondary",
  },
];

const supportRoutes = [
  {
    title: "Guest",
    href: "/guest",
    detail: "Public-facing guest lane for permitted access and house-explains-itself guidance.",
  },
  {
    title: "Integrity",
    href: "/integrity",
    detail: "Record-integrity layer for missing information, unresolved issues, and verification gaps.",
  },
  {
    title: "Prevention",
    href: "/prevention",
    detail: "Proof-of-prevention and risk-mitigation framing for monitored and documented protection points.",
  },
  {
    title: "Service Events",
    href: "/service-events",
    detail: "Meaningful service history and continuity events attached to the property record.",
  },
  {
    title: "Telemetry",
    href: "/telemetry",
    detail: "Property telemetry and continuity layer centered on meaningful events, not noisy raw streams.",
  },
  {
    title: "Voice",
    href: "/voice",
    detail: "Voice lane for structured factual query support against the property record.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="subpage-logo-wrap">
          <Image
            src="/iqr-home-logo-tight-WonB.png"
            alt="IQR Home"
            width={150}
            height={105}
            className="subpage-logo"
            priority
          />
        </div>

        <h1>IQR Home</h1>
        <p>
          A property-centered operations portal built around continuity, record integrity,
          field execution, and proof. The property record belongs to the house, not the homeowner.
        </p>

        <div className="status-pill">Property Telemetry + Continuity Layer</div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Primary Entry Points</h2>
            <p className="muted">
              Start here to move from intake to startup outputs and HQ oversight without guesswork.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          {primaryRoutes.map((route) => (
            <div className="output-detail-card" key={route.href}>
              <div className="detail-card-top">
                <strong>{route.title}</strong>
                <span className="qty-chip">{route.tag}</span>
              </div>
              <p>{route.detail}</p>
              <Link href={route.href} className={`${route.buttonClass} inline-button`}>
                {route.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Operational Backbone</h2>
            <p className="muted">
              Questionnaire → Validation → Compilation → Configurator → Startup Outputs →
              Property Record Shell → Home Kit / Startup Kit → Document Intake →
              Field Install Plan → On-Site Installation → Record Population →
              Record Integrity Review → Go Live → Ongoing Stewardship
            </p>
          </div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Center of gravity</div>
            <div className="metric-value">Property record</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Product type</div>
            <div className="metric-value">Operations portal</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Messaging layer</div>
            <div className="metric-value">Slack prompt layer</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Source of truth</div>
            <div className="metric-value">IQR record</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Secondary Modules</h2>
            <p className="muted">
              Supporting routes already in the app and available for the property continuity model.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          {supportRoutes.map((route) => (
            <div className="output-detail-card" key={route.href}>
              <div className="detail-card-top">
                <strong>{route.title}</strong>
                <span className="qty-chip">Module</span>
              </div>
              <p>{route.detail}</p>
              <Link href={route.href} className="button-secondary inline-button">
                Open {route.title}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


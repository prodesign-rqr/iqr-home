import Image from "next/image";
import Link from "next/link";
import { questionnaireSpec, answerMappings } from "../../../lib/questionnaire-v1";

export default function OutputsPage() {
  return (
    <main>
      <section className="hero">
        <div className="subpage-logo-wrap">
          <Image src="/iqr-home-logo-tight-WonB.png" alt="IQR Home" width={140} height={98} className="subpage-logo" priority />
        </div>
        <h1>Configurator Outputs v1</h1>
        <p>Structured outputs generated from the Design Sales Questionnaire.</p>
        <div className="subpage-nav">
          <Link href="/partner/questionnaire" className="subpage-nav-home">Back to Questionnaire</Link>
          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">Partner Entry</Link>
            <Link href="/hq" className="subnav-pill">HQ Admin</Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Questionnaire Section Spec</h2>
            <p className="muted">Every answer must map to a record object and output.</p>
          </div>
          <div className="status-pill">Spec v1</div>
        </div>

        <div className="spec-table">
          <div className="spec-table-head">
            <div>Section</div><div>Purpose</div><div>Fields</div>
          </div>
          {questionnaireSpec.map((section) => (
            <div className="spec-table-row" key={section.title}>
              <div><strong>{section.title}</strong></div>
              <div>{section.purpose}</div>
              <div>{section.fields.length}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Answer-to-Output Mapping</h2>
            <p className="muted">Bridge from intake answers to startup behavior.</p>
          </div>
        </div>

        <div className="bullet-list">
          {answerMappings.map(([answer, drives]) => (
            <div className="list-card" key={answer}>
              <strong>{answer}</strong>
              <ul className="clean-list">
                {drives.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Startup Output Views</h2>
            <p className="muted">Initial output pages generated from Questionnaire v1.</p>
          </div>
        </div>

        <div className="output-card-grid">
          <Link href="/partner/outputs/qr-tag-plan" className="output-card"><strong>QR Tag Plan</strong><span>Label set and destinations.</span></Link>
          <Link href="/partner/outputs/counter-card" className="output-card"><strong>Counter Card Config</strong><span>Public / private access behavior.</span></Link>
          <Link href="/partner/outputs/startup-kit" className="output-card"><strong>Startup Kit List</strong><span>Core onboarding kit contents.</span></Link>
          <Link href="/partner/outputs/property-record-shell" className="output-card"><strong>Property Record Shell</strong><span>Structured object buckets.</span></Link>
          <Link href="/partner/outputs/field-install-checklist" className="output-card"><strong>Field Install Checklist</strong><span>Install and documentation tasks.</span></Link>
        </div>
      </section>
    </main>
  );
}


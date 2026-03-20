"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { loadQuestionnaireStateV1 } from "../../../../lib/questionnaire-state-v1";
import { buildFieldInstallChecklist } from "../../../../lib/output-mappers-v1";

export default function FieldInstallChecklistPage() {
  const state = useMemo(() => loadQuestionnaireStateV1() as any, []);
  const items = useMemo(() => buildFieldInstallChecklist(state), [state]);

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
        <h1>Field Install Checklist</h1>
        <p>First-pass install tasks generated from the current saved questionnaire draft.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">
            Back to Outputs
          </Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Field Tasks</h2>
            <p className="muted">Use this list as the handoff between design intake and field execution.</p>
          </div>
          <div className="status-pill">Checklist</div>
        </div>

        <div className="output-detail-stack">
          {items.map((item, index) => (
            <div className="output-detail-card" key={`${item.task}-${index}`}>
              <div className="detail-card-top">
                <strong>{item.task}</strong>
                <span className="qty-chip">{item.owner}</span>
              </div>
              <p>{item.notes}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { loadQuestionnaireStateV1 } from "../../../../lib/questionnaire-state-v1";
import { buildStartupKit } from "../../../../lib/output-mappers-v1";

export default function StartupKitPage() {
  const state = useMemo(() => loadQuestionnaireStateV1() as any, []);
  const items = useMemo(() => buildStartupKit(state), [state]);

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
        <h1>Kit Contents v2</h1>
        <p>This list can later become quantity-aware and partner-specific.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">
            Back to Outputs
          </Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Startup Kit</h2>
            <p className="muted">First-pass startup package generated from the current saved draft.</p>
          </div>
          <div className="status-pill">Startup Kit</div>
        </div>

        <div className="output-detail-stack">
          {items.map((item) => (
            <div className="output-detail-card" key={item.label}>
              <div className="detail-card-top">
                <strong>{item.label}</strong>
                <span className="qty-chip">Included</span>
              </div>
              <p>{item.reason}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

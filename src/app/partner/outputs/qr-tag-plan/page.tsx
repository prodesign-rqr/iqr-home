"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { loadQuestionnaireStateV1 } from "../../../../lib/questionnaire-state-v1";
import { buildQrTagPlan } from "../../../../lib/output-mappers-v1";

export default function QrTagPlanPage() {
  const state = useMemo(() => loadQuestionnaireStateV1() as any, []);
  const items = useMemo(() => buildQrTagPlan(state), [state]);

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
        <h1>QR Tag Plan</h1>
        <p>Initial label set generated from the current saved questionnaire draft.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">
            Back to Outputs
          </Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Tag Set v2</h2>
            <p className="muted">Starting labels for rack, network, systems, and protection points.</p>
          </div>
          <div className="status-pill">QR Plan</div>
        </div>

        <div className="output-detail-stack">
          {items.length === 0 ? (
            <div className="output-detail-card">
              <div className="detail-card-top">
                <strong>No mapped tag items yet</strong>
                <span className="qty-chip">0</span>
              </div>
              <p>Save a questionnaire draft with real scope selections to generate the first-pass QR plan.</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="output-detail-card" key={item.code}>
                <div className="detail-card-top">
                  <strong>{item.label}</strong>
                  <span className="qty-chip">{item.code}</span>
                </div>
                <p>
                  <strong>Destination:</strong> {item.destination}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

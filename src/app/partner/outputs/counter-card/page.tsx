"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { loadQuestionnaireStateV1 } from "../../../../lib/questionnaire-state-v1";
import {
  buildCounterCardConfig,
  type CounterCardConfig,
} from "../../../../lib/output-mappers-v1";

export default function CounterCardOutputPage() {
  const state = useMemo(() => loadQuestionnaireStateV1(), []);
  const config: CounterCardConfig = useMemo(
    () => buildCounterCardConfig(state),
    [state]
  );

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
        <h1>Counter Card Config</h1>
        <p>First-pass counter card readiness based on the current saved draft.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">
            Back to Outputs
          </Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Counter Card Status</h2>
            <p className="muted">
              This page confirms whether the counter card is ready to be included
              in the startup flow.
            </p>
          </div>
          <div className="status-pill">Counter Card</div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Readiness</strong>
              <span className="qty-chip">
                {config.ready ? "Ready" : "Needs review"}
              </span>
            </div>
            <p>
              <strong>Enabled:</strong> {config.enabled ? "Yes" : "No"}
            </p>
            <p>
              <strong>Street address:</strong>{" "}
              {config.streetAddress || "Property address not set"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

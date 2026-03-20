"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { loadQuestionnaireStateV1 } from "../../../../lib/questionnaire-state-v1";
import { buildCounterCardConfig } from "../../../../lib/output-mappers-v1";

export default function CounterCardOutputPage() {
  const state = useMemo(() => loadQuestionnaireStateV1(), []);
  const items = useMemo(() => buildCounterCardConfig(state), [state]);

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

        <h1>Counter Card Configuration</h1>
        <p>Questionnaire-driven output for public access behavior and guest-facing card rules.</p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>

          <div className="subpage-nav-links">
            <Link href="/partner/questionnaire" className="subnav-pill">Questionnaire</Link>
            <Link href="/partner/outputs" className="subnav-pill">Outputs</Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Counter Card Output</h2>
            <p className="muted">Public entry must stay bounded to Scan-2-Know, Scan-2-Join, and allowed record surfaces.</p>
          </div>
        </div>

        <div className="bullet-list">
          {items.map((item, index) => (
            <div className="list-card" key={`${item.title}-${index}`}>
              <strong>{item.title}</strong>
              <div>{item.detail}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


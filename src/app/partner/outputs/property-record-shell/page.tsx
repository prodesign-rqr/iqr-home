"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { loadQuestionnaireStateV1 } from "../../../../lib/questionnaire-state-v1";
import { buildPropertyRecordShell } from "../../../../lib/output-mappers-v1";

export default function PropertyRecordShellPage() {
  const state = useMemo(() => loadQuestionnaireStateV1() as any, []);
  const blocks = useMemo(() => buildPropertyRecordShell(state), [state]);

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
        <h1>Property Record Shell</h1>
        <p>Structured shell blocks anchored to identity, continuity, and first-pass scope.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">
            Back to Outputs
          </Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Shell Blocks</h2>
            <p className="muted">This page defines the first-pass record scaffold generated from the draft.</p>
          </div>
          <div className="status-pill">Record Shell</div>
        </div>

        <div className="output-detail-stack">
          {blocks.map((block) => (
            <div className="output-detail-card" key={block.title}>
              <div className="detail-card-top">
                <strong>{block.title}</strong>
                <span className="qty-chip">{block.status}</span>
              </div>
              <p>{block.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

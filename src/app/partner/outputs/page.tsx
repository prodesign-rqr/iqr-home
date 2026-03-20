"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  loadQuestionnaireStateV1,
  hasSavedQuestionnaireDraft,
} from "../../../lib/questionnaire-state-v1";
import { buildOutputSummary } from "../../../lib/output-mappers-v1";

export default function PartnerOutputsPage() {
  const state = useMemo(() => loadQuestionnaireStateV1(), []);
  const summary = useMemo(() => buildOutputSummary(state), [state]);

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

        <h1>Startup Outputs</h1>
        <p>
          Configurator-driven views derived from the saved questionnaire state.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>

          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">Partner Entry</Link>
            <Link href="/partner/questionnaire" className="subnav-pill">Questionnaire</Link>
            <span className="subnav-current-dot" aria-hidden="true">&bull;</span>
            <Link href="/hq" className="subnav-pill">HQ Admin</Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Output Summary</h2>
            <p className="muted">
              {hasSavedQuestionnaireDraft(state)
                ? `Using saved draft from ${state._meta.lastSavedAt}`
                : "No saved draft detected yet. Fill out and save the questionnaire first."}
            </p>
          </div>
          <div className="status-pill">Configurator v1</div>
        </div>

        <div className="output-card-grid">
          <Link href="/partner/outputs/qr-tag-plan" className="output-card">
            <strong>QR Tag Plan</strong>
            <div>{summary.qrTagCount} mapped items</div>
          </Link>

          <Link href="/partner/outputs/counter-card" className="output-card">
            <strong>Counter Card Config</strong>
            <div>{summary.counterCardReady ? "Ready" : "Pending"}</div>
          </Link>

          <Link href="/partner/outputs/startup-kit" className="output-card">
            <strong>Startup Kit</strong>
            <div>{summary.startupKitCount} kit items</div>
          </Link>

          <Link href="/partner/outputs/property-record-shell" className="output-card">
            <strong>Property Record Shell</strong>
            <div>{summary.recordShellCount} shell blocks</div>
          </Link>

          <Link href="/partner/outputs/field-install-checklist" className="output-card">
            <strong>Field Install Checklist</strong>
            <div>{summary.checklistCount} field tasks</div>
          </Link>
        </div>
      </section>
    </main>
  );
}


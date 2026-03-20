"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { loadQuestionnaireStateV1 } from "../../../lib/questionnaire-state-v1";
import { buildOutputSummary } from "../../../lib/output-mappers-v1";

export default function OutputsPage() {
  const state = useMemo(() => loadQuestionnaireStateV1() as any, []);
  const summary = useMemo(() => buildOutputSummary(state), [state]);
  const savedAt = state?._meta?.lastSavedAt ?? "No saved draft timestamp";

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
        <h1>Configurator Outputs v2</h1>
        <p>Structured outputs generated from the Design Sales Questionnaire.</p>
        <div className="subpage-nav">
          <Link href="/partner/questionnaire" className="subpage-nav-home">
            Back to Questionnaire
          </Link>
          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">
              Partner Entry
            </Link>
            <span className="subnav-current-dot" aria-hidden="true">
              &bull;
            </span>
            <Link href="/hq" className="subnav-pill">
              HQ Admin
            </Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Output Summary</h2>
            <p className="muted">Using saved draft from {savedAt}</p>
          </div>
          <div className="status-pill">Slice 7 Pack A</div>
        </div>

        <div className="output-detail-stack">
          <Link href="/partner/outputs/qr-tag-plan" className="output-detail-card">
            <div className="detail-card-top">
              <strong>QR Tag Plan</strong>
              <span className="qty-chip">{summary.qrPlanCount} mapped items</span>
            </div>
            <p>Initial label set for rack, network, systems, and selected protection points.</p>
          </Link>

          <Link href="/partner/outputs/startup-kit" className="output-detail-card">
            <div className="detail-card-top">
              <strong>Startup Kit</strong>
              <span className="qty-chip">{summary.startupKitCount} kit items</span>
            </div>
            <p>First-pass startup package based on the current saved questionnaire draft.</p>
          </Link>

          <Link href="/partner/outputs/field-install-checklist" className="output-detail-card">
            <div className="detail-card-top">
              <strong>Field Install Checklist</strong>
              <span className="qty-chip">{summary.checklistCount} field tasks</span>
            </div>
            <p>First-pass install tasks generated from the current questionnaire scope.</p>
          </Link>

          <Link href="/partner/outputs/property-record-shell" className="output-detail-card">
            <div className="detail-card-top">
              <strong>Property Record Shell</strong>
              <span className="qty-chip">{summary.propertyRecordCount} shell blocks</span>
            </div>
            <p>Structured property record scaffold anchored to identity, continuity, and scope.</p>
          </Link>

          <Link href="/partner/outputs/counter-card" className="output-detail-card">
            <div className="detail-card-top">
              <strong>Counter Card Config</strong>
              <span className="qty-chip">{summary.counterCardReady ? "Ready" : "Pending"}</span>
            </div>
            <p>Kitchen counter card readiness for first-pass guest and homeowner orientation.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}

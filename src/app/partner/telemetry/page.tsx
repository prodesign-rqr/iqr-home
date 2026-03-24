"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  loadQuestionnaireStateV1,
  type QuestionnaireStateV1,
} from "../../../lib/questionnaire-state-v1";
import { buildSpatialIncidentTelemetryModel } from "../../../lib/spatial-incident-packets-v1";

export default function PartnerTelemetryPage() {
  const [state, setState] = useState<QuestionnaireStateV1 | null>(null);

  useEffect(() => {
    setState(loadQuestionnaireStateV1());
  }, []);

  const currentState = state ?? loadQuestionnaireStateV1();
  const telemetry = useMemo(
    () => buildSpatialIncidentTelemetryModel(currentState),
    [currentState],
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

        <h1>Spatial Incident Packet Engine</h1>
        <p>
          Telemetry foundation for turning meaningful property events into IQR-owned incident packets with spatial context.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">
            Back to Home
          </Link>

          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">
              Partner Entry
            </Link>
            <Link href="/partner/workspace" className="subnav-pill">
              Property Workspace
            </Link>
            <span className="subnav-pill current">Telemetry</span>
            <Link href="/hq/telemetry" className="subnav-pill">
              HQ Telemetry
            </Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>{telemetry.propertyName}</h2>
            <p className="muted">
              The property stays the anchor. The packet now has a preview surface, a detail view, and a prepared path toward generated output.
            </p>
          </div>
          <div className="status-pill">{telemetry.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Summary card</div>
            <div className="metric-value">
              {telemetry.packetPreviewSurface.incidentSummaryCard.statusBadge}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Primary recipient</div>
            <div className="metric-value">
              {telemetry.packetPreviewSurface.recipientSummary.primaryRecipient}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Assembly steps</div>
            <div className="metric-value">
              {telemetry.packetPreviewSurface.assemblySteps.length}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Artifact prep items</div>
            <div className="metric-value">
              {telemetry.packetPreviewSurface.generatedArtifactPrep.length}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Incident Summary Card</h2>
            <p className="muted">
              This is the packet preview surface that should let a human understand the incident before opening the full detail view.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.packetPreviewSurface.incidentSummaryCard.headline}</strong>
              <span className="qty-chip">
                {telemetry.packetPreviewSurface.incidentSummaryCard.statusBadge}
              </span>
            </div>
            <div className="bullet-list">
              {telemetry.packetPreviewSurface.incidentSummaryCard.summaryLines.map(
                (line, index) => (
                  <div className="list-card" key={`${line}-${index}`}>
                    <div>{line}</div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Source + Recipient Summary</h2>
            <p className="muted">
              Explicit source and recipient summaries make the packet preview usable before the full artifact is opened.
            </p>
          </div>
        </div>

        <div className="grid two-col">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Source Summary</strong>
              <span className="qty-chip">
                {telemetry.packetPreviewSurface.sourceSummary.severity}
              </span>
            </div>
            <p>
              <strong>Event type:</strong>{" "}
              {telemetry.packetPreviewSurface.sourceSummary.eventType}
            </p>
            <p>
              <strong>Source system:</strong>{" "}
              {telemetry.packetPreviewSurface.sourceSummary.sourceSystem}
            </p>
            <p>
              <strong>Source identifier:</strong>{" "}
              {telemetry.packetPreviewSurface.sourceSummary.sourceIdentifier}
            </p>
            <p>
              <strong>Protection point:</strong>{" "}
              {telemetry.packetPreviewSurface.sourceSummary.protectionPoint}
            </p>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Recipient Summary</strong>
              <span className="qty-chip">
                {telemetry.packetPreviewSurface.recipientSummary.readyRecipients.length} ready
              </span>
            </div>
            <p>
              <strong>Primary recipient:</strong>{" "}
              {telemetry.packetPreviewSurface.recipientSummary.primaryRecipient}
            </p>
            <p>
              <strong>Ready recipients:</strong>{" "}
              {telemetry.packetPreviewSurface.recipientSummary.readyRecipients.join(" | ") ||
                "None"}
            </p>
            <p>
              <strong>Pending recipients:</strong>{" "}
              {telemetry.packetPreviewSurface.recipientSummary.pendingRecipients.join(" | ") ||
                "None"}
            </p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Packet Assembly Sequence</h2>
            <p className="muted">
              The packet now has an explicit assembly structure before live delivery or generated output is added.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.packetPreviewSurface.assemblySteps.map((step, index) => (
            <div className="list-card" key={`${step.stepId}-${index}`}>
              <strong>{step.title}</strong>
              <div>{step.status}</div>
              <div>{step.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Generated Artifact Output Prep</h2>
            <p className="muted">
              These prep items are the bridge between packet detail composition and a future generated artifact output layer.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.packetPreviewSurface.generatedArtifactPrep.map((item, index) => (
            <div className="list-card" key={`${item.artifactName}-${index}`}>
              <strong>{item.artifactName}</strong>
              <div>{item.artifactFormat}</div>
              <div>{item.readiness}</div>
              <div>{item.note}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


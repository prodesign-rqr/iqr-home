"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  loadQuestionnaireStateV1,
  type QuestionnaireStateV1,
} from "../../../lib/questionnaire-state-v1";
import { buildSpatialIncidentTelemetryModel } from "../../../lib/spatial-incident-packets-v1";

export default function HQTelemetryPage() {
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

        <h1>HQ Telemetry</h1>
        <p>
          HQ-side view of incident packet requirements, routing posture, archive behavior, and return-path continuity.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">
            Back to Home
          </Link>

          <div className="subpage-nav-links">
            <Link href="/hq" className="subnav-pill">
              HQ Admin
            </Link>
            <Link href="/partner/workspace" className="subnav-pill">
              Property Workspace
            </Link>
            <Link href="/partner/telemetry" className="subnav-pill">
              Partner Telemetry
            </Link>
            <span className="subnav-pill current">HQ Telemetry</span>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Packet Continuity Layer</h2>
            <p className="muted">
              This layer adds the packet artifact shell, delivery record structure, and archive linkage model.
            </p>
          </div>
          <div className="status-pill">{telemetry.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Artifact status</div>
            <div className="metric-value">{telemetry.packetArtifact.artifactStatus}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Delivery entries</div>
            <div className="metric-value">{telemetry.deliveryLog.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Follow-up entries</div>
            <div className="metric-value">{telemetry.followUpTimeline.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Archive entries</div>
            <div className="metric-value">{telemetry.archiveEntries.length}</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Delivery Matrix</h2>
            <p className="muted">
              Live delivery will come later, but the routing shell and evidence trail are defined now.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.deliveryLog.map((entry, index) => (
            <div className="list-card" key={`${entry.recipientRole}-${index}`}>
              <strong>{entry.recipientRole}</strong>
              <div>{entry.recipientName}</div>
              <div>{entry.deliveryChannel}</div>
              <div>{entry.deliveryStatus}</div>
              <div>{entry.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Return + Archive Surfaces</h2>
            <p className="muted">
              The packet front door resolves back into the workspace and the property timeline.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Return paths</strong>
              <span className="qty-chip">Linked</span>
            </div>
            <p><strong>Workspace:</strong> {telemetry.returnPaths.workspace}</p>
            <p><strong>Outputs:</strong> {telemetry.returnPaths.outputs}</p>
            <p><strong>HQ:</strong> {telemetry.returnPaths.hq}</p>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Archive entries</strong>
              <span className="qty-chip">Permanent</span>
            </div>
            {telemetry.archiveEntries.map((entry, index) => (
              <p key={`${entry.entryType}-${index}`}>
                <strong>{entry.entryType}:</strong> {entry.note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Follow-Up Timeline</h2>
            <p className="muted">
              Follow-up continuity is part of the packet model, not an afterthought.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.followUpTimeline.map((entry, index) => (
            <div className="list-card" key={`${entry.status}-${index}`}>
              <strong>{entry.status}</strong>
              <div>{entry.owner}</div>
              <div>{entry.note}</div>
              <div>{entry.timestamp}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


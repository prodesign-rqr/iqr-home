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
          HQ-side view of incident packet requirements, routing posture, and archive behavior.
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
            <h2>Incident Packet Doctrine</h2>
            <p className="muted">
              Native systems still alert. IQR interprets, packages, delivers, returns, and archives.
            </p>
          </div>
          <div className="status-pill">{telemetry.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Property</div>
            <div className="metric-value">{telemetry.propertyName}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Protection points</div>
            <div className="metric-value">{telemetry.protectionPointMappings.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Required inputs</div>
            <div className="metric-value">{telemetry.requiredInputs.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Recipients</div>
            <div className="metric-value">{telemetry.recipients.length}</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Color Logic</h2>
            <p className="muted">
              Fast comprehension wins. Rendering stays deterministic and non-artistic.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          <div className="list-card"><strong>Red</strong><div>{telemetry.samplePacket.colorLogic.red}</div></div>
          <div className="list-card"><strong>Yellow</strong><div>{telemetry.samplePacket.colorLogic.yellow}</div></div>
          <div className="list-card"><strong>Green</strong><div>{telemetry.samplePacket.colorLogic.green}</div></div>
          <div className="list-card"><strong>Blue</strong><div>{telemetry.samplePacket.colorLogic.blue}</div></div>
          <div className="list-card"><strong>Gray</strong><div>{telemetry.samplePacket.colorLogic.gray}</div></div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Archive + Return Path</h2>
            <p className="muted">
              Every packet must resolve back into the property workspace and live permanently in the property timeline.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Archive behavior</strong>
              <span className="qty-chip">Permanent</span>
            </div>
            <p>{telemetry.samplePacket.archivePolicy}</p>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Return paths</strong>
              <span className="qty-chip">Linked</span>
            </div>
            <p><strong>Workspace:</strong> {telemetry.returnPaths.workspace}</p>
            <p><strong>Outputs:</strong> {telemetry.returnPaths.outputs}</p>
            <p><strong>HQ:</strong> {telemetry.returnPaths.hq}</p>
          </div>
        </div>
      </section>
    </main>
  );
}


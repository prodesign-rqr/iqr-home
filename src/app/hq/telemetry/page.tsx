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
          HQ-side view of artifact-surface readiness, output-routing posture, and archive-handoff structure.
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
            <h2>Generated Artifact Readiness</h2>
            <p className="muted">
              This layer adds the generated artifact surface, routing matrix, and archive handoff record.
            </p>
          </div>
          <div className="status-pill">{telemetry.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Artifact filename</div>
            <div className="metric-value">
              {telemetry.generatedArtifactSurface.artifactFilename}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Artifact sections</div>
            <div className="metric-value">
              {telemetry.generatedArtifactSections.length}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Routing rows</div>
            <div className="metric-value">
              {telemetry.outputRoutingReadiness.length}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Archive handoff</div>
            <div className="metric-value">
              {telemetry.archiveHandoffRecord.handoffStatus}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Generated Artifact Surface</h2>
            <p className="muted">
              HQ should be able to inspect the future output surface before live artifact generation exists.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.generatedArtifactSurface.artifactTitle}</strong>
              <span className="qty-chip">
                {telemetry.generatedArtifactSurface.artifactStatus}
              </span>
            </div>
            <p>
              <strong>Filename:</strong>{" "}
              {telemetry.generatedArtifactSurface.artifactFilename}
            </p>
            <p>
              <strong>Viewer surface:</strong>{" "}
              {telemetry.generatedArtifactSurface.viewerSurface}
            </p>
            <p>
              <strong>Export mode:</strong>{" "}
              {telemetry.generatedArtifactSurface.exportMode}
            </p>
            <p>
              <strong>Archive mode:</strong>{" "}
              {telemetry.generatedArtifactSurface.archiveMode}
            </p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Artifact Section Stack</h2>
            <p className="muted">
              These are the stable artifact sections that should be emitted once output generation is turned on.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          {telemetry.generatedArtifactSections.map((section, index) => (
            <div className="output-detail-card" key={`${section.sectionId}-${index}`}>
              <div className="detail-card-top">
                <strong>{section.title}</strong>
                <span className="qty-chip">{section.status}</span>
              </div>
              <p>
                <strong>Type:</strong> {section.sectionType}
              </p>
              <p>{section.description}</p>
              <div className="bullet-list">
                {section.includedItems.map((item, itemIndex) => (
                  <div className="list-card" key={`${item}-${itemIndex}`}>
                    <div>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Output Routing Matrix</h2>
            <p className="muted">
              Routing posture is still pre-delivery, but HQ can now inspect which artifact paths are ready and which are blocked.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.outputRoutingReadiness.map((route, index) => (
            <div className="list-card" key={`${route.routeId}-${index}`}>
              <strong>{route.audience}</strong>
              <div>{route.routeType}</div>
              <div>{route.status}</div>
              <div>{route.gatingReason}</div>
              <div>{route.destinationSurface}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Archive Handoff Record</h2>
            <p className="muted">
              Once the generated artifact exists, it needs a deterministic handoff into the permanent property archive lane.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.archiveHandoffRecord.artifactName}</strong>
              <span className="qty-chip">
                {telemetry.archiveHandoffRecord.archiveStatus}
              </span>
            </div>
            <p>
              <strong>Handoff status:</strong>{" "}
              {telemetry.archiveHandoffRecord.handoffStatus}
            </p>
            <p>
              <strong>Linked surface:</strong>{" "}
              {telemetry.archiveHandoffRecord.linkedSurface}
            </p>
            <p>
              <strong>Note:</strong> {telemetry.archiveHandoffRecord.note}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


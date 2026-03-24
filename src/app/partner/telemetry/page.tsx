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
              The packet now has a preview surface, a detail view, a generated artifact surface, and a prepared archive handoff.
            </p>
          </div>
          <div className="status-pill">{telemetry.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Artifact title</div>
            <div className="metric-value">
              {telemetry.generatedArtifactSurface.artifactTitle}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Artifact format</div>
            <div className="metric-value">
              {telemetry.generatedArtifactSurface.artifactFormat}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Routing entries</div>
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
              This is the first explicit surface for the future generated packet artifact, separate from the preview card and detail view.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.generatedArtifactSurface.artifactTitle}</strong>
              <span className="qty-chip">
                {telemetry.generatedArtifactSurface.artifactFormat}
              </span>
            </div>
            <p>
              <strong>Filename:</strong>{" "}
              {telemetry.generatedArtifactSurface.artifactFilename}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {telemetry.generatedArtifactSurface.artifactStatus}
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
            <p>
              <strong>Generation note:</strong>{" "}
              {telemetry.generatedArtifactSurface.generationNote}
            </p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Artifact Section Stack</h2>
            <p className="muted">
              These are the major sections the future generated artifact should emit in stable order.
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
            <h2>Output Routing Readiness</h2>
            <p className="muted">
              Generated output still is not live delivery, but the routing posture can be defined now.
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
              The generated artifact needs a clean handoff into the permanent archive lane once real output is enabled.
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


"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionCard from "../../../components/SectionCard";
import {
  buildSectionIntegrityRollup,
  resolveTruth,
} from "../../../lib/property-workspace-v1";
import {
  loadQuestionnaireStateV1,
  type QuestionnaireStateV1,
} from "../../../lib/questionnaire-state-v1";
import { buildSpatialIncidentTelemetryModel } from "../../../lib/spatial-incident-packets-v1";
import type { TruthListItem } from "../../../lib/types";

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

  const routingItems: TruthListItem[] = telemetry.outputRoutingReadiness.map((route: any) => ({
    id: route.routeId,
    title: route.audience,
    description: `${route.routeType} | ${route.destinationSurface}`,
    meta: `${route.status} | ${route.gatingReason}`,
    truth: resolveTruth({
      status: route.status,
      hasEvidence: true,
      blockerType:
        String(route.status ?? "").toLowerCase() !== "ready" ? "missing_linkage" : undefined,
      blockerReason:
        String(route.status ?? "").toLowerCase() !== "ready"
          ? route.gatingReason || "Routing posture is not ready."
          : undefined,
      nextActionText:
        String(route.status ?? "").toLowerCase() !== "ready"
          ? "Resolve routing gate."
          : undefined,
    }),
  }));

  const artifactTruth = resolveTruth({
    status: telemetry.generatedArtifactSurface.artifactStatus,
    hasEvidence: Boolean(telemetry.generatedArtifactSurface.artifactFilename),
    blockerType:
      String(telemetry.generatedArtifactSurface.artifactStatus ?? "").toLowerCase() !== "ready"
        ? "missing_source"
        : undefined,
    blockerReason:
      String(telemetry.generatedArtifactSurface.artifactStatus ?? "").toLowerCase() !== "ready"
        ? telemetry.generatedArtifactSurface.generationNote
        : undefined,
    nextActionText:
      String(telemetry.generatedArtifactSurface.artifactStatus ?? "").toLowerCase() !== "ready"
        ? "Complete artifact generation prerequisites."
        : undefined,
  });

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
          Partner telemetry now shows which artifact and routing surfaces are ready, which are only reported, and which are blocked by unresolved handoff or generation gaps.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>
          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">Partner Entry</Link>
            <Link href="/partner/workspace" className="subnav-pill">Property Workspace</Link>
            <span className="subnav-pill current">Telemetry</span>
            <Link href="/hq/telemetry" className="subnav-pill">HQ Telemetry</Link>
          </div>
        </div>
      </section>

      <SectionCard
        title={telemetry.propertyName}
        subtitle="Partner-side artifact readiness, routing posture, and archive handoff."
        right={<span className="status-pill">{telemetry.currentStatus}</span>}
        rollup={buildSectionIntegrityRollup([artifactTruth, ...routingItems.map((item) => item.truth)])}
      >
        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Artifact title</div>
            <div className="metric-value">{telemetry.generatedArtifactSurface.artifactTitle}</div>
            <div className="muted small">{artifactTruth.truthStatus}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Archive handoff</div>
            <div className="metric-value">{telemetry.archiveHandoffRecord.handoffStatus}</div>
            <div className="muted small">{telemetry.archiveHandoffRecord.note}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Generated Artifact Surface"
        subtitle="First explicit surface for the future packet artifact."
        rollup={buildSectionIntegrityRollup([artifactTruth])}
      >
        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.generatedArtifactSurface.artifactTitle}</strong>
              <span className="status-pill">{artifactTruth.truthStatus}</span>
            </div>
            <p><strong>Filename:</strong> {telemetry.generatedArtifactSurface.artifactFilename}</p>
            <p><strong>Status:</strong> {telemetry.generatedArtifactSurface.artifactStatus}</p>
            <p><strong>Viewer surface:</strong> {telemetry.generatedArtifactSurface.viewerSurface}</p>
            <p><strong>Export mode:</strong> {telemetry.generatedArtifactSurface.exportMode}</p>
            <p><strong>Archive mode:</strong> {telemetry.generatedArtifactSurface.archiveMode}</p>
            {artifactTruth.blockerReason ? <p><strong>Blocker:</strong> {artifactTruth.blockerReason}</p> : null}
            {artifactTruth.nextActionText ? <p><strong>Next:</strong> {artifactTruth.nextActionText}</p> : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Output Routing Readiness"
        subtitle="Partner-side routing posture for future generated output."
        rollup={buildSectionIntegrityRollup(routingItems.map((item) => item.truth))}
      >
        <div className="bullet-list">
          {routingItems.map((item) => (
            <div className="list-card" key={item.id}>
              <div className="detail-card-top">
                <strong>{item.title}</strong>
                <span className="status-pill">{item.truth.truthStatus}</span>
              </div>
              <div>{item.description}</div>
              <div>{item.meta}</div>
              {item.truth.blockerReason ? (
                <div className="muted small">Blocker: {item.truth.blockerReason}</div>
              ) : null}
              {item.truth.nextActionText ? (
                <div className="muted small">Next: {item.truth.nextActionText}</div>
              ) : null}
            </div>
          ))}
        </div>
      </SectionCard>
    </main>
  );
}

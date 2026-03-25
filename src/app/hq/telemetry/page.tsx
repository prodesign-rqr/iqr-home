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

  const archiveTruth = resolveTruth({
    status: telemetry.archiveHandoffRecord.handoffStatus,
    hasEvidence: Boolean(telemetry.archiveHandoffRecord.artifactName),
    blockerType:
      String(telemetry.archiveHandoffRecord.handoffStatus ?? "").toLowerCase() !== "ready"
        ? "missing_linkage"
        : undefined,
    blockerReason:
      String(telemetry.archiveHandoffRecord.handoffStatus ?? "").toLowerCase() !== "ready"
        ? telemetry.archiveHandoffRecord.note
        : undefined,
    nextActionText:
      String(telemetry.archiveHandoffRecord.handoffStatus ?? "").toLowerCase() !== "ready"
        ? "Complete archive handoff requirements."
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

        <h1>HQ Telemetry</h1>
        <p>
          HQ telemetry now shows which artifact and handoff surfaces are ready, which are blocked, and what needs action before release.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>
          <div className="subpage-nav-links">
            <Link href="/hq" className="subnav-pill">HQ Admin</Link>
            <Link href="/partner/workspace" className="subnav-pill">Property Workspace</Link>
            <Link href="/partner/telemetry" className="subnav-pill">Partner Telemetry</Link>
            <span className="subnav-pill current">HQ Telemetry</span>
          </div>
        </div>
      </section>

      <SectionCard
        title="Generated Artifact Readiness"
        subtitle="HQ-side view of artifact-surface readiness and archive-handoff structure."
        right={<span className="status-pill">{telemetry.currentStatus}</span>}
        rollup={buildSectionIntegrityRollup([archiveTruth, ...routingItems.map((item) => item.truth)])}
      >
        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Artifact filename</div>
            <div className="metric-value">{telemetry.generatedArtifactSurface.artifactFilename}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Archive handoff</div>
            <div className="metric-value">{telemetry.archiveHandoffRecord.handoffStatus}</div>
            <div className="muted small">{archiveTruth.truthStatus}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Output Routing Matrix"
        subtitle="HQ inspection surface for routing posture."
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

      <SectionCard
        title="Archive Handoff Record"
        subtitle="Deterministic handoff into the permanent property archive lane."
        rollup={buildSectionIntegrityRollup([archiveTruth])}
      >
        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.archiveHandoffRecord.artifactName}</strong>
              <span className="status-pill">{archiveTruth.truthStatus}</span>
            </div>
            <p><strong>Handoff status:</strong> {telemetry.archiveHandoffRecord.handoffStatus}</p>
            <p><strong>Linked surface:</strong> {telemetry.archiveHandoffRecord.linkedSurface}</p>
            <p><strong>Note:</strong> {telemetry.archiveHandoffRecord.note}</p>
            {archiveTruth.blockerReason ? <p><strong>Blocker:</strong> {archiveTruth.blockerReason}</p> : null}
            {archiveTruth.nextActionText ? <p><strong>Next:</strong> {archiveTruth.nextActionText}</p> : null}
          </div>
        </div>
      </SectionCard>
    </main>
  );
}

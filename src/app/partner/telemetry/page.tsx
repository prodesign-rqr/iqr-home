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
              The property stays the anchor. Floor plans, events, recipients, and packets all attach to the house record.
            </p>
          </div>
          <div className="status-pill">{telemetry.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Property ID</div>
            <div className="metric-value">{telemetry.propertyId}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Street address</div>
            <div className="metric-value">{telemetry.streetAddress}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Floor plan packet status</div>
            <div className="metric-value">{telemetry.samplePacket.packetStatus}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Protection points</div>
            <div className="metric-value">{telemetry.protectionPointMappings.length}</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Required Inputs</h2>
            <p className="muted">
              This module starts with deterministic inputs, not magical guessing.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.requiredInputs.map((item, index) => (
            <div className="list-card" key={`${item.label}-${index}`}>
              <strong>{item.label}</strong>
              <div>{item.status}</div>
              <div>{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Floor Plan Foundation</h2>
            <p className="muted">
              Master file, working/display copy, floor pages, and manual room-zone confirmation drive v1.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Master floor plan</strong>
              <span className="qty-chip">{telemetry.floorPlanMaster.documentStatus}</span>
            </div>
            <p>{telemetry.floorPlanMaster.expectedFormat}</p>
            <p>{telemetry.floorPlanMaster.versionPolicy}</p>
            <p>{telemetry.floorPlanMaster.note}</p>
          </div>

          {telemetry.floorPlanPages.map((page, index) => (
            <div className="output-detail-card" key={`${page.floorLabel}-${index}`}>
              <div className="detail-card-top">
                <strong>{page.floorLabel}</strong>
                <span className="qty-chip">Page {page.pageNumber}</span>
              </div>
              <p>{page.mappingStatus}</p>
              <p>{page.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Protection-Point Mapping</h2>
            <p className="muted">
              Upstream events become spatially useful only when protection points are tied to rooms and zones.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          {telemetry.protectionPointMappings.map((point, index) => (
            <div className="output-detail-card" key={`${point.code}-${index}`}>
              <div className="detail-card-top">
                <strong>{point.label}</strong>
                <span className="qty-chip">{point.code}</span>
              </div>
              <p><strong>Room / zone:</strong> {point.roomOrZone}</p>
              <p><strong>Source type:</strong> {point.sourceType}</p>
              <p><strong>Upstream system:</strong> {point.upstreamSystem}</p>
              <p><strong>Mapping status:</strong> {point.mappingStatus}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Recipient Matrix</h2>
            <p className="muted">
              Packets route to human recipients, while IQR stays the source of truth.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.recipients.map((recipient, index) => (
            <div className="list-card" key={`${recipient.role}-${index}`}>
              <strong>{recipient.role}</strong>
              <div>{recipient.name}</div>
              <div>{recipient.routingStatus}</div>
              <div>{recipient.deliveryMode}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Sample Incident + Packet Shell</h2>
            <p className="muted">
              This is the operational front door, not a decorative attachment.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.sampleIncident.eventType}</strong>
              <span className="qty-chip">{telemetry.sampleIncident.severity}</span>
            </div>
            <p><strong>Source:</strong> {telemetry.sampleIncident.sourceSystem}</p>
            <p><strong>Identifier:</strong> {telemetry.sampleIncident.sourceIdentifier}</p>
            <p><strong>Floor:</strong> {telemetry.sampleIncident.floor}</p>
            <p><strong>Room / zone:</strong> {telemetry.sampleIncident.roomOrZone}</p>
            <p><strong>Protection point:</strong> {telemetry.sampleIncident.protectionPoint}</p>
            <p><strong>Action summary:</strong> {telemetry.sampleIncident.actionSummary}</p>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.samplePacket.packetTitle}</strong>
              <span className="qty-chip">{telemetry.samplePacket.packetStatus}</span>
            </div>
            <p><strong>Return path:</strong> {telemetry.samplePacket.returnPath}</p>
            <p><strong>Archive policy:</strong> {telemetry.samplePacket.archivePolicy}</p>
            <div className="bullet-list">
              {telemetry.samplePacket.includedArtifacts.map((artifact, index) => (
                <div className="list-card" key={`${artifact}-${index}`}>
                  <div>{artifact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


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
              The property stays the anchor. Floor plans, events, recipients, packets, and archive return paths all attach to the house record.
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
            <div className="metric-label">Packet artifact</div>
            <div className="metric-value">{telemetry.packetArtifact.artifactStatus}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Delivery entries</div>
            <div className="metric-value">{telemetry.deliveryLog.length}</div>
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
            <h2>Packet Artifact</h2>
            <p className="muted">
              The packet is the front door, not the whole house. This artifact shell prepares the packet for future PDF generation and delivery.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.packetArtifact.artifactType}</strong>
              <span className="qty-chip">{telemetry.packetArtifact.packetStatus}</span>
            </div>
            <p><strong>Artifact ID:</strong> {telemetry.packetArtifact.artifactId}</p>
            <p><strong>Viewer mode:</strong> {telemetry.packetArtifact.viewerMode}</p>
            <p><strong>Return path:</strong> {telemetry.packetArtifact.returnPath}</p>
            <p><strong>Archive storage:</strong> {telemetry.packetArtifact.archiveStorage}</p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Delivery Log Shell</h2>
            <p className="muted">
              Deterministic recipient records come first. Live delivery behavior comes in the next layer.
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
              <div>{entry.deliveryTimestamp}</div>
              <div>{entry.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Follow-Up Timeline</h2>
            <p className="muted">
              The packet must return recipients into IQR and preserve continuity after the first alert moment.
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

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Archive Entries</h2>
            <p className="muted">
              Every packet resolves back into the property timeline and keeps continuity over time.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.archiveEntries.map((entry, index) => (
            <div className="list-card" key={`${entry.entryType}-${index}`}>
              <strong>{entry.entryType}</strong>
              <div>{entry.status}</div>
              <div>{entry.linkedSurface}</div>
              <div>{entry.note}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


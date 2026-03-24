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
          HQ-side view of incident packet requirements, routing posture, archive behavior, and PDF-ready packet composition.
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
            <h2>Packet Detail Readiness</h2>
            <p className="muted">
              This layer adds packet body structure, page selection logic, label placement rules, and the PDF-ready content model.
            </p>
          </div>
          <div className="status-pill">{telemetry.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Selected page</div>
            <div className="metric-value">
              {telemetry.packetDetailView.pageSelection.floorLabel} / Page{" "}
              {telemetry.packetDetailView.pageSelection.pageNumber}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Body blocks</div>
            <div className="metric-value">
              {telemetry.packetDetailView.bodyBlocks.length}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Label placements</div>
            <div className="metric-value">
              {telemetry.packetDetailView.labelPlacements.length}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">PDF model</div>
            <div className="metric-value">
              {telemetry.packetDetailView.pdfModel.renderStatus}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Page Selection Logic</h2>
            <p className="muted">
              Packet composition must choose the correct floor-plan page before rendering and delivery ever happen.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>
                {telemetry.packetDetailView.pageSelection.floorLabel}
              </strong>
              <span className="qty-chip">
                Page {telemetry.packetDetailView.pageSelection.pageNumber}
              </span>
            </div>
            <p>{telemetry.packetDetailView.pageSelection.selectionReason}</p>
            <p>{telemetry.packetDetailView.pageSelection.fallbackPolicy}</p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Packet Body Blocks</h2>
            <p className="muted">
              These body blocks define the stable composition of the packet detail view and future PDF artifact.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          {telemetry.packetDetailView.bodyBlocks.map((block, index) => (
            <div className="output-detail-card" key={`${block.blockId}-${index}`}>
              <div className="detail-card-top">
                <strong>{block.title}</strong>
                <span className="qty-chip">{block.priority}</span>
              </div>
              <p>
                <strong>Content type:</strong> {block.contentType}
              </p>
              <div className="bullet-list">
                {block.includedFields.map((item, itemIndex) => (
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
            <h2>Source Label + Legend Placement</h2>
            <p className="muted">
              Label placement remains deterministic so the packet stays legible and repeatable.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.packetDetailView.labelPlacements.map((placement, index) => (
            <div className="list-card" key={`${placement.placementId}-${index}`}>
              <strong>{placement.labelType}</strong>
              <div>{placement.targetArea}</div>
              <div>{placement.placementRule}</div>
              <div>{placement.purpose}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>PDF-Ready Content Model</h2>
            <p className="muted">
              The packet body is now structured for later PDF generation without yet invoking live delivery.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.packetDetailView.pdfModel.documentTitle}</strong>
              <span className="qty-chip">
                {telemetry.packetDetailView.pdfModel.pageSize}
              </span>
            </div>
            <p>
              <strong>Orientation:</strong>{" "}
              {telemetry.packetDetailView.pdfModel.orientation}
            </p>
            <p>
              <strong>Include legend:</strong>{" "}
              {telemetry.packetDetailView.pdfModel.includeLegend ? "Yes" : "No"}
            </p>
            <p>
              <strong>Include action summary:</strong>{" "}
              {telemetry.packetDetailView.pdfModel.includeActionSummary
                ? "Yes"
                : "No"}
            </p>
            <p>
              <strong>Include return path:</strong>{" "}
              {telemetry.packetDetailView.pdfModel.includeReturnPath
                ? "Yes"
                : "No"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {telemetry.packetDetailView.pdfModel.renderStatus}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


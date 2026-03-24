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
            <div className="metric-label">Selected floor page</div>
            <div className="metric-value">
              {telemetry.packetDetailView.pageSelection.floorLabel} / Page{" "}
              {telemetry.packetDetailView.pageSelection.pageNumber}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Body blocks</div>
            <div className="metric-value">{telemetry.packetDetailView.bodyBlocks.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Label placements</div>
            <div className="metric-value">{telemetry.packetDetailView.labelPlacements.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">PDF model</div>
            <div className="metric-value">{telemetry.packetDetailView.pdfModel.renderStatus}</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Floor-Plan Page Selection</h2>
            <p className="muted">
              Packet composition now chooses the floor-plan page deterministically before any future PDF generation.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.packetDetailView.pageSelection.floorLabel}</strong>
              <span className="qty-chip">Page {telemetry.packetDetailView.pageSelection.pageNumber}</span>
            </div>
            <p>{telemetry.packetDetailView.pageSelection.selectionReason}</p>
            <p>{telemetry.packetDetailView.pageSelection.fallbackPolicy}</p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Packet Body Composition</h2>
            <p className="muted">
              These blocks define the deterministic reading order of the incident packet body.
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
              <p><strong>Content type:</strong> {block.contentType}</p>
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
            <h2>Label Placement Rules</h2>
            <p className="muted">
              Source labels, point codes, and legend placement all stay deterministic and non-ornamental.
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
            <h2>PDF-Ready Model</h2>
            <p className="muted">
              This is the content model that prepares the packet for later PDF generation without adding live delivery yet.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{telemetry.packetDetailView.pdfModel.documentTitle}</strong>
              <span className="qty-chip">{telemetry.packetDetailView.pdfModel.pageSize}</span>
            </div>
            <p><strong>Orientation:</strong> {telemetry.packetDetailView.pdfModel.orientation}</p>
            <p><strong>Include legend:</strong> {telemetry.packetDetailView.pdfModel.includeLegend ? "Yes" : "No"}</p>
            <p><strong>Include action summary:</strong> {telemetry.packetDetailView.pdfModel.includeActionSummary ? "Yes" : "No"}</p>
            <p><strong>Include return path:</strong> {telemetry.packetDetailView.pdfModel.includeReturnPath ? "Yes" : "No"}</p>
            <p><strong>Status:</strong> {telemetry.packetDetailView.pdfModel.renderStatus}</p>
          </div>
        </div>
      </section>
    </main>
  );
}


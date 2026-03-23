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
            <div className="metric-label">Packet ready state</div>
            <div className="metric-value">{telemetry.renderModel.packetReadyState}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Overlay zones</div>
            <div className="metric-value">{telemetry.renderModel.overlayZones.length}</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Overlay Zones</h2>
            <p className="muted">
              These zones define how a meaningful incident will be rendered onto the floor plan copy.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          {telemetry.renderModel.overlayZones.map((zone, index) => (
            <div className="output-detail-card" key={`${zone.zoneId}-${index}`}>
              <div className="detail-card-top">
                <strong>{zone.displayLabel}</strong>
                <span className="qty-chip">{zone.colorRole}</span>
              </div>
              <p><strong>Floor:</strong> {zone.floorLabel}</p>
              <p><strong>Room / zone:</strong> {zone.roomOrZone}</p>
              <p><strong>Coordinate hint:</strong> {zone.coordinateHint}</p>
              <p><strong>Why it exists:</strong> {zone.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Packet Layout</h2>
            <p className="muted">
              The packet needs a stable layout before it can become a PDF artifact.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          {telemetry.renderModel.layoutSections.map((section, index) => (
            <div className="output-detail-card" key={`${section.title}-${index}`}>
              <div className="detail-card-top">
                <strong>{section.title}</strong>
                <span className="qty-chip">Section</span>
              </div>
              <p>{section.purpose}</p>
              <div className="bullet-list">
                {section.includedContent.map((item, itemIndex) => (
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
            <h2>Render Rules</h2>
            <p className="muted">
              Deterministic rules now. Actual PDF rendering comes in the next layer.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {telemetry.renderModel.renderRules.map((rule, index) => (
            <div className="list-card" key={`${rule}-${index}`}>
              <div>{rule}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


import Image from "next/image";
import Link from "next/link";
import SectionCard from "../../components/SectionCard";
import TelemetryGrid from "../../components/TelemetryGrid";
import { mockRecord } from "../../lib/mock-record";
import {
  buildSectionIntegrityRollup,
  resolveTruth,
} from "../../lib/property-workspace-v1";
import type { TelemetryTile, TruthListItem } from "../../lib/types";

export default function TelemetryPage() {
  const { property, meta, avItInfrastructure, monitoring } = mockRecord;

  const rackItems: TruthListItem[] = (avItInfrastructure?.rackDevices ?? []).map((device: any) => ({
    id: device.id,
    title: device.name,
    description: `${device.brand ?? "Unknown brand"} ${device.model ?? ""}`.trim(),
    meta: `Category: ${device.category} | Role: ${device.role ?? "N/A"} | Location: ${device.location || "Missing location"}`,
    truth: resolveTruth({
      status: device.status,
      verification: device.verification,
      hasEvidence: Boolean(device.brand || device.model || device.serialNumber),
      lastVerifiedAt: device.lastVerifiedAt ?? device.lastVerified,
      missing: !device.location,
    }),
  }));

  const monitoredItems: TruthListItem[] = (monitoring?.monitoredConditions ?? []).map((sensor: any) => ({
    id: sensor.id,
    title: sensor.name,
    description: sensor.location,
    meta: `Type: ${sensor.sensorType} | Protected point: ${sensor.protectedPoint ?? "N/A"} | Status: ${sensor.status} | Last seen: ${sensor.lastSeenAt ?? "N/A"}`,
    truth: resolveTruth({
      status: sensor.status,
      verification: sensor.verification,
      hasEvidence: Boolean(sensor.lastSeenAt || sensor.sensorType),
      lastVerifiedAt: sensor.lastVerifiedAt ?? sensor.lastSeenAt,
      missing: !sensor.location,
      linkageMissing: !sensor.protectedPoint && String(sensor.sensorType ?? "").toLowerCase().includes("leak"),
    }),
  }));

  const eventItems: TruthListItem[] = (monitoring?.eventHistory ?? []).map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    meta: `Severity: ${event.severity ?? "N/A"} | Status: ${event.status} | Source: ${event.source} | Event time: ${event.eventAt}`,
    truth: resolveTruth({
      status: event.status,
      hasEvidence: Boolean(event.source || event.eventAt),
      reported: true,
      blockerType:
        String(event.status ?? "").toLowerCase() === "open" ? "missing_verification" : undefined,
    }),
  }));

  const tiles: TelemetryTile[] = [
    {
      label: "Property Anchor",
      value: property.iqrPropertyId,
      meta: `${property.streetAddress} | Parcel / APN ${property.parcelApn}`,
      truth: resolveTruth({
        status: meta.recordStatus,
        hasEvidence: Boolean(property.iqrPropertyId && property.parcelApn),
      }),
    },
    {
      label: "AV / IT Infrastructure",
      value: `${rackItems.length}`,
      meta: "Rack, network, and endpoint objects",
      truth: resolveTruth({
        status: rackItems.length > 0 ? "reported" : "",
        hasEvidence: rackItems.length > 0,
        missing: rackItems.length === 0,
        reported: rackItems.length > 0,
      }),
    },
    {
      label: "Monitored Conditions",
      value: `${monitoredItems.length}`,
      meta: "YoLink-backed conditions and protected points",
      truth: resolveTruth({
        status: monitoredItems.length > 0 ? "reported" : "",
        hasEvidence: monitoredItems.length > 0,
        missing: monitoredItems.length === 0,
        reported: monitoredItems.length > 0,
      }),
    },
    {
      label: "Recent Events",
      value: `${eventItems.length}`,
      meta: "Meaningful telemetry events in the record",
      truth: resolveTruth({
        status: eventItems.some((item) => item.truth.truthStatus === "Blocked") ? "open" : "reported",
        hasEvidence: eventItems.length > 0,
        missing: eventItems.length === 0,
        reported: eventItems.length > 0,
      }),
    },
    {
      label: "Record Status",
      value: meta.recordStatus,
      meta: property.streetAddress,
      truth: resolveTruth({
        status: meta.recordStatus,
        hasEvidence: Boolean(property.iqrPropertyId),
      }),
    },
  ];

  const rackRollup = buildSectionIntegrityRollup(rackItems.map((item) => item.truth));
  const monitoredRollup = buildSectionIntegrityRollup(monitoredItems.map((item) => item.truth));
  const eventRollup = buildSectionIntegrityRollup(eventItems.map((item) => item.truth));

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
        <h1>Property Telemetry</h1>
        <p>
          Telemetry now distinguishes what is verified, what is merely reported, and what is blocked or missing inside the structured property record.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>
          <div className="subpage-nav-links">
            <span className="subnav-current-dot" aria-hidden="true">&bull;</span>
            <Link href="/prevention" className="subnav-pill">Prevention</Link>
            <Link href="/voice" className="subnav-pill">Voice</Link>
            <Link href="/service-events" className="subnav-pill">Service Events</Link>
            <Link href="/integrity" className="subnav-pill">Integrity</Link>
          </div>
        </div>
      </section>

      <SectionCard
        title="Telemetry Summary"
        subtitle="Shared truth-state summary for the property telemetry layer."
        right={<span className="status-pill">Status: {meta.recordStatus}</span>}
        rollup={buildSectionIntegrityRollup(tiles.map((tile) => tile.truth))}
      >
        <TelemetryGrid tiles={tiles} />
      </SectionCard>

      <SectionCard
        title="AV / IT Infrastructure"
        subtitle="Rack, network, control, and endpoint objects tracked in the house record."
        rollup={rackRollup}
      >
        <div className="bullet-list">
          {rackItems.map((item) => (
            <div className="list-card" key={item.id}>
              <div className="detail-card-top">
                <strong>{item.title}</strong>
                <span className="status-pill">{item.truth.truthStatus}</span>
              </div>
              <div>{item.description}</div>
              <div className="muted small">{item.meta}</div>
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
        title="Monitored Conditions"
        subtitle="YoLink-backed sensors and environmental monitors tied to continuity."
        rollup={monitoredRollup}
      >
        <div className="bullet-list">
          {monitoredItems.length ? (
            monitoredItems.map((item) => (
              <div className="list-card" key={item.id}>
                <div className="detail-card-top">
                  <strong>{item.title}</strong>
                  <span className="status-pill">{item.truth.truthStatus}</span>
                </div>
                <div>{item.description}</div>
                <div className="muted small">{item.meta}</div>
                {item.truth.blockerReason ? (
                  <div className="muted small">Blocker: {item.truth.blockerReason}</div>
                ) : null}
                {item.truth.nextActionText ? (
                  <div className="muted small">Next: {item.truth.nextActionText}</div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="list-card">
              <strong>No monitored conditions yet</strong>
              <div className="muted small">Expected data missing</div>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Recent Telemetry Events"
        subtitle="Meaningful events from the monitored record."
        rollup={eventRollup}
      >
        <div className="bullet-list">
          {eventItems.length ? (
            eventItems.map((item) => (
              <div className="list-card" key={item.id}>
                <div className="detail-card-top">
                  <strong>{item.title}</strong>
                  <span className="status-pill">{item.truth.truthStatus}</span>
                </div>
                <div>{item.description}</div>
                <div className="muted small">{item.meta}</div>
                {item.truth.blockerReason ? (
                  <div className="muted small">Blocker: {item.truth.blockerReason}</div>
                ) : null}
                {item.truth.nextActionText ? (
                  <div className="muted small">Next: {item.truth.nextActionText}</div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="list-card">
              <strong>No telemetry events yet</strong>
              <div className="muted small">No data yet</div>
            </div>
          )}
        </div>
      </SectionCard>
    </main>
  );
}


import  Image  from "next/image";
import Link from "next/link";
import { mockRecord } from "../../lib/mock-record";

export default function TelemetryPage() {
  const { property, meta, avItInfrastructure, monitoring } = mockRecord;

  return (
    <main>
      <section className="hero">
        <div  className="subpage-logo-wrap">
            <Image
                src="/iqr-home-logo-tight-WonB.png"
                alt="IQR  Home"
                width={140}
		height={98}
		className="subpage-logo"
		priority
 />
</div>
        <h1>Property Telemetry</h1>
        <p>
          Telemetry combines baseline documentation, rack / infrastructure details, and monitored condition status into a single structured property record.
        </p>
         
        <div className="subpage-nav">
          <Link href="/"  className="subpage-nav-home">Back to Home</Link>

          <div  className="subpage-nav-links">
            <span  className="subnav-current-dot"  aria-hidden="true">&bull;</span>
            <Link href="/prevention"  className="subnav-pill">Prevention</Link>
            <Link href="/voice"  className="subnav-pill">Voice</Link>
            <Link href="/service-events"  className="subnav-pill">Service  Events</Link>
            <Link href="/integrity"  className="subnav-pill">Integrity</Link>
	  </div>
        </div>
        </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Property Anchor</h2>
            <p className="muted">
              Structured record identity for this house.
            </p>
          </div>
          <div className="status-pill">Status: {meta.recordStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Street Address</div>
            <div className="metric-value small-value">
              {property.streetAddress}
            </div>
            <div className="muted small">
              {property.city}, {property.state} {property.zip}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Parcel / APN</div>
            <div className="metric-value">{property.parcelApn}</div>
            <div className="muted small">IQR ID: {property.iqrPropertyId}</div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>AV / IT Infrastructure</h2>
            <p className="muted">
              Rack, network, control, and endpoint objects tracked in the house record.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {avItInfrastructure.rackDevices.map((device) => (
            <div className="list-card" key={device.id}>
              <strong>{device.name}</strong>
              <div>
                {device.brand ?? "Unknown brand"} {device.model ?? ""}
              </div>
              <div className="muted small">
                Category: {device.category} | Role: {device.role ?? "N/A"} | Status: {device.status ?? "unknown"}
              </div>
              <div className="muted small">
                Location: {device.location || "Missing location"} | Verification: {device.verification}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Monitored Conditions</h2>
            <p className="muted">
              YoLink-backed sensors and environmental monitors tied to continuity.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {monitoring.monitoredConditions.map((sensor) => (
            <div className="list-card" key={sensor.id}>
              <strong>{sensor.name}</strong>
              <div>{sensor.location}</div>
              <div className="muted small">
                Type: {sensor.sensorType} | Protected point: {sensor.protectedPoint ?? "N/A"}
              </div>
              <div className="muted small">
                Status: {sensor.status} | Last seen: {sensor.lastSeenAt ?? "N/A"} | Verification: {sensor.verification}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Recent Telemetry Events</h2>
            <p className="muted">
              Meaningful events from the monitored record.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {monitoring.eventHistory.map((event) => (
            <div className="list-card" key={event.id}>
              <strong>{event.title}</strong>
              <div>{event.description}</div>
              <div className="muted small">
                Severity: {event.severity ?? "N/A"} | Status: {event.status} | Source: {event.source}
              </div>
              <div className="muted small">
                Event time: {event.eventAt}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

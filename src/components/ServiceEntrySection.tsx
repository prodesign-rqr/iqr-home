import type { ServiceEntryNodeRecord, ServiceEntryEventRecord } from "../lib/schema";

const integrationStatusLabel: Record<string, string> = {
  not_configured: "Not Configured",
  planned: "Planned",
  partial: "Partial",
  configured: "Configured",
};

const integrationStatusColor: Record<string, string> = {
  not_configured: "rgba(255,255,255,0.25)",
  planned: "#f5be67",
  partial: "#6dd3ff",
  configured: "#7fe296",
};

const entryTypeLabel: Record<string, string> = {
  front_door: "Front Door",
  rear_door: "Rear Door",
  side_door: "Side Door",
  garage: "Garage",
  other: "Other",
};

const resultColor: Record<string, string> = {
  requested: "#6dd3ff",
  approved: "#5cf0c9",
  completed: "#7fe296",
  denied: "#ff8b8b",
  planned: "#f5be67",
};

function EntryNodeCard({ node }: { node: ServiceEntryNodeRecord }) {
  const statusColor = integrationStatusColor[node.integrationStatus] ?? "rgba(255,255,255,0.25)";

  return (
    <div
      style={{
        padding: "20px 22px",
        borderRadius: 12,
        border: `1px solid ${statusColor}33`,
        background: "rgba(255,255,255,0.02)",
        display: "grid",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "#ecf3fb",
              marginBottom: 3,
            }}
          >
            {node.label}
            {node.isPrimaryServiceEntry && (
              <span
                style={{
                  marginLeft: 10,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#6dd3ff",
                  border: "1px solid rgba(109,211,255,0.35)",
                  borderRadius: 4,
                  padding: "2px 7px",
                }}
              >
                Primary Service Entry
              </span>
            )}
          </div>
          {node.locationDescription && (
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>
              {node.locationDescription}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: statusColor,
            border: `1px solid ${statusColor}44`,
            borderRadius: 4,
            padding: "3px 9px",
            whiteSpace: "nowrap",
          }}
        >
          {integrationStatusLabel[node.integrationStatus] ?? node.integrationStatus}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 10,
        }}
      >
        {[
          { label: "Entry Type", value: entryTypeLabel[node.entryType] ?? node.entryType },
          {
            label: "QR Enabled",
            value: node.qrEnabled ? "Yes" : "No — planned",
          },
          {
            label: "Service Entry Enabled",
            value: node.serviceEntryEnabled ? "Yes" : "No — planned",
          },
          ...(node.lockPlannedBrand
            ? [{ label: "Planned Lock", value: `${node.lockPlannedBrand} (${node.lockPlannedType ?? "unspecified"})` }]
            : []),
          ...(node.middlewarePlannedType && node.middlewarePlannedType !== "none"
            ? [{ label: "Planned Middleware", value: node.middlewarePlannedType }]
            : []),
        ].map((field) => (
          <div key={field.label}>
            <div
              style={{
                fontSize: "0.67rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 3,
              }}
            >
              {field.label}
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
              {field.value}
            </div>
          </div>
        ))}
      </div>

      {node.notes && (
        <div
          style={{
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.55,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 10,
          }}
        >
          {node.notes}
        </div>
      )}
    </div>
  );
}

function ServiceEntryEventRow({ event }: { event: ServiceEntryEventRecord }) {
  const color = resultColor[event.result] ?? "rgba(255,255,255,0.4)";
  const date = new Date(event.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 2, color: "#ecf3fb" }}>
          {event.workflowType}
        </div>
        <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.35)" }}>
          {date} &mdash; {event.actorRole.replace(/_/g, " ")} &mdash; via {event.source.replace(/_/g, " ")}
        </div>
        {event.notes && (
          <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
            {event.notes}
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color,
          border: `1px solid ${color}44`,
          borderRadius: 4,
          padding: "3px 9px",
          whiteSpace: "nowrap",
        }}
      >
        {event.result}
      </span>
    </div>
  );
}

export default function ServiceEntrySection({
  entryNodes,
  events,
}: {
  entryNodes: ServiceEntryNodeRecord[];
  events: ServiceEntryEventRecord[];
}) {
  const primaryNode = entryNodes.find((n) => n.isPrimaryServiceEntry) ?? entryNodes[0];

  return (
    <>
      <section className="panel" style={{ marginTop: 24 }}>
        <div className="section-title">
          <div>
            <h2>Service Entry</h2>
            <p>
              The designated managed service-provider entry point for this property.
              IQR records only managed QR-based service-provider entry events.
              Homeowner and private lock usage is not tracked in this feature.
            </p>
          </div>
        </div>

        {entryNodes.length === 0 ? (
          <div
            style={{
              padding: "32px 24px",
              borderRadius: 10,
              border: "1px dashed rgba(255,255,255,0.1)",
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.875rem",
              lineHeight: 1.65,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8, color: "rgba(255,255,255,0.45)" }}>
              No Service Entry Point Configured
            </div>
            This section defines the one managed service-provider entry point for the property.
            Once configured, it will hold the designated entry node, planned lock hardware,
            middleware integration details, and QR workflow status.
            <div
              style={{
                marginTop: 14,
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.2)",
                fontStyle: "italic",
              }}
            >
              IQR records only managed QR-based service-provider entry events by default.
              Homeowner ingress/egress is outside IQR logging.
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {primaryNode && <EntryNodeCard node={primaryNode} />}
            {entryNodes.filter((n) => n.id !== primaryNode?.id).map((node) => (
              <EntryNodeCard key={node.id} node={node} />
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: 18,
            padding: "12px 16px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.3)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 4 }}>
            Privacy boundary
          </strong>
          IQR records only managed QR-based service-provider entry events by default.
          Homeowner and private lock usage is not tracked in this feature unless explicitly
          enabled in a future phase. The lock hardware is treated as an actuator endpoint
          for future integration — not as a primary source of identity or truth.
        </div>
      </section>

      <section className="panel" style={{ marginTop: 24 }}>
        <div className="section-title">
          <div>
            <h2>Service Entry Events</h2>
            <p>
              Managed QR-based service-provider entry events tied to the designated entry node.
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div
            style={{
              padding: "24px 0",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            No managed service-entry events recorded yet.
            <div
              style={{
                marginTop: 8,
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.2)",
                fontStyle: "italic",
              }}
            >
              Events will appear here once QR-based service-provider entry is active.
              Homeowner ingress/egress is not logged.
            </div>
          </div>
        ) : (
          <div>
            {events.map((event) => (
              <ServiceEntryEventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

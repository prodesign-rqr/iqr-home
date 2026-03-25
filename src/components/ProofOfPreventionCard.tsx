import type { PreventionCardItem } from "../lib/types";

export default function ProofOfPreventionCard({ item }: { item: PreventionCardItem | null }) {
  if (!item) return null;

  return (
    <div className="list-card">
      <div className="detail-card-top" style={{ marginBottom: 10 }}>
        <strong>{item.title}</strong>
        <span className="status-pill">{item.truth.truthStatus}</span>
      </div>

      {item.location ? <div className="muted small">{item.location}</div> : null}

      <div className="kv-list small" style={{ marginTop: 10 }}>
        {item.details.map((detail) => (
          <div className="kv-item" key={`${item.title}-${detail.label}`}>
            <strong>{detail.label}</strong>
            <span>{detail.value}</span>
          </div>
        ))}
      </div>

      {item.truth.blockerReason ? (
        <div className="muted small" style={{ marginTop: 10 }}>
          Blocker: {item.truth.blockerReason}
        </div>
      ) : null}

      {item.truth.nextActionText ? (
        <div className="muted small" style={{ marginTop: 6 }}>
          Next: {item.truth.nextActionText}
        </div>
      ) : null}

      {item.truth.evidenceLabel || item.truth.lastVerifiedAt ? (
        <div className="muted small" style={{ marginTop: 6 }}>
          {item.truth.evidenceLabel ?? "Evidence cue"}
          {item.truth.lastVerifiedAt ? ` | Last verified ${item.truth.lastVerifiedAt}` : ""}
        </div>
      ) : null}
    </div>
  );
}

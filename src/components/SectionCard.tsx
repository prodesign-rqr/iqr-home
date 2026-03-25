import type { SectionIntegrityRollup } from "../lib/types";

export default function SectionCard({
  title,
  subtitle,
  children,
  right,
  rollup,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  rollup?: SectionIntegrityRollup;
}) {
  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
          {rollup ? (
            <p className="muted small" style={{ marginTop: 6 }}>
              {rollup.summary}
              {rollup.nextActionText ? ` | Next: ${rollup.nextActionText}` : ""}
            </p>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {rollup ? (
            <>
              <span className="status-pill">Verified {rollup.verifiedCount}</span>
              <span className="status-pill">Pending {rollup.reportedOrInferredCount}</span>
              <span className="status-pill">Missing {rollup.missingCount}</span>
              <span className="status-pill">Blocked {rollup.blockedCount}</span>
            </>
          ) : null}
          {right}
        </div>
      </div>
      {children}
    </section>
  );
}

import type { ReactNode } from "react";
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
  children: ReactNode;
  right?: ReactNode;
  rollup?: SectionIntegrityRollup;
}) {
  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
          {rollup ? (
            <p className="muted small">
              {rollup.summary}
              {rollup.nextActionText ? ` | Next: ${rollup.nextActionText}` : ""}
            </p>
          ) : null}
        </div>
        <div className="section-title-right">
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

import Image from "next/image";
import Link from "next/link";
import { startupOutputs } from "../../../../lib/questionnaire-v1";

export default function QrTagPlanPage() {
  return (
    <main>
      <section className="hero">
        <div className="subpage-logo-wrap">
          <Image src="/iqr-home-logo-tight-WonB.png" alt="IQR Home" width={140} height={98} className="subpage-logo" priority />
        </div>
        <h1>QR Tag Plan</h1>
        <p>Initial label set generated from Questionnaire v1.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">Back to Outputs</Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div><h2>Tag Set v1</h2><p className="muted">Starting labels for rack, network, systems, and protection points.</p></div>
          <div className="status-pill">QR Plan</div>
        </div>

        <div className="spec-table">
          <div className="spec-table-head four-col">
            <div>Label</div><div>Code</div><div>Destination</div><div>Reason</div>
          </div>
          {startupOutputs.qrTagPlan.map(([label, code, destination, reason]) => (
            <div className="spec-table-row four-col" key={code}>
              <div><strong>{label}</strong></div><div>{code}</div><div>{destination}</div><div>{reason}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


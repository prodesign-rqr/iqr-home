import Image from "next/image";
import Link from "next/link";
import { startupOutputs } from "../../../../lib/questionnaire-v1";

export default function CounterCardPage() {
  const card = startupOutputs.counterCard;

  return (
    <main>
      <section className="hero">
        <div className="subpage-logo-wrap">
          <Image src="/iqr-home-logo-tight-WonB.png" alt="IQR Home" width={140} height={98} className="subpage-logo" priority />
        </div>
        <h1>Counter Card Config</h1>
        <p>Initial card behavior for Scan-2-Know, Scan-2-Join, and bounded public access.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">Back to Outputs</Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div><h2>Counter Card v1</h2><p className="muted">Public-facing behavior stays simple. Protected controls stay behind partner and HQ entry.</p></div>
          <div className="status-pill">Counter Card</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card"><div className="metric-label">Mode</div><div className="metric-value small-value">{card.mode}</div></div>
          <div className="metric-card"><div className="metric-label">Guest network display</div><div className="metric-value small-value">{card.networkName}</div></div>
        </div>

        <div className="mapping-grid">
          <div className="list-card"><strong>Public objects</strong><ul className="clean-list">{card.publicObjects.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="list-card"><strong>Protected objects</strong><ul className="clean-list">{card.privateObjects.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>
    </main>
  );
}


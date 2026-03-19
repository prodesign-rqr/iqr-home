import Image from "next/image";
import Link from "next/link";
import { startupOutputs } from "../../../../lib/questionnaire-v1";

export default function StartupKitPage() {
  return (
    <main>
      <section className="hero">
        <div className="subpage-logo-wrap">
          <Image src="/iqr-home-logo-tight-WonB.png" alt="IQR Home" width={140} height={98} className="subpage-logo" priority />
        </div>
        <h1>Startup Kit List</h1>
        <p>Initial onboarding kit contents shaped by questionnaire answers and scope selections.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">Back to Outputs</Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div><h2>Kit Contents v1</h2><p className="muted">This list can later become quantity-aware and partner-specific.</p></div>
          <div className="status-pill">Startup Kit</div>
        </div>

        <div className="bullet-list">
          {startupOutputs.startupKit.map((item) => (
            <div className="list-card" key={item}>
              <strong>{item}</strong>
              <div>Included in the first-pass startup package.</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


import Image from "next/image";
import Link from "next/link";
import { startupOutputs } from "../../../../lib/questionnaire-v1";

export default function PropertyRecordShellPage() {
  return (
    <main>
      <section className="hero">
        <div className="subpage-logo-wrap">
          <Image src="/iqr-home-logo-tight-WonB.png" alt="IQR Home" width={140} height={98} className="subpage-logo" priority />
        </div>
        <h1>Property Record Shell</h1>
        <p>Initial structured object buckets created before field install and baseline documentation are completed.</p>
        <div className="subpage-nav">
          <Link href="/partner/outputs" className="subpage-nav-home">Back to Outputs</Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div><h2>Shell Objects v1</h2><p className="muted">The record belongs to the house, not the current homeowner.</p></div>
          <div className="status-pill">Record Shell</div>
        </div>

        <div className="output-card-grid">
          {startupOutputs.propertyRecordShell.map((item) => (
            <div className="output-card static-card" key={item}>
              <strong>{item}</strong>
              <span>Created as part of startup output generation.</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


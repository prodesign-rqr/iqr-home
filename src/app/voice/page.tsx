import Image from "next/image";
import Link from "next/link";
import VoiceAccessPanel from "../../components/VoiceAccessPanel";
import { mockRecord } from "../../lib/mock-record";

export default function VoicePage() {
  const { property, meta } = mockRecord;

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

  <h1>Voice</h1>
  <p>
    Voice keeps answers bounded to the structured house record so the property can
    explain itself clearly, consistently, and without guessing.
  </p>

  <div className="subpage-nav">
    <Link href="/" className="subpage-nav-home">Back to Home</Link>

    <div className="subpage-nav-links">
      <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
      <Link href="/prevention" className="subnav-pill">Prevention</Link>
      <span  className="subnav-current-dot"  aria-hidden="true">&bull;</span>
      <Link href="/service-events" className="subnav-pill">Service Events</Link>
      <Link href="/integrity" className="subnav-pill">Integrity</Link>
    
    </div>
  </div>
</section>


      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Voice Query Panel</h2>
            <p className="muted">
              Structured questions only. Responses should stay concise,
              factual, and tied to the property record.
            </p>
          </div>
          <div className="status-pill">Ready for review</div>
        </div>

        <VoiceAccessPanel />
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Voice Scope</h2>
            <p className="muted">What this page should and should not do.</p>
          </div>
        </div>

        <div className="grid two-col">
          <div className="list-card">
            <strong>In scope</strong>
            <div className="muted small">
              Location, protection status, monitoring status, service history,
              verification status, and other structured factual retrieval.
            </div>
          </div>

          <div className="list-card">
            <strong>Out of scope</strong>
            <div className="muted small">
              Creative responses, speculative advice, broad smart-home
              conversation, or answers that are not grounded in the house record.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


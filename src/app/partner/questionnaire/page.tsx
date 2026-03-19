import Image from "next/image";
import Link from "next/link";

export default function QuestionnairePage() {
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

        <h1>Design Sales Questionnaire v1</h1>
        <p>
          Structured intake layer inside the current IQR app. Every answer must map to
          a configurator output and/or a stable property record object.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>

          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">Partner Entry</Link>
            <Link href="/hq" className="subnav-pill">HQ Admin</Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Required Platform Flow</h2>
            <p className="muted">
              Questionnaire → System Design Configurator → Startup Outputs → Property Record Shell → Field Install Plan
            </p>
          </div>
          <div className="status-pill">Questionnaire v1</div>
        </div>

        <div className="bullet-list">
          <div className="list-card">
            <strong>Outputs driven by the questionnaire</strong>
            <div>Property record creation, QR tag plan, Counter Card configuration, YoLink scope, AV / IT baseline, startup kit contents, and field install checklist.</div>
          </div>

          <div className="list-card">
            <strong>Data rules</strong>
            <div>Structured fields first, minimal controlled free text, conditional logic for follow-ups, and stable record schema underneath.</div>
          </div>
        </div>
      </section>

      <form className="questionnaire-form">
        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>1. Property Basics</h2>
              <p className="muted">Backend anchor = Parcel / APN. Human-facing reference = street address.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="parcel-apn">Parcel / APN</label>
              <input id="parcel-apn" name="parcel-apn" type="text" placeholder="217-54-321" />
            </div>

            <div className="form-field">
              <label htmlFor="street-address">Street address</label>
              <input id="street-address" name="street-address" type="text" placeholder="1234 Desert Highlands Drive" />
            </div>

            <div className="form-field">
              <label htmlFor="property-type">Property type</label>
              <select id="property-type" name="property-type" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Single-family residence</option>
                <option>Condo / townhome</option>
                <option>Estate / compound</option>
                <option>Second residence</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="occupancy-type">Occupancy type</label>
              <select id="occupancy-type" name="occupancy-type" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Primary residence</option>
                <option>Second residence</option>
                <option>Rental / guest use</option>
                <option>Seasonal occupancy</option>
              </select>
            </div>
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>2. People and Roles</h2>
              <p className="muted">Capture who owns, manages, services, and receives continuity information.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="client-role">Client / owner</label>
              <input id="client-role" name="client-role" type="text" placeholder="Owner or estate contact" />
            </div>

            <div className="form-field">
              <label htmlFor="property-manager">Property manager</label>
              <input id="property-manager" name="property-manager" type="text" placeholder="Management company or contact" />
            </div>

            <div className="form-field">
              <label htmlFor="tis-owner">TIS owner / integrator</label>
              <input id="tis-owner" name="tis-owner" type="text" placeholder="Partner account owner" />
            </div>

            <div className="form-field">
              <label htmlFor="service-preference">Service preference</label>
              <select id="service-preference" name="service-preference" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Reactive only</option>
                <option>Managed support</option>
                <option>Quarterly review</option>
                <option>Yearly update required</option>
              </select>
            </div>
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>3. AV / IT Infrastructure</h2>
              <p className="muted">First domain = rack, network, AV, control, and monitored conditions.</p>
            </div>
          </div>

          <div className="checkbox-grid">
            <label className="checkbox-item"><input type="checkbox" /> Main AV rack present</label>
            <label className="checkbox-item"><input type="checkbox" /> Managed network gateway</label>
            <label className="checkbox-item"><input type="checkbox" /> PoE switching</label>
            <label className="checkbox-item"><input type="checkbox" /> Wi-Fi access points</label>
            <label className="checkbox-item"><input type="checkbox" /> Control processor</label>
            <label className="checkbox-item"><input type="checkbox" /> UPS / conditioned power</label>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="rack-location">Primary rack location</label>
              <input id="rack-location" name="rack-location" type="text" placeholder="Main AV closet" />
            </div>

            <div className="form-field">
              <label htmlFor="network-notes">Network notes</label>
              <input id="network-notes" name="network-notes" type="text" placeholder="VLANs, ISP, backup WAN, etc." />
            </div>
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>4. Major Home Systems</h2>
              <p className="muted">Major systems and appliances remain in scope as property record objects.</p>
            </div>
          </div>

          <div className="checkbox-grid">
            <label className="checkbox-item"><input type="checkbox" /> HVAC</label>
            <label className="checkbox-item"><input type="checkbox" /> Water heater</label>
            <label className="checkbox-item"><input type="checkbox" /> Electrical</label>
            <label className="checkbox-item"><input type="checkbox" /> Plumbing</label>
            <label className="checkbox-item"><input type="checkbox" /> Roof</label>
            <label className="checkbox-item"><input type="checkbox" /> Refrigeration / ice maker</label>
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>5. Water-Risk Monitoring</h2>
              <p className="muted">Full YoLink package remains in scope. YoLink alerts; IQR records and preserves.</p>
            </div>
          </div>

          <div className="checkbox-grid">
            <label className="checkbox-item"><input type="checkbox" /> Dishwasher protection</label>
            <label className="checkbox-item"><input type="checkbox" /> Clothes washer protection</label>
            <label className="checkbox-item"><input type="checkbox" /> Refrigerator / ice maker protection</label>
            <label className="checkbox-item"><input type="checkbox" /> Water heater pan protection</label>
            <label className="checkbox-item"><input type="checkbox" /> Sink cabinet protection</label>
            <label className="checkbox-item"><input type="checkbox" /> Local shutoff devices in scope</label>
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>6. Environmental Monitoring</h2>
              <p className="muted">Store meaningful events only, not continuous telemetry.</p>
            </div>
          </div>

          <div className="checkbox-grid">
            <label className="checkbox-item"><input type="checkbox" /> Rack temperature</label>
            <label className="checkbox-item"><input type="checkbox" /> Garage freezer</label>
            <label className="checkbox-item"><input type="checkbox" /> Wine room</label>
            <label className="checkbox-item"><input type="checkbox" /> Art / collection room</label>
            <label className="checkbox-item"><input type="checkbox" /> Mechanical room</label>
            <label className="checkbox-item"><input type="checkbox" /> Pantry / food storage</label>
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>7. Counter Card and Access</h2>
              <p className="muted">Public entry remains limited to Scan-2-Know, Scan-2-Join, and allowed house-record access.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="counter-card-mode">Counter Card mode</label>
              <select id="counter-card-mode" name="counter-card-mode" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Scan-2-Know + Scan-2-Join</option>
                <option>Scan-2-Know only</option>
                <option>Scan-2-Join only</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="guest-network-name">Guest network display name</label>
              <input id="guest-network-name" name="guest-network-name" type="text" placeholder="IQR Guest" />
            </div>
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>8. Stewardship / Service Preferences</h2>
              <p className="muted">Questionnaire answers should drive startup kit, onboarding, and continuity outputs.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="yearly-update">Yearly update cadence</label>
              <select id="yearly-update" name="yearly-update" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Required</option>
                <option>Recommended</option>
                <option>Deferred</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="startup-priority">Startup priority</label>
              <select id="startup-priority" name="startup-priority" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Standard</option>
                <option>Rush onboarding</option>
                <option>Needs additional documentation</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="onboarding-notes">Controlled notes</label>
            <textarea id="onboarding-notes" name="onboarding-notes" placeholder="Use only when structured fields do not cover the case." />
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>Configurator Outputs Triggered</h2>
              <p className="muted">Initial views for the next phase of the flow.</p>
            </div>
          </div>

          <div className="bullet-list">
            <div className="list-card"><strong>QR tag plan</strong><div>System labels and object IDs linked to the property record shell.</div></div>
            <div className="list-card"><strong>Counter Card config</strong><div>Scan-2-Know and Scan-2-Join behavior, public visibility, and access rules.</div></div>
            <div className="list-card"><strong>Startup kit list</strong><div>Recommended labels, cards, sensors, and field hardware for the property.</div></div>
            <div className="list-card"><strong>Property record shell</strong><div>Structured shell aligned to parcel/APN, address, infrastructure, monitoring, service, and integrity.</div></div>
            <div className="list-card"><strong>Field install checklist</strong><div>Partner-facing install plan generated from questionnaire answers.</div></div>
          </div>

          <div className="form-actions">
            <button type="button" className="button-secondary">Save Draft</button>
            <button type="button" className="button-primary">Generate Startup Outputs</button>
          </div>
        </section>
      </form>
    </main>
  );
}


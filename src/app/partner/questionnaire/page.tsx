"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  defaultQuestionnaireStateV1,
  hasSavedQuestionnaireDraft,
  loadQuestionnaireStateV1,
  saveQuestionnaireStateV1,
  clearQuestionnaireStateV1,
  type QuestionnaireStateV1,
} from "../../../lib/questionnaire-state-v1";
import { buildOutputSummary } from "../../../lib/output-mappers-v1";

export default function QuestionnairePage() {
  const router = useRouter();
  const [formState, setFormState] = useState<QuestionnaireStateV1>(defaultQuestionnaireStateV1);
  const [saveMessage, setSaveMessage] = useState("Draft not saved yet.");

  useEffect(() => {
    const loaded = loadQuestionnaireStateV1();
    setFormState(loaded);
    setSaveMessage(
      hasSavedQuestionnaireDraft(loaded)
        ? `Draft restored from ${loaded._meta.lastSavedAt}`
        : "No saved draft yet."
    );
  }, []);

  const outputSummary = useMemo(() => buildOutputSummary(formState), [formState]);

  function updateSection(section: keyof QuestionnaireStateV1, field: string, value: string | boolean) {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, string | boolean>),
        [field]: value,
      },
    }));
  }

  function handleSaveDraft() {
    const saved = saveQuestionnaireStateV1(formState);
    setFormState(saved);
    setSaveMessage(`Draft saved at ${saved._meta.lastSavedAt}`);
  }

  function handleResumeDraft() {
    const loaded = loadQuestionnaireStateV1();
    setFormState(loaded);
    setSaveMessage(
      hasSavedQuestionnaireDraft(loaded)
        ? `Draft restored from ${loaded._meta.lastSavedAt}`
        : "No saved draft found."
    );
  }

  function handleClearDraft() {
    clearQuestionnaireStateV1();
    setFormState(defaultQuestionnaireStateV1);
    setSaveMessage("Draft cleared.");
  }

  function handleGenerateOutputs() {
    const saved = saveQuestionnaireStateV1(formState);
    setFormState(saved);
    setSaveMessage(`Startup outputs generated from draft saved at ${saved._meta.lastSavedAt}`);
    router.push("/partner/outputs");
  }

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
          Structured intake layer inside the current IQR app. Every answer maps to a
          configurator output and/or a stable property record object.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">Back to Home</Link>

          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">Partner Entry</Link>
            <span className="subnav-current-dot" aria-hidden="true">&bull;</span>
            <Link href="/partner/outputs" className="subnav-pill">Outputs</Link>
            <Link href="/hq" className="subnav-pill">HQ Admin</Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Questionnaire State + Output Wiring</h2>
            <p className="muted">
              Questionnaire → Configurator → Startup Outputs → Property Record Shell → Field Install Plan
            </p>
          </div>
          <div className="status-pill">Slice 6A</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">QR plan items</div>
            <div className="metric-value">{outputSummary.qrTagCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Startup kit items</div>
            <div className="metric-value">{outputSummary.startupKitCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Install checklist items</div>
            <div className="metric-value">{outputSummary.checklistCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Counter Card readiness</div>
            <div className="metric-value small-value">{outputSummary.counterCardReady ? "Ready" : "Pending"}</div>
          </div>
        </div>

        <div className="save-status">{saveMessage}</div>

        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={handleResumeDraft}>Resume Draft</button>
          <button type="button" className="button-secondary" onClick={handleSaveDraft}>Save Draft</button>
          <button type="button" className="button-secondary" onClick={handleClearDraft}>Clear Draft</button>
          <button type="button" className="button-primary" onClick={handleGenerateOutputs}>Generate Startup Outputs</button>
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
              <input
                id="parcel-apn"
                name="parcel-apn"
                type="text"
                placeholder="217-54-321"
                value={formState.propertyBasics.parcelApn}
                onChange={(e) => updateSection("propertyBasics", "parcelApn", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="street-address">Street address</label>
              <input
                id="street-address"
                name="street-address"
                type="text"
                placeholder="1234 Desert Highlands Drive"
                value={formState.propertyBasics.streetAddress}
                onChange={(e) => updateSection("propertyBasics", "streetAddress", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="property-type">Property type</label>
              <select
                id="property-type"
                name="property-type"
                value={formState.propertyBasics.propertyType}
                onChange={(e) => updateSection("propertyBasics", "propertyType", e.target.value)}
              >
                <option value="">Select one</option>
                <option>Single-family residence</option>
                <option>Condo / townhome</option>
                <option>Estate / compound</option>
                <option>Second residence</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="occupancy-type">Occupancy type</label>
              <select
                id="occupancy-type"
                name="occupancy-type"
                value={formState.propertyBasics.occupancyType}
                onChange={(e) => updateSection("propertyBasics", "occupancyType", e.target.value)}
              >
                <option value="">Select one</option>
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
              <label htmlFor="client-owner">Client / owner</label>
              <input
                id="client-owner"
                name="client-owner"
                type="text"
                placeholder="Owner or estate contact"
                value={formState.peopleRoles.clientOwner}
                onChange={(e) => updateSection("peopleRoles", "clientOwner", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="property-manager">Property manager</label>
              <input
                id="property-manager"
                name="property-manager"
                type="text"
                placeholder="Management company or contact"
                value={formState.peopleRoles.propertyManager}
                onChange={(e) => updateSection("peopleRoles", "propertyManager", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="tis-owner">TIS owner / integrator</label>
              <input
                id="tis-owner"
                name="tis-owner"
                type="text"
                placeholder="Partner account owner"
                value={formState.peopleRoles.tisOwner}
                onChange={(e) => updateSection("peopleRoles", "tisOwner", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="service-preference">Service preference</label>
              <select
                id="service-preference"
                name="service-preference"
                value={formState.peopleRoles.servicePreference}
                onChange={(e) => updateSection("peopleRoles", "servicePreference", e.target.value)}
              >
                <option value="">Select one</option>
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
            <label className="checkbox-item"><input type="checkbox" checked={formState.avit.mainRackPresent} onChange={(e) => updateSection("avit", "mainRackPresent", e.target.checked)} /> Main AV rack present</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.avit.managedGateway} onChange={(e) => updateSection("avit", "managedGateway", e.target.checked)} /> Managed network gateway</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.avit.poeSwitching} onChange={(e) => updateSection("avit", "poeSwitching", e.target.checked)} /> PoE switching</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.avit.wifiAccessPoints} onChange={(e) => updateSection("avit", "wifiAccessPoints", e.target.checked)} /> Wi-Fi access points</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.avit.controlProcessor} onChange={(e) => updateSection("avit", "controlProcessor", e.target.checked)} /> Control processor</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.avit.upsConditionedPower} onChange={(e) => updateSection("avit", "upsConditionedPower", e.target.checked)} /> UPS / conditioned power</label>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="rack-location">Primary rack location</label>
              <input
                id="rack-location"
                name="rack-location"
                type="text"
                placeholder="Main AV closet"
                value={formState.avit.rackLocation}
                onChange={(e) => updateSection("avit", "rackLocation", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="network-notes">Network notes</label>
              <input
                id="network-notes"
                name="network-notes"
                type="text"
                placeholder="VLANs, ISP, backup WAN, etc."
                value={formState.avit.networkNotes}
                onChange={(e) => updateSection("avit", "networkNotes", e.target.value)}
              />
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
            <label className="checkbox-item"><input type="checkbox" checked={formState.majorSystems.hvac} onChange={(e) => updateSection("majorSystems", "hvac", e.target.checked)} /> HVAC</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.majorSystems.waterHeater} onChange={(e) => updateSection("majorSystems", "waterHeater", e.target.checked)} /> Water heater</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.majorSystems.electrical} onChange={(e) => updateSection("majorSystems", "electrical", e.target.checked)} /> Electrical</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.majorSystems.plumbing} onChange={(e) => updateSection("majorSystems", "plumbing", e.target.checked)} /> Plumbing</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.majorSystems.roof} onChange={(e) => updateSection("majorSystems", "roof", e.target.checked)} /> Roof</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.majorSystems.refrigerationIceMaker} onChange={(e) => updateSection("majorSystems", "refrigerationIceMaker", e.target.checked)} /> Refrigeration / ice maker</label>
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
            <label className="checkbox-item"><input type="checkbox" checked={formState.waterRisk.dishwasherProtected} onChange={(e) => updateSection("waterRisk", "dishwasherProtected", e.target.checked)} /> Dishwasher protection</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.waterRisk.toiletsProtected} onChange={(e) => updateSection("waterRisk", "toiletsProtected", e.target.checked)} /> Toilet supply line protection</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.waterRisk.clothesWasherProtected} onChange={(e) => updateSection("waterRisk", "clothesWasherProtected", e.target.checked)} /> Clothes washer protection</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.waterRisk.refrigeratorProtected} onChange={(e) => updateSection("waterRisk", "refrigeratorProtected", e.target.checked)} /> Refrigerator / ice maker protection</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.waterRisk.waterHeaterProtected} onChange={(e) => updateSection("waterRisk", "waterHeaterProtected", e.target.checked)} /> Water heater pan protection</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.waterRisk.sinkCabinetProtected} onChange={(e) => updateSection("waterRisk", "sinkCabinetProtected", e.target.checked)} /> Sink cabinet protection</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.waterRisk.localShutoffScope} onChange={(e) => updateSection("waterRisk", "localShutoffScope", e.target.checked)} /> Local shutoff devices in scope</label>
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
            <label className="checkbox-item"><input type="checkbox" checked={formState.environmental.rackTemperature} onChange={(e) => updateSection("environmental", "rackTemperature", e.target.checked)} /> Rack temperature</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.environmental.garageFreezer} onChange={(e) => updateSection("environmental", "garageFreezer", e.target.checked)} /> Garage freezer</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.environmental.wineRoom} onChange={(e) => updateSection("environmental", "wineRoom", e.target.checked)} /> Wine room</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.environmental.artCollectionRoom} onChange={(e) => updateSection("environmental", "artCollectionRoom", e.target.checked)} /> Art / collection room</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.environmental.mechanicalRoom} onChange={(e) => updateSection("environmental", "mechanicalRoom", e.target.checked)} /> Mechanical room</label>
            <label className="checkbox-item"><input type="checkbox" checked={formState.environmental.pantryFoodStorage} onChange={(e) => updateSection("environmental", "pantryFoodStorage", e.target.checked)} /> Pantry / food storage</label>
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
              <select
                id="counter-card-mode"
                name="counter-card-mode"
                value={formState.counterCard.mode}
                onChange={(e) => updateSection("counterCard", "mode", e.target.value)}
              >
                <option value="">Select one</option>
                <option>Scan-2-Know + Scan-2-Join</option>
                <option>Scan-2-Know only</option>
                <option>Scan-2-Join only</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="guest-network-name">Guest network display name</label>
              <input
                id="guest-network-name"
                name="guest-network-name"
                type="text"
                placeholder="IQR Guest"
                value={formState.counterCard.guestNetworkName}
                onChange={(e) => updateSection("counterCard", "guestNetworkName", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="section-card form-section">
          <div className="section-header">
            <div>
              <h2>8. Stewardship / Service Preferences</h2>
              <p className="muted">Answers here drive startup outputs and continuity posture.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="yearly-update">Yearly update cadence</label>
              <select
                id="yearly-update"
                name="yearly-update"
                value={formState.stewardship.yearlyUpdate}
                onChange={(e) => updateSection("stewardship", "yearlyUpdate", e.target.value)}
              >
                <option value="">Select one</option>
                <option>Required</option>
                <option>Recommended</option>
                <option>Deferred</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="startup-priority">Startup priority</label>
              <select
                id="startup-priority"
                name="startup-priority"
                value={formState.stewardship.startupPriority}
                onChange={(e) => updateSection("stewardship", "startupPriority", e.target.value)}
              >
                <option value="">Select one</option>
                <option>Standard</option>
                <option>Rush onboarding</option>
                <option>Needs additional documentation</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="onboarding-notes">Controlled notes</label>
            <textarea
              id="onboarding-notes"
              name="onboarding-notes"
              placeholder="Use only when structured fields do not cover the case."
              value={formState.stewardship.onboardingNotes}
              onChange={(e) => updateSection("stewardship", "onboardingNotes", e.target.value)}
            />
          </div>
        </section>
      </form>
    </main>
  );
}


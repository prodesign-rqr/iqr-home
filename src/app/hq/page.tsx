"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  loadQuestionnaireStateV1,
  type QuestionnaireStateV1,
} from "../../lib/questionnaire-state-v1";
import {
  buildOnboardingBuckets,
  buildOnboardingProperty,
  onboardingStatuses,
} from "../../lib/onboarding-pipeline-v1";
import { buildOutputSummary, buildTagItems } from "../../lib/output-mappers-v1";
import { buildPropertyWorkspace } from "../../lib/property-workspace-v1";

export default function HQPage() {
  const [state, setState] = useState<QuestionnaireStateV1 | null>(null);

  useEffect(() => {
    setState(loadQuestionnaireStateV1());
  }, []);

  const currentState = state ?? loadQuestionnaireStateV1();
  const onboardingProperty = useMemo(
    () => buildOnboardingProperty(currentState),
    [currentState],
  );
  const buckets = useMemo(() => buildOnboardingBuckets(currentState), [currentState]);
  const outputSummary = useMemo(() => buildOutputSummary(currentState), [currentState]);
  const qrPlanCount = useMemo(() => buildTagItems(currentState).length, [currentState]);
  const workspace = useMemo(() => buildPropertyWorkspace(currentState), [currentState]);

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

        <h1>HQ Admin</h1>
        <p>
          HQ-side oversight for onboarding review, status control, record correction, startup release decisions,
          and property workspace continuity.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">
            Back to Home
          </Link>

          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">
              Partner Entry
            </Link>
            <Link href="/partner/workspace" className="subnav-pill">
              Property Workspace
            </Link>
            <Link href="/partner/questionnaire" className="subnav-pill">
              Questionnaire
            </Link>
            <Link href="/partner/outputs" className="subnav-pill">
              Startup Outputs
            </Link>
            <span className="subnav-pill current">HQ Admin</span>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Onboarding Pipeline</h2>
            <p className="muted">Status buckets required for HQ review visibility and control.</p>
          </div>
          <div className="status-pill">HQ Protected</div>
        </div>

        <div className="pipeline-card-grid">
          {onboardingStatuses.map((status) => (
            <div className="pipeline-card" key={status}>
              <div className="pipeline-card-top">
                <strong>{status}</strong>
                <span className="qty-chip">{buckets[status].length}</span>
              </div>
              <div className="muted">
                {buckets[status].length > 0
                  ? buckets[status][0].propertyName
                  : "No draft in this bucket"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Property Workspace Oversight</h2>
            <p className="muted">
              First HQ view into the property-centered operating environment.
            </p>
          </div>
          <div className="status-pill">{workspace.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Participants</div>
            <div className="metric-value">{workspace.participants.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Action prompts</div>
            <div className="metric-value">{workspace.prompts.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Modules</div>
            <div className="metric-value">{workspace.modules.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Counter Card</div>
            <div className="metric-value">
              {workspace.counterCardReady ? "Ready" : "Needs attention"}
            </div>
          </div>
        </div>

        <Link href="/partner/workspace" className="button-primary inline-button">
          Open Property Workspace
        </Link>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Current Draft Record</h2>
            <p className="muted">
              HQ view of the current browser questionnaire and its derived startup posture.
            </p>
          </div>
          <div className="status-pill">{onboardingProperty.currentStatus}</div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>{onboardingProperty.propertyName}</strong>
              <span className="qty-chip">{onboardingProperty.id}</span>
            </div>
            <p>
              <strong>Street address:</strong> {onboardingProperty.streetAddress}
            </p>
            <p>
              <strong>Parcel / APN:</strong> {onboardingProperty.parcelApn}
            </p>
            <p>
              <strong>Partner:</strong> {onboardingProperty.partnerName}
            </p>
            <p>
              <strong>Continuity owner:</strong> {onboardingProperty.continuityOwner}
            </p>
            <p>
              <strong>Next action:</strong> {onboardingProperty.nextAction}
            </p>
            <p>
              <strong>Notes:</strong> {onboardingProperty.notes}
            </p>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Startup Output Counts</strong>
              <span className="qty-chip">Live</span>
            </div>
            <p>
              <strong>QR plan items:</strong> {qrPlanCount}
            </p>
            <p>
              <strong>Startup kit items:</strong> {outputSummary.startupKitCount}
            </p>
            <p>
              <strong>Record shell blocks:</strong> {outputSummary.propertyShellCount}
            </p>
            <p>
              <strong>Field tasks:</strong> {outputSummary.checklistCount}
            </p>
            <p>
              <strong>Counter Card ready:</strong>{" "}
              {outputSummary.counterCardReady ? "Yes" : "No"}
            </p>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Status History</strong>
              <span className="qty-chip">{onboardingProperty.statusHistory.length}</span>
            </div>

            <div className="bullet-list">
              {onboardingProperty.statusHistory.map((entry, index) => (
                <div className="list-card" key={`${entry.status}-${index}`}>
                  <strong>{entry.status}</strong>
                  <div>{entry.timestamp}</div>
                  <div>{entry.changedBy}</div>
                  <div>{entry.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


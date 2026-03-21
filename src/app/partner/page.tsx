"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  hasSavedQuestionnaireDraft,
  loadQuestionnaireStateV1,
  type QuestionnaireStateV1,
} from "../../lib/questionnaire-state-v1";
import { buildOutputSummary, buildTagItems } from "../../lib/output-mappers-v1";
import { buildOnboardingProperty } from "../../lib/onboarding-pipeline-v1";

export default function PartnerPage() {
  const [state, setState] = useState<QuestionnaireStateV1 | null>(null);

  useEffect(() => {
    setState(loadQuestionnaireStateV1());
  }, []);

  const draftLoaded = state !== null;
  const currentState = state ?? loadQuestionnaireStateV1();
  const outputSummary = useMemo(() => buildOutputSummary(currentState), [currentState]);
  const qrPlanCount = useMemo(() => buildTagItems(currentState).length, [currentState]);
  const onboardingRecord = useMemo(
    () => buildOnboardingProperty(currentState),
    [currentState],
  );

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

        <h1>Partner Entry</h1>
        <p>
          Partner-side workspace for intake, output review, and startup packet readiness.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">
            Back to Home
          </Link>

          <div className="subpage-nav-links">
            <span className="subnav-pill current">Partner Workspace</span>
            <Link href="/partner/questionnaire" className="subnav-pill">
              Questionnaire
            </Link>
            <Link href="/partner/outputs" className="subnav-pill">
              Startup Outputs
            </Link>
            <Link href="/hq" className="subnav-pill">
              HQ Admin
            </Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Draft Status</h2>
            <p className="muted">
              Current browser draft state and the readiness implied by the live questionnaire.
            </p>
          </div>
          <div className="status-pill">
            {hasSavedQuestionnaireDraft(currentState) ? "Saved draft present" : "No saved draft"}
          </div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Property</div>
            <div className="metric-value">{onboardingRecord.propertyName}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Current status</div>
            <div className="metric-value">{onboardingRecord.currentStatus}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">QR plan items</div>
            <div className="metric-value">{qrPlanCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Startup kit items</div>
            <div className="metric-value">{outputSummary.startupKitCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Record shell blocks</div>
            <div className="metric-value">{outputSummary.propertyShellCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Field tasks</div>
            <div className="metric-value">{outputSummary.checklistCount}</div>
          </div>
        </div>

        <div className="list-card">
          <strong>Next action</strong>
          <div>{onboardingRecord.nextAction}</div>
        </div>

        <p className="muted">
          {draftLoaded
            ? "Loaded from the current browser draft."
            : "Loading the current browser draft."}
        </p>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Partner Actions</h2>
            <p className="muted">
              Move from intake to generated outputs without leaving the partner lane.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Questionnaire</strong>
              <span className="qty-chip">Intake</span>
            </div>
            <p>
              Capture the property anchor, people, AV / IT scope, monitoring, and access posture.
            </p>
            <Link href="/partner/questionnaire" className="button-primary inline-button">
              Open Questionnaire
            </Link>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Startup Outputs</strong>
              <span className="qty-chip">Review</span>
            </div>
            <p>
              Inspect QR tags, startup kit contents, property shell blocks, and field tasks.
            </p>
            <Link href="/partner/outputs" className="button-primary inline-button">
              Open Startup Outputs
            </Link>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>HQ Visibility</strong>
              <span className="qty-chip">Oversight</span>
            </div>
            <p>
              Confirm how the current draft appears on the HQ side of the onboarding workflow.
            </p>
            <Link href="/hq" className="button-secondary inline-button">
              Open HQ Admin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


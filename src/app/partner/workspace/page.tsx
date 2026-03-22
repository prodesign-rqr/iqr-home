"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  loadQuestionnaireStateV1,
  type QuestionnaireStateV1,
} from "../../../lib/questionnaire-state-v1";
import { buildPropertyWorkspace } from "../../../lib/property-workspace-v1";

export default function PartnerWorkspacePage() {
  const [state, setState] = useState<QuestionnaireStateV1 | null>(null);

  useEffect(() => {
    setState(loadQuestionnaireStateV1());
  }, []);

  const currentState = state ?? loadQuestionnaireStateV1();
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

        <h1>Property Workspace</h1>
        <p>
          Property-centered operating environment for onboarding, continuity, field execution,
          integrity prompts, and startup-packet visibility.
        </p>

        <div className="subpage-nav">
          <Link href="/" className="subpage-nav-home">
            Back to Home
          </Link>

          <div className="subpage-nav-links">
            <Link href="/partner" className="subnav-pill">
              Partner Entry
            </Link>
            <span className="subnav-pill current">Property Workspace</span>
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
            <h2>Property Anchor</h2>
            <p className="muted">
              The property is the permanent center of gravity. People and workflow attach to it.
            </p>
          </div>
          <div className="status-pill">{workspace.currentStatus}</div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">Property</div>
            <div className="metric-value">{workspace.propertyName}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Property ID</div>
            <div className="metric-value">{workspace.propertyId}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Street address</div>
            <div className="metric-value">{workspace.streetAddress}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Parcel / APN</div>
            <div className="metric-value">{workspace.parcelApn}</div>
          </div>
        </div>

        <div className="list-card">
          <strong>Next action</strong>
          <div>{workspace.nextAction}</div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Workspace Metrics</h2>
            <p className="muted">
              Derived counts that help the property explain where it stands operationally.
            </p>
          </div>
        </div>

        <div className="grid two-col">
          <div className="metric-card">
            <div className="metric-label">QR plan items</div>
            <div className="metric-value">{workspace.qrPlanCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Startup kit items</div>
            <div className="metric-value">{workspace.startupKitCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Property shell blocks</div>
            <div className="metric-value">{workspace.propertyShellCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Field tasks</div>
            <div className="metric-value">{workspace.checklistCount}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Counter Card</div>
            <div className="metric-value">
              {workspace.counterCardReady ? "Ready" : "Needs attention"}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Action Prompts</h2>
            <p className="muted">
              Property-specific operational prompts, not generic task-management clutter.
            </p>
          </div>
        </div>

        <div className="bullet-list">
          {workspace.prompts.map((prompt, index) => (
            <div className="list-card" key={`${prompt.title}-${index}`}>
              <strong>{prompt.title}</strong>
              <div>{prompt.owner}</div>
              <div>{prompt.status}</div>
              <div>{prompt.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Participants + Role Views</h2>
            <p className="muted">
              Humans and organizations remain attached to the property record as stewardship participants.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Participants</strong>
              <span className="qty-chip">{workspace.participants.length}</span>
            </div>
            <div className="bullet-list">
              {workspace.participants.map((participant, index) => (
                <div className="list-card" key={`${participant.role}-${index}`}>
                  <strong>{participant.role}</strong>
                  <div>{participant.name}</div>
                  <div>{participant.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="output-detail-card">
            <div className="detail-card-top">
              <strong>Role Views</strong>
              <span className="qty-chip">{workspace.roleViews.length}</span>
            </div>
            <div className="bullet-list">
              {workspace.roleViews.map((view, index) => (
                <div className="list-card" key={`${view.role}-${index}`}>
                  <strong>{view.role}</strong>
                  <div>{view.focus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Operational Modules</h2>
            <p className="muted">
              First-pass architecture for onboarding, integrity, document collection, field execution, and Slack prompts.
            </p>
          </div>
        </div>

        <div className="output-detail-stack">
          {workspace.modules.map((module, index) => (
            <div className="output-detail-card" key={`${module.title}-${index}`}>
              <div className="detail-card-top">
                <strong>{module.title}</strong>
                <span className="qty-chip">{module.status}</span>
              </div>
              <p>{module.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


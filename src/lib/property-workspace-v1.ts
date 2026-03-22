import { buildOutputSummary, buildTagItems } from "./output-mappers-v1";
import { buildOnboardingProperty } from "./onboarding-pipeline-v1";
import type { QuestionnaireStateV1 } from "./questionnaire-state-v1";

export type PropertyWorkspaceParticipant = {
  name: string;
  role: string;
  status: string;
};

export type PropertyWorkspacePrompt = {
  title: string;
  owner: string;
  status: string;
  detail: string;
};

export type PropertyWorkspaceModule = {
  title: string;
  status: string;
  detail: string;
};

export type PropertyWorkspaceRoleView = {
  role: string;
  focus: string;
};

export type PropertyWorkspaceV1 = {
  propertyId: string;
  propertyName: string;
  streetAddress: string;
  parcelApn: string;
  currentStatus: string;
  nextAction: string;
  participants: PropertyWorkspaceParticipant[];
  prompts: PropertyWorkspacePrompt[];
  modules: PropertyWorkspaceModule[];
  roleViews: PropertyWorkspaceRoleView[];
  qrPlanCount: number;
  startupKitCount: number;
  propertyShellCount: number;
  checklistCount: number;
  counterCardReady: boolean;
};

function text(value: string | undefined, fallback = ""): string {
  return value && value.trim() ? value.trim() : fallback;
}

export function buildPropertyWorkspace(state: QuestionnaireStateV1): PropertyWorkspaceV1 {
  const onboarding = buildOnboardingProperty(state);
  const outputSummary = buildOutputSummary(state);
  const qrPlanCount = buildTagItems(state).length;

  const participants: PropertyWorkspaceParticipant[] = [
    {
      name: text(state.peopleRoles.clientOwner, "Client / owner not assigned"),
      role: "Homeowner",
      status: state.peopleRoles.clientOwner ? "Attached" : "Missing",
    },
    {
      name: text(state.peopleRoles.propertyManager, "Property manager not assigned"),
      role: "Property manager",
      status: state.peopleRoles.propertyManager ? "Attached" : "Optional / missing",
    },
    {
      name: text(state.peopleRoles.tisOwner, "Integrator owner not assigned"),
      role: "Integrator owner",
      status: state.peopleRoles.tisOwner ? "Attached" : "Missing",
    },
  ];

  const prompts: PropertyWorkspacePrompt[] = [];

  if (!text(state.propertyBasics.parcelApn) || !text(state.propertyBasics.streetAddress)) {
    prompts.push({
      title: "Complete property anchor",
      owner: "Partner sales",
      status: "Open",
      detail: "Parcel / APN and street address must be confirmed before the workspace can serve as the canonical property anchor.",
    });
  }

  if (!text(state.peopleRoles.clientOwner) || !text(state.peopleRoles.tisOwner)) {
    prompts.push({
      title: "Attach core stewardship participants",
      owner: "Partner owner",
      status: "Open",
      detail: "Client / owner and TIS owner are required so the property has accountable human participants attached to the record.",
    });
  }

  if (outputSummary.propertyShellCount === 0 || outputSummary.checklistCount === 0) {
    prompts.push({
      title: "Advance startup outputs",
      owner: "Partner workspace",
      status: "In progress",
      detail: "Startup outputs are still thin. Continue intake and generated output review before field execution.",
    });
  }

  if (!outputSummary.counterCardReady) {
    prompts.push({
      title: "Confirm Counter Card readiness",
      owner: "Partner workspace",
      status: "Open",
      detail: "Counter Card mode and guest access details still need to support the public access layer cleanly.",
    });
  }

  if (prompts.length === 0) {
    prompts.push({
      title: "HQ review and release",
      owner: "HQ admin",
      status: "Ready",
      detail: "The property workspace is coherent enough for HQ review, release prep, and startup packet assembly.",
    });
  }

  const modules: PropertyWorkspaceModule[] = [
    {
      title: "Questionnaire + intake",
      status: onboarding.currentStatus,
      detail: "Structured intake remains the first controlled step in building the house record.",
    },
    {
      title: "Startup outputs",
      status: outputSummary.propertyShellCount > 0 ? "Available" : "Forming",
      detail: "QR plan, startup kit, property shell, and field checklist outputs stay tied to the property record.",
    },
    {
      title: "Document intake",
      status: "Planned",
      detail: "PDF upload, mobile capture, and OCR-assisted confirmation will attach evidence to structured record objects.",
    },
    {
      title: "Integrity queue",
      status: prompts.some((prompt) => prompt.status == "Open") ? "Needs action" : "Stable",
      detail: "Missing information, unresolved issues, and unverified records become property-specific operational prompts.",
    },
    {
      title: "Field execution",
      status: outputSummary.checklistCount > 0 ? "Seeded" : "Pending",
      detail: "Field tasks are anchored to the property workspace, not scattered across generic task tools.",
    },
    {
      title: "Slack ops layer",
      status: "Planned",
      detail: "Slack will remain the prompt layer for partner operations while IQR stays the source of truth.",
    },
  ];

  const roleViews: PropertyWorkspaceRoleView[] = [
    {
      role: "Homeowner / spouse",
      focus: "Confidence, continuity, and a readable operating record for the house.",
    },
    {
      role: "Property manager",
      focus: "Current state, pending actions, and verified continuity across service events.",
    },
    {
      role: "Integrator owner / sales",
      focus: "Questionnaire quality, startup outputs, install readiness, and missing-information closure.",
    },
    {
      role: "Field technician / service coordinator",
      focus: "What is ready, what is blocked, what is verified, and what must be captured back into the record.",
    },
    {
      role: "HQ admin",
      focus: "Status visibility, release control, integrity review, and partner oversight.",
    },
  ];

  return {
    propertyId: onboarding.id,
    propertyName: onboarding.propertyName,
    streetAddress: onboarding.streetAddress,
    parcelApn: onboarding.parcelApn,
    currentStatus: onboarding.currentStatus,
    nextAction: onboarding.nextAction,
    participants,
    prompts,
    modules,
    roleViews,
    qrPlanCount,
    startupKitCount: outputSummary.startupKitCount,
    propertyShellCount: outputSummary.propertyShellCount,
    checklistCount: outputSummary.checklistCount,
    counterCardReady: outputSummary.counterCardReady,
  };
}


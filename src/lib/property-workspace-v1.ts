import { buildOutputSummary, buildTagItems } from "./output-mappers-v1";
import { buildOnboardingProperty } from "./onboarding-pipeline-v1";
import type { QuestionnaireStateV1 } from "./questionnaire-state-v1";
import type {
  BlockerType,
  SectionIntegrityRollup,
  TruthResolution,
  TruthStatus,
} from "./types";

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

export type TruthInput = {
  verification?: string;
  status?: string;
  hasEvidence?: boolean;
  lastVerifiedAt?: string;
  missing?: boolean;
  blocked?: boolean;
  blockerType?: BlockerType;
  blockerReason?: string;
  nextActionText?: string;
  reported?: boolean;
  inferred?: boolean;
  conflicting?: boolean;
  linkageMissing?: boolean;
  contextMissing?: boolean;
  stale?: boolean;
  restricted?: boolean;
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

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function blockerReasonFor(type?: BlockerType): string | undefined {
  switch (type) {
    case "missing_source":
      return "Supporting source is missing.";
    case "missing_verification":
      return "Recorded information still needs verification.";
    case "missing_linkage":
      return "Related record linkage is incomplete.";
    case "missing_context":
      return "Operational context is too thin to trust.";
    case "conflicting_record":
      return "Conflicting record state needs resolution.";
    case "awaiting_update":
      return "Review or update cadence has gone stale.";
    case "restricted_access":
      return "Required supporting material is not accessible.";
    default:
      return undefined;
  }
}

function nextActionFor(type?: BlockerType): string | undefined {
  switch (type) {
    case "missing_source":
      return "Add supporting file, photo, or source.";
    case "missing_verification":
      return "Verify recorded information.";
    case "missing_linkage":
      return "Link related record or event.";
    case "missing_context":
      return "Add operational detail.";
    case "conflicting_record":
      return "Resolve record conflict.";
    case "awaiting_update":
      return "Complete review or update.";
    case "restricted_access":
      return "Restore or request access.";
    default:
      return undefined;
  }
}

export function resolveTruth(input: TruthInput): TruthResolution {
  const verification = normalize(input.verification);
  const status = normalize(input.status);

  const blockerType: BlockerType | undefined =
    input.blockerType ??
    (input.conflicting
      ? "conflicting_record"
      : input.linkageMissing
      ? "missing_linkage"
      : input.contextMissing
      ? "missing_context"
      : input.stale
      ? "awaiting_update"
      : input.restricted
      ? "restricted_access"
      : input.blocked
      ? "missing_verification"
      : undefined);

  if (input.missing || (!verification && !status && !input.hasEvidence && !blockerType)) {
    return {
      truthStatus: "Missing",
      blockerReason: input.blockerReason ?? "Required information is missing.",
      nextActionText: input.nextActionText ?? "Add the missing information.",
      evidenceLabel: input.hasEvidence ? "Evidence present" : undefined,
      lastVerifiedAt: input.lastVerifiedAt,
    };
  }

  if (blockerType) {
    return {
      truthStatus: "Blocked",
      blockerType,
      blockerReason: input.blockerReason ?? blockerReasonFor(blockerType),
      nextActionText: input.nextActionText ?? nextActionFor(blockerType),
      evidenceLabel: input.hasEvidence ? "Evidence present" : undefined,
      lastVerifiedAt: input.lastVerifiedAt,
    };
  }

  if (input.inferred) {
    return {
      truthStatus: "Inferred",
      blockerReason: "Derived from linked record context.",
      evidenceLabel: input.hasEvidence ? "Evidence present" : undefined,
      lastVerifiedAt: input.lastVerifiedAt,
    };
  }

  if (
    verification === "verified" ||
    verification === "complete" ||
    verification === "confirmed" ||
    status === "verified" ||
    status === "active" ||
    status === "ready" ||
    status === "complete" ||
    status === "stable" ||
    status === "protected"
  ) {
    return {
      truthStatus: "Verified",
      evidenceLabel: input.hasEvidence ? "Evidence present" : "Verified state",
      lastVerifiedAt: input.lastVerifiedAt,
    };
  }

  if (
    input.reported ||
    verification === "reported" ||
    verification === "pending" ||
    verification === "needs review" ||
    verification === "review" ||
    status === "reported" ||
    status === "pending" ||
    status === "watch" ||
    status === "open"
  ) {
    return {
      truthStatus: "Reported",
      blockerReason: "Present in the record but not yet verified.",
      nextActionText: "Verify recorded information.",
      evidenceLabel: input.hasEvidence ? "Evidence present" : undefined,
      lastVerifiedAt: input.lastVerifiedAt,
    };
  }

  return {
    truthStatus: "Reported",
    blockerReason: "Present in the record but not yet normalized.",
    nextActionText: "Review and verify the recorded state.",
    evidenceLabel: input.hasEvidence ? "Evidence present" : undefined,
    lastVerifiedAt: input.lastVerifiedAt,
  };
}

export function buildSectionIntegrityRollup(items: TruthResolution[]): SectionIntegrityRollup {
  const verifiedCount = items.filter((item) => item.truthStatus === "Verified").length;
  const reportedOrInferredCount = items.filter(
    (item) => item.truthStatus === "Reported" || item.truthStatus === "Inferred",
  ).length;
  const missingCount = items.filter((item) => item.truthStatus === "Missing").length;
  const blockedCount = items.filter((item) => item.truthStatus === "Blocked").length;

  const summaryParts: string[] = [];
  if (verifiedCount) summaryParts.push(`${verifiedCount} verified`);
  if (reportedOrInferredCount) summaryParts.push(`${reportedOrInferredCount} pending`);
  if (missingCount) summaryParts.push(`${missingCount} missing`);
  if (blockedCount) summaryParts.push(`${blockedCount} blocked`);

  const nextActionText =
    items.find((item) => item.nextActionText)?.nextActionText ??
    (blockedCount > 0
      ? "Resolve blockers first."
      : missingCount > 0
      ? "Add missing information."
      : reportedOrInferredCount > 0
      ? "Verify reported items."
      : undefined);

  return {
    verifiedCount,
    reportedOrInferredCount,
    missingCount,
    blockedCount,
    summary: summaryParts.length ? summaryParts.join(" • ") : "No items surfaced",
    nextActionText,
  };
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
      status: prompts.some((prompt) => prompt.status === "Open") ? "Needs action" : "Stable",
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

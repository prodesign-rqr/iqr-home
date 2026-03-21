import { buildOutputSummary, buildTagItems } from "./output-mappers-v1";
import type { QuestionnaireStateV1 } from "./questionnaire-state-v1";

export const onboardingStatuses = [
  "New",
  "In Process",
  "Needs Additional Information",
  "Ready to Ship",
  "Completed",
] as const;

export type OnboardingStatus = (typeof onboardingStatuses)[number];

export const onboardingFlow = [
  "Questionnaire",
  "System Design Configurator",
  "Startup Outputs",
  "Property Record Shell",
  "Field Install Plan",
] as const;

export type OnboardingStatusEntry = {
  status: OnboardingStatus;
  timestamp: string;
  changedBy: string;
  notes: string;
};

export type OnboardingProperty = {
  id: string;
  propertyName: string;
  streetAddress: string;
  parcelApn: string;
  partnerName: string;
  continuityOwner: string;
  currentStatus: OnboardingStatus;
  nextAction: string;
  notes: string;
  startupOutputs: string[];
  statusHistory: OnboardingStatusEntry[];
};

function text(value: string | undefined, fallback = ""): string {
  return value && value.trim() ? value.trim() : fallback;
}

function derivePropertyName(state: QuestionnaireStateV1): string {
  const street = text(state.propertyBasics.streetAddress);
  const parcel = text(state.propertyBasics.parcelApn);

  if (street) {
    return street.split(",")[0].trim();
  }

  if (parcel) {
    return `Property ${parcel}`;
  }

  return "Unnamed property draft";
}

function derivePropertyId(state: QuestionnaireStateV1): string {
  const parcel = text(state.propertyBasics.parcelApn);
  if (parcel) {
    return `IQR-${parcel.replace(/[^0-9A-Za-z]/g, "").slice(0, 12)}`;
  }

  const street = text(state.propertyBasics.streetAddress);
  if (street) {
    return `IQR-${street.replace(/[^0-9A-Za-z]/g, "").slice(0, 12)}`;
  }

  return "IQR-DRAFT";
}

function deriveStatus(
  state: QuestionnaireStateV1,
  qrPlanCount: number,
  outputSummary: ReturnType<typeof buildOutputSummary>,
): OnboardingStatus {
  const hasParcel = Boolean(text(state.propertyBasics.parcelApn));
  const hasStreet = Boolean(text(state.propertyBasics.streetAddress));
  const hasOwner = Boolean(text(state.peopleRoles.clientOwner));
  const hasPartner = Boolean(text(state.peopleRoles.tisOwner));

  if (!hasParcel || !hasStreet) {
    return "Needs Additional Information";
  }

  if (!hasOwner || !hasPartner) {
    return "Needs Additional Information";
  }

  const hasOutputs =
    qrPlanCount > 0 ||
    outputSummary.startupKitCount > 0 ||
    outputSummary.checklistCount > 0 ||
    outputSummary.propertyShellCount > 0;

  if (!hasOutputs) {
    return "In Process";
  }

  return "Ready to Ship";
}

function deriveNextAction(currentStatus: OnboardingStatus): string {
  if (currentStatus === "Needs Additional Information") {
    return "Complete the property anchor and core ownership / partner fields.";
  }

  if (currentStatus === "In Process") {
    return "Finish the questionnaire so startup outputs can be assembled.";
  }

  if (currentStatus === "Ready to Ship") {
    return "Review the generated outputs and release the startup packet.";
  }

  if (currentStatus === "Completed") {
    return "Archive the handoff and wait for next field event.";
  }

  return "Open the questionnaire and begin intake.";
}

export function buildOnboardingProperty(
  state: QuestionnaireStateV1,
): OnboardingProperty {
  const outputSummary = buildOutputSummary(state);
  const qrPlanCount = buildTagItems(state).length;
  const currentStatus = deriveStatus(state, qrPlanCount, outputSummary);
  const now = new Date().toISOString();

  const startupOutputs: string[] = [];
  if (qrPlanCount > 0) startupOutputs.push("QR tag plan");
  if (outputSummary.counterCardReady) startupOutputs.push("Counter Card config");
  if (outputSummary.startupKitCount > 0) startupOutputs.push("Startup kit list");
  if (outputSummary.propertyShellCount > 0) startupOutputs.push("Property record shell");
  if (outputSummary.checklistCount > 0) startupOutputs.push("Field install checklist");

  const notes =
    currentStatus === "Ready to Ship"
      ? "Questionnaire is aligned well enough to assemble and review the startup packet."
      : currentStatus === "Needs Additional Information"
      ? "Draft exists, but core identity or relationship fields are still incomplete."
      : "Draft is active and outputs are still forming.";

  const history: OnboardingStatusEntry[] = [
    {
      status: "New",
      timestamp: now,
      changedBy: "Partner workspace",
      notes: "Questionnaire draft detected in the current browser.",
    },
  ];

  if (currentStatus !== "New") {
    history.push({
      status: currentStatus,
      timestamp: now,
      changedBy: "Derived pipeline",
      notes,
    });
  }

  return {
    id: derivePropertyId(state),
    propertyName: derivePropertyName(state),
    streetAddress: text(state.propertyBasics.streetAddress, "Street address not set"),
    parcelApn: text(state.propertyBasics.parcelApn, "Parcel / APN not set"),
    partnerName: text(state.peopleRoles.tisOwner, "Partner account owner not set"),
    continuityOwner: text(
      state.peopleRoles.propertyManager || state.peopleRoles.clientOwner,
      "Continuity owner not assigned",
    ),
    currentStatus,
    nextAction: deriveNextAction(currentStatus),
    notes,
    startupOutputs,
    statusHistory: history,
  };
}

export function buildOnboardingBuckets(state: QuestionnaireStateV1) {
  const property = buildOnboardingProperty(state);

  return onboardingStatuses.reduce<Record<OnboardingStatus, OnboardingProperty[]>>(
    (accumulator, status) => {
      accumulator[status] = property.currentStatus === status ? [property] : [];
      return accumulator;
    },
    {
      New: [],
      "In Process": [],
      "Needs Additional Information": [],
      "Ready to Ship": [],
      Completed: [],
    },
  );
}


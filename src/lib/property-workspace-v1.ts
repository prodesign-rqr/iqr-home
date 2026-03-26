import { buildOutputSummary, buildTagItems } from "./output-mappers-v1";
import { buildOnboardingProperty } from "./onboarding-pipeline-v1";
import type { QuestionnaireStateV1 } from "./questionnaire-state-v1";
import type { StructuredHouseRecordV11 } from "./schema";
import { groupFloorPlanDocuments, validateSpatialFinishRecord } from "./schema";
import type {
  BlockerType,
  FloorPlanDocument,
  LocationBoundRecordGroup,
  SectionIntegrityRollup,
  SelectedAreaContext,
  SpatialAreaSummary,
  SpatialFinishRecord,
  SpatialProperty,
  SpatialPropertyShell,
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
    status === "resolved"
  ) {
    return {
      truthStatus: "Verified",
      evidenceLabel: input.hasEvidence ? "Evidence present" : undefined,
      lastVerifiedAt: input.lastVerifiedAt,
    };
  }

  if (input.reported || verification === "unverified" || verification === "needs-review" || status === "reported" || status === "info" || status === "open") {
    return {
      truthStatus: "Reported",
      blockerReason: input.blockerReason,
      nextActionText: input.nextActionText,
      evidenceLabel: input.hasEvidence ? "Evidence present" : undefined,
      lastVerifiedAt: input.lastVerifiedAt,
    };
  }

  return {
    truthStatus: "Reported",
    evidenceLabel: input.hasEvidence ? "Evidence present" : undefined,
    lastVerifiedAt: input.lastVerifiedAt,
  };
}

export function buildSectionIntegrityRollup(items: TruthResolution[]): SectionIntegrityRollup {
  const rollup = {
    verifiedCount: items.filter((item) => item.truthStatus === "Verified").length,
    reportedOrInferredCount: items.filter((item) => item.truthStatus === "Reported" || item.truthStatus === "Inferred").length,
    missingCount: items.filter((item) => item.truthStatus === "Missing").length,
    blockedCount: items.filter((item) => item.truthStatus === "Blocked").length,
    summary: "",
    nextActionText: undefined as string | undefined,
  };

  const parts: string[] = [];
  if (rollup.verifiedCount) parts.push(`${rollup.verifiedCount} verified`);
  if (rollup.reportedOrInferredCount) parts.push(`${rollup.reportedOrInferredCount} pending`);
  if (rollup.missingCount) parts.push(`${rollup.missingCount} missing`);
  if (rollup.blockedCount) parts.push(`${rollup.blockedCount} blocked`);

  rollup.summary = parts.length ? parts.join(" • ") : "No records yet";
  const firstBlocked = items.find((item) => item.nextActionText)?.nextActionText;
  if (firstBlocked) rollup.nextActionText = firstBlocked;

  return rollup;
}

function toFloorPlanDocument(
  doc: NonNullable<StructuredHouseRecordV11["spatial"]>["floorPlanDocuments"][number]
): FloorPlanDocument {
  return {
    id: doc.id,
    title: doc.title,
    kind: doc.kind,
    floorId: doc.floorId,
    exteriorAreaId: doc.exteriorAreaId,
    versionLabel: doc.versionLabel,
    sourceDocumentId: doc.sourceDocumentId,
    fileName: doc.fileName,
    note: doc.note,
  };
}

function buildAreaRecordCounts(record: StructuredHouseRecordV11, areaId: string) {
  const spatial = record.spatial;
  if (!spatial) {
    return {
      documents: 0,
      finishes: 0,
      equipment: 0,
      protectionPoints: 0,
      visits: 0,
      incidents: 0,
    };
  }

  const documents = spatial.floorPlanDocuments.filter(
    (doc) => doc.floorId === spatial.areas.find((area) => area.id === areaId)?.floorId || doc.exteriorAreaId === areaId
  ).length;

  const finishes = spatial.finishLedger.filter((entry) => entry.areaId === areaId).length;

  const area = spatial.areas.find((item) => item.id === areaId);
  const label = area?.label.toLowerCase() ?? "";

  const equipment = record.avItInfrastructure.rackDevices.filter((device) =>
    (device.location ?? "").toLowerCase().includes(label)
  ).length;

  const protectionPoints = record.prevention.riskProtectionPoints.filter((point) =>
    (point.location ?? "").toLowerCase().includes(label)
  ).length;

  const visits = record.service.timeline.filter((event) =>
    (event.description ?? "").toLowerCase().includes(label) || (event.title ?? "").toLowerCase().includes(label)
  ).length;

  const incidents = record.monitoring.eventHistory.filter((event) =>
    (event.description ?? "").toLowerCase().includes(label) || (event.title ?? "").toLowerCase().includes(label)
  ).length;

  return {
    documents,
    finishes,
    equipment,
    protectionPoints,
    visits,
    incidents,
  };
}

function buildSelectedAreaContext(record: StructuredHouseRecordV11, areaId?: string): SelectedAreaContext | undefined {
  const spatial = record.spatial;
  if (!spatial || !spatial.areas.length) return undefined;

  const area = spatial.areas.find((item) => item.id === (areaId ?? spatial.areas[0].id)) ?? spatial.areas[0];
  const floor = spatial.floors.find((item) => item.id === area.floorId);

  const groupedRecords: LocationBoundRecordGroup = {
    documents: spatial.floorPlanDocuments
      .filter((doc) => doc.floorId === area.floorId || doc.exteriorAreaId === area.id)
      .map(toFloorPlanDocument),
    finishes: spatial.finishLedger
      .filter((entry) => entry.areaId === area.id)
      .filter((entry) => validateSpatialFinishRecord(entry).valid)
      .map((entry) => ({
        id: entry.id,
        floorId: entry.floorId,
        exteriorAreaId: entry.exteriorAreaId,
        areaId: entry.areaId,
        surfaceId: entry.surfaceId,
        current: entry.current,
        brand: entry.brand,
        productLine: entry.productLine,
        colorName: entry.colorName,
        colorCode: entry.colorCode,
        sheen: entry.sheen,
        dateApplied: entry.dateApplied,
        appliedBy: entry.appliedBy,
        notes: entry.notes,
      })),
    equipment: record.avItInfrastructure.rackDevices
      .filter((device) => (device.location ?? "").toLowerCase().includes(area.label.toLowerCase()))
      .map((device) => ({
        id: device.id,
        title: device.name,
        detail: `${device.brand ?? "Unknown brand"} ${device.model ?? ""}`.trim(),
      })),
    protectionPoints: record.prevention.riskProtectionPoints
      .filter((point) => point.location.toLowerCase().includes(area.label.toLowerCase()))
      .map((point) => ({
        id: point.id,
        title: point.protectedAsset,
        detail: `${point.location} | Verification: ${point.verification}`,
      })),
    incidents: record.monitoring.eventHistory
      .filter((event) => `${event.title} ${event.description ?? ""}`.toLowerCase().includes(area.label.toLowerCase()))
      .map((event) => ({
        id: event.id,
        title: event.title,
        detail: `${event.eventAt} | ${event.status}`,
      })),
    visits: record.service.timeline
      .filter((event) => `${event.title} ${event.description ?? ""}`.toLowerCase().includes(area.label.toLowerCase()))
      .map((event) => ({
        id: event.id,
        title: event.title,
        detail: `${event.eventAt} | ${event.status}`,
      })),
  };

  const groupCount =
    groupedRecords.documents.length +
    groupedRecords.finishes.length +
    groupedRecords.equipment.length +
    groupedRecords.protectionPoints.length +
    groupedRecords.incidents.length +
    groupedRecords.visits.length;

  return {
    areaId: area.id,
    label: area.label,
    areaType: area.areaType,
    floorLabel: floor?.label,
    detailSummary: groupCount
      ? `${groupCount} grouped records attached to this mapped area.`
      : "No records attached yet. This mapped area is ready for documents, finishes, service history, and protection context.",
    groupedRecords,
  };
}

export function buildSpatialPropertyShell(record: StructuredHouseRecordV11): SpatialPropertyShell {
  const spatial = record.spatial;
  const floorPlanDocuments = spatial?.floorPlanDocuments ?? [];
  const groupedDocs = groupFloorPlanDocuments(floorPlanDocuments);

  const floors = (spatial?.floors ?? []).map((floor) => {
    const areas: SpatialAreaSummary[] = (spatial?.areas ?? [])
      .filter((area) => area.floorId === floor.id)
      .map((area) => ({
        id: area.id,
        label: area.label,
        areaType: area.areaType,
        floorId: area.floorId,
        parentAreaId: area.parentAreaId,
        recordCounts: buildAreaRecordCounts(record, area.id),
      }));
    return {
      id: floor.id,
      label: floor.label,
      areas,
    };
  });

  const exteriorAreas: SpatialAreaSummary[] = (spatial?.areas ?? [])
    .filter((area) => area.areaType === "exterior")
    .map((area) => ({
      id: area.id,
      label: area.label,
      areaType: area.areaType,
      floorId: area.floorId,
      parentAreaId: area.parentAreaId,
      recordCounts: buildAreaRecordCounts(record, area.id),
    }));

  const selectedAreaContext = buildSelectedAreaContext(record);

  const property: SpatialProperty = {
    propertyId: record.property.iqrPropertyId,
    propertyName: "Anonymized Desert Residence",
    streetAddress: "Address held in canonical record",
    parcelApn: "APN held in canonical record",
    defaultFloorId: spatial?.floors?.[0]?.id,
    floors,
    exteriorAreas,
    floorPlanDocuments: floorPlanDocuments.map(toFloorPlanDocument),
    selectedAreaContext,
  };

  const currentFinishIssues = (spatial?.finishLedger ?? [])
    .map((entry) => validateSpatialFinishRecord(entry))
    .filter((result) => !result.valid);

  return {
    propertyId: record.property.iqrPropertyId,
    propertyName: property.propertyName,
    streetAddress: property.streetAddress,
    parcelApn: property.parcelApn,
    currentStatus: record.meta.recordStatus,
    nextAction:
      currentFinishIssues.length > 0
        ? "Resolve mapped finish record gaps."
        : groupedDocs.master.length === 0
        ? "Add a preserved master floor-plan document."
        : "Continue attaching room, surface, and service records to mapped areas.",
    property,
    masterFloorPlans: groupedDocs.master.map(toFloorPlanDocument),
    derivedFloorPlans: groupedDocs.derived.map(toFloorPlanDocument),
    selectedAreaContext,
    systemIndexPath: "/telemetry",
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
      detail:
        "Parcel / APN and street address must be confirmed before the workspace can serve as the canonical property anchor.",
    });
  }

  if (!text(state.peopleRoles.clientOwner) || !text(state.peopleRoles.tisOwner)) {
    prompts.push({
      title: "Attach core stewardship participants",
      owner: "Partner owner",
      status: "Open",
      detail:
        "Client / owner and TIS owner are required so the property has accountable human participants attached to the record.",
    });
  }

  if (outputSummary.propertyShellCount === 0 || outputSummary.checklistCount === 0) {
    prompts.push({
      title: "Advance startup outputs",
      owner: "Partner workspace",
      status: "In progress",
      detail:
        "Startup outputs are still thin. Continue intake and generated output review before field execution.",
    });
  }

  if (!outputSummary.counterCardReady) {
    prompts.push({
      title: "Confirm Counter Card readiness",
      owner: "Partner workspace",
      status: "Open",
      detail:
        "Counter Card mode and guest access details still need to support the public access layer cleanly.",
    });
  }

  if (prompts.length === 0) {
    prompts.push({
      title: "HQ review and release",
      owner: "HQ admin",
      status: "Ready",
      detail:
        "The property workspace is coherent enough for HQ review, release prep, and startup packet assembly.",
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

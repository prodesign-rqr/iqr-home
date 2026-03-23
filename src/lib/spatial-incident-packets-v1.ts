import { buildPropertyWorkspace } from "./property-workspace-v1";
import type { QuestionnaireStateV1 } from "./questionnaire-state-v1";

export type TelemetryEventTypeV1 =
  | "Water Leak"
  | "Temperature Anomaly"
  | "Freeze Risk"
  | "Supplemental Heat Telemetry";

export type TelemetrySeverityV1 = "High" | "Medium" | "Low";

export type TelemetryRequiredInputV1 = {
  label: string;
  status: "Required" | "Configured" | "Needs Confirmation";
  detail: string;
};

export type FloorPlanMasterV1 = {
  documentStatus: "Missing" | "Required" | "Loaded";
  expectedFormat: string;
  versionPolicy: string;
  note: string;
};

export type FloorPlanPageV1 = {
  floorLabel: string;
  pageNumber: number;
  mappingStatus: string;
  note: string;
};

export type ProtectionPointMappingV1 = {
  code: string;
  label: string;
  roomOrZone: string;
  sourceType: string;
  upstreamSystem: string;
  mappingStatus: string;
};

export type TelemetryRecipientV1 = {
  role: string;
  name: string;
  routingStatus: string;
  deliveryMode: string;
};

export type SpatialIncidentObjectV1 = {
  propertyId: string;
  propertyName: string;
  streetAddress: string;
  eventType: TelemetryEventTypeV1;
  sourceSystem: string;
  sourceIdentifier: string;
  severity: TelemetrySeverityV1;
  floor: string;
  roomOrZone: string;
  protectionPoint: string;
  timestamp: string;
  deliveryProfile: string;
  actionSummary: string;
};

export type SpatialIncidentPacketShellV1 = {
  packetTitle: string;
  packetStatus: string;
  colorLogic: {
    red: string;
    yellow: string;
    green: string;
    blue: string;
    gray: string;
  };
  includedArtifacts: string[];
  returnPath: string;
  archivePolicy: string;
};

export type SpatialIncidentTelemetryModelV1 = {
  propertyId: string;
  propertyName: string;
  streetAddress: string;
  currentStatus: string;
  requiredInputs: TelemetryRequiredInputV1[];
  floorPlanMaster: FloorPlanMasterV1;
  floorPlanPages: FloorPlanPageV1[];
  protectionPointMappings: ProtectionPointMappingV1[];
  recipients: TelemetryRecipientV1[];
  sampleIncident: SpatialIncidentObjectV1;
  samplePacket: SpatialIncidentPacketShellV1;
  returnPaths: {
    workspace: string;
    outputs: string;
    hq: string;
  };
};

function text(value: string | undefined, fallback = ""): string {
  return value && value.trim() ? value.trim() : fallback;
}

function buildRequiredInputs(): TelemetryRequiredInputV1[] {
  return [
    {
      label: "Floor plan PDF",
      status: "Required",
      detail:
        "One master PDF per property, ideally one floor per page, with legible room and service-space labels.",
    },
    {
      label: "Room / zone mapping",
      status: "Needs Confirmation",
      detail:
        "Stable room and zone coordinates should be confirmed manually during onboarding / setup for v1.",
    },
    {
      label: "Protection-point mapping",
      status: "Required",
      detail:
        "Each meaningful monitored point must be tied to a room / zone and preserved as part of the property record.",
    },
    {
      label: "Recipient routing profile",
      status: "Required",
      detail:
        "Each property needs deterministic packet recipients for homeowner, stewardship roles, and service escalation.",
    },
  ];
}

function buildFloorPlanMaster(): FloorPlanMasterV1 {
  return {
    documentStatus: "Required",
    expectedFormat: "PDF master with one floor per page where possible",
    versionPolicy: "Preserve master file and floor plan version history",
    note:
      "IQR uses the master floor plan as supporting evidence and generates a working/display copy for overlays.",
  };
}

function buildFloorPlanPages(): FloorPlanPageV1[] {
  return [
    {
      floorLabel: "Main floor",
      pageNumber: 1,
      mappingStatus: "Awaiting confirmation",
      note: "Confirm room labels, service spaces, and zone boundaries.",
    },
    {
      floorLabel: "Upper / secondary floor",
      pageNumber: 2,
      mappingStatus: "Optional / as applicable",
      note: "Use only when the property layout actually includes this floor.",
    },
  ];
}

function buildProtectionPointMappings(
  state: QuestionnaireStateV1,
): ProtectionPointMappingV1[] {
  const points: ProtectionPointMappingV1[] = [];

  if (state.waterRisk.dishwasherProtected) {
    points.push({
      code: "WL-DW-01",
      label: "Dishwasher leak point",
      roomOrZone: "Kitchen",
      sourceType: "Water risk",
      upstreamSystem: "Approved upstream sensor",
      mappingStatus: "Needs floor plan coordinate",
    });
  }

  if (state.waterRisk.toiletsProtected) {
    points.push({
      code: "WL-WC-01",
      label: "Toilet supply line point",
      roomOrZone: "Bathroom / toilet group",
      sourceType: "Water risk",
      upstreamSystem: "Approved upstream sensor",
      mappingStatus: "Needs floor plan coordinate",
    });
  }

  if (state.waterRisk.clothesWasherProtected) {
    points.push({
      code: "WL-LA-01",
      label: "Clothes washer point",
      roomOrZone: "Laundry",
      sourceType: "Water risk",
      upstreamSystem: "Approved upstream sensor",
      mappingStatus: "Needs floor plan coordinate",
    });
  }

  if (state.waterRisk.refrigeratorProtected) {
    points.push({
      code: "WL-RF-01",
      label: "Refrigerator / ice maker point",
      roomOrZone: "Kitchen / bar",
      sourceType: "Water risk",
      upstreamSystem: "Approved upstream sensor",
      mappingStatus: "Needs floor plan coordinate",
    });
  }

  if (state.waterRisk.waterHeaterPanProtected) {
    points.push({
      code: "WL-WH-01",
      label: "Water heater pan point",
      roomOrZone: "Mechanical / utility",
      sourceType: "Water risk",
      upstreamSystem: "Approved upstream sensor",
      mappingStatus: "Needs floor plan coordinate",
    });
  }

  if (state.waterRisk.sinkCabinetProtected) {
    points.push({
      code: "WL-SC-01",
      label: "Sink cabinet point",
      roomOrZone: "Kitchen / bath cabinet",
      sourceType: "Water risk",
      upstreamSystem: "Approved upstream sensor",
      mappingStatus: "Needs floor plan coordinate",
    });
  }

  if (points.length === 0) {
    points.push({
      code: "PP-UNMAPPED",
      label: "No protection points mapped from the current draft yet",
      roomOrZone: "Pending",
      sourceType: "Draft state",
      upstreamSystem: "Not yet assigned",
      mappingStatus: "Complete the questionnaire and map protection points",
    });
  }

  return points;
}

function buildRecipients(state: QuestionnaireStateV1): TelemetryRecipientV1[] {
  return [
    {
      role: "Homeowner",
      name: text(state.peopleRoles.clientOwner, "Not assigned"),
      routingStatus: text(state.peopleRoles.clientOwner) ? "Ready" : "Missing",
      deliveryMode: "Packet link + notification",
    },
    {
      role: "Property manager",
      name: text(state.peopleRoles.propertyManager, "Not assigned"),
      routingStatus: text(state.peopleRoles.propertyManager)
        ? "Ready"
        : "Optional / missing",
      deliveryMode: "Packet link + stewardship follow-up",
    },
    {
      role: "Partner / service coordinator",
      name: text(state.peopleRoles.tisOwner, "Not assigned"),
      routingStatus: text(state.peopleRoles.tisOwner) ? "Ready" : "Missing",
      deliveryMode: "Operational prompt + packet link",
    },
  ];
}

function buildSampleIncident(
  propertyId: string,
  propertyName: string,
  streetAddress: string,
  mappings: ProtectionPointMappingV1[],
): SpatialIncidentObjectV1 {
  const firstPoint = mappings[0];

  return {
    propertyId,
    propertyName,
    streetAddress,
    eventType: "Water Leak",
    sourceSystem: "Approved upstream system",
    sourceIdentifier: firstPoint.code,
    severity: "High",
    floor: "Main floor",
    roomOrZone: firstPoint.roomOrZone,
    protectionPoint: firstPoint.label,
    timestamp: "Awaiting live event timestamp",
    deliveryProfile: "Property telemetry default routing",
    actionSummary:
      "Meaningful incident packet will identify the affected point, show the floor plan overlay, and return the recipient to the property workspace for follow-up.",
  };
}

function buildSamplePacket(): SpatialIncidentPacketShellV1 {
  return {
    packetTitle: "Spatial Incident Packet",
    packetStatus: "Packet shell ready",
    colorLogic: {
      red: "Active / urgent / directly affected",
      yellow: "Attention / degraded / nearby concern",
      green: "Protected / verified / normal where relevant",
      blue: "Monitored point / device location / reference marker",
      gray: "Background structure / unaffected context",
    },
    includedArtifacts: [
      "Structured incident object",
      "Color-coded floor plan PDF overlay",
      "Legend and source labels",
      "Short action summary",
      "Return path into the property workspace",
      "Archive trail with delivery log",
    ],
    returnPath: "/partner/workspace",
    archivePolicy:
      "Archive the packet PDF, raw event object, source identifiers, delivery records, timestamps, and subsequent notes in the property timeline.",
  };
}

export function buildSpatialIncidentTelemetryModel(
  state: QuestionnaireStateV1,
): SpatialIncidentTelemetryModelV1 {
  const workspace = buildPropertyWorkspace(state);
  const mappings = buildProtectionPointMappings(state);

  return {
    propertyId: workspace.propertyId,
    propertyName: workspace.propertyName,
    streetAddress: workspace.streetAddress,
    currentStatus: workspace.currentStatus,
    requiredInputs: buildRequiredInputs(),
    floorPlanMaster: buildFloorPlanMaster(),
    floorPlanPages: buildFloorPlanPages(),
    protectionPointMappings: mappings,
    recipients: buildRecipients(state),
    sampleIncident: buildSampleIncident(
      workspace.propertyId,
      workspace.propertyName,
      workspace.streetAddress,
      mappings,
    ),
    samplePacket: buildSamplePacket(),
    returnPaths: {
      workspace: "/partner/workspace",
      outputs: "/partner/outputs",
      hq: "/hq",
    },
  };
}


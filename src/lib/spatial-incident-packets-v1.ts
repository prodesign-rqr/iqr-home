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

export type IncidentColorRoleV1 = "red" | "yellow" | "green" | "blue" | "gray";

export type IncidentColorLogicV1 = {
  red: string;
  yellow: string;
  green: string;
  blue: string;
  gray: string;
};

export type FloorPlanOverlayZoneV1 = {
  zoneId: string;
  floorLabel: string;
  roomOrZone: string;
  displayLabel: string;
  colorRole: IncidentColorRoleV1;
  coordinateHint: string;
  rationale: string;
};

export type IncidentPacketLegendItemV1 = {
  colorRole: IncidentColorRoleV1;
  label: string;
  meaning: string;
};

export type IncidentPacketLayoutSectionV1 = {
  title: string;
  purpose: string;
  includedContent: string[];
};

export type SpatialIncidentPacketShellV1 = {
  packetTitle: string;
  packetStatus: string;
  colorLogic: IncidentColorLogicV1;
  includedArtifacts: string[];
  returnPath: string;
  archivePolicy: string;
};

export type SpatialIncidentRenderModelV1 = {
  packetTitle: string;
  overlayZones: FloorPlanOverlayZoneV1[];
  legend: IncidentPacketLegendItemV1[];
  layoutSections: IncidentPacketLayoutSectionV1[];
  renderRules: string[];
  packetReadyState: string;
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
  renderModel: SpatialIncidentRenderModelV1;
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

function buildColorLogic(): IncidentColorLogicV1 {
  return {
    red: "Active / urgent / directly affected",
    yellow: "Attention / degraded / nearby concern",
    green: "Protected / verified / normal where relevant",
    blue: "Monitored point / device location / reference marker",
    gray: "Background structure / unaffected context",
  };
}

function buildSamplePacket(): SpatialIncidentPacketShellV1 {
  return {
    packetTitle: "Spatial Incident Packet",
    packetStatus: "Packet shell ready",
    colorLogic: buildColorLogic(),
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

function buildOverlayZones(
  incident: SpatialIncidentObjectV1,
  mappings: ProtectionPointMappingV1[],
): FloorPlanOverlayZoneV1[] {
  const activePoint = mappings[0];

  return [
    {
      zoneId: `${activePoint.code}-ACTIVE`,
      floorLabel: incident.floor,
      roomOrZone: activePoint.roomOrZone,
      displayLabel: activePoint.label,
      colorRole: "red",
      coordinateHint: "Center this marker on the mapped protection point",
      rationale: "Directly affected point for the active incident.",
    },
    {
      zoneId: `${activePoint.code}-CONTEXT`,
      floorLabel: incident.floor,
      roomOrZone: activePoint.roomOrZone,
      displayLabel: `${activePoint.roomOrZone} context`,
      colorRole: "yellow",
      coordinateHint: "Outline adjacent room or immediate spill / impact zone",
      rationale: "Nearby concern or review-needed area around the active point.",
    },
    {
      zoneId: `${activePoint.code}-REFERENCE`,
      floorLabel: incident.floor,
      roomOrZone: "Reference markers",
      displayLabel: "Monitored point reference",
      colorRole: "blue",
      coordinateHint: "Show stable device / sensor reference marker",
      rationale: "Identifies the monitored protection point or source label.",
    },
    {
      zoneId: `${activePoint.code}-BACKGROUND`,
      floorLabel: incident.floor,
      roomOrZone: "Unaffected structure",
      displayLabel: "Background plan",
      colorRole: "gray",
      coordinateHint: "Keep unaffected structure muted for fast comprehension",
      rationale: "Preserves structural context without visual clutter.",
    },
  ];
}

function buildLegend(colorLogic: IncidentColorLogicV1): IncidentPacketLegendItemV1[] {
  return [
    { colorRole: "red", label: "Red", meaning: colorLogic.red },
    { colorRole: "yellow", label: "Yellow", meaning: colorLogic.yellow },
    { colorRole: "green", label: "Green", meaning: colorLogic.green },
    { colorRole: "blue", label: "Blue", meaning: colorLogic.blue },
    { colorRole: "gray", label: "Gray", meaning: colorLogic.gray },
  ];
}

function buildLayoutSections(): IncidentPacketLayoutSectionV1[] {
  return [
    {
      title: "Header",
      purpose: "Immediate identity and incident context",
      includedContent: ["Property name", "Street address", "Event type", "Timestamp", "Severity"],
    },
    {
      title: "Floor plan overlay",
      purpose: "Fast spatial comprehension",
      includedContent: [
        "Color-coded plan page",
        "Protection-point marker",
        "Source label",
        "Adjacent context zone",
      ],
    },
    {
      title: "Legend and source labels",
      purpose: "Explain rendering without ambiguity",
      includedContent: ["Stable color legend", "Source system label", "Protection-point code"],
    },
    {
      title: "Action summary and return path",
      purpose: "Turn packet into an operational front door",
      includedContent: ["Plain-English action summary", "Workspace return link", "Packet archive note"],
    },
  ];
}

function buildRenderRules(): string[] {
  return [
    "Use deterministic color logic only. No artistic or ambiguous rendering.",
    "Floor plan stays as supporting evidence tied to the property record.",
    "Show directly affected point first, then nearby concern, then reference markers.",
    "Keep unaffected structure visually muted so the active incident reads instantly.",
    "Legend, labels, and action summary must remain visible on every packet.",
    "Packet composition should support later PDF generation without changing the core data model.",
  ];
}

function buildRenderModel(
  incident: SpatialIncidentObjectV1,
  mappings: ProtectionPointMappingV1[],
  packet: SpatialIncidentPacketShellV1,
): SpatialIncidentRenderModelV1 {
  return {
    packetTitle: packet.packetTitle,
    overlayZones: buildOverlayZones(incident, mappings),
    legend: buildLegend(packet.colorLogic),
    layoutSections: buildLayoutSections(),
    renderRules: buildRenderRules(),
    packetReadyState: "Render model prepared for deterministic PDF packet composition",
  };
}

export function buildSpatialIncidentTelemetryModel(
  state: QuestionnaireStateV1,
): SpatialIncidentTelemetryModelV1 {
  const workspace = buildPropertyWorkspace(state);
  const mappings = buildProtectionPointMappings(state);
  const sampleIncident = buildSampleIncident(
    workspace.propertyId,
    workspace.propertyName,
    workspace.streetAddress,
    mappings,
  );
  const samplePacket = buildSamplePacket();

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
    sampleIncident,
    samplePacket,
    renderModel: buildRenderModel(sampleIncident, mappings, samplePacket),
    returnPaths: {
      workspace: "/partner/workspace",
      outputs: "/partner/outputs",
      hq: "/hq",
    },
  };
}


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

export type IncidentPacketArtifactV1 = {
  artifactId: string;
  artifactType: string;
  artifactStatus: string;
  viewerMode: string;
  packetStatus: string;
  returnPath: string;
  archiveStorage: string;
};

export type IncidentDeliveryRecordV1 = {
  recipientRole: string;
  recipientName: string;
  deliveryChannel: string;
  deliveryStatus: string;
  deliveryTimestamp: string;
  note: string;
};

export type IncidentFollowUpNoteV1 = {
  status: string;
  owner: string;
  note: string;
  timestamp: string;
};

export type IncidentArchiveEntryV1 = {
  entryType: string;
  status: string;
  linkedSurface: string;
  note: string;
};

export type PacketDetailPageSelectionV1 = {
  floorLabel: string;
  pageNumber: number;
  selectionReason: string;
  fallbackPolicy: string;
};

export type PacketBodyBlockV1 = {
  blockId: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  contentType: string;
  includedFields: string[];
};

export type PacketLabelPlacementV1 = {
  placementId: string;
  labelType: string;
  targetArea: string;
  placementRule: string;
  purpose: string;
};

export type PdfReadyPacketModelV1 = {
  documentTitle: string;
  pageSize: string;
  orientation: string;
  includeLegend: boolean;
  includeActionSummary: boolean;
  includeReturnPath: boolean;
  renderStatus: string;
};

export type PacketDetailViewV1 = {
  pageSelection: PacketDetailPageSelectionV1;
  bodyBlocks: PacketBodyBlockV1[];
  labelPlacements: PacketLabelPlacementV1[];
  pdfModel: PdfReadyPacketModelV1;
};

export type IncidentSummaryCardV1 = {
  headline: string;
  priority: string;
  floorAndZone: string;
  sourceLine: string;
  actionLine: string;
};

export type SourceSummaryBlockV1 = {
  title: string;
  priority: string;
  eventType: string;
  sourceSystem: string;
  sourceIdentifier: string;
  protectionPoint: string;
};

export type RecipientSummaryBlockV1 = {
  title: string;
  readyCount: number;
  primaryRecipient: string;
  readyRecipients: string[];
  pendingRecipients: string[];
};

export type PacketAssemblyStepV1 = {
  stepId: string;
  title: string;
  status: string;
  description: string;
};

export type ArtifactPrepItemV1 = {
  itemId: string;
  title: string;
  outputType: string;
  status: string;
  description: string;
};

export type GeneratedArtifactSurfaceV1 = {
  artifactTitle: string;
  artifactFilename: string;
  artifactFormat: string;
  artifactStatus: string;
  viewerSurface: string;
  exportMode: string;
  archiveMode: string;
  generationNote: string;
};

export type GeneratedArtifactSectionV1 = {
  sectionId: string;
  title: string;
  sectionType: string;
  status: string;
  description: string;
  includedItems: string[];
};

export type OutputRoutingReadinessV1 = {
  routeId: string;
  audience: string;
  routeType: string;
  status: string;
  gatingReason: string;
  destinationSurface: string;
};

export type ArchiveHandoffRecordV1 = {
  recordId: string;
  artifactName: string;
  archiveStatus: string;
  handoffStatus: string;
  linkedSurface: string;
  note: string;
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
  packetArtifact: IncidentPacketArtifactV1;
  deliveryLog: IncidentDeliveryRecordV1[];
  followUpTimeline: IncidentFollowUpNoteV1[];
  archiveEntries: IncidentArchiveEntryV1[];
  packetDetailView: PacketDetailViewV1;
  incidentSummaryCard: IncidentSummaryCardV1;
  sourceSummary: SourceSummaryBlockV1;
  recipientSummary: RecipientSummaryBlockV1;
  packetAssemblySteps: PacketAssemblyStepV1[];
  artifactPrepItems: ArtifactPrepItemV1[];
  generatedArtifactSurface: GeneratedArtifactSurfaceV1;
  generatedArtifactSections: GeneratedArtifactSectionV1[];
  outputRoutingReadiness: OutputRoutingReadinessV1[];
  archiveHandoffRecord: ArchiveHandoffRecordV1;
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
      includedContent: [
        "Property name",
        "Street address",
        "Event type",
        "Timestamp",
        "Severity",
      ],
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
      includedContent: [
        "Stable color legend",
        "Source system label",
        "Protection-point code",
      ],
    },
    {
      title: "Action summary and return path",
      purpose: "Turn packet into an operational front door",
      includedContent: [
        "Plain-English action summary",
        "Workspace return link",
        "Packet archive note",
      ],
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

function buildPacketArtifact(
  propertyId: string,
  packet: SpatialIncidentPacketShellV1,
): IncidentPacketArtifactV1 {
  return {
    artifactId: `${propertyId}-PACKET-001`,
    artifactType: "Incident packet artifact shell",
    artifactStatus: "Ready for PDF generation layer",
    viewerMode: "Openable packet front door with return path",
    packetStatus: packet.packetStatus,
    returnPath: packet.returnPath,
    archiveStorage: "Property timeline / permanent archive lane",
  };
}

function buildDeliveryLog(
  recipients: TelemetryRecipientV1[],
): IncidentDeliveryRecordV1[] {
  return recipients.map((recipient, index) => ({
    recipientRole: recipient.role,
    recipientName: recipient.name,
    deliveryChannel: recipient.deliveryMode,
    deliveryStatus:
      recipient.routingStatus === "Ready" ? "Awaiting live delivery" : "Routing incomplete",
    deliveryTimestamp: index === 0 ? "Awaiting live event timestamp" : "Pending",
    note:
      recipient.routingStatus === "Ready"
        ? "Recipient is eligible for deterministic packet delivery in a future delivery pack."
        : "Recipient route must be completed before production packet delivery.",
  }));
}

function buildFollowUpTimeline(workspaceName: string): IncidentFollowUpNoteV1[] {
  return [
    {
      status: "Packet shell prepared",
      owner: "IQR telemetry lane",
      note:
        "Render model, artifact shell, and archive posture are defined for the current property.",
      timestamp: "Design-time / pre-live event",
    },
    {
      status: "Awaiting live incident",
      owner: workspaceName,
      note:
        "No live packet delivery occurs yet. Future pack will convert this shell into an actual packet workflow.",
      timestamp: "Pending",
    },
  ];
}

function buildArchiveEntries(
  packet: SpatialIncidentPacketShellV1,
): IncidentArchiveEntryV1[] {
  return [
    {
      entryType: "Packet PDF",
      status: "Reserved",
      linkedSurface: "/partner/workspace",
      note: "This archive slot will hold the rendered packet PDF artifact.",
    },
    {
      entryType: "Structured event object",
      status: "Reserved",
      linkedSurface: "/partner/telemetry",
      note: "Raw structured event data will archive alongside the packet.",
    },
    {
      entryType: "Delivery log",
      status: "Reserved",
      linkedSurface: "/hq/telemetry",
      note: "Delivery records and routing outcomes will live with the archive.",
    },
    {
      entryType: "Follow-up notes",
      status: "Reserved",
      linkedSurface: packet.returnPath,
      note: "Subsequent notes and status changes will remain tied to the property workspace.",
    },
  ];
}

function buildPageSelection(
  incident: SpatialIncidentObjectV1,
  pages: FloorPlanPageV1[],
): PacketDetailPageSelectionV1 {
  const matchedPage =
    pages.find((page) => page.floorLabel === incident.floor) ?? pages[0];

  return {
    floorLabel: matchedPage.floorLabel,
    pageNumber: matchedPage.pageNumber,
    selectionReason:
      matchedPage.floorLabel === incident.floor
        ? "Selected the floor-plan page that matches the incident floor."
        : "Used the first available page as the deterministic fallback.",
    fallbackPolicy:
      "If no direct floor match exists, use the first available mapped page until onboarding confirmation improves coverage.",
  };
}

function buildBodyBlocks(): PacketBodyBlockV1[] {
  return [
    {
      blockId: "packet-header",
      title: "Packet Header",
      priority: "High",
      contentType: "Identity + incident context",
      includedFields: [
        "Property name",
        "Street address",
        "Event type",
        "Timestamp",
        "Severity",
      ],
    },
    {
      blockId: "overlay-panel",
      title: "Overlay Panel",
      priority: "High",
      contentType: "Floor-plan page with deterministic overlay",
      includedFields: [
        "Selected floor-plan page",
        "Overlay zones",
        "Protection-point marker",
        "Source label",
      ],
    },
    {
      blockId: "legend-panel",
      title: "Legend + Labels",
      priority: "Medium",
      contentType: "Interpretation support",
      includedFields: [
        "Color legend",
        "Source system label",
        "Protection-point code",
      ],
    },
    {
      blockId: "action-panel",
      title: "Action + Return Path",
      priority: "High",
      contentType: "Operational next step",
      includedFields: [
        "Action summary",
        "Return path",
        "Archive note",
      ],
    },
  ];
}

function buildLabelPlacements(
  incident: SpatialIncidentObjectV1,
  renderModel: SpatialIncidentRenderModelV1,
): PacketLabelPlacementV1[] {
  return [
    {
      placementId: "label-source",
      labelType: "Source label",
      targetArea: renderModel.overlayZones[0].zoneId,
      placementRule:
        "Place the source label nearest the active protection point without obscuring the marker.",
      purpose: `Identify the upstream source for ${incident.eventType}.`,
    },
    {
      placementId: "label-protection-point",
      labelType: "Protection-point code",
      targetArea: renderModel.overlayZones[0].zoneId,
      placementRule:
        "Place the protection-point code directly adjacent to the active marker.",
      purpose: "Tie the packet visually to the mapped protection point record.",
    },
    {
      placementId: "label-legend",
      labelType: "Legend block",
      targetArea: "Packet side rail or bottom panel",
      placementRule:
        "Keep the legend in a stable non-overlapping location on every packet.",
      purpose: "Preserve fast comprehension and deterministic reading order.",
    },
  ];
}

function buildPdfModel(
  propertyName: string,
  packetTitle: string,
): PdfReadyPacketModelV1 {
  return {
    documentTitle: `${propertyName} — ${packetTitle}`,
    pageSize: "Letter",
    orientation: "Portrait",
    includeLegend: true,
    includeActionSummary: true,
    includeReturnPath: true,
    renderStatus: "PDF-ready content model prepared for future generation layer",
  };
}

function buildPacketDetailView(
  incident: SpatialIncidentObjectV1,
  floorPlanPages: FloorPlanPageV1[],
  renderModel: SpatialIncidentRenderModelV1,
): PacketDetailViewV1 {
  return {
    pageSelection: buildPageSelection(incident, floorPlanPages),
    bodyBlocks: buildBodyBlocks(),
    labelPlacements: buildLabelPlacements(incident, renderModel),
    pdfModel: buildPdfModel(incident.propertyName, renderModel.packetTitle),
  };
}

function buildIncidentSummaryCard(
  incident: SpatialIncidentObjectV1,
): IncidentSummaryCardV1 {
  return {
    headline: `${incident.eventType} at ${incident.protectionPoint}`,
    priority: "High priority",
    floorAndZone: `${incident.floor} / ${incident.roomOrZone}`,
    sourceLine: `Source: ${incident.sourceSystem}`,
    actionLine: `Action: ${incident.actionSummary}`,
  };
}

function buildSourceSummary(
  incident: SpatialIncidentObjectV1,
): SourceSummaryBlockV1 {
  return {
    title: "Source Summary",
    priority: "High",
    eventType: incident.eventType,
    sourceSystem: incident.sourceSystem,
    sourceIdentifier: incident.sourceIdentifier,
    protectionPoint: incident.protectionPoint,
  };
}

function buildRecipientSummary(
  recipients: TelemetryRecipientV1[],
): RecipientSummaryBlockV1 {
  const readyRecipients = recipients
    .filter((recipient) => recipient.routingStatus === "Ready")
    .map((recipient) => `${recipient.role}: ${recipient.name}`);

  const pendingRecipients = recipients
    .filter((recipient) => recipient.routingStatus !== "Ready")
    .map((recipient) => `${recipient.role}: ${recipient.name}`);

  return {
    title: "Recipient Summary",
    readyCount: readyRecipients.length,
    primaryRecipient: readyRecipients[0] ?? "No ready recipient yet",
    readyRecipients,
    pendingRecipients,
  };
}

function buildPacketAssemblySteps(): PacketAssemblyStepV1[] {
  return [
    {
      stepId: "assembly-1",
      title: "Summarize the incident",
      status: "Ready",
      description:
        "Build the incident summary card and establish the packet headline before assembly.",
    },
    {
      stepId: "assembly-2",
      title: "Assemble packet body",
      status: "Ready",
      description:
        "Use the packet detail view blocks and page selection to assemble the packet body deterministically.",
    },
    {
      stepId: "assembly-3",
      title: "Prepare artifact output",
      status: "Prepared",
      description:
        "Hand the assembled packet content to the future generated-artifact layer without invoking live delivery yet.",
    },
  ];
}

function buildArtifactPrepItems(): ArtifactPrepItemV1[] {
  return [
    {
      itemId: "prep-pdf",
      title: "Incident packet PDF",
      outputType: "PDF",
      status: "Prepared",
      description:
        "The content model is now structured so future generation can create the packet PDF consistently.",
    },
    {
      itemId: "prep-preview-card",
      title: "Packet preview card",
      outputType: "App surface",
      status: "Prepared",
      description:
        "The preview surface can summarize the incident before opening the full packet detail view.",
    },
  ];
}

function buildGeneratedArtifactSurface(
  propertyName: string,
  incidentSummary: IncidentSummaryCardV1,
): GeneratedArtifactSurfaceV1 {
  const filenameBase =
    propertyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "property";

  return {
    artifactTitle: `${propertyName} Incident Packet Preview`,
    artifactFilename: `${filenameBase}-incident-packet-preview.pdf`,
    artifactFormat: "PDF preview artifact",
    artifactStatus: "Prepared for future generated output",
    viewerSurface: "Packet preview surface + full packet detail surface",
    exportMode: "Generated artifact layer will emit the file once enabled",
    archiveMode: "Archive alongside packet record and workspace return path",
    generationNote: `Primary headline: ${incidentSummary.headline}`,
  };
}

function buildGeneratedArtifactSections(
  incidentSummary: IncidentSummaryCardV1,
): GeneratedArtifactSectionV1[] {
  return [
    {
      sectionId: "artifact-summary",
      title: "Summary header",
      sectionType: "Header",
      status: "Ready",
      description:
        "Lead with the incident headline, priority, floor/zone, and first-glance context.",
      includedItems: [
        incidentSummary.headline,
        incidentSummary.priority,
        incidentSummary.floorAndZone,
      ],
    },
    {
      sectionId: "artifact-detail",
      title: "Detail body",
      sectionType: "Packet body",
      status: "Ready",
      description:
        "Carry the selected floor-plan page, body blocks, labels, and action summary into the artifact.",
      includedItems: [
        "Selected page",
        "Packet body blocks",
        "Source labels",
        "Action summary",
      ],
    },
    {
      sectionId: "artifact-return",
      title: "Return + archive footer",
      sectionType: "Footer",
      status: "Prepared",
      description:
        "Keep the return path and archive note visible so the artifact stays attached to the property record.",
      includedItems: [
        "Return path",
        "Archive note",
        "Artifact filename",
      ],
    },
  ];
}

function buildOutputRoutingReadiness(
  recipients: TelemetryRecipientV1[],
): OutputRoutingReadinessV1[] {
  return recipients.map((recipient, index) => ({
    routeId: `route-${index + 1}`,
    audience: `${recipient.role}: ${recipient.name}`,
    routeType: recipient.deliveryMode,
    status:
      recipient.routingStatus === "Ready"
        ? "Prepared for future artifact routing"
        : "Blocked until routing is completed",
    gatingReason:
      recipient.routingStatus === "Ready"
        ? "Recipient is already marked ready in the deterministic routing profile."
        : "Recipient is not fully configured yet.",
    destinationSurface:
      recipient.routingStatus === "Ready"
        ? "Preview card -> future generated artifact -> workspace return path"
        : "Remain on packet preview surface until routing is completed",
  }));
}

function buildArchiveHandoffRecord(
  artifact: GeneratedArtifactSurfaceV1,
): ArchiveHandoffRecordV1 {
  return {
    recordId: "archive-handoff-001",
    artifactName: artifact.artifactFilename,
    archiveStatus: "Prepared for permanent archive handoff",
    handoffStatus: "Waiting on generated artifact layer",
    linkedSurface: "/partner/workspace",
    note:
      "Once generated output is enabled, the artifact should hand off into the permanent property timeline with a stable return path.",
  };
}

export function buildSpatialIncidentTelemetryModel(
  state: QuestionnaireStateV1,
): SpatialIncidentTelemetryModelV1 {
  const workspace = buildPropertyWorkspace(state);
  const floorPlanPages = buildFloorPlanPages();
  const mappings = buildProtectionPointMappings(state);
  const sampleIncident = buildSampleIncident(
    workspace.propertyId,
    workspace.propertyName,
    workspace.streetAddress,
    mappings,
  );
  const samplePacket = buildSamplePacket();
  const recipients = buildRecipients(state);
  const renderModel = buildRenderModel(sampleIncident, mappings, samplePacket);
  const packetDetailView = buildPacketDetailView(
    sampleIncident,
    floorPlanPages,
    renderModel,
  );
  const incidentSummaryCard = buildIncidentSummaryCard(sampleIncident);
  const sourceSummary = buildSourceSummary(sampleIncident);
  const recipientSummary = buildRecipientSummary(recipients);
  const packetAssemblySteps = buildPacketAssemblySteps();
  const artifactPrepItems = buildArtifactPrepItems();
  const generatedArtifactSurface = buildGeneratedArtifactSurface(
    workspace.propertyName,
    incidentSummaryCard,
  );

  return {
    propertyId: workspace.propertyId,
    propertyName: workspace.propertyName,
    streetAddress: workspace.streetAddress,
    currentStatus: workspace.currentStatus,
    requiredInputs: buildRequiredInputs(),
    floorPlanMaster: buildFloorPlanMaster(),
    floorPlanPages,
    protectionPointMappings: mappings,
    recipients,
    sampleIncident,
    samplePacket,
    renderModel,
    packetArtifact: buildPacketArtifact(workspace.propertyId, samplePacket),
    deliveryLog: buildDeliveryLog(recipients),
    followUpTimeline: buildFollowUpTimeline(workspace.propertyName),
    archiveEntries: buildArchiveEntries(samplePacket),
    packetDetailView,
    incidentSummaryCard,
    sourceSummary,
    recipientSummary,
    packetAssemblySteps,
    artifactPrepItems,
    generatedArtifactSurface,
    generatedArtifactSections: buildGeneratedArtifactSections(incidentSummaryCard),
    outputRoutingReadiness: buildOutputRoutingReadiness(recipients),
    archiveHandoffRecord: buildArchiveHandoffRecord(generatedArtifactSurface),
    returnPaths: {
      workspace: "/partner/workspace",
      outputs: "/partner/outputs",
      hq: "/hq",
    },
  };
}


export const questionnaireSpec = [
  {
    title: "Property Basics",
    purpose: "Create the property anchor and house identity.",
    fields: [
      ["Parcel / APN", "text", "property.anchor.parcelApn"],
      ["Street address", "text", "property.identity.streetAddress"],
      ["Property type", "select", "property.profile.propertyType"],
      ["Occupancy type", "select", "property.profile.occupancyType"],
    ],
  },
  {
    title: "People and Roles",
    purpose: "Identify ownership, management, and continuity contacts.",
    fields: [
      ["Client / owner", "text", "people.owner.primaryContact"],
      ["Property manager", "text", "people.manager.primaryContact"],
      ["TIS owner / integrator", "text", "partner.account.owner"],
      ["Service preference", "select", "service.preferences.supportTier"],
    ],
  },
  {
    title: "AV / IT Infrastructure",
    purpose: "Define rack, network, AV, control, and power baseline.",
    fields: [
      ["Main AV rack present", "checkbox", "avIt.rack.mainRackPresent"],
      ["Managed network gateway", "checkbox", "avIt.network.gatewayManaged"],
      ["PoE switching", "checkbox", "avIt.network.poeSwitching"],
      ["Wi-Fi access points", "checkbox", "avIt.network.wifiAccessPointsPresent"],
      ["Control processor", "checkbox", "avIt.control.processorPresent"],
      ["UPS / conditioned power", "checkbox", "avIt.power.upsPresent"],
      ["Primary rack location", "text", "avIt.rack.primaryLocation"],
      ["Network notes", "text", "avIt.network.notes"],
    ],
  },
  {
    title: "Major Home Systems",
    purpose: "Capture system objects that belong to the house record.",
    fields: [
      ["HVAC", "checkbox", "systems.hvac.inScope"],
      ["Water heater", "checkbox", "systems.waterHeater.inScope"],
      ["Electrical", "checkbox", "systems.electrical.inScope"],
      ["Plumbing", "checkbox", "systems.plumbing.inScope"],
      ["Roof", "checkbox", "systems.roof.inScope"],
      ["Refrigeration / ice maker", "checkbox", "systems.refrigeration.inScope"],
    ],
  },
  {
    title: "Water-Risk Monitoring",
    purpose: "Scope YoLink sensing and shutoff opportunities.",
    fields: [
      ["Dishwasher protection", "checkbox", "monitoring.waterRisk.dishwasher.protected"],
      ["Clothes washer protection", "checkbox", "monitoring.waterRisk.clothesWasher.protected"],
      ["Refrigerator / ice maker protection", "checkbox", "monitoring.waterRisk.fridgeIce.protected"],
      ["Water heater pan protection", "checkbox", "monitoring.waterRisk.waterHeaterPan.protected"],
      ["Sink cabinet protection", "checkbox", "monitoring.waterRisk.sinkCabinets.protected"],
      ["Local shutoff devices in scope", "checkbox", "monitoring.waterRisk.localShutoff.inScope"],
    ],
  },
  {
    title: "Environmental Monitoring",
    purpose: "Define monitored conditions that create meaningful event history.",
    fields: [
      ["Rack temperature", "checkbox", "monitoring.environmental.rackTemperature.inScope"],
      ["Garage freezer", "checkbox", "monitoring.environmental.garageFreezer.inScope"],
      ["Wine room", "checkbox", "monitoring.environmental.wineRoom.inScope"],
      ["Art / collection room", "checkbox", "monitoring.environmental.artRoom.inScope"],
      ["Mechanical room", "checkbox", "monitoring.environmental.mechanicalRoom.inScope"],
      ["Pantry / food storage", "checkbox", "monitoring.environmental.pantryStorage.inScope"],
    ],
  },
  {
    title: "Counter Card and Access",
    purpose: "Define public-facing access behavior and card configuration.",
    fields: [
      ["Counter Card mode", "select", "counterCard.mode"],
      ["Guest network display name", "text", "counterCard.scanToJoin.networkDisplayName"],
    ],
  },
  {
    title: "Stewardship / Service Preferences",
    purpose: "Drive startup urgency, yearly updates, and onboarding posture.",
    fields: [
      ["Yearly update cadence", "select", "service.preferences.yearlyUpdateCadence"],
      ["Startup priority", "select", "startup.priority"],
      ["Controlled notes", "textarea", "startup.notes.controlled"],
    ],
  },
] as const;

export const answerMappings = [
  ["Property Basics", ["Property record creation", "Property record shell", "QR tag root identity"]],
  ["People and Roles", ["Onboarding workflow", "Service routing", "Continuity ownership"]],
  ["AV / IT Infrastructure", ["AV / IT baseline", "QR tag plan", "Startup kit", "Field install checklist"]],
  ["Water-Risk Monitoring", ["YoLink sensor scope", "YoLink shutoff scope", "Proof of prevention records"]],
  ["Environmental Monitoring", ["Meaningful event history", "Environmental watch list", "Service timeline inputs"]],
  ["Counter Card and Access", ["Counter Card config", "Public access behavior", "Guest onboarding"]],
  ["Stewardship / Service Preferences", ["Startup urgency", "Pipeline status", "Yearly update planning"]],
] as const;

export const startupOutputs = {
  qrTagPlan: [
    ["Main Rack", "IQR-AV-001", "Rack / AV / IT baseline", "Core system anchor"],
    ["Network Gateway", "IQR-NET-001", "Counter Card + network record", "Scan-to-know linkage"],
    ["Control Processor", "IQR-CTL-001", "Control subsystem record", "Support continuity"],
    ["Water Heater", "IQR-SYS-001", "Major systems record", "Service + risk context"],
    ["Dishwasher Leak Zone", "IQR-WR-001", "Water-risk record", "Proof of prevention"],
  ],
  counterCard: {
    mode: "Scan-2-Know + Scan-2-Join",
    networkName: "IQR Guest",
    publicObjects: ["Guest Wi-Fi", "House info", "Limited system links"],
    privateObjects: ["Partner workflow", "HQ workflow", "Protected record controls"],
  },
  startupKit: [
    "Kitchen Counter Card",
    "Private-area QR cards",
    "QR label starter pack",
    "YoLink sensors for protected points",
    "Local shutoff devices for scoped locations",
    "Property onboarding packet",
  ],
  propertyRecordShell: [
    "Property anchor",
    "People and roles",
    "AV / IT baseline",
    "Major systems register",
    "Water-risk protection objects",
    "Environmental monitoring objects",
    "Service timeline shell",
    "Yearly update ledger",
  ],
  fieldInstallChecklist: [
    "Confirm Parcel / APN and street address",
    "Mount and label QR tags",
    "Provision Counter Card and guest network display",
    "Document rack, gateway, control, and UPS details",
    "Install YoLink sensors at scoped protection points",
    "Verify local shutoff devices where specified",
    "Capture startup photos and baseline evidence",
    "Mark onboarding status for HQ review",
  ],
} as const;


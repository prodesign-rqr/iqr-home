export type LooseObject = Record<string, any>;

export type TagItem = {
  label: string;
  code: string;
  destination: string;
};

export type StartupKitItem = {
  label: string;
  reason: string;
};

export type ChecklistItem = {
  task: string;
  owner: string;
  notes: string;
};

export type PropertyRecordBlock = {
  title: string;
  description: string;
  status: string;
};

export type CounterCardConfig = {
  ready: boolean;
  enabled: boolean;
  streetAddress: string;
};

export type OutputSummaryV1 = {
  qrPlanCount: number;
  qrTagCount: number;
  startupKitCount: number;
  checklistCount: number;
  propertyRecordCount: number;
  propertyShellCount: number;
  counterCardReady: boolean;
};

function asObject(input: unknown): LooseObject {
  return input && typeof input === "object" ? (input as LooseObject) : {};
}

function section(state: unknown, key: string): LooseObject {
  return asObject(asObject(state)[key]);
}

function yes(value: unknown): boolean {
  return value === true;
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function buildCounterCardConfig(state: unknown): CounterCardConfig {
  const propertyBasics = section(state, "propertyBasics");
  const streetAddress = text(propertyBasics.streetAddress, "Property address not set");

  return {
    ready: streetAddress !== "Property address not set",
    enabled: true,
    streetAddress,
  };
}

export function buildTagItems(state: unknown): TagItem[] {
  const avit = section(state, "avit");
  const majorSystems = section(state, "majorSystems");
  const waterRisk = section(state, "waterRisk");

  const items: TagItem[] = [];

  if (yes(avit.mainRackPresent)) {
    items.push({
      label: "Main Rack",
      code: "IQR-AV-001",
      destination: "Rack / AV / IT baseline",
    });
  }

  if (yes(avit.managedGateway) || yes(avit.wifiAccessPoints) || yes(avit.poeSwitching)) {
    items.push({
      label: "Network Gateway",
      code: "IQR-NET-001",
      destination: "Counter Card + network record",
    });
  }

  if (yes(avit.controlProcessor)) {
    items.push({
      label: "Control Processor",
      code: "IQR-CTL-001",
      destination: "Control subsystem record",
    });
  }

  if (yes(majorSystems.hvac)) {
    items.push({
      label: "HVAC System",
      code: "IQR-MECH-001",
      destination: "Mechanical system record",
    });
  }

  if (yes(majorSystems.waterHeater)) {
    items.push({
      label: "Water Heater",
      code: "IQR-PLB-001",
      destination: "Water heater record",
    });
  }

  if (yes(waterRisk.dishwasherProtected)) {
    items.push({
      label: "Dishwasher",
      code: "IQR-WAT-001",
      destination: "Dishwasher protection point",
    });
  }

  if (yes(waterRisk.refrigeratorProtected)) {
    items.push({
      label: "Refrigerator / ice maker",
      code: "IQR-WAT-002",
      destination: "Refrigerator water-risk point",
    });
  }

  if (yes(waterRisk.toiletsProtected)) {
    items.push({
      label: "Toilet supply lines",
      code: "IQR-WAT-003",
      destination: "Toilet protection points",
    });
  }

  if (yes(waterRisk.clothesWasherProtected)) {
    items.push({
      label: "Clothes Washer",
      code: "IQR-WAT-004",
      destination: "Laundry water-risk point",
    });
  }

  if (yes(waterRisk.waterHeaterPanProtected)) {
    items.push({
      label: "Water Heater Pan",
      code: "IQR-WAT-005",
      destination: "Water heater pan protection point",
    });
  }

  if (yes(waterRisk.sinkCabinetProtected)) {
    items.push({
      label: "Sink Cabinets",
      code: "IQR-WAT-006",
      destination: "Sink cabinet protection points",
    });
  }

  return items;
}

export const buildQrTagPlan = buildTagItems;

export function buildStartupKitItems(state: unknown): StartupKitItem[] {
  const waterRisk = section(state, "waterRisk");
  const tagItems = buildTagItems(state);

  const items: StartupKitItem[] = [
    {
      label: "Kitchen Counter Card",
      reason: "Included in the first-pass startup package.",
    },
    {
      label: "Private-area QR cards",
      reason: "Included when partner setup and room access records are active.",
    },
    {
      label: "QR label starter pack",
      reason: tagItems.length > 0
        ? "Generated because mapped tag targets are already in scope."
        : "Hold until mapped tag targets are confirmed.",
    },
    {
      label: "Property onboarding packet",
      reason: "Included in the first-pass startup package.",
    },
  ];

  const protectedWaterPoints =
    yes(waterRisk.dishwasherProtected) ||
    yes(waterRisk.toiletsProtected) ||
    yes(waterRisk.clothesWasherProtected) ||
    yes(waterRisk.refrigeratorProtected) ||
    yes(waterRisk.waterHeaterPanProtected) ||
    yes(waterRisk.sinkCabinetProtected);

  if (protectedWaterPoints) {
    items.push({
      label: "YoLink sensors for protected points",
      reason: "Included because water-risk protection points are selected.",
    });
  }

  if (yes(waterRisk.localShutoffInScope)) {
    items.push({
      label: "Local shutoff devices for scoped locations",
      reason: "Included because local shutoff scope is active.",
    });
  }

  return items;
}

export const buildStartupKit = buildStartupKitItems;

export function buildFieldInstallChecklist(state: unknown): ChecklistItem[] {
  const avit = section(state, "avit");
  const waterRisk = section(state, "waterRisk");

  const items: ChecklistItem[] = [
    {
      task: "Program and place Kitchen Counter Card",
      owner: "Field tech",
      notes: "Confirm guest-facing orientation and network handoff behavior.",
    },
    {
      task: "Apply first-pass QR labels",
      owner: "Field tech",
      notes: "Rack, network, and protected-point labels should match the current mapped output set.",
    },
    {
      task: "Verify property record shell",
      owner: "Project manager",
      notes: "Anchor the property record to parcel/APN, street address, and continuity contacts.",
    },
    {
      task: "Confirm startup kit contents with partner",
      owner: "Partner PM",
      notes: "Verify what ships now versus what waits for later install phases.",
    },
  ];

  if (yes(avit.mainRackPresent) || yes(avit.managedGateway) || yes(avit.wifiAccessPoints)) {
    items.push({
      task: "Document AV / IT rack baseline",
      owner: "Field tech",
      notes: "Capture rack location, gateway posture, Wi-Fi posture, and conditioned power notes.",
    });
  }

  if (
    yes(waterRisk.dishwasherProtected) ||
    yes(waterRisk.toiletsProtected) ||
    yes(waterRisk.clothesWasherProtected) ||
    yes(waterRisk.refrigeratorProtected) ||
    yes(waterRisk.waterHeaterPanProtected) ||
    yes(waterRisk.sinkCabinetProtected)
  ) {
    items.push({
      task: "Validate YoLink protection points",
      owner: "Field tech",
      notes: "Confirm each selected water-risk point has the expected sensing and labeling.",
    });
  }

  if (yes(waterRisk.localShutoffInScope)) {
    items.push({
      task: "Test local shutoff devices",
      owner: "Field tech",
      notes: "Confirm shutoff locations, power, and handoff notes before closeout.",
    });
  }

  return items;
}

export function buildPropertyRecordShell(state: unknown): PropertyRecordBlock[] {
  const propertyBasics = section(state, "propertyBasics");
  const peopleRoles = section(state, "peopleRoles");
  const avit = section(state, "avit");

  return [
    {
      title: "Property Identity",
      description: `${text(propertyBasics.parcelApn, "Parcel/APN pending")} / ${text(
        propertyBasics.streetAddress,
        "Street address pending"
      )}`,
      status: "Anchored",
    },
    {
      title: "People and Roles",
      description: `${text(peopleRoles.clientOwner, "Owner contact pending")} / ${text(
        peopleRoles.tisOwner,
        "Integrator pending"
      )}`,
      status: "In scope",
    },
    {
      title: "AV / IT Baseline",
      description: `${text(avit.rackLocation, "Rack location pending")} / ${text(
        avit.networkNotes,
        "Network notes pending"
      )}`,
      status: "Draft shell",
    },
    {
      title: "Water-Risk Profile",
      description: `${buildTagItems(state)
        .filter((item) => item.code.startsWith("IQR-WAT"))
        .length} protected points mapped`,
      status: "Monitoring ready",
    },
  ];
}

export const buildPropertyRecord = buildPropertyRecordShell;

export function buildOutputSummary(state: unknown): OutputSummaryV1 {
  const qrItems = buildTagItems(state);
  const startupKitItems = buildStartupKitItems(state);
  const checklistItems = buildFieldInstallChecklist(state);
  const propertyRecordBlocks = buildPropertyRecordShell(state);
  const counterCard = buildCounterCardConfig(state);

  return {
    qrPlanCount: qrItems.length,
    qrTagCount: qrItems.length,
    startupKitCount: startupKitItems.length,
    checklistCount: checklistItems.length,
    propertyRecordCount: propertyRecordBlocks.length,
    propertyShellCount: propertyRecordBlocks.length,
    counterCardReady: counterCard.ready,
  };
}

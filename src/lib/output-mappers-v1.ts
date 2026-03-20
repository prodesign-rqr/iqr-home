import type { QuestionnaireStateV1 } from "./questionnaire-state-v1";

export type OutputItem = {
  title: string;
  detail: string;
};

export function buildQrTagPlan(state: QuestionnaireStateV1): OutputItem[] {
  const items: OutputItem[] = [
    {
      title: "Property anchor tag",
      detail: `Parcel/APN ${state.propertyBasics.parcelApn || "Pending"} linked to ${state.propertyBasics.streetAddress || "street address pending"}.`,
    },
  ];

  if (state.avit.mainRackPresent) {
    items.push({
      title: "Primary AV rack tag",
      detail: `Rack location: ${state.avit.rackLocation || "location pending confirmation"}.`,
    });
  }

  if (state.avit.managedGateway) {
    items.push({
      title: "Gateway / network core tag",
      detail: "Add QR identity for gateway and ISP-facing network record.",
    });
  }

  if (state.avit.controlProcessor) {
    items.push({
      title: "Control engine tag",
      detail: "Create object label for the control processor and associated documentation.",
    });
  }

  if (state.waterRisk.dishwasherProtected) {
    items.push({
      title: "Dishwasher protection tag",
      detail: "Tie leak protection point to the kitchen dishwasher bay record.",
    });
  }

  if (state.waterRisk.toiletsProtected) {
    items.push({
      title: "Toilet supply line tags",
      detail: "Create toilet supply line protection tags for each documented bathroom group.",
    });
  }

  if (state.waterRisk.refrigeratorProtected) {
    items.push({
      title: "Refrigerator / ice maker tag",
      detail: "Mark the kitchen refrigeration protection point for future service reference.",
    });
  }

  return items;
}

export function buildCounterCardConfig(state: QuestionnaireStateV1): OutputItem[] {
  return [
    {
      title: "Counter Card mode",
      detail: state.counterCard.mode || "Mode not selected yet.",
    },
    {
      title: "Guest network name",
      detail: state.counterCard.guestNetworkName || "Guest network display name not yet set.",
    },
    {
      title: "Public entry doctrine",
      detail: "Public-facing card supports Scan-2-Know, Scan-2-Join, and only the allowed house-record surfaces.",
    },
  ];
}

export function buildStartupKit(state: QuestionnaireStateV1): OutputItem[] {
  const items: OutputItem[] = [
    {
      title: "Baseline kit",
      detail: "Counter Card, QR labels, property startup packet, and field install packet.",
    },
  ];

  if (state.avit.mainRackPresent) {
    items.push({
      title: "AV / IT labeling set",
      detail: "Rack, gateway, PoE switching, AP, and control labels for structured record startup.",
    });
  }

  if (
    state.waterRisk.dishwasherProtected ||
    state.waterRisk.toiletsProtected ||
    state.waterRisk.clothesWasherProtected ||
    state.waterRisk.refrigeratorProtected ||
    state.waterRisk.waterHeaterProtected ||
    state.waterRisk.sinkCabinetProtected
  ) {
    items.push({
      title: "YoLink water-risk package",
      detail: "Sensor and shutoff planning kit aligned to selected protection points.",
    });
  }

  if (
    state.environmental.rackTemperature ||
    state.environmental.garageFreezer ||
    state.environmental.wineRoom ||
    state.environmental.artCollectionRoom ||
    state.environmental.mechanicalRoom ||
    state.environmental.pantryFoodStorage
  ) {
    items.push({
      title: "Environmental monitoring kit",
      detail: "Temperature / humidity sensor plan tied to meaningful-event recording only.",
    });
  }

  return items;
}

export function buildPropertyRecordShell(state: QuestionnaireStateV1): OutputItem[] {
  return [
    {
      title: "Property identity",
      detail: `Parcel/APN ${state.propertyBasics.parcelApn || "Pending"} with address ${state.propertyBasics.streetAddress || "pending"} and occupancy ${state.propertyBasics.occupancyType || "pending"}.`,
    },
    {
      title: "People and roles",
      detail: `Owner: ${state.peopleRoles.clientOwner || "pending"} | PM: ${state.peopleRoles.propertyManager || "pending"} | TIS owner: ${state.peopleRoles.tisOwner || "pending"}.`,
    },
    {
      title: "AV / IT baseline",
      detail: `Rack present: ${state.avit.mainRackPresent ? "Yes" : "No"} | Gateway: ${state.avit.managedGateway ? "Yes" : "No"} | Control engine: ${state.avit.controlProcessor ? "Yes" : "No"}.`,
    },
    {
      title: "Monitoring scope",
      detail: `Water-risk scope and environmental zones derived from questionnaire toggles; YoLink records meaningful events while IQR preserves the structured memory.`,
    },
  ];
}

export function buildFieldInstallChecklist(state: QuestionnaireStateV1): OutputItem[] {
  const items: OutputItem[] = [
    {
      title: "Confirm property anchor",
      detail: `Verify Parcel/APN ${state.propertyBasics.parcelApn || "pending"} and street address at first site touch.`,
    },
    {
      title: "Confirm partner workflow owner",
      detail: `Confirm TIS owner / project lead: ${state.peopleRoles.tisOwner || "pending"}.`,
    },
  ];

  if (state.avit.mainRackPresent) {
    items.push({
      title: "Photograph and tag primary rack",
      detail: `Document rack at ${state.avit.rackLocation || "confirmed rack location"} and align labels to the property record shell.`,
    });
  }

  if (state.waterRisk.toiletsProtected) {
    items.push({
      title: "Confirm toilet supply line protection points",
      detail: "Document bathroom groups, supply line locations, and local shutoff scope.",
    });
  }

  if (state.counterCard.mode) {
    items.push({
      title: "Configure Counter Card",
      detail: `Apply selected mode: ${state.counterCard.mode}.`,
    });
  }

  if (state.stewardship.yearlyUpdate) {
    items.push({
      title: "Set stewardship cadence",
      detail: `Yearly update preference: ${state.stewardship.yearlyUpdate}.`,
    });
  }

  return items;
}

export function buildOutputSummary(state: QuestionnaireStateV1) {
  return {
    qrTagCount: buildQrTagPlan(state).length,
    startupKitCount: buildStartupKit(state).length,
    checklistCount: buildFieldInstallChecklist(state).length,
    recordShellCount: buildPropertyRecordShell(state).length,
    counterCardReady: Boolean(state.counterCard.mode || state.counterCard.guestNetworkName),
  };
}


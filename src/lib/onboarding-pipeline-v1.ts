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
];

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
  statusHistory: {
    status: OnboardingStatus;
    timestamp: string;
    changedBy: string;
    notes: string;
  }[];
};

export const onboardingProperties: OnboardingProperty[] = [
  {
    id: "IQR-AZ-001",
    propertyName: "Desert Highlands Residence",
    streetAddress: "1234 Desert Highlands Drive, Scottsdale, AZ 85255",
    parcelApn: "217-54-321",
    partnerName: "Desert Valley Integration",
    continuityOwner: "TIS owner + property manager",
    currentStatus: "In Process",
    nextAction: "Confirm rack baseline and YoLink shutoff scope.",
    notes: "Questionnaire captured. Outputs under review before startup kit assembly.",
    startupOutputs: [
      "QR tag plan",
      "Counter Card config",
      "Startup kit list",
      "Property record shell",
      "Field install checklist",
    ],
    statusHistory: [
      {
        status: "New",
        timestamp: "2026-03-18 09:10",
        changedBy: "Partner Sales",
        notes: "Questionnaire started from partner workspace.",
      },
      {
        status: "In Process",
        timestamp: "2026-03-18 14:40",
        changedBy: "IQR HQ",
        notes: "Reviewing AV / IT rack scope and monitoring points.",
      },
    ],
  },
  {
    id: "IQR-AZ-002",
    propertyName: "North Peak Retreat",
    streetAddress: "88 Summit Wash Trail, Scottsdale, AZ 85262",
    parcelApn: "216-19-884",
    partnerName: "Canyon Home Systems",
    continuityOwner: "Project manager",
    currentStatus: "Needs Additional Information",
    nextAction: "Need APN confirmation and final people / roles contacts.",
    notes: "Water-risk scope selected, but property anchor is incomplete.",
    startupOutputs: [
      "QR tag plan",
      "Property record shell",
    ],
    statusHistory: [
      {
        status: "New",
        timestamp: "2026-03-17 11:20",
        changedBy: "Partner Sales",
        notes: "Draft saved during intake call.",
      },
      {
        status: "Needs Additional Information",
        timestamp: "2026-03-18 10:05",
        changedBy: "IQR HQ",
        notes: "Missing parcel/APN and owner continuity contact.",
      },
    ],
  },
  {
    id: "IQR-AZ-003",
    propertyName: "Silverleaf Guest House",
    streetAddress: "17 Copper Sky Court, Scottsdale, AZ 85255",
    parcelApn: "216-72-041",
    partnerName: "Sonoran Estate Tech",
    continuityOwner: "Field technician",
    currentStatus: "Ready to Ship",
    nextAction: "Assemble startup kit and release install packet.",
    notes: "Configurator outputs approved. Startup kit can be packed now.",
    startupOutputs: [
      "QR tag plan",
      "Counter Card config",
      "Startup kit list",
      "Field install checklist",
    ],
    statusHistory: [
      {
        status: "New",
        timestamp: "2026-03-15 08:15",
        changedBy: "Partner Sales",
        notes: "Initial questionnaire submitted.",
      },
      {
        status: "In Process",
        timestamp: "2026-03-15 13:45",
        changedBy: "IQR HQ",
        notes: "Outputs reviewed and property shell assembled.",
      },
      {
        status: "Ready to Ship",
        timestamp: "2026-03-18 16:10",
        changedBy: "IQR HQ",
        notes: "Install packet approved and startup kit released.",
      },
      ],
   },
];

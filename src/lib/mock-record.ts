import type { StructuredHouseRecordV11 } from "./schema";

export const mockRecord: StructuredHouseRecordV11 = {
  property: {
    parcelApn: "217-54-321",
    iqrPropertyId: "iqr-az-scottsdale-001",
    streetAddress: "1234 Desert Highlands Drive",
    city: "Scottsdale",
    state: "AZ",
    zip: "85255"
  },

  meta: {
    schemaVersion: "1.1",
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-14T15:30:00Z",
    baselineDate: "2026-03-01",
    yearlyUpdateDate: "2026-03-10",
    recordStatus: "active",
    continuityOwner: "Desert Valley Property Services"
  },

  summary: {
    propertyType: {
      value: "Single-family residence",
      verification: "verified",
      verifiedAt: "2026-03-01",
      source: "pm-baseline"
    },
    occupancyType: {
      value: "Second residence",
      verification: "verified",
      verifiedAt: "2026-03-01",
      source: "pm-baseline"
    },
    useCase: {
      value: "managed-services-continuity",
      verification: "verified",
      verifiedAt: "2026-03-01",
      source: "pm-baseline"
    },
    primaryBuyer: {
      value: "technology-integration-specialist-owner",
      verification: "verified",
      verifiedAt: "2026-03-01",
      source: "manual"
    }
  },

  avItInfrastructure: {
    rackDevices: [
      {
        id: "rack-core-router",
        category: "network",
        name: "Core Router",
        brand: "Ubiquiti",
        model: "UXG-Pro",
        serialNumber: "UXGPRO-AX-4471",
        location: "Main AV rack",
        role: "Primary gateway",
        status: "active",
        verification: "verified",
        notes: "Primary WAN edge for property network."
      },
      {
        id: "rack-poe-switch",
        category: "network",
        name: "PoE Switch",
        brand: "Ubiquiti",
        model: "USW-Pro-24-PoE",
        serialNumber: "USW24P-1182",
        location: "Main AV rack",
        role: "PoE distribution",
        status: "active",
        verification: "verified"
      },
      {
        id: "rack-control-processor",
        category: "control",
        name: "Control Processor",
        brand: "Control4",
        model: "EA-5",
        serialNumber: "C4EA5-6620",
        location: "Main AV rack",
        role: "Control engine",
        status: "active",
        verification: "needs-review",
        notes: "Model verified; serial pending recheck."
      },
      {
        id: "rack-ups",
        category: "power",
        name: "Rack UPS",
        brand: "APC",
        model: "SMX1500RM2U",
        serialNumber: "APC-1500-8821",
        location: "",
        role: "Short-duration backup",
        status: "active",
        verification: "unverified",
        notes: "Intentional integrity issue: missing location."
      },
      {
        id: "rack-apple-tv-family",
        category: "av",
        name: "Apple TV Family Room",
        brand: "Apple",
        model: "Apple TV 4K",
        serialNumber: "ATV4K-FR-1288",
        location: "Family room media cabinet",
        role: "Streaming endpoint",
        status: "active",
        verification: "verified"
      }
    ],
    networkNotes: "Main rack supports WAN edge, PoE switching, control, and media endpoints.",
    controlNotes: "Control system coordinates AV switching, lighting scenes, and selected automation routines."
  },

  majorSystems: [
    {
      id: "sys-hvac-main",
      type: "hvac",
      name: "Main HVAC",
      brand: "Trane",
      model: "XR16",
      serialNumber: "TRANE-XR16-4471",
      installDate: "2022-09-12",
      location: "Side yard condenser / attic air handler",
      status: "active",
      verification: "verified"
    },
    {
      id: "sys-water-heater-garage",
      type: "water-heater",
      name: "Garage Water Heater",
      brand: "Rheem",
      model: "Performance Platinum 50",
      serialNumber: "RHEEM-50-2023-8842",
      installDate: "2023-04-18",
      location: "Garage mechanical wall",
      status: "active",
      verification: "verified"
    },
    {
      id: "sys-fridge-kitchen",
      type: "appliance",
      name: "Kitchen Refrigerator / Ice Maker",
      brand: "Sub-Zero",
      model: "CL4250UFD",
      serialNumber: "SZ-CL4250-1127",
      installDate: "2024-02-01",
      location: "Kitchen",
      status: "active",
      verification: "verified"
    }
  ],

  monitoring: {
    monitoredConditions: [
      {
        id: "mon-leak-dishwasher",
        platform: "yolink",
        sensorType: "leak",
        name: "Dishwasher Leak Sensor",
        protectedPoint: "Dishwasher",
        location: "Kitchen dishwasher bay",
        status: "active",
        lastSeenAt: "2026-03-14T14:52:00Z",
        verification: "verified"
      },
      {
        id: "mon-leak-water-heater",
        platform: "yolink",
        sensorType: "leak",
        name: "Water Heater Pan Sensor",
        protectedPoint: "Garage Water Heater",
        location: "Garage water heater pan",
        status: "active",
        lastSeenAt: "2026-03-14T14:49:00Z",
        verification: "verified"
      },
      {
        id: "mon-freezer-garage",
        platform: "yolink",
        sensorType: "freezer",
        name: "Garage Freezer Monitor",
        protectedPoint: "Garage freezer contents",
        location: "Garage freezer",
        status: "needs-battery",
        lastSeenAt: "2026-03-12T22:10:00Z",
        verification: "verified",
        notes: "Battery warning triggered this week."
      },
      {
        id: "mon-rack-temp",
        platform: "yolink",
        sensorType: "temperature",
        name: "Rack Temperature Monitor",
        protectedPoint: "Main AV rack",
        location: "Main AV rack",
        status: "active",
        lastSeenAt: "2026-03-14T14:55:00Z",
        verification: "verified"
      }
    ],
    eventHistory: [
      {
        id: "evt-yolink-battery-alert",
        eventType: "alert",
        title: "Garage freezer battery alert",
        description: "Battery level dropped below threshold on freezer monitor.",
        source: "yolink",
        status: "open",
        severity: "medium",
        relatedObjectIds: ["mon-freezer-garage"],
        eventAt: "2026-03-12T22:10:00Z",
        notes: "Battery replacement pending."
      },
      {
        id: "evt-rack-heat-spike",
        eventType: "alert",
        title: "Rack temperature spike",
        description: "Rack temperature exceeded preferred range for 18 minutes.",
        source: "yolink",
        status: "info",
        severity: "low",
        relatedObjectIds: ["mon-rack-temp", "rack-poe-switch"],
        eventAt: "2026-03-08T19:20:00Z",
        notes: "Resolved naturally after HVAC recovery."
      }
    ]
  },

  prevention: {
    riskProtectionPoints: [
      {
        id: "prot-dishwasher",
        riskType: "water",
        protectedAsset: "Dishwasher",
        location: "Kitchen dishwasher bay",
        mitigationDevice: "YoLink leak sensor",
        localShutoffPresent: true,
        verification: "verified",
        lastVerifiedAt: "2026-03-01"
      },
      {
        id: "prot-water-heater",
        riskType: "water",
        protectedAsset: "Garage Water Heater",
        location: "Garage mechanical wall",
        mitigationDevice: "Leak pan sensor",
        localShutoffPresent: true,
        verification: "verified",
        lastVerifiedAt: "2026-03-01"
      },
      {
        id: "prot-fridge",
        riskType: "water",
        protectedAsset: "Kitchen Refrigerator / Ice Maker",
        location: "Kitchen",
        mitigationDevice: "Supply line sensor",
        localShutoffPresent: false,
        verification: "needs-review",
        lastVerifiedAt: "2026-03-01",
        notes: "Intentional integrity issue: shutoff not confirmed."
      }
    ]
  },

  service: {
    timeline: [
      {
        id: "svc-baseline-20260301",
        eventType: "baseline",
        title: "Inspection baseline created",
        description: "Initial structured property record created from PM baseline documentation.",
        source: "pm-baseline",
        status: "resolved",
        eventAt: "2026-03-01T09:00:00Z",
        performedBy: "Desert Valley Inspections"
      },
      {
        id: "svc-rack-review-20260305",
        eventType: "service",
        title: "AV rack review and photo verification",
        description: "Network and AV rack documentation refreshed.",
        source: "manual",
        status: "resolved",
        severity: "low",
        relatedObjectIds: ["rack-core-router", "rack-poe-switch", "rack-control-processor"],
        eventAt: "2026-03-05T15:30:00Z",
        performedBy: "IQR Field Review"
      },
      {
        id: "svc-freezer-battery-followup",
        eventType: "issue",
        title: "Freezer monitor battery follow-up required",
        description: "Battery replacement required for continued environmental monitoring.",
        source: "yolink",
        status: "open",
        severity: "medium",
        relatedObjectIds: ["mon-freezer-garage"],
        eventAt: "2026-03-12T22:10:00Z"
      },
      {
        id: "svc-orphaned-demo",
        eventType: "service",
        title: "Legacy control review",
        description: "Intentional integrity test event with orphaned object reference.",
        source: "manual",
        status: "info",
        severity: "low",
        relatedObjectIds: ["ghost-device-001"],
        eventAt: "2026-03-07T12:00:00Z",
        performedBy: "IQR Demo Data"
      }
    ],
    unresolvedIssues: [
      {
        id: "issue-freezer-battery",
        title: "Garage freezer monitor battery replacement needed",
        description: "Battery alert remains open and monitoring continuity is at risk.",
        severity: "medium",
        relatedObjectIds: ["mon-freezer-garage"],
        identifiedAt: "2026-03-12T22:10:00Z",
        status: "open"
      },
      {
        id: "issue-rack-ups-location",
        title: "Rack UPS location not verified",
        description: "UPS asset exists in record but exact placement is missing.",
        severity: "low",
        relatedObjectIds: ["rack-ups"],
        identifiedAt: "2026-03-14T10:20:00Z",
        status: "watch"
      }
    ],
    yearlyUpdates: [
      {
        id: "yr-2026",
        eventType: "yearly-update",
        title: "2026 annual record update",
        description: "Yearly structured record refresh completed.",
        source: "manual",
        status: "resolved",
        eventAt: "2026-03-10T11:00:00Z",
        performedBy: "IQR Annual Review"
      }
    ]
  },

  integrity: {
    issues: [
      {
        id: "integrity-rack-ups-location",
        category: "missing-field",
        severity: "medium",
        objectType: "RackDevice",
        objectId: "rack-ups",
        message: "Rack UPS is missing a location."
      },
      {
        id: "integrity-rack-ups-verification",
        category: "missing-verification",
        severity: "medium",
        objectType: "RackDevice",
        objectId: "rack-ups",
        message: "Rack UPS is not verified."
      },
      {
        id: "integrity-orphaned-event",
        category: "orphaned-event",
        severity: "high",
        objectType: "ServiceEvent",
        objectId: "svc-orphaned-demo",
        message: "Legacy control review references unknown object ID ghost-device-001."
      },
      {
        id: "integrity-fridge-shutoff-review",
        category: "missing-verification",
        severity: "medium",
        objectType: "RiskProtectionPoint",
        objectId: "prot-fridge",
        message: "Kitchen refrigerator protection point needs shutoff verification."
      }
    ],
    integrityScore: 82
  }
};

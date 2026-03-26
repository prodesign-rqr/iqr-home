export type PropertyAnchor = {
  parcelApn: string;
  iqrPropertyId: string;
  streetAddress: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type RecordMeta = {
  schemaVersion: "1.1";
  createdAt: string;
  updatedAt: string;
  baselineDate?: string;
  yearlyUpdateDate?: string;
  recordStatus: "draft" | "active" | "needs-review";
  continuityOwner?: string;
};

export type VerificationStatus = "verified" | "unverified" | "needs-review";
export type Severity = "low" | "medium" | "high";
export type EventSource = "manual" | "pm-baseline" | "yolink";
export type EventStatus = "open" | "resolved" | "info";

export type StructuredField<T> = {
  value: T;
  verification: VerificationStatus;
  verifiedAt?: string;
  source?: EventSource;
  notes?: string;
};

export type RackDevice = {
  id: string;
  category: "network" | "av" | "control" | "power" | "storage" | "other";
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
  role?: string;
  status?: "active" | "inactive" | "unknown";
  verification: VerificationStatus;
  notes?: string;
};

export type MajorSystem = {
  id: string;
  type:
    | "hvac"
    | "water-heater"
    | "electrical"
    | "plumbing"
    | "roof"
    | "appliance"
    | "pool"
    | "security"
    | "other";
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  location?: string;
  status?: "active" | "inactive" | "unknown";
  verification: VerificationStatus;
  notes?: string;
};

export type MonitoredCondition = {
  id: string;
  platform: "yolink";
  sensorType:
    | "leak"
    | "temperature"
    | "humidity"
    | "door"
    | "freezer"
    | "fridge"
    | "power"
    | "other";
  name: string;
  protectedPoint?: string;
  location: string;
  status: "active" | "inactive" | "needs-battery" | "unknown";
  lastSeenAt?: string;
  verification: VerificationStatus;
  notes?: string;
};

export type RiskProtectionPoint = {
  id: string;
  riskType: "water" | "environmental" | "equipment";
  protectedAsset: string;
  location: string;
  mitigationDevice?: string;
  localShutoffPresent?: boolean;
  verification: VerificationStatus;
  lastVerifiedAt?: string;
  notes?: string;
};

export type ServiceEvent = {
  id: string;
  eventType:
    | "baseline"
    | "installation"
    | "service"
    | "alert"
    | "inspection"
    | "yearly-update"
    | "issue";
  title: string;
  description?: string;
  source: EventSource;
  status: EventStatus;
  severity?: Severity;
  relatedObjectIds?: string[];
  eventAt: string;
  resolvedAt?: string;
  performedBy?: string;
  notes?: string;
};

export type UnresolvedIssue = {
  id: string;
  title: string;
  description?: string;
  severity: Severity;
  relatedObjectIds?: string[];
  identifiedAt: string;
  status: "open" | "watch" | "resolved";
};

export type RecordIntegrityIssue = {
  id: string;
  category:
    | "missing-field"
    | "missing-verification"
    | "unresolved-issue"
    | "orphaned-event"
    | "incomplete-event"
    | "inconsistent-naming";
  severity: Severity;
  objectType?: string;
  objectId?: string;
  message: string;
};

export type SpatialAreaType = "room" | "zone" | "exterior";
export type FloorPlanDocumentKind = "master" | "derived";
export type SurfaceCategory = "wall" | "ceiling" | "trim" | "cabinet" | "floor" | "door" | "other";

export type SpatialFloor = {
  id: string;
  label: string;
  levelOrder: number;
};

export type SpatialArea = {
  id: string;
  floorId?: string;
  label: string;
  areaType: SpatialAreaType;
  parentAreaId?: string;
  notes?: string;
};

export type SurfaceReference = {
  id: string;
  areaId: string;
  label: string;
  category: SurfaceCategory;
};

export type FloorPlanDocumentRecord = {
  id: string;
  title: string;
  fileName: string;
  kind: FloorPlanDocumentKind;
  floorId?: string;
  exteriorAreaId?: string;
  versionLabel: string;
  sourceDocumentId?: string;
  note?: string;
};

export type SpatialFinishLedgerEntry = {
  id: string;
  floorId?: string;
  exteriorAreaId?: string;
  areaId: string;
  surfaceId: string;
  current: boolean;
  brand: string;
  productLine?: string;
  colorName: string;
  colorCode?: string;
  sheen?: string;
  dateApplied?: string;
  appliedBy?: string;
  notes?: string;
};

export type SpatialRecordV1 = {
  floors: SpatialFloor[];
  areas: SpatialArea[];
  surfaceReferences: SurfaceReference[];
  floorPlanDocuments: FloorPlanDocumentRecord[];
  finishLedger: SpatialFinishLedgerEntry[];
};

export type StructuredHouseRecordV11 = {
  property: PropertyAnchor;
  meta: RecordMeta;

  summary: {
    propertyType?: StructuredField<string>;
    occupancyType?: StructuredField<string>;
    useCase: StructuredField<"managed-services-continuity">;
    primaryBuyer: StructuredField<"technology-integration-specialist-owner">;
  };

  avItInfrastructure: {
    rackDevices: RackDevice[];
    networkNotes?: string;
    controlNotes?: string;
  };

  majorSystems: MajorSystem[];

  monitoring: {
    monitoredConditions: MonitoredCondition[];
    eventHistory: ServiceEvent[];
  };

  prevention: {
    riskProtectionPoints: RiskProtectionPoint[];
  };

  service: {
    timeline: ServiceEvent[];
    unresolvedIssues: UnresolvedIssue[];
    yearlyUpdates: ServiceEvent[];
  };

  integrity: {
    issues: RecordIntegrityIssue[];
    integrityScore?: number;
  };

  spatial?: SpatialRecordV1;
};

export function validateSpatialFinishRecord(
  entry: SpatialFinishLedgerEntry
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!entry.areaId) issues.push("Missing mapped area.");
  if (!entry.surfaceId) issues.push("Missing mapped surface.");
  if (!entry.floorId && !entry.exteriorAreaId) {
    issues.push("Finish record must be tied to a floor or exterior area.");
  }
  if (!entry.brand) issues.push("Finish record is missing brand.");
  if (!entry.colorName) issues.push("Finish record is missing color name.");

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function groupFloorPlanDocuments(documents: FloorPlanDocumentRecord[]) {
  return {
    master: documents.filter((doc) => doc.kind === "master"),
    derived: documents.filter((doc) => doc.kind === "derived"),
  };
}

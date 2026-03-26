export type QueryIntent =
  | "inspection_baseline_date"
  | "inspection_provider"
  | "property_record_start_date"
  | "system_list"
  | "installation_date"
  | "system_age"
  | "manufacturer_model"
  | "serial_number"
  | "device_location"
  | "leak_sensor_locations"
  | "temp_humidity_sensor_locations"
  | "monitored_space"
  | "protected_water_points"
  | "mitigation_devices"
  | "shutoff_valve_locations"
  | "protected_fixture_status"
  | "proof_of_prevention_status"
  | "environmental_monitoring_zones"
  | "freezer_monitoring"
  | "wine_room_monitoring"
  | "av_rack_monitoring"
  | "art_collection_monitoring"
  | "last_service_event"
  | "service_history"
  | "replacement_history"
  | "last_update_change"
  | "yearly_update_summary"
  | "yearly_update_date"
  | "yearly_update_verification_status"
  | "sensor_status"
  | "battery_status"
  | "protection_verification_date"
  | "unresolved_issues"
  | "needs_attention"
  | "what_is_monitored"
  | "what_is_protected"
  | "home_record_summary"
  | "risk_profile_summary"
  | "timeline_summary"
  | "event_by_date";

export type TruthStatus = "Verified" | "Reported" | "Inferred" | "Missing" | "Blocked";

export type BlockerType =
  | "missing_source"
  | "missing_verification"
  | "missing_linkage"
  | "missing_context"
  | "conflicting_record"
  | "awaiting_update"
  | "restricted_access";

export interface TruthResolution {
  truthStatus: TruthStatus;
  blockerType?: BlockerType;
  blockerReason?: string;
  nextActionText?: string;
  evidenceLabel?: string;
  lastVerifiedAt?: string;
}

export interface SectionIntegrityRollup {
  verifiedCount: number;
  reportedOrInferredCount: number;
  missingCount: number;
  blockedCount: number;
  summary: string;
  nextActionText?: string;
}

export interface TelemetryTile {
  label: string;
  value: string;
  meta?: string;
  truth: TruthResolution;
}

export interface PreventionCardItem {
  title: string;
  location?: string;
  details: Array<{
    label: string;
    value: string;
  }>;
  truth: TruthResolution;
}

export interface TruthListItem {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  truth: TruthResolution;
}

export type FloorPlanDocumentKind = "master" | "derived";

export interface SurfaceReference {
  id: string;
  label: string;
  category: "wall" | "ceiling" | "trim" | "cabinet" | "floor" | "door" | "other";
}

export interface FloorPlanDocument {
  id: string;
  title: string;
  kind: FloorPlanDocumentKind;
  floorId?: string;
  exteriorAreaId?: string;
  versionLabel: string;
  sourceDocumentId?: string;
  fileName: string;
  note?: string;
}

export interface SpatialAreaSummary {
  id: string;
  label: string;
  areaType: "room" | "zone" | "exterior";
  floorId?: string;
  parentAreaId?: string;
  recordCounts: {
    documents: number;
    finishes: number;
    equipment: number;
    protectionPoints: number;
    visits: number;
    incidents: number;
  };
}

export interface SpatialFinishRecord {
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
}

export interface LocationBoundRecordGroup {
  documents: FloorPlanDocument[];
  finishes: SpatialFinishRecord[];
  equipment: Array<{ id: string; title: string; detail?: string }>;
  protectionPoints: Array<{ id: string; title: string; detail?: string }>;
  incidents: Array<{ id: string; title: string; detail?: string }>;
  visits: Array<{ id: string; title: string; detail?: string }>;
}

export interface SelectedAreaContext {
  areaId: string;
  label: string;
  areaType: "room" | "zone" | "exterior";
  floorLabel?: string;
  detailSummary: string;
  groupedRecords: LocationBoundRecordGroup;
}

export interface SpatialProperty {
  propertyId: string;
  propertyName: string;
  streetAddress: string;
  parcelApn: string;
  defaultFloorId?: string;
  floors: Array<{
    id: string;
    label: string;
    areas: SpatialAreaSummary[];
  }>;
  exteriorAreas: SpatialAreaSummary[];
  floorPlanDocuments: FloorPlanDocument[];
  selectedAreaContext?: SelectedAreaContext;
}

export interface SpatialPropertyShell {
  propertyId: string;
  propertyName: string;
  streetAddress: string;
  parcelApn: string;
  currentStatus: string;
  nextAction: string;
  property: SpatialProperty;
  masterFloorPlans: FloorPlanDocument[];
  derivedFloorPlans: FloorPlanDocument[];
  selectedAreaContext?: SelectedAreaContext;
  systemIndexPath: string;
}

export interface PropertyRecord {
  property_record: {
    id: string;
    name: string;
    start_date: string;
    status: string;
    address: string;
    hero_summary: string;
  };
  inspection_baseline: {
    date: string;
    provider_name: string;
    provider_company: string;
    report_type: string;
    original_pdf_file: string;
    summary: string;
  };
  systems: SystemRecord[];
  devices: DeviceRecord[];
  waterRiskPoints: WaterRiskPoint[];
  environmentalMonitoringZones: EnvironmentalMonitoringZone[];
  mitigationDevices: MitigationVerification[];
  serviceEvents: ServiceEvent[];
  yearlyUpdate: YearlyUpdate;
  timeline: TimelineEvent[];
  issues: {
    unresolved: IssueItem[];
  };
  attentionItems: AttentionItem[];
}

export interface SystemRecord {
  id: string;
  name: string;
  category: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  install_date?: string;
  age_estimate?: string;
  location?: string;
  service_history?: ServiceEvent[];
  replacement_history?: TimelineEvent[];
}

export interface DeviceRecord {
  id: string;
  device_type: string;
  device_name: string;
  category: string;
  location: string;
  linked_system_id?: string;
  linked_fixture?: string;
  status: string;
  battery_status?: string;
  install_date?: string;
  last_verified?: string;
}

export interface WaterRiskPoint {
  id: string;
  fixture_name: string;
  location: string;
  protection_status: string;
  leak_sensor_installed: boolean;
  shutoff_valve_installed: boolean;
  last_verified: string;
  notes?: string;
}

export interface EnvironmentalMonitoringZone {
  id: string;
  zone_name: string;
  zone_type: string;
  sensor_id: string;
  status: string;
  last_verified: string;
  alert_thresholds?: string;
}

export interface MitigationVerification {
  id: string;
  device_type: string;
  protected_fixture: string;
  location: string;
  install_date: string;
  last_verified: string;
  status: string;
}

export interface ServiceEvent {
  event_id: string;
  date: string;
  event_type: string;
  system_id?: string;
  provider_name: string;
  summary: string;
  documents?: string[];
}

export interface YearlyUpdate {
  date: string;
  summary: string;
  verification_status: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  event_type: string;
  description: string;
  linked_system_id?: string;
}

export interface IssueItem {
  id: string;
  title: string;
  severity: string;
  status: string;
  linked_system_id?: string;
  created_date: string;
  last_reviewed: string;
}

export interface AttentionItem {
  id: string;
  title: string;
  severity: string;
  linked_system_id?: string;
  due_note: string;
}

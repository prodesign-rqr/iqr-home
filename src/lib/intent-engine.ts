import { intentMap } from "./intent-map";
import { mockRecord } from "./mock-record";

const lower = (value: string) => value.toLowerCase();

function findRackDevice(question: string) {
  const q = lower(question);
  return mockRecord.avItInfrastructure.rackDevices.find((device) => {
    const haystack = [
      device.name,
      device.brand,
      device.model,
      device.role ?? "",
      device.location ?? "",
      device.id
    ]
      .join(" ")
      .toLowerCase();

    return q.includes(device.name.toLowerCase()) || q.includes(device.id.toLowerCase()) || haystack.includes(q);
  });
}

function findProtectionPoint(question: string) {
  const q = lower(question);
  return mockRecord.prevention.riskProtectionPoints.find((point) => {
    const haystack = [
      point.protectedAsset,
      point.location,
      point.mitigationDevice,
      point.id
    ]
      .join(" ")
      .toLowerCase();

    return q.includes(point.protectedAsset.toLowerCase()) || q.includes(point.id.toLowerCase()) || haystack.includes(q);
  });
}

function findMonitoringZone(question: string) {
  const q = lower(question);
  return mockRecord.monitoring.monitoredConditions.find((zone) => {
    const haystack = [
      zone.name,
      zone.protectedPoint,
      zone.location,
      zone.sensorType,
      zone.id
    ]
      .join(" ")
      .toLowerCase();

    return q.includes(zone.name.toLowerCase()) || q.includes((zone.protectedPoint ?? "").toLowerCase()) || haystack.includes(q);
  });
}

function detectIntent(question: string): string | null {
  const q = lower(question);
  const ranked = intentMap

    .map((definition) => {
      const score = definition.keywords.reduce((total, keyword) => total + (q.includes(keyword) ? 1 : 0), 0);
      return { intent: definition.intent, score };
    })
    .sort((a, b) => b.score - a.score);

  if (q.includes("systems")) return "system_list";
  if (q.includes("serial")) return "serial_number";
  if (q.includes("where") && q.includes("leak sensor")) return "leak_sensor_locations";
  if (q.includes("where") && q.includes("shutoff")) return "shutoff_valve_locations";
  if (q.includes("protected")) return "protected_water_points";
  if (q.includes("mitigation")) return "mitigation_devices";
  if (q.includes("what rooms are monitored") || q.includes("what is monitored")) return "what_is_monitored";
  if (q.includes("last service")) return "last_service_event";
  if (q.includes("what changed")) return "last_update_change";
  if (q.includes("needs attention")) return "needs_attention";
  if (q.includes("risk profile")) return "risk_profile_summary";
  if (q.includes("tell me about this home") || q.includes("summarize this house")) return "home_record_summary";
  if (q.includes("integrity")) return "integrity_summary";

  return ranked[0]?.score ? ranked[0].intent : null;
}

export function answerQuestion(question: string): { intent: string | null; response: string } {
  const intent = detectIntent(question);

  if (!intent) {
    return {
      intent: null,
      response: "No structured answer was found in the house record."
    };
  }

  const rackDevice = findRackDevice(question);
  const protectionPoint = findProtectionPoint(question);
  const monitoringZone = findMonitoringZone(question);

  const monitoredSpaces = mockRecord.monitoring.monitoredConditions
    .map((zone) => zone.protectedPoint)
    .join(", ");

  const leakSensorLocations = mockRecord.monitoring.monitoredConditions
    .filter((zone) => zone.sensorType === "leak")
    .map((zone) => zone.location)
    .join(", ");

  const protectedAssets = mockRecord.prevention.riskProtectionPoints
    .map((point) => point.protectedAsset)
    .join(", ");

  const mitigationDevices = mockRecord.prevention.riskProtectionPoints
    .map((point) => `${point.mitigationDevice} at ${point.protectedAsset}`)
    .join(", ");

  const lastService = [...mockRecord.service.timeline]
    .sort((a, b) => b.eventAt.localeCompare(a.eventAt))[0];

  switch (intent) {
    case "home_record_summary":
      return {
        intent,
        response: `This property record is anchored to parcel ${mockRecord.property.parcelApn} at ${mockRecord.property.streetAddress}, ${mockRecord.property.city}, ${mockRecord.property.state} ${mockRecord.property.zip}. It includes ${mockRecord.avItInfrastructure.rackDevices.length} rack devices, ${mockRecord.majorSystems.length} major systems, ${mockRecord.monitoring.monitoredConditions.length} monitored conditions, and ${mockRecord.prevention.riskProtectionPoints.length} documented protection points.`
      };

    case "system_list":
      return {
        intent,
        response: `This house record includes these major systems: ${mockRecord.majorSystems.map((system) => system.name).join(", ")}.`
      };

    case "serial_number":
      return rackDevice
        ? {
            intent,
            response: `The serial number for ${rackDevice.name} is ${rackDevice.serialNumber ?? "not recorded"}.`
          }
        : {
            intent,
            response: "No matching rack device serial number was found in the structured record."
          };

    case "device_location":
      return rackDevice
        ? {
            intent,
            response: `${rackDevice.name} is located at ${rackDevice.location ?? "an unverified location"}.`
          }
        : protectionPoint
        ? {
            intent,
            response: `${protectionPoint.protectedAsset} is documented at ${protectionPoint.location}.`
          }
        : {
            intent,
            response: "No matching device or protected asset location was found."
          };

    case "leak_sensor_locations":
      return {
        intent,
        response: leakSensorLocations
          ? `Leak sensors are installed at ${leakSensorLocations}.`
          : "No leak sensor locations are recorded."
      };

    case "shutoff_valve_locations":
      return {
        intent,
        response: `Confirmed local shutoffs are documented for ${mockRecord.prevention.riskProtectionPoints
          .filter((point) => point.localShutoffPresent)
          .map((point) => point.protectedAsset)
          .join(", ")}.`
      };

    case "protected_water_points":
      return {
        intent,
        response: `Protected water-risk points include ${protectedAssets}.`
      };

    case "mitigation_devices":
      return {
        intent,
        response: `Documented mitigation devices include ${mitigationDevices}.`
      };

    case "what_is_monitored":
    case "environmental_monitoring_zones":
      return {
        intent,
        response: `Monitoring currently covers ${monitoredSpaces}.`
      };

    case "last_service_event":
      return lastService
        ? {
            intent,
            response: `The most recent service event is "${lastService.title}" recorded at ${lastService.eventAt}.`
          }
        : {
            intent,
            response: "No service events are recorded."
          };

    case "last_update_change":
      return lastService
        ? {
            intent,
            response: `The most recent recorded change is "${lastService.description}" at ${lastService.eventAt}.`
          }
        : {
            intent,
            response: "No recent change was found in the record."
          };

    case "needs_attention":
      return {
        intent,
        response: mockRecord.service.unresolvedIssues.length
          ? `Items needing attention include ${mockRecord.service.unresolvedIssues.map((issue) => issue.title).join(", ")}.`
          : "No unresolved issues are currently recorded."
      };

    case "risk_profile_summary":
      return {
        intent,
        response: `The current risk profile includes protected water-risk points at ${protectedAssets}, monitored conditions covering ${monitoredSpaces}, and ${mockRecord.integrity.issues.length} active integrity findings.`
      };

    case "integrity_summary":
      return {
        intent,
        response: `The record integrity score is ${mockRecord.integrity.integrityScore ?? "not recorded"}, with ${mockRecord.integrity.issues.length} integrity issues currently flagged.`
      };

    default:
      return monitoringZone
        ? {
            intent,
            response: `${monitoringZone.name} is ${monitoringZone.status} and was last seen at ${monitoringZone.lastSeenAt}.`
          }
        : {
            intent,
            response: "No structured answer was found in the house record."
          };
  }
}


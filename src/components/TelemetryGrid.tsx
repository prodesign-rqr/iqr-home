import { PropertyRecord } from "../lib/types";
 
export default function TelemetryGrid({ record }: { record: PropertyRecord }) {
  const tiles = [
    {
      label: "Inspection Baseline",
      value: record.inspection_baseline.date,
      meta: record.inspection_baseline.provider_company
    },
    {
      label: "Mitigation Devices",
      value: `${record.mitigationDevices.length}`,
      meta: "Verified prevention points"
    },
    {
      label: "Sensor Signals",
      value: `${record.devices.length}`,
      meta: "Structured device records"
    },
    {
      label: "Service Events",
      value: `${record.serviceEvents.length}`,
      meta: "Logged service history"
    },
    {
      label: "Yearly Updates",
      value: record.yearlyUpdate.verification_status,
      meta: record.yearlyUpdate.date
    }
  ];
 
  return (
    <div className="telemetry-grid">
      {tiles.map((tile) => (
        <div key={tile.label} className="telemetry-tile">
          <div className="label">{tile.label}</div>
          <div className="value">{tile.value}</div>
          <div className="meta">{tile.meta}</div>
        </div>
      ))}
    </div>
  );
}
import { PropertyRecord } from "@/lib/types";
 
export default function ProofOfPreventionCard({ record }: { record: PropertyRecord }) {
  const point = record.waterRiskPoints.find((item) => item.fixture_name === "Dishwasher");
 
  if (!point) return null;
 
  return (
    <div className="list-card">
      <strong>Proof of Prevention</strong>
      <div className="kv-list small" style={{ marginTop: 10 }}>
        <div className="kv-item">
          <strong>Protected Point</strong>
          <span>{point.fixture_name}</span>
        </div>
        <div className="kv-item">
          <strong>Leak Sensor Installed</strong>
          <span>{point.leak_sensor_installed ? "Yes" : "No"}</span>
        </div>
        <div className="kv-item">
          <strong>Local Shutoff Valve</strong>
          <span>{point.shutoff_valve_installed ? "Yes" : "No"}</span>
        </div>
        <div className="kv-item">
          <strong>Install / Verification</strong>
          <span>Installed 2025-03-12 | Last verified {point.last_verified}</span>
        </div>
        <div className="kv-item">
          <strong>Status</strong>
          <span className="status-pill status-active">{point.protection_status}</span>
        </div>
      </div>
    </div>
  );
}

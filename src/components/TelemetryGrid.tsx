import type { TelemetryTile } from "../lib/types";

function truthLine(tile: TelemetryTile): string {
  if (tile.truth.blockerReason) {
    return tile.truth.blockerReason;
  }

  if (tile.truth.evidenceLabel && tile.truth.lastVerifiedAt) {
    return `${tile.truth.evidenceLabel} | Last verified ${tile.truth.lastVerifiedAt}`;
  }

  if (tile.truth.evidenceLabel) {
    return tile.truth.evidenceLabel;
  }

  if (tile.truth.lastVerifiedAt) {
    return `Last verified ${tile.truth.lastVerifiedAt}`;
  }

  if (tile.truth.nextActionText) {
    return tile.truth.nextActionText;
  }

  return "No additional context";
}

export default function TelemetryGrid({ tiles }: { tiles: TelemetryTile[] }) {
  return (
    <div className="telemetry-grid">
      {tiles.map((tile) => (
        <div key={tile.label} className="telemetry-tile">
          <div className="label">{tile.label}</div>
          <div className="value">{tile.value}</div>
          <div className="meta">{tile.meta}</div>
          <div className="muted small" style={{ marginTop: 6 }}>
            <span className="status-pill">{tile.truth.truthStatus}</span>
          </div>
          <div className="muted small" style={{ marginTop: 6 }}>
            {truthLine(tile)}
          </div>
        </div>
      ))}
    </div>
  );
}

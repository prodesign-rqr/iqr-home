import { PropertyRecord } from "@/lib/types";
 
export default function Timeline({ record }: { record: PropertyRecord }) {
  return (
    <div className="timeline-list">
      {record.timeline.map((event) => (
        <div key={event.id} className="timeline-item">
          <strong>{event.date}</strong>
          <div>{event.description}</div>
          <div className="muted small">{event.event_type}</div>
        </div>
      ))}
    </div>
  );
}

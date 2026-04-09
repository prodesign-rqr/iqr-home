"use client";

type StatusBadgeProps = {
  status: string;
  size?: "sm" | "md";
};

const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "#6b7280" },
  active: { label: "Active", color: "#7fe296" },
  needs_review: { label: "Needs Review", color: "#f59e0b" },
  archived: { label: "Archived", color: "#6b7280" },
  pending: { label: "Pending", color: "#6b7280" },
  open: { label: "Open", color: "#6dd3ff" },
  closed: { label: "Closed", color: "#7fe296" },
  needs_revisit: { label: "Needs Revisit", color: "#f59e0b" },
  paused: { label: "Paused", color: "#f59e0b" },
  completed: { label: "Completed", color: "#7fe296" },
  abandoned: { label: "Abandoned", color: "#ff8b8b" },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const entry = statusMap[status] ?? { label: status, color: "#6b7280" };
  const fontSize = size === "sm" ? "0.7rem" : "0.78rem";

  return (
    <span
      style={{
        display: "inline-block",
        padding: size === "sm" ? "2px 8px" : "3px 10px",
        borderRadius: 4,
        fontSize,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: entry.color,
        border: `1px solid ${entry.color}44`,
        background: `${entry.color}14`,
      }}
    >
      {entry.label}
    </span>
  );
}

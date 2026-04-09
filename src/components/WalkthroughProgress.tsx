"use client";

type WalkthroughProgressProps = {
  total: number;
  closed: number;
  currentIndex: number;
};

export default function WalkthroughProgress({ total, closed, currentIndex }: WalkthroughProgressProps) {
  const pct = total > 0 ? Math.round((closed / total) * 100) : 0;

  return (
    <div
      style={{
        padding: "16px 24px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 16,
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>Walkthrough Progress</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            {closed} of {total} rooms closed
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: pct === 100 ? "#7fe296" : "#6dd3ff",
              borderRadius: 3,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Room {currentIndex + 1} of {total} — One Walk. One Record. Nothing Missed.
        </div>
      </div>
      <div
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: pct === 100 ? "#7fe296" : "#6dd3ff",
          minWidth: 60,
          textAlign: "right",
        }}
      >
        {pct}%
      </div>
    </div>
  );
}

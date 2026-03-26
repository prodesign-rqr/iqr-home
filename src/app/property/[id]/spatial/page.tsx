export default function SpatialPage() {
  const propertyId = "test"
  const floorPlanStatus = "Loaded"
  const mappedAreas = 6
  const protectionPoints = 12
const points = [
  { id: "p1", label: "Kitchen Sink", top: "22%", left: "28%" },
  { id: "p2", label: "Refrigerator", top: "38%", left: "62%" },
  { id: "p3", label: "Water Heater", top: "70%", left: "48%" },
]

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div style={{ opacity: 0.7, fontSize: "0.95rem", marginBottom: "8px" }}>
            Property Spatial Surface
          </div>
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>IQR Spatial</h1>
          <p style={{ opacity: 0.8, marginTop: "12px", maxWidth: "700px" }}>
            This route is now serving as the property-centered spatial surface for floor-plan-led navigation, protection context, and future incident mapping.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ opacity: 0.65, fontSize: "0.9rem" }}>Property ID</div>
            <div style={{ fontSize: "1.2rem", marginTop: "8px" }}>{propertyId}</div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ opacity: 0.65, fontSize: "0.9rem" }}>Floor Plan Status</div>
            <div style={{ fontSize: "1.2rem", marginTop: "8px" }}>{floorPlanStatus}</div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ opacity: 0.65, fontSize: "0.9rem" }}>Mapped Areas</div>
            <div style={{ fontSize: "1.2rem", marginTop: "8px" }}>{mappedAreas}</div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ opacity: 0.65, fontSize: "0.9rem" }}>Protection Points</div>
            <div style={{ fontSize: "1.2rem", marginTop: "8px" }}>{protectionPoints}</div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "24px",
            minHeight: "420px",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          }}
        >
          <div style={{ opacity: 0.7, marginBottom: "12px" }}>Floor Plan Surface Placeholder</div>
         <div
  style={{
    height: "340px",
    borderRadius: "12px",
    border: "1px dashed rgba(255,255,255,0.2)",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  }}
>
  <div
    style={{
      position: "absolute",
      inset: "24px",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "10px",
    }}
  />

  {points.map((point) => (
    <div
      key={point.id}
      style={{
        position: "absolute",
        top: point.top,
        left: point.left,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "999px",
          background: "#fff",
          boxShadow: "0 0 0 4px rgba(255,255,255,0.12)",
          margin: "0 auto 8px",
        }}
      />
      <div
        style={{
          fontSize: "0.8rem",
          whiteSpace: "nowrap",
          background: "rgba(0,0,0,0.7)",
          padding: "4px 8px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {point.label}
      </div>
    </div>
  ))}

  <div
    style={{
      position: "absolute",
      bottom: "12px",
      right: "16px",
      opacity: 0.55,
      fontSize: "0.85rem",
    }}
  >
    Protection layer preview
  </div>
</div>
        </div>
      </div>
    </main>
  )
}
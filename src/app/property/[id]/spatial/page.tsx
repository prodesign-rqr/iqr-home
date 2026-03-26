export default function SpatialPage() {
  const propertyId = "test"
  const floorPlanStatus = "Loaded"
  const mappedAreas = 6
  const protectionPoints = 12

  const points = [
    {
      id: "p1",
      label: "Kitchen Sink",
      type: "Leak Sensor",
      status: "Protected",
      top: "22%",
      left: "28%",
      room: "Kitchen",
      lastChecked: "2026-03-26",
      note: "Primary wet-zone protection point under sink cabinet.",
    },
    {
      id: "p2",
      label: "Dishwasher",
      type: "Leak Sensor",
      status: "Protected",
      top: "38%",
      left: "36%",
      room: "Kitchen",
      lastChecked: "2026-03-26",
      note: "Appliance protection point behind toe-kick zone.",
    },
    {
      id: "p3",
      label: "Refrigerator",
      type: "Temp / Leak",
      status: "Protected",
      top: "26%",
      left: "48%",
      room: "Kitchen",
      lastChecked: "2026-03-26",
      note: "Covers ice-maker and adjacent supply risk area.",
    },
    {
      id: "p4",
      label: "Water Heater",
      type: "Leak Sensor",
      status: "Protected",
      top: "62%",
      left: "70%",
      room: "Mechanical",
      lastChecked: "2026-03-26",
      note: "Pan and shutoff context zone.",
    },
  ]

  const selectedPoint = points[0]

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
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div style={{ opacity: 0.7, fontSize: "0.95rem", marginBottom: "8px" }}>
            Property Spatial Surface
          </div>
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>IQR Spatial</h1>
          <p style={{ opacity: 0.8, marginTop: "12px", maxWidth: "760px" }}>
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
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.9fr)",
            gap: "20px",
          }}
        >
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
                height: "420px",
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {points.map((point) => (
                <div
                  key={point.id}
                  style={{
                    position: "absolute",
                    top: point.top,
                    left: point.left,
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: point.id === selectedPoint.id ? "16px" : "14px",
                      height: point.id === selectedPoint.id ? "16px" : "14px",
                      borderRadius: "999px",
                      background: point.id === selectedPoint.id ? "#22c55e" : "#3b82f6",
                      boxShadow:
                        point.id === selectedPoint.id
                          ? "0 0 14px rgba(34,197,94,0.85)"
                          : "0 0 12px rgba(59,130,246,0.8)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.92,
                      whiteSpace: "nowrap",
                      background:
                        point.id === selectedPoint.id
                          ? "rgba(34,197,94,0.16)"
                          : "rgba(0,0,0,0.55)",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      border:
                        point.id === selectedPoint.id
                          ? "1px solid rgba(34,197,94,0.45)"
                          : "1px solid rgba(255,255,255,0.12)",
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

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "16px",
              padding: "20px",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            }}
          >
            <div style={{ opacity: 0.65, fontSize: "0.9rem", marginBottom: "8px" }}>
              Selected Protection Point
            </div>

            <h2 style={{ fontSize: "1.4rem", marginTop: 0, marginBottom: "14px" }}>
              {selectedPoint.label}
            </h2>

            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Type</div>
                <div style={{ marginTop: "6px" }}>{selectedPoint.type}</div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Status</div>
                <div style={{ marginTop: "6px" }}>{selectedPoint.status}</div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Room / Zone</div>
                <div style={{ marginTop: "6px" }}>{selectedPoint.room}</div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Last Checked</div>
                <div style={{ marginTop: "6px" }}>{selectedPoint.lastChecked}</div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Field Note</div>
                <div style={{ marginTop: "6px", lineHeight: 1.45 }}>{selectedPoint.note}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
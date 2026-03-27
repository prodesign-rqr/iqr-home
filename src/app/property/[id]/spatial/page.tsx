type SpatialPageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ point?: string }>
}

type SpatialPoint = {
  id: string
  label: string
  type: string
  status: string
  room: string
  note: string
}

export default async function Page({
  params,
  searchParams,
}: SpatialPageProps) {
  const { id } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const selectedPointId = resolvedSearchParams?.point ?? "p1"

  const points: SpatialPoint[] = [
    {
      id: "p1",
      label: "Kitchen Sink",
      type: "Leak Sensor",
      status: "Protected",
      room: "Kitchen",
      note: "Primary wet-zone protection point under sink cabinet.",
    },
    {
      id: "p2",
      label: "Dishwasher",
      type: "Leak Sensor",
      status: "Protected",
      room: "Kitchen",
      note: "Appliance protection point behind toe-kick zone.",
    },
    {
      id: "p3",
      label: "Refrigerator",
      type: "Temp / Leak",
      status: "Protected",
      room: "Kitchen",
      note: "Covers ice-maker and adjacent supply risk area.",
    },
    {
      id: "p4",
      label: "Water Heater",
      type: "Leak Sensor",
      status: "Protected",
      room: "Mechanical",
      note: "Pan and shutoff context zone.",
    },
  ]

  const selectedPoint =
    points.find((point) => point.id === selectedPointId) ?? points[0]

  return (
    <main
      style={{
        padding: 40,
        color: "#fff",
        background: "#000",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>IQR Spatial</h1>
        <p>Property: {id}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 24,
            alignItems: "start",
            marginTop: 24,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: 20,
              minHeight: 420,
            }}
          >
            <div style={{ marginBottom: 16, opacity: 0.8 }}>Protection Points</div>

            <div style={{ display: "grid", gap: 10 }}>
              {points.map((point) => (
                <a
                  key={point.id}
                  href={`/property/${id}/spatial?point=${point.id}`}
                  style={{
                    display: "block",
                    padding: "12px 14px",
                    borderRadius: 12,
                    textDecoration: "none",
                    color: "#fff",
                    border:
                      point.id === selectedPoint.id
                        ? "1px solid rgba(34,197,94,0.55)"
                        : "1px solid rgba(255,255,255,0.14)",
                    background:
                      point.id === selectedPoint.id
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(255,255,255,0.03)",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{point.label}</div>
                  <div style={{ opacity: 0.75, marginTop: 4, fontSize: "0.92rem" }}>
                    {point.type} • {point.room}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div style={{ opacity: 0.7, marginBottom: 8 }}>Selected Protection Point</div>
            <h2 style={{ marginTop: 0 }}>{selectedPoint.label}</h2>

            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Type</div>
                <div style={{ marginTop: 6 }}>{selectedPoint.type}</div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Status</div>
                <div style={{ marginTop: 6 }}>{selectedPoint.status}</div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Room / Zone</div>
                <div style={{ marginTop: 6 }}>{selectedPoint.room}</div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ opacity: 0.65, fontSize: "0.82rem" }}>Field Note</div>
                <div style={{ marginTop: 6, lineHeight: 1.45 }}>{selectedPoint.note}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
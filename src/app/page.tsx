import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>IQR Home</h1>
        <p>
          A house that can explain itself. Most houses are data-rich but memory-poor. IQR Home
          replaces fragmented onboarding with a guided, room-by-room commissioning walkthrough
          that creates a verified baseline property record.
        </p>
        <div className="subpage-nav">
          <Link href="/workspace" className="subpage-nav-home">
            Open Partner Workspace
          </Link>
          <div className="subpage-nav-links">
            <Link href="/telemetry" className="subnav-pill">Telemetry</Link>
            <Link href="/prevention" className="subnav-pill">Prevention</Link>
            <Link href="/service-events" className="subnav-pill">Service Events</Link>
            <Link href="/integrity" className="subnav-pill">Integrity</Link>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginTop: 24,
          padding: "0 24px",
        }}
      >
        {[
          {
            title: "One Walk. One Record.",
            body: "The walkthrough session structures the commissioning of a house into a room-by-room, verified baseline record. Nothing is missed.",
          },
          {
            title: "Property-First Architecture",
            body: "The property is the permanent center of gravity. Every floor, room, system, and document anchors to the property record.",
          },
          {
            title: "Explicit Closure Model",
            body: "Rooms cannot be closed without confirmation. Data is structured, not free-form. Closure must be deliberate.",
          },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              padding: "24px 22px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "1rem",
                color: "#ecf3fb",
                marginBottom: 10,
                letterSpacing: "-0.01em",
              }}
            >
              {card.title}
            </div>
            <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              {card.body}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: "24px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 12,
            }}
          >
            Core MVP Flows
          </div>
          {[
            { label: "Partner Workspace", href: "/workspace" },
            { label: "New Property", href: "/workspace/new" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "8px 0",
                fontSize: "0.875rem",
                color: "#6dd3ff",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 12,
            }}
          >
            Reference Views
          </div>
          {[
            { label: "Telemetry", href: "/telemetry" },
            { label: "Prevention", href: "/prevention" },
            { label: "Service Events", href: "/service-events" },
            { label: "Integrity", href: "/integrity" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "8px 0",
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 12,
            }}
          >
            Planned Modules
          </div>
          {["Systems", "QR Tags", "Floor Plans", "Documents"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 0",
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.22)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

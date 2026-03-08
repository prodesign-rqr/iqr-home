export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        color: "#111",
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
<img
  src="/IQR-Home-logo.png"
  alt="IQR Home logo"
  style={{
    width: "180px",
    height: "auto",
    marginBottom: "24px",
    display: "block",
  }}
/>
        <h1
          style={{
            fontSize: "56px",
            lineHeight: 1,
            marginBottom: "16px",
            fontWeight: 800,
          }}
        >
          IQR Home
        </h1>

        <p
          style={{
            fontSize: "24px",
            lineHeight: 1.4,
            maxWidth: "700px",
            marginBottom: "24px",
          }}
        >
          Premium home continuity, stewardship, and service coordination.
        </p>

        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            maxWidth: "760px",
            marginBottom: "32px",
          }}
        >
          IQR Home combines standardized QR identification, service pathways,
          and property-risk monitoring into a partner-installed home continuity
          system.
        </p>

        <a
          href="#"
          style={{
            display: "inline-block",
            background: "#111",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Open Demo Property
        </a>
      </div>
    </main>
  );
}
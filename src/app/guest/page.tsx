export default function GuestPage() {
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
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <img
          src="/IQR-Home-logo.png"
          alt="IQR Home logo"
          style={{
            width: "140px",
            height: "auto",
            marginBottom: "24px",
            display: "block",
          }}
        />

        <p style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 700 }}>
          Desert Highlands Residence
        </p>

        <h1
          style={{
            fontSize: "48px",
            lineHeight: 1.1,
            marginBottom: "20px",
            fontWeight: 800,
          }}
        >
          Guest Wi-Fi
        </h1>

        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "16px",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>SSID</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: 700 }}>
            DesertHighlands_Guest
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>Password</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: 700 }}>
            Welcome2DH!
          </p>
        </div>

        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          Select the guest network, enter the password, and connect.
        </p>

        <a
          href="/"
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
          Back Home
        </a>
      </div>
    </main>
  );
}
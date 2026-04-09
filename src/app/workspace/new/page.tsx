import Link from "next/link";
import PropertyForm from "../../../components/PropertyForm";

export default function NewPropertyPage() {
  return (
    <main>
      <section className="hero">
        <h1>New Property Record</h1>
        <p>
          This is a capture event, not a demo. Every field you enter anchors the house to a
          permanent, structured record. The property is the center of gravity.
        </p>
        <div className="subpage-nav">
          <Link href="/workspace" className="subpage-nav-home">
            Back to Workspace
          </Link>
        </div>
      </section>

      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <PropertyForm />
      </div>
    </main>
  );
}

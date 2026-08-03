export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: "40rem" }}>
      <h1>Alizane Labs provisioning API</h1>
      <p>
        Internal service. Onboarding interview transcripts arrive by webhook, are turned into
        structured business facts, and are staged for human verification before anything is
        published to a client site.
      </p>
      <p>
        <code>GET /api/health</code> reports configuration status.
      </p>
    </main>
  );
}

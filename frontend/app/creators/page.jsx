export default function CreatorsPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem", textAlign: "center" }}>
        🎥 Empieza a ganar hoy en MeetYouLive
      </h1>
      <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#555", marginBottom: "2rem" }}>
        Comparte tu contenido, conecta con tu audiencia y monetiza desde el primer día.
      </p>

      <section style={{ background: "#f9f9f9", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2>💰 ¿Por qué unirte a MeetYouLive?</h2>
        <ul style={{ lineHeight: "2" }}>
          <li>✅ Ingresos por vídeos de pago</li>
          <li>✅ Regalos directos de tu audiencia</li>
          <li>✅ Sube tu primer vídeo en 2 pasos</li>
          <li>✅ Tú controlas el precio de tu contenido</li>
          <li>✅ Pagos rápidos y transparentes</li>
        </ul>
      </section>

      <section style={{ background: "#f9f9f9", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2>📊 Comisión transparente</h2>
        <p style={{ fontSize: "1.1rem" }}>
          <strong>0% comisión el primer mes.</strong> A partir del segundo mes, solo el 20% va a la plataforma — el 80% es tuyo.
        </p>
        <p style={{ color: "#555" }}>
          Sin sorpresas. Sin letra pequeña. Cuanto más ganas, más te queda.
        </p>
      </section>

      <section style={{ background: "#f9f9f9", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2>🚀 Cómo empezar (2 pasos)</h2>
        <ol style={{ lineHeight: "2.5", fontSize: "1.1rem" }}>
          <li><strong>1.</strong> Crea tu cuenta gratis</li>
          <li><strong>2.</strong> Sube tu primer vídeo y fija el precio</li>
        </ol>
        <p style={{ color: "#555" }}>Ya está. Tu contenido está listo para generar ingresos.</p>
      </section>

      <div style={{ textAlign: "center" }}>
        <a
          href="/login"
          style={{
            display: "inline-block",
            background: "#1d9bf0",
            color: "#fff",
            padding: "1rem 2.5rem",
            borderRadius: "8px",
            fontSize: "1.2rem",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🎬 Empieza a ganar hoy
        </a>
      </div>

      <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem", fontSize: "0.9rem" }}>
        ¿Tienes dudas? Escríbenos a{" "}
        <a href="mailto:creators@meetyoulive.net" style={{ color: "#1d9bf0" }}>
          creators@meetyoulive.net
        </a>
      </p>
    </div>
  );
}

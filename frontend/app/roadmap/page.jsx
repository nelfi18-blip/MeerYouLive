export default function RoadmapPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", textAlign: "center" }}>🗺️ Roadmap público — MeetYouLive</h1>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "2rem" }}>
        Aquí publicamos lo que estamos construyendo. Tu feedback impulsa la plataforma.
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <h2>✅ Lanzado</h2>
        <ul style={{ lineHeight: "2", paddingLeft: "1.5rem" }}>
          <li>Registro e inicio de sesión (email + Google)</li>
          <li>Subida y visualización de vídeos</li>
          <li>Vídeos privados con pago por acceso (Stripe)</li>
          <li>Regalos de usuarios a creadores</li>
          <li>Dashboard de creador</li>
          <li>Landing page para creadores (<a href="/creators" style={{ color: "#1d9bf0" }}>/creators</a>)</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>🔨 En desarrollo</h2>
        <ul style={{ lineHeight: "2", paddingLeft: "1.5rem" }}>
          <li>Notificaciones por email (bienvenida, primer regalo)</li>
          <li>Rankings semanales de creadores</li>
          <li>Badges y hitos de creador</li>
          <li>Paquetes de regalos (5 / 10 / 20)</li>
          <li>Preview pública (teaser) de vídeos privados</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>📋 Próximamente</h2>
        <ul style={{ lineHeight: "2", paddingLeft: "1.5rem" }}>
          <li>App móvil (iOS + Android)</li>
          <li>Streaming en directo</li>
          <li>Suscripciones mensuales a creadores</li>
          <li>Integración con TikTok / Instagram Reels para compartir</li>
          <li>Panel de métricas avanzado (CAC, ARPU, conversión)</li>
        </ul>
      </section>

      <section style={{ background: "#f9f9f9", borderRadius: "12px", padding: "1.5rem" }}>
        <h2>💬 ¿Qué quieres ver?</h2>
        <p>
          Escríbenos a{" "}
          <a href="mailto:feedback@meetyoulive.net" style={{ color: "#1d9bf0" }}>
            feedback@meetyoulive.net
          </a>{" "}
          o síguenos en redes para votar las próximas funciones.
        </p>
      </section>

      <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem", fontSize: "0.85rem" }}>
        Última actualización: Febrero 2026
      </p>
    </div>
  );
}

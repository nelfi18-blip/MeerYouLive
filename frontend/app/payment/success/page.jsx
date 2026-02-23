export default function PaymentSuccess() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>✅ Pago completado</h1>
      <p>Tu compra ha sido procesada correctamente. Ya puedes ver el vídeo.</p>
      <p style={{ color: "#1d9bf0", fontSize: "1.1rem" }}>
        Apoyaste directamente al creador 💙
      </p>
      <a href="/dashboard">Volver al inicio</a>
    </div>
  );
}
